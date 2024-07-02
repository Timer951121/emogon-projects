
import React from 'react';
import jQuery from 'jquery';
import { Editor } from "@tinymce/tinymce-react";
import imgChatTriClient from '../../assets/images/chat-tri-client.png';
import imgChatTriEmp from '../../assets/images/chat-tri-emp.png';
import imgAttach from '../../assets/images/attach.png';
import imgClose from '../../assets/images/close.png';
import imgPenEdit from '../../assets/images/pen-edit-black.png';
import imgDeleteTrans from '../../assets/images/delete-trans.png';
import imgDelete from '../../assets/images/delete-black.png';
import imgDownload from '../../assets/images/download.png';
import { GetParseArr, Icon, GetParseDate, GetStatusLabel } from '../../data/common';
import { htmlEditorKey, apiUrl, serverUrl } from '../../data/config';
import { GetEmpInfo } from '../content/ChannelContent';

export default class ChannelDetail extends React.Component {
	constructor(props) {
		super(props);
		const {empStr, detailChannel, teamStr} = props;
		const attachArr = [ ]
		const channelInfo = detailChannel || {};
		this.docH = 0; this.docW = 0; this.otherEmp = {};
		this.customData = []; this.teamData = []; this.empInfo={};
		this.state = {empStr, teamStr, detailChannel, channelInfo, mailArr:[], attachArr, inputStr:'', editTime:null};
	}

	componentDidMount() {
		this.docH = document.documentElement.offsetHeight;
		this.docW = document.documentElement.offsetWidth;
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['empStr', 'detailChannel', 'teamStr', 'customerStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='empStr') {
					this.empInfo = GetEmpInfo(nextProps.empStr);
				} else if (key==='detailChannel') {
					const channelInfo = nextProps.detailChannel || {}, {senderId, receiverId} = channelInfo;
					this.empType = senderId===this.empInfo.id?'sender':'receiver';
					const otherIdKey = this.empType==='sender'?'receiverId':'senderId';
					this.otherEmp = this.teamData.find(emp=>{return emp.id===channelInfo[otherIdKey]}) || {};
					this.setState({mailArr:[], channelInfo}, () => {
						if (nextProps.detailChannel) {
							this.refreshChatData(0, true);
						}
					});
				} else if (key==='teamStr') {
					this.teamData = GetParseArr(nextProps[key]);
				}
			}
		});
	}

	refreshChatData = (time, loading) => {
		const {detailChannel, channelInfo} = this.state, empId = this.empInfo.id;
		if (!detailChannel || !channelInfo.id) return;

		this.props.setLoading(loading);
		jQuery.ajax({ type: "POST", url: apiUrl+'get_data/getMail.php', dataType: 'json', data: {channelId:parseInt(channelInfo.id), time, empId},
			success: (res) => {
				this.props.setLoading(false);
				const {mailArr} = this.state, firstApi = time === 0;
				res.forEach(item => {
					const timeVal = parseInt(item.time), senderId = parseInt(item.senderId);
					item.customer = senderId!==this.empInfo.id;
					const senderInfo = this.teamData.find(custom=>custom.id===senderId);
					const mailItem = {
						timeVal,
						time:this.getTimeStr(timeVal),
						sender:senderInfo.name,
						senderId,
						message:item.content,
						client:item.customer?true:false,
						mailType:item.mailType,
					}
					mailArr.push(mailItem);
					time = timeVal;
				});
				if (res.length > 0) {
					this.setState({mailArr}, () => {
						this.setChatScroll(firstApi);
					})
					if (!loading) { //  && detailChannel.status==='close'
						detailChannel.status = 'open';
						this.setState({detailChannel});
						this.props.callChannelAPI();
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

	deleteChannel = () => {
		if (window.confirm('Are you sure to delete the channel?')) {
			this.props.setLoading(true);
			const updateData = {updateType:'delete', id:this.state.channelInfo.id}
			jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateChannel.php', dataType: 'json', data: updateData,
				success: (res) => {
					this.props.setLoading(false);
					const {success, error} = res;
					if (success) {
						this.props.callChannelAPI();
						this.props.closedetailChannel();
					} else {
						const errorStr = error || "Failed to save the data";
						window.alert(errorStr);
					}
				}
			});
		}
	}

	submitMail = (mailType) => {

		const {inputStr, mailArr, channelInfo, editTime} = this.state, {id, senderId, receiverId} = channelInfo;
		if (!inputStr) return;
		if (editTime) {this.updateMail(); return;}
		const timeVal = Math.round(Date.now()/1000), otherId = senderId===this.empInfo.id?receiverId:senderId;
		const mailItem = {
			timeVal,
			time:this.getTimeStr(timeVal),
			sender:this.empInfo.first + ' ' +this.empInfo.last,
			senderId:this.empInfo.id,
			message:inputStr,
			client:false,
			mailType
		}
		mailArr.push(mailItem);
		this.setState({inputStr:'', mailArr}, () => this.setChatScroll(false) );

		const insertData = {
			channelId:parseInt(id),
			senderId:this.empInfo.id,
			receiverId:otherId,
			content:inputStr,
			time:timeVal,
			mailType
		}

		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/sendMail.php', dataType: 'json', data: insertData,
			success: (res) => { 
				const {detailChannel} = this.state;
				if (detailChannel.status==='close') {
					detailChannel.status = 'open';
					this.setState({detailChannel});
					this.props.callTicketAPI();
				}
			 }
		});
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
					this.submitMail('image');
				});
				this.props.setLoading(false);
			}
		};
		xhttp.send(formData);
	}

	updateMail = () => {
		const {editTime, mailArr, inputStr} = this.state, senderId = parseInt(this.empInfo.id);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateMail.php', dataType: 'json', data: {type:'edit', senderId, time:editTime, content:inputStr},
			success: (res) => {
				if (res.success) {
					mailArr.forEach(item => {
						if (item.senderId ===senderId && item.timeVal === editTime) { item.message = inputStr; }
					});
					this.setState({mailArr, inputStr:'', editTime:null});
				}
			}
		}, error=> {console.log(error)});
	}

	onDeleteMail = (item) => {
		if (!window.confirm('Are you sure to delete the mail?')) return;
		const {senderId, timeVal} = item, {mailArr} = this.state;
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateMail.php', dataType: 'json', data: {type:'delete', senderId, time:timeVal},
			success: (res) => {
				if (res.success) {
					const newArr = [];
					mailArr.forEach(mail => {
						if (mail.senderId === senderId && mail.timeVal ===timeVal) return;
						newArr.push(mail);
					});
					this.setState({mailArr:[...newArr]});
				}
			}
		}, error=> {console.log(error)});
	}

	openImageModal = (mail) => {
		this.setState({imageSrc:serverUrl+'other/message_images/'+mail, imageWrapper:true}, () => {
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

	render() {
		const {detailChannel, mailArr, attachArr, inputStr, editTime, imageWrapper, imageInner, imageSrc, channelInfo} = this.state;
		// const {id, answer, customer, status, title, update} = detailChannel;
		return (
			<>
			<div className={`detail-content ${detailChannel?'active':''} content-detailChannel content-detail-message`}>
				<div className='left-chat'>
					<div className='chat-wrapper scroll scroll-y' id='chatWrapper'>
						{mailArr.map((item, idx) =>
							<div className={`message-item ${item.client?'client':'me'} ${item.otherEmp?'other-emp':''}`} key={idx}>
								<div className='message-top'>
									<div className='sender'>{item.sender}</div>
									<div className='time'>{item.time}</div>
								</div>
								{!item.mailType &&
									<div className='text render-html' dangerouslySetInnerHTML={{ __html: item.message }} />
								}
								{/* {item.mailType==='image' &&
									<img className='attach-image' src={serverUrl+'other/message_images/'+item.message} onClick={e=>this.openImageModal(item.message)}></img>
								} */}
								{/* {(!item.client && !item.otherEmp) &&
									<div className='setting-buttons'>
										{item.mailType !== 'image' &&
											<Icon classStr='btn-item' img={imgPenEdit} onClickIcon={e=>this.setState({editTime:item.timeVal, inputStr:item.message})}></Icon>
										}
										<Icon classStr='btn-item' img={imgDeleteTrans} onClickIcon={e=>this.onDeleteMail(item)}></Icon>
									</div>
								} */}
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
						{/* <div className='select-image flex' onClick={e=>this.onClickAttach()}>
							<img src={imgAttach} alt=''></img>
						</div>
						<input type="file" id="imgInputFile" accept="image/*" onChange={e=>this.onUploadImgFile(e)}/> */}
					</div>
					<div className='footer'>
						{/* <div className='attach-wrapper'>
							<div className='label'>Anhänge:</div>
							<div className='attach-content'>
								{attachArr.map((item, idx) =>
									<div className='attach-item' key={idx}>
										<div className='attach-name red'>{item.name}</div>
										<Icon img={imgClose} classStr='icon-small'></Icon>
									</div>
								)}
							</div>
						</div> */}
						{/* {editTime && 
							<div className={`button`} onClick={e=>this.setState({editTime:null, inputStr:''})}>Stornieren</div>
						} */}
						<div className={`button ${inputStr?'':'empty-back'}`} onClick={e=>this.submitMail()}>Absenden</div>
					</div>
				</div>

				<div className='right-info'>
					<div className='info-wrapper ticket-info'>
						<div className='info-item'>
							<div className='label'>{this.empType==='sender'?'Empfänger:':'Absender:'}</div>
							<div className='value'>{this.otherEmp.first+' '+this.otherEmp.last}</div>
						</div>
						<div className='info-item'>
							<div className='label'>Betreff:</div>
							<div className='value'>{detailChannel.title}</div>
						</div>
						<div className='info-item'>
							<div className='label'>Datum:</div>
							<div className='value'>{this.getTimeStr(detailChannel.createTime)}</div>
						</div>
					</div>
					
					{/* <div className='buttons'>
						<div className='button empty-back'>Abgeben / Eskalieren</div>
					</div> */}
					{/* <Icon classStr='btn-ticket-delete' img={imgDelete} onClickIcon={e=>this.deleteChannel()}></Icon> */}
				</div>
			</div>
			
			{/* <div className={`modal-back image-modal ${imageWrapper?'active':''} `} style={{position:'fixed'}}>
				<div className={`modal-wrapper ${imageInner?'active':''}`}>
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
			</div> */}

			</>
		);
	}
}
