import React from 'react';
import DocumentPicker from 'react-native-document-picker';
// import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import { TouchableOpacity, Image, Text, View, ScrollView, StyleSheet, TextInput, Keyboard, Animated} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import { GetParseDate, SendEmail, UpdateHtmlStr } from '../../data/common';
import { apiUrl } from '../../data/config';
import { MainCss, wholeWidth, red, white, black, grey, wholeHeight, ModalCss} from '../../assets/css';
import imgSupportGrey from '../../assets/images/support.png';
import imgInfoRed from '../../assets/images/info-red.png';
import imgChatTriRed from '../../assets/images/chat-tri-red.png';
import imgChatTriGrey from '../../assets/images/chat-tri-grey.png';
import imgAttach from '../../assets/images/attach.png';
import imgClose from '../../assets/images/close.png';
import imgDownload from '../../assets/images/download.png';

const DetailCss = StyleSheet.create({
	chatBoard:{flex:1, flexGrow:1, width:wholeWidth},
})

export default class TicketChatComponent extends React.Component {
	constructor(props) {
		super(props);
		const {selTicketId, mainInfo, ticketArr, teamArr} = props;
		this.inputBottom = new Animated.Value(0);
		this.scrollRef = React.createRef();
		this.state = {selTicketId, mainInfo, ticketArr, teamArr, messageArr:[], detailCourse:{}, courseOpacity:1, selSystemIdx:0, selFormatIdx:0, inputStr:'', keyShow:false};
	}

	componentDidMount() {
		this.keyShowEvent = Keyboard.addListener( 'keyboardDidShow', (e) => { this.setKeyStatus(e, true); }, );
		this.keyHideEvent = Keyboard.addListener( 'keyboardDidHide', (e) => { this.setKeyStatus(e, false); }, );
		const {selTicketId, ticketArr} = this.state;
		if (selTicketId) {
			this.ticketInfo = ticketArr.find(item=>parseInt(item.id)===parseInt(selTicketId));
			this.refreshChatData(0, true);
		}
	}

	componentWillUnmount() {
		this.keyShowEvent.remove();
		this.keyHideEvent.remove();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['selTicketId', 'mainInfo', 'ticketArr', 'teamArr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					if (key==='selTicketId') {
						if (this.state.selTicketId) {
							this.ticketInfo = this.state.ticketArr.find(item=>parseInt(item.id)===parseInt(this.state.selTicketId));
							this.refreshChatData(0, true);
						}
					}
				})
			}
		});
	}

	refreshChatData = (time, loading) => {
		const isFocused = this.props.navigation.isFocused();
		if (!isFocused) return;
		const {selTicketId, teamArr, mainInfo} = this.state, customerId = parseInt(mainInfo.id);
		if (!selTicketId || !this.ticketInfo) return;
		this.props.setLoading(loading);
		const getDataJson = {ticketId:parseInt(this.ticketInfo.id), time, customerId};
		axios.post(`${apiUrl}mobile/getMessage.php`, getDataJson).then(res => {
			const {messageArr, mainInfo, teamArr} = this.state;
			res.data.forEach(item => {
				const timeVal = parseInt(item.time);
				const senderInfo = item.customer?mainInfo: teamArr.find(emp=>emp.id===parseInt(item.sender));
				const messageItem = {
					time:this.getTimeStr(timeVal),
					sender:senderInfo.name,
					message:UpdateHtmlStr(item.content, item.messageType),
					client:parseInt(item.sender)===customerId?false:true,
					messageType:item.messageType
				}
				messageArr.push(messageItem);
				time = timeVal;
			});
			this.setState({messageArr});
			this.props.setLoading(false);
			setTimeout(() => { this.refreshChatData(time); }, 1000);
		}).catch(error => {
			console.log(error);
			this.props.setLoading(false);
		});
	}

	getTimeStr = (timeVal) => {
		if (!timeVal) return '';
		const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(timeVal);
		return dayNum+'. '+monthName+' '+yearNum+' '+hourStr+':'+minStr;
	}

	setKeyStatus = (e, status) => {
		Animated.timing(this.inputBottom, { toValue: e.endCoordinates.height, duration: 300, useNativeDriver: false }).start();
		this.setState({keyShow:status}, () => { });
	}

	sendMessage = (messageType) => {
		const {messageArr, inputStr, mainInfo, teamArr} = this.state;
		if (!inputStr.trim()) return;
		const timeVal = Math.round(Date.now()/1000);
		const messageItem = {
			time:this.getTimeStr(timeVal),
			sender:mainInfo.name,
			message:messageType==='image'?inputStr:'<p style="color: black; margin: 3px 0px;">'+inputStr+'</p>',
			client:false,
			messageType
		}
		messageArr.push(messageItem);
		this.setState({messageArr, inputStr:''});
		const {id, systemId, employeeId, title} = this.ticketInfo;
		const content = messageType==='image'?inputStr:'<p>'+inputStr+'</p>';
		const insertData = {
			systemId:parseInt(systemId),
			ticketId:parseInt(id),
			sender:parseInt(mainInfo.id),
			content,
			time:timeVal,
			messageType
		}

		axios.post(`${apiUrl}mobile/sendMessage.php`, insertData).then(res => {
		}).catch(error => { });

		var typeStr = 'message', mailStr = content;
		if (messageType==='image') {
			typeStr = 'image';
			// mailStr = '';
			mailStr = `<img src='${apiUrl}other/message_images/${mailStr}' alt='' />`
		}
		const selEmp = teamArr.find(item=>parseInt(item.id)===parseInt(employeeId));
		const mailContent = `<p>Hello ${selEmp.name}</p></br><p>You received new ${typeStr} from ${mainInfo.name} on ${title} ticket as below content.</p></br><p>${mailStr}</p>`;
		SendEmail(selEmp.email, mainInfo.email, 'Received new '+typeStr+' on ENERQ', mailContent);

	}

	onChangeInput = (str) => {
		this.setState({inputStr:str});
	}

	setScrollEnd = (e) => {
		const scrollHeight = e.nativeEvent.layout.y;
		this.scrollRef.current.scrollTo({x:0, y:scrollHeight, animated:true});
	}

	downloadModal = () => {
		this.props.setLoading(true);
		const date = new Date(), {modalImg} = this.state;
		const image_URL = apiUrl+'other/message_images/'+modalImg;
		let ext = this.getExtention(image_URL);
		ext = '.' + ext[0];
		// const { config, fs } = RNFetchBlob;
		// let PictureDir = fs.dirs.PictureDir;
		// let options = {
		// 	fileCache: true,
		// 	addAndroidDownloads: {
		// 		// Related to the Android only
		// 		useDownloadManager: true,
		// 		notification: true,
		// 		path: PictureDir + '/image_' +  Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
		// 		description: 'Image',
		// 	},
		// };
		// config(options).fetch('GET', image_URL).then(res => {
		// 	console.log('res -> ', JSON.stringify(res));
		// 	this.props.setLoading(false);
		// });
	}

	getExtention = (filename) => {
		return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
	}

	selectFile = async() => {
		// DocumentPicker.pick({ type: ['image/*'], }, (error, res) => { console.log(error); });
		try {
			const res = await DocumentPicker.pick({ type: ['image/*'], })
			const fileInfo = res[0]
			if (!fileInfo) return;
			// {"fileCopyUri": null, "name": "IMG_20230309_024536.jpg", "size": 10593640, "type": "image/jpeg", "uri": "content://media/external/images/media/1463"}
			const format = fileInfo.name.split('.').pop();
			this.props.setLoading(true);
			if (!format) return;
			const formData = new FormData();
			formData.append("file", fileInfo);
			formData.append("format", format);
			formData.append("type", 'message');

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", apiUrl+'other/uploadImgFile.php', true); // Mobile
			xhttp.onreadystatechange = (e) => {
				const result = e.target;
				if (result.readyState === 4 && result.status === 200) {
					const res = JSON.parse(result.responseText);
					console.log('success');
					console.log(res);
					this.setState({inputStr:res.file_name+'.'+format}, () => {
						this.sendMessage('image');
						setTimeout(() => { this.props.setLoading(false); }, 100);
					});
				}
			};
			xhttp.send(formData);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) { } else {  }
		}
	}

	closeImageModal = () => {
		this.setState({modalImg:false});
	}

	render() {
		const {messageArr, inputStr, modalImg} = this.state;
		return (
				<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
					<TopMenuComponent
						label='Chat-Support'
						openProfile={()=>{
							this.props.resetSelTicketId(0);
							this.props.navigation.navigate('Profile');
						}}
						goBack={e=>{
							this.props.resetSelTicketId(0);
							this.props.navigation.goBack()
						}}
					></TopMenuComponent>
					<View style={{width:wholeWidth, flex:1}}>
						<View style={{...MainCss.flex, paddingVertical:10, borderTopColor:grey, borderTopWidth:2}}>
							<Image source={imgSupportGrey} style={{...MainCss.buttonIcon, marginRight:15, marginLeft:10}}></Image>
							<Text style={{...MainCss.label, flex:1}}>Ticket-Nummer: {this.ticketInfo?this.ticketInfo.number:''}</Text>
							<TouchableOpacity style={{marginRight:15}} onPress={e=>this.props.openTicketInfo()}><Image source={imgInfoRed} style={{...MainCss.buttonIcon}}></Image></TouchableOpacity>
						</View>
						<View style={{width:wholeWidth, flex:1}}>
							<ScrollView ref={this.scrollRef}>
								{messageArr.map((chat, idx)=>
									<View key={idx} style={{marginVertical:10, marginHorizontal:30, ...MainCss.flex}} onLayout={e=>{if (idx===messageArr.length-1) this.setScrollEnd(e)}}>
										<View style={{width:66, display:chat.client?'none':'flex'}}></View>
										<View style={{flex:1, backgroundColor:chat.client?'#F5BCBB':'#E6E3E6', paddingHorizontal:10, paddingVertical:7, borderRadius:7, position:'relative'}}>
											<View style={{...MainCss.flex}}>
												<Text style={{...MainCss.label, color:grey, flex:1}}>{chat.sender}</Text>
												<Text style={{...MainCss.label, color:grey}}>{chat.time}</Text>
											</View>
											{!chat.messageType &&
												<RenderHtml
													style={{...MainCss.label, color:black}}
													contentWidth={wholeWidth}
													source={{html:chat.message}}
												/>
											}
											{chat.messageType==='image' &&
												<TouchableOpacity style={{width:'100%', height:150, ...MainCss.flex}} onPress={e=>this.setState({modalImg:chat.message})}>
													<Image source={{uri : apiUrl+'other/message_images/'+chat.message}} style={{width:'95%', height:150, resizeMode:'contain'}}></Image>
												</TouchableOpacity>
											}
											{chat.client ?
												<Image source={imgChatTriRed} style={{position:'absolute', top:0, left:-12}}></Image>:
												<Image source={imgChatTriGrey} style={{position:'absolute', top:0, right:-12}}></Image>
											}
										</View>
										<View style={{width:66, display:chat.client?'flex':'none'}}></View>
									</View>
								)}
							</ScrollView>
						</View>
						<View style={{...MainCss.flex, backgroundColor:'#D0D0D0', width:wholeWidth, height:60}}>
							<TextInput
								placeholder='Hier tippen..'
								value={inputStr}
								onChangeText={e=>this.onChangeInput(e, 'codeStr')}
								style={{backgroundColor:white, ...MainCss.label, flex:1, borderRadius:7, height:44, paddingHorizontal:10, marginHorizontal:10}}
							></TextInput>
							<TouchableOpacity style={{...MainCss.flex, height:44, borderRadius:7, width:44, borderColor:grey, borderWidth:1}} onPress={e=>this.selectFile()}>
								<Image source={imgAttach} style={{width:25, height:25, resizeMode:'contain'}}></Image>
							</TouchableOpacity>
							<TouchableOpacity style={{...MainCss.flex, height:44, borderRadius:7, backgroundColor:red, width:60, opacity:inputStr?1:0.3, marginHorizontal:10}} onPress={e=>this.sendMessage()}>
								<Text style={{color:white}}>OK</Text>
							</TouchableOpacity>
						</View>
						<Animated.View style={[{width:wholeWidth, height:this.inputBottom}]}></Animated.View>
					</View>
					{modalImg &&
						<View style={{...ModalCss.back}}>
							<View style={{...ModalCss.wrapper, height:580}}>
								<Image source={{uri : apiUrl+'other/message_images/'+modalImg}} style={{...ModalCss.image}}></Image>
								<TouchableOpacity style={{...MainCss.button, width:80}} onPress={e=>this.downloadModal()}>
									<Image source={imgDownload} style={{...MainCss.buttonImg}}></Image>
								</TouchableOpacity>
								<TouchableOpacity style={{...ModalCss.close}} onPress={e=>this.closeImageModal()}>
									<Image source={imgClose} style={{...ModalCss.closeImg}}></Image>
								</TouchableOpacity>
							</View>
						</View>
					}
				</View>
		);
	}
}
