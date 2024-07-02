import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { TouchableOpacity, Image, Text, View, Alert, SafeAreaView, TextInput, Linking, Keyboard, Platform} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { KeyboardAwareView } from 'react-native-keyboard-aware-view'


// import QRModalComponent from './ScanQR';
import imgLogo from '../assets/images/logo-image.png';
import imgLabel from '../assets/images/logo-label.png';
import imgQr from '../assets/images/qr.png';
import imgPhone from '../assets/images/phone.png';
import { MainCss, black, grey } from '../assets/css';
import {wholeWidth, wholeHeight} from '../assets/css';
import { red, white } from '../assets/css/MainCss';
import { SetAnimateArr } from '../data/common';

const tabArr = [
	{key:'kunde', label:'Kunde'},
	{key:'team', label:'Team'},
]
const testMode = false;
const codeLength = 12, email = testMode?'worker0@gmail.com':'', passd = testMode?'password0':'';

export default class FirstComponent extends React.Component {
	constructor(props) {
		super(props);
		const {codeStr, mainInfo, selFirst, selIdx} = props;
		this.state = {selTab:tabArr[0].key, selFirst, codeStr, selIdx, email, passd, systemOptionArr:[], qrModal:false, qrInner:false, tabTop:10, imgLogoW:82, imgLabelW:140, imgMarginV:0, logoTop:90, logoPartH:160, keyBottom:0, mainInfo};
		// this.state = {selTab:null, selFirst, codeStr, selIdx, email:'', passd:'', systemOptionArr:[], qrModal:false, qrInner:false, tabTop:-40, imgLogoW:121, imgLabelW:210, imgMarginV:28, logoTop:0, logoPartH:wholeHeight, mainInfo};
	}

	componentDidMount() {
		if (Platform.OS==='ios') {
		} else {
			this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>this._keyboardDidShow());
			this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>this._keyboardDidHide());
		}
	}

	// componentWillMount () {
	// }

	componentWillUnmount() {
		if (Platform.OS==='ios') {
		} else {
			this.keyboardDidShowListener.remove();
			this.keyboardDidHideListener.remove();
		}
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		['codeStr', 'mainInfo', 'selFirst', 'selIdx', 'systemOptionArr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='mainInfo' && !nextProps.mainInfo.name) {
					this.setState({logoPartH:160, logoTop:90, tabTop:10, imgLogoW:82, imgLabelW:140, imgMarginV:0}); // , selFirst:'input'
					this.props.setSelFirst('input');
				} else if (key==='selFirst') {
					// if (nextProps.selFirst === 'input') { this.setLogoAnimate(); } else 
					if (nextProps.selFirst === 'confirm') { this.setSelFirstConfirm(); }
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	_keyboardDidShow () {
		if (this.state.selTab==='kunde') return;
		const animateArr = [ { key:'keyBottom', old: 0, new: 200}, ]
		SetAnimateArr(animateArr, this);
	}
	
	_keyboardDidHide () {
		if (this.state.selTab==='kunde') return;
		const animateArr = [ { key:'keyBottom', old: 200, new: 0}, ]
		SetAnimateArr(animateArr, this);
	}

	onChangeCodeStr = (str) => {
		this.setState({codeStr:str});
	}

	onChangeInput = (e, key) => {
		var str = e;
		if (key==='codeStr') {
			str = e.toUpperCase();
			this.props.setCodeStr(str);
		} else {
			this.setState({[key]:str});
		}
	}

	onClickCode = (loading) => {
		// if (this.props.test) {this.setSelFirstConfirm(); return;}
		const {codeStr} = this.state;
		if (!codeStr || codeStr.length !== codeLength) return;
		this.props.onClickCode(loading);
	}

	setSelFirstConfirm = () => {
		// this.setState({selFirst:'confirm'});
		const animateArr = [
			{ key:'tabTop', old: 10, new: -50},
			{ key:'logoTop', old: 90, new: 40},
		]
		SetAnimateArr(animateArr, this);
	}

	checkEmail = (str) => {
		return String(str).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	}

	onClickEmail = () => {
		const {email, passd} = this.state;
		if (!this.checkEmail(email) || passd==='') {
			Alert.alert(
				'Input Error',
				'Insert correct email format and password!',
				[ { text: 'OK', onPress: async () => { }, }, ],
				{ cancelable: false }
			);
			return;
		}
		this.props.onClickEmail(email, passd);
	}

	onClickConfirm = () => {
		this.props.navigation.navigate( 'Total');
	}

	// setLogoAnimate = () => {
	// 	this.setState({selTab:tabArr[0].key}); // selFirst:'input', 
	// 	const animateArr = [
	// 		{ key:'logoPartH', old: wholeHeight, new: 160},
	// 		{ key:'logoTop', old: 0, new: 90},
	// 		{ key:'tabTop', old: -60, new: 10},
	// 		{ key:'imgLogoW', old: 121, new: 82},
	// 		{ key:'imgLabelW', old: 210, new: 140},
	// 		{ key:'imgMarginV', old: 28, new: 0}
	// 	]
	// 	SetAnimateArr(animateArr, this);
	// }

	callPhone = () => {
		const phoneNumber = '+41415158888';
		Linking.openURL(`tel:${phoneNumber}`);
	}

	render() {
		const {mainInfo, selTab, selIdx, selFirst, codeStr, systemOptionArr, email, passd, tabTop, imgLogoW, imgLabelW, imgMarginV, logoTop, logoPartH, keyBottom} = this.state;
		const codeBtnStyle = codeStr.length===codeLength?{}:MainCss.buttonEmpty;
		return (
			<KeyboardAwareScrollView contentContainerStyle={{...MainCss.backBoard, ...MainCss.flexColumn, flex:1}} extraHeight={-64}>
				<View style={{position: 'absolute', top:tabTop, width: wholeWidth, ...MainCss.flex, display:'flex',}}>{/* tabTop -50 */}
					{tabArr.map((item, idx)=>
						<TouchableOpacity style={{...MainCss.flex, flex: 1}} onPress={() => this.setState({selTab:item.key})} key={idx}>
							<View style={{paddingVertical: 6, borderBottomWidth :3, borderBottomColor: selTab===item.key?'#D9271C':'#FFFFFF'}}>
								<Text style={{...MainCss.label, width: 100, textAlign: 'center'}}>{item.label}</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
				<View style={{...MainCss.flexColumn, height:logoPartH, marginTop:logoTop}}>
					<Image source={imgLogo} style={{width:imgLogoW, height:imgLogoW, marginVertical:imgMarginV, resizeMode: 'contain'}} />
					<Image source={imgLabel} style={{width:imgLabelW, resizeMode: 'contain'}} />
				</View>
				{selTab==='kunde' &&
					<View style={{...MainCss.flexColumn, flex:1}}>
						{selFirst==='input' &&
							<View style={{...MainCss.flexColumn}}>
								<View style={{...MainCss.labelWrapper}}>
									<Text style={{...MainCss.label}}>Beim Auftragsabschluss hast Du</Text>
									<Text style={{...MainCss.label}}>einen Code von uns erhalten.</Text>
								</View>
								<TouchableOpacity style={{...MainCss.button}} onPress={() => this.props.navigation.navigate('QRScan')}>
									<View style={{...MainCss.buttonIcon}}>
										<Image source={imgQr} style={{...MainCss.buttonImg}}></Image>
									</View>
									<Text style={{...MainCss.buttonIconLabel}}>QR-Code scannen</Text>
								</TouchableOpacity>
								
								<TextInput
									placeholder='Code eingeben'
									value={codeStr}
									onChangeText={e=>this.onChangeInput(e, 'codeStr')}
									style={{...MainCss.input, marginBottom: 10, marginTop:20}}
									placeholderTextColor={grey}
									// underlineColorAndroid="transparent"
									// blurOnSubmit={false} 
									// autoFocus={false} 
									// autoCorrect={false}
									// autoCapitalize="none" 
									// keyboardType="email-address" 
									// returnKeyType="next" 
									// onSubmitEditing={this.submit.bind(this)}
								></TextInput>
								<TouchableOpacity style={{...MainCss.button, ...codeBtnStyle}}
								// backgroundColor:codeStr.length===codeLength?red:white, borderColor:codeStr.length===codeLength?white:red
									onPress={e=>{
										if (!codeStr || codeStr.length!==codeLength) {
											this.props.showError('Insert correct code!');
										} else { 
											this.onClickCode(true);
										}
									}}
								>
									<Text style={{...MainCss.buttonLabel, color:codeStr.length===codeLength?white:red}}>Weiter</Text>
								</TouchableOpacity>
								<View style={{...MainCss.labelWrapper}}>
									<Text style={{...MainCss.label}}>Noch kein Kunde?</Text>
									<Text style={{...MainCss.label}}>Kostenloses Angebot:</Text>
								</View>
								<TouchableOpacity style={{...MainCss.button, marginBottom:50}} onPress={e=>this.callPhone()}>
									<View style={{...MainCss.buttonIcon}}>
										<Image source={imgPhone} style={{...MainCss.buttonImg}}></Image>
									</View>
									<Text style={{...MainCss.buttonIconLabel}}>+41 41 515 88 88</Text>
								</TouchableOpacity>
							</View>
						}
						{selFirst==='confirm' &&
							<>{/* SafeAreaView style={{...MainCss.flexColumn, height:wholeHeight - 250}} */}
								<View style={{...MainCss.labelWrapper}}>
									<Text style={{...MainCss.label, textAlign:'center', fontSize:20}}>Hallo {mainInfo?.name},</Text>
									<Text style={{...MainCss.label, textAlign:'center', fontSize:20}}>wähle deine Anlage:</Text>
								</View>
								<SelectDropdown
									data={systemOptionArr}
									onSelect={(selectedItem, index) => { this.props.setSelSystemIdx(index); }} // this.setState({selLocIdx:index})
									defaultValue={systemOptionArr[selIdx]}
									buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
									rowTextForSelection={(item, index) => { return item }}
									buttonStyle={{...MainCss.selectButton}}
								/>
								<TouchableOpacity style={{...MainCss.button, width:200}} onPress={this.onClickConfirm}>
									<Text style={{...MainCss.buttonLabel}}>Bestätigen</Text>
								</TouchableOpacity>
							</>// SafeAreaView
						}

					</View>
				}

				{selTab !== 'kunde' &&
					<View style={{...MainCss.flexColumn, flex:1, marginBottom:keyBottom}}>
						<Text style={{...MainCss.label, fontSize:20, lineHeight:25}}>Melde Dich hier mit deinen</Text>
						<Text style={{...MainCss.label, fontSize:20, lineHeight:25}}> Daten an.</Text>
						<TextInput
							placeholder='E-Mail'
							value={email}
							onChangeText={e=>this.onChangeInput(e, 'email')}
							style={{...MainCss.input, marginTop:20}}
							placeholderTextColor={grey}
							onSubmitEditing={e=>{this.onClickEmail(); }}
						></TextInput>
						<TextInput
							placeholder='Passwort'
							value={passd}
							secureTextEntry={true}
							onChangeText={e=>this.onChangeInput(e, 'passd')}
							style={{...MainCss.input, marginBottom: 20, marginTop:10}}
							placeholderTextColor={grey}
							onSubmitEditing={e=>{this.onClickEmail(); }}
						></TextInput>
						<TouchableOpacity style={{...MainCss.button}} onPress={this.onClickEmail}>
							<Text style={{...MainCss.buttonLabel}}>Absenden</Text>
						</TouchableOpacity>
					</View>
				}

			</KeyboardAwareScrollView>
			
		);
	}
}
