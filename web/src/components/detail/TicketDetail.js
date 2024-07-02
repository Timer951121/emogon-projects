
import React from 'react';
import jQuery from 'jquery';
import { Editor } from "@tinymce/tinymce-react";
import imgDocTrans from '../../assets/images/doc-trans.png';
import imgChatTriClient from '../../assets/images/chat-tri-client.png';
import imgChatTriEmp from '../../assets/images/chat-tri-emp.png';
import imgAttach from '../../assets/images/attach.png';
import imgClose from '../../assets/images/close.png';
import imgPenEdit from '../../assets/images/pen-edit-black.png';
import imgDeleteTrans from '../../assets/images/delete-trans.png';
import imgDelete from '../../assets/images/delete-black.png';
import imgDownload from '../../assets/images/download.png';
import { customerDetailMenu } from '../../data/constant';
import { GetParseArr, Icon, GetRoleStrCustomer, GetParseDate, GetStatusLabel, SendEmail } from '../../data/common';
import { htmlEditorKey, apiUrl, serverUrl } from '../../data/config';

const ticketInfoArr = [
	{key:'number', label:'Ticket ID:'},
	{key:'category', label:'Kategorie:'},
	{key:'title', label:'Betreff:'},
	{key:'customer', label:'Kunde:'},
]

export default class TicketDetail extends React.Component {
	constructor(props) {
		super(props);
		const {empStr, loginType, detailTicket, teamStr, systemStr, customerStr} = props;
		const attachArr = [
			// {type:'pdf', name:'enerqrabattcoupon10.pdf'},
			// {type:'jpg', name:'beispielanhang.jpg'},
		]
		const ticketInfo = detailTicket || {};
		this.docH = 0; this.docW = 0;
		this.systemData = []; this.customData = []; this.teamData = []; this.empInfo={};
		this.state = {empStr, loginType, teamStr, detailTicket, ticketInfo, messageArr:[], attachArr, inputStr:'', systemStr, customerStr, selCustomer:{}, selSystem:{}, editTime:null};
	}

	componentDidMount() {
		this.docH = document.documentElement.offsetHeight;
		this.docW = document.documentElement.offsetWidth;
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['empStr', 'loginType', 'detailTicket', 'teamStr', 'systemStr', 'customerStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='empStr') {
					this.empInfo = JSON.parse(nextProps.empStr);
				} else if (key==='detailTicket') {
					const ticketInfo = nextProps.detailTicket || {};
					const selCustomer = ticketInfo ? this.customData.find(item=>item.id===parseInt(ticketInfo.customerId)) : {};
					const selSystem = ticketInfo ? this.systemData.find(item=>item.id===parseInt(ticketInfo.systemId)) : {};
					ticketInfo.customer = selCustomer?selCustomer.name:'';
					ticketInfo.systemName = selSystem?(selSystem.name+', '+selSystem.location):'';
					ticketInfo.systemNum = selSystem?selSystem.number:'';
					ticketInfo.roleInfo = GetRoleStrCustomer(parseInt(selSystem?selSystem.role : 0));
					this.setState({messageArr:[], ticketInfo, selCustomer, selSystem}, () => {
						if (nextProps.detailTicket) {
							this.refreshChatData(0, true);
						}
					});
				} else if (key==='systemStr') {
					this.systemData = GetParseArr(nextProps[key], ['id', 'customerId']);
				} else if (key==='customerStr') {
					this.customData = GetParseArr(nextProps[key]);
				} else if (key==='teamStr') {
					this.teamData = GetParseArr(nextProps[key]);
				}
			}
		});
	}

	refreshChatData = (time, loading) => {
		const {detailTicket, ticketInfo, loginType} = this.state, empId = parseInt(this.empInfo.id);
		if (!detailTicket || !ticketInfo.id) return;
		this.props.setLoading(loading);
		jQuery.ajax({ type: "POST", url: apiUrl+'get_data/getMessage.php', dataType: 'json', data: {ticketId:parseInt(ticketInfo.id), time, empId},
			success: (res) => {
				this.props.setLoading(false);
				const {messageArr} = this.state, firstApi = time === 0;
				res.forEach(item => {
					const timeVal = parseInt(item.time);
					const userGroup = item.customer!=='1'?this.teamData:this.customData;
					const senderInfo = [...userGroup].find(custom=>custom.id===parseInt(item.sender));
					if (!senderInfo) { return; } // console.log(item); 

					var client = item.customer==='1'?true:false, otherEmp = parseInt(item.sender)===empId?false:true;
					if (loginType==='customer') {
						client = !client; otherEmp = false;
					}
					const messageItem = {
						timeVal,
						time:this.getTimeStr(timeVal),
						sender:senderInfo.name,
						senderId:item.sender,
						message:item.content,
						client,
						otherEmp,
						messageType:item.messageType,
						note: item.note
					}
					messageArr.push(messageItem);
					time = timeVal;

				});
				if (res.length > 0) {
					this.setState({messageArr}, () => {
						this.setChatScroll(firstApi);
					})
					if (!loading && detailTicket.status==='close') {
						detailTicket.status = 'open';
						this.setState({detailTicket});
						this.props.callTicketAPI();
					}
				}
				
				setTimeout(() => { this.refreshChatData(time); }, 1000);
			}
		});
	}

	setChatScroll = (unsmooth) => {
		const chatWrapper = document.getElementById("chatWrapper");
		if (unsmooth) chatWrapper.scroll({ top: chatWrapper.scrollHeight });
		else chatWrapper.scroll({ top: chatWrapper.scrollHeight, behavior: 'smooth' });
	}

	onChangeInput = (e) => {
		const str = e.target.value;
		this.setState({inputStr:str});
	}

	deleteTicket = () => {
		if (window.confirm('Are you sure to delete the ticket?')) {
			this.props.setLoading(true);
			const updateData = {updateType:'delete', id:this.state.ticketInfo.id}
			jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateTicket.php', dataType: 'json', data: updateData,
				success: (res) => {
					this.props.setLoading(false);
					const {success, error} = res;
					if (success) {
						this.props.callTicketAPI();
						this.props.closeDetailTicket();
					} else {
						const errorStr = error || "Failed to save the data";
						window.alert(errorStr);
					}
				}
			});
		}
	}

	submitMessage = (messageType) => {
		const {inputStr, messageArr, ticketInfo, editTime, loginType} = this.state, {id, systemId, customerId, title} = ticketInfo;
		if (!inputStr) return;
		if (editTime) {this.updateMessage(); return;}
		const timeVal = Math.round(Date.now()/1000), senderId = parseInt(this.empInfo.id);
		const messageItem = {
			timeVal,
			time:this.getTimeStr(timeVal),
			sender:this.empInfo.first + ' ' +this.empInfo.last,
			senderId,
			message:inputStr,
			client:false,
			messageType
		}
		messageArr.push(messageItem);
		this.setState({inputStr:'', messageArr}, () => this.setChatScroll(false) );

		const insertData = {
			systemId:parseInt(systemId),
			ticketId:parseInt(id),
			sender:senderId,
			content:inputStr,
			time:timeVal,
			messageType,
			loginType
		}

		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/sendMessage.php', dataType: 'json', data: insertData,
			success: (res) => { 
				const {detailTicket} = this.state;
				if (detailTicket.status==='close') {
					detailTicket.status = 'open';
					this.setState({detailTicket});
					this.props.callTicketAPI();
				}
			}
		});
		
		const pushNoteData = {id:systemId, title:'ENERQ Support', message:'Sie haben eine neue Antwort vom ENERQ Team!', type:'message'};
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/sendPushNote.php', dataType: 'json', data: pushNoteData,
			success: (res) => {  }
		});

		const selCustomer = this.customData.find(item=>item.id===parseInt(customerId));
		var typeStr = 'message', mailStr = inputStr;
		if (messageType==='image') {
			typeStr = 'image';
			// mailStr = '';
			mailStr = `<img src='${apiUrl}other/message_images/${inputStr}' alt='' />`
		}
		const mailContent = `<p>Hello, ${selCustomer.name}.</p> </br> <p>${this.empInfo.name} sent new ${typeStr} on '${title}' ticket as below content.</p></br><p> ${mailStr} </p>`;
		SendEmail(selCustomer.email, this.empInfo.email, `New message on '${title}' ticket from ENERQ`, mailContent);

	}

	getTimeStr = (timeVal) => {
		if (!timeVal) return '';
		const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(timeVal);
		return dayNum+'. '+monthName+' '+yearNum+' '+hourStr+':'+minStr;
	}

	onClickAttach = () => {
		const imgInputFile = document.getElementById('imgInputFile');
		imgInputFile.click();
	}

	onUploadImgFile = () => {
		const imgInputFile = document.getElementById('imgInputFile');
		const selFile = imgInputFile.files[0];
		if (!selFile) return;
        const format = selFile.name.split('.').pop();
		if (!format) return;

		const formData = new FormData();
		formData.append("file", selFile);
		formData.append("type", 'message');
		formData.append("format", format);

		this.props.setLoading(true);
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", apiUrl+'other/uploadImgFile.php', true);
		xhttp.onreadystatechange = (e) => {
			const result = e.target;
			if (result.readyState === 4 && result.status === 200) {
				const res = JSON.parse(result.responseText);
				this.setState({inputStr:res.file_name+'.'+format}, () => {
					this.submitMessage('image');
				});
				this.props.setLoading(false);
			}
		};
		xhttp.send(formData);
	}

	updateMessage = () => {
		const {editTime, messageArr, inputStr} = this.state, senderId = parseInt(this.empInfo.id);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateMessage.php', dataType: 'json', data: {type:'edit', senderId, time:editTime, content:inputStr},
			success: (res) => {
				if (res.success) {
					messageArr.forEach(item => {
						if (item.senderId ===senderId && item.timeVal === editTime) { item.message = inputStr; }
					});
					this.setState({messageArr, inputStr:'', editTime:null});
				}
			}
		}, error=> {console.log(error)});
	}

	onDeleteMessage = (item) => {
		if (!window.confirm('Are you sure to delete the message?')) return;
		const {senderId, timeVal} = item, {messageArr} = this.state;
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateMessage.php', dataType: 'json', data: {type:'delete', senderId, time:timeVal},
			success: (res) => {
				if (res.success) {
					const newArr = [];
					messageArr.forEach(message => {
						if (message.senderId === senderId && message.timeVal ===timeVal) return;
						newArr.push(message);
					});
					this.setState({messageArr:[...newArr]});
				}
			}
		}, error=> {console.log(error)});
	}

	submitNote = (updateType) => {
		const {noteTime, messageArr, textNote, noteSender} = this.state; //, senderId = parseInt(this.empInfo.id);
		if (updateType==='edit' && textNote.trim()==='') return;
		this.props.setLoading(true);
		const note = updateType==='delete'?'':textNote;
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateMessage.php', dataType: 'json', data: {type:'note', senderId:noteSender, time:noteTime, note},
			success: (res) => {
				this.props.setLoading(false);
				if (res.success) {
					messageArr.forEach(item => {
						if (item.senderId === noteSender && item.timeVal === noteTime) { item.note = textNote; }
					});
					this.setState({messageArr, textNote:'', noteTime:null, noteSender:null});
					this.closeNoteModal();
				} else {
					window.alert('Failed to update note');
				}
			}
		}, error=> {console.log(error); this.props.setLoading(false);});
	}

	openNoteModal = (item, type) => {
		this.setState({textNote: item.note, noteTime:item.timeVal, noteSender:item.senderId, noteWrapper:true}, () => {
			this.setState({noteInner:true});
		})
	}

	closeNoteModal = () => {
		this.setState({noteInner:false});
		setTimeout(() => { this.setState({noteWrapper:false, textNote:'', noteTime:null}) }, 500);
	}

	openImageModal = (message) => {
		this.setState({imageSrc:serverUrl+'other/message_images/'+message, imageWrapper:true}, () => {
			this.setState({imageInner:true});
		})
	}

	closeImageModal = () => {
		this.setState({imageInner:false});
		setTimeout(() => { this.setState({imageWrapper:false, imageSrc:''}) }, 500);
	}

	downloadImage = async () => {
		const {imageSrc} = this.state;
		if (!imageSrc) return;
		const image = await fetch(imageSrc);
		const imageBlog = await image.blob()
		const imageURL = URL.createObjectURL(imageBlog)
	  
		const link = document.createElement('a')
		link.href = imageURL
		link.download = 'New Image'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	closeTicket = () => {
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/closeTicket.php', dataType: 'json', data: {id:parseInt(this.state.ticketInfo.id)},
			success: (res) => {
				this.props.setLoading(false);
				if (res.success) {
					var {detailTicket} = this.state;
					detailTicket.status = 'close';
					this.setState({detailTicket});
					this.props.callTicketAPI();
				} else {
					window.alert('Failed to close ticket, retry again!');
				}
			}
		}, error=> {window.alert('Failed to close ticket, retry again!'); this.props.setLoading(false);});
	}

	render() {
		const {detailTicket, loginType, messageArr, attachArr, inputStr, editTime, textNote, noteWrapper, noteInner, imageWrapper, imageInner, imageSrc, ticketInfo} = this.state;
		// const {id, answer, customer, status, title, update} = detailTicket;
		return (
			<>
			<div className={`detail-content ${detailTicket?'active':''} content-detailTicket content-detail-message`}>
				<div className='left-chat'>
					<div className='chat-wrapper scroll scroll-y' id='chatWrapper'>
						{messageArr.map((item, idx) =>
							<div className={`message-item ${item.client?'client':'me'} ${item.otherEmp?'other-emp':''}`} key={idx}>
								<div className='message-top'>
									<div className='sender'>{item.sender}</div>
									<div className='time'>{item.time}</div>
								</div>
								{!item.messageType &&
									<div className='text render-html' dangerouslySetInnerHTML={{ __html: item.message }} />
								}
								{item.messageType==='image' &&
									<img className='attach-image' src={serverUrl+'other/message_images/'+item.message} onClick={e=>this.openImageModal(item.message)}></img>
								}
								{item.note && loginType !== 'customer' &&
									<div className='note-wrapper'>
										<div className='note-title flex'>
											<div className='label'>Notiz</div>
											<Icon img={imgPenEdit} onClickIcon={e=>this.openNoteModal(item, 'edit')}></Icon>
											<Icon img={imgDeleteTrans} onClickIcon={e=>{
												if (window.confirm('Are you sure to delete the note?')) {
													this.setState({noteTime:item.timeVal, noteSender:item.senderId}, e=>this.submitNote('delete'))
												}
											} }></Icon>
										</div>
										<div className='note-content'>{item.note}</div>
									</div>
								}
								{(!item.note || (!item.client && !item.otherEmp)) && loginType !== 'customer' &&
									<div className='setting-buttons'>
										{!item.note &&
											<div className='btn-item note-btn' onClick={e=>this.openNoteModal(item, 'add')}>
												<Icon img={imgDocTrans}></Icon>
												<label>Notiz hinzufügen</label>
											</div>
										}
										{!item.client && !item.otherEmp && loginType !== 'customer' &&
											<>
												{item.messageType !== 'image' &&
													<Icon classStr='btn-item' img={imgPenEdit} onClickIcon={e=>this.setState({editTime:item.timeVal, inputStr:item.message})}></Icon>
												}
												<Icon classStr='btn-item' img={imgDeleteTrans} onClickIcon={e=>this.onDeleteMessage(item)}></Icon>
											</>
										}
									</div>
								}
								<img className='chat-tri' src={item.client?imgChatTriClient:imgChatTriEmp} alt=''></img>
							</div>
						)}
					</div>
					<div className='input-wrapper'>
						<Editor
							apiKey={htmlEditorKey}
							disabled={false}
							initialValue={''}
							value={inputStr}
							init={{
								branding: false,
								height: 210,
								width: this.docW - (window.innerWidth>1200?620:530),
								menubar: false,
								plugins: "autolink link",
								toolbar: "bold italic underline link",
								image_advtab: false
							}}
							onEditorChange={(str) => { this.setState({inputStr:str}); }}
						></Editor>
						<div className='select-image flex' onClick={e=>this.onClickAttach()}>
							<img src={imgAttach} alt=''></img>
						</div>
						<input type="file" id="imgInputFile" accept="image/*" onChange={e=>this.onUploadImgFile(e)}/>
					</div>
					<div className='footer'>
						<div className='attach-wrapper'>
							<div className='label'>Anhänge:</div>
							<div className='attach-content'>
								{attachArr.map((item, idx) =>
									<div className='attach-item' key={idx}>
										<div className='attach-name red'>{item.name}</div>
										<Icon img={imgClose} classStr='icon-small'></Icon>
									</div>
								)}
							</div>
						</div>
						{editTime && 
							<div className={`button`} onClick={e=>this.setState({editTime:null, inputStr:''})}>Stornieren</div>
						}
						<div className={`button ${inputStr?'':'empty-back'}`} onClick={e=>this.submitMessage()}>Absenden</div>
					</div>
				</div>

				<div className='right-info'>
					<div className='info-wrapper ticket-info'>
						{ticketInfoArr.map((item, idx) =>
							<div className='info-item' key={idx}>
								<div className='label'>{item.label}</div>
								<div className='value'>{detailTicket[item.key]}</div>
							</div>
						)}
					</div>
					<div className='info-wrapper project-info'>
						<div className='info-item'>
							<div className='label'>Anlage:</div>
							<div className='value'>{detailTicket.systemName}</div>
						</div>
						<div className='info-item'>
							<div className='label'>Projektnr.:</div>
							<div className='value'>{detailTicket.systemNum}</div>
						</div>
						<div className='info-item'>
							<div className='label'>Detail:</div>
							<div className='value flex icons'>
								{customerDetailMenu.map((item, idx) =>
									<Icon img={item.black} key={idx}></Icon>
								)}
							</div>
						</div>
					</div>
					<div className='info-wrapper detail-info'>
						<div className='info-item'>
							<div className='label' style={{width:'70px'}}>Status:</div>
							<div className='value red'>{GetStatusLabel(detailTicket.status)}</div>
						</div>
						<div className='info-item'>Letzte Antwort:</div>
						<div className='info-item red'>{this.getTimeStr(detailTicket.lastTime)}</div>
						{/* <div className='info-item'>{detailTicket.time?'von Marco S.':''}</div> */}
						<div className='info-item'>Erstellt am:</div>
						<div className='info-item'>{this.getTimeStr(detailTicket.createTime)}</div>
						<div className='info-item'>
							<div className='label'>Antworten:</div>
							<div className='value'>2</div>
						</div>
					</div>
					<div className='info-wrapper other-info'>
						<div className='info-item'>
							<div className='label'>Ticket-Owner:</div>
							<div className='value'>Du</div>
						</div>
						<div className='info-item'>
							<div className='label'>Owner vorher:</div>
							<div className='value'>Serge H.</div>
						</div>
					</div>
					{loginType === 'employee' &&
						<>
							<div className='buttons'>
								<div className='button empty-back'>Abgeben / Eskalieren</div>
								{detailTicket.status!=='close' &&
									<div className='button empty-back' onClick={e=>this.closeTicket('close')}>Schließen</div>
								}
							</div>
							<Icon classStr='btn-ticket-delete' img={imgDelete} onClickIcon={e=>this.deleteTicket()}></Icon>
						</>
					}
				</div>
			</div>
			
			<div className={`modal-back note-modal ${noteWrapper?'active':''} `} style={{position:'fixed'}}>
				<div className={`modal-wrapper ${noteInner?'active':''}`}>
					<div className='modal-title'>Additional note</div>
					<div className='modal-content'>
						<textarea id='textNote' rows="6" onChange={e=>{this.setState({textNote:e.target.value})}} value={textNote}></textarea>
						<div className='button-wrapper flex'>
							<div className={`button ${(!textNote || textNote.trim()==='')?'disable':''}`} onClick={e=>this.submitNote('edit')}>Submit</div>
							<div className={`button `} onClick={e=>this.closeNoteModal()}>Cancel</div>
						</div>
					</div>
					<div className='close-icon' onClick={e=>this.closeNoteModal()}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>

			<div className={`modal-back image-modal ${imageWrapper?'active':''} `} style={{position:'fixed'}}>
				<div className={`modal-wrapper ${imageInner?'active':''}`}>
					{/* <div className='modal-title'>Additional note</div> */}
					<div className='modal-content'>
						<img src={imageSrc} alt=''></img>
					</div>
					<div className='button-wrapper flex'>
						<div className='button empty-back' onClick={e=>this.downloadImage()}>
							<div className='button-row'>
								<Icon img={imgDownload}></Icon>
							</div>
						</div>
					</div>
					<div className='close-icon' onClick={e=>this.closeImageModal()}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>

			</>
		);
	}
}
