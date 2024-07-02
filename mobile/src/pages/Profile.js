import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import TopMenuComponent from './layout/TopMenu';
import { MainCss, wholeHeight, wholeWidth, red, white, grey } from '../assets/css';

import imgExit from '../assets/images/exit.png';
import imgAvatarBig from '../assets/images/avatar-big.png';
import imgAvatarSetting from '../assets/images/avatar-setting.png';
import imgAvatarSmall from '../assets/images/avatar-small.png';
import imgBill from '../assets/images/bill.png';
import imgSetting from '../assets/images/setting.png';
import imgDoc from '../assets/images/doc.png';
import ListWrapper from './layout/ListWrapper';
import { SetAnimate, onTouchE, onTouchS } from '../data/common';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiUrl } from '../data/config';

const listArr = [
	// {key:'account', img:imgAvatarSmall, label:'Mein Konto'},
	// {key:'invoice', img:imgBill, label:'Rechnungsübersicht'},
	// {key:'ideas', img:imgSetting, label:'Einstellungen'},
	{key:'agb', img:imgDoc, label:'AGB'},
	{key:'impress', img:imgDoc, label:'Impressum'},
]
const ProfileCss = StyleSheet.create({
	// avatar:{height:wholeHeight - 600},
	avatar:{flex:1},
	avatarImgWrapper:{width:130, height:130, marginBottom:20, position:'relative'},
	avatarImg:{width:130, height:130, borderRadius:65},
	back:{width: wholeWidth, height: 70,  backgroundColor: red},
	backImg:{width: 22, height:22, marginRight: 30},
});

export default class ProfileComponent extends React.Component {
	constructor(props) {
		super(props);
		const {profile, mainInfo} = props;
		this.state = {profile, mainInfo, top:-wholeHeight};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['profile', 'mainInfo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='profile') {
					if (nextProps.profile===true) SetAnimate('top', -wholeHeight, 0, this);
					else SetAnimate('top', 0, -wholeHeight, this);
				} else if (key==='mainInfo') {
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickListItem = (listKey) => {
		if 		(listKey==='agb') this.props.navigation.navigate('AGB');
		else if (listKey==='impress') this.props.navigation.navigate('Impress');
	}

	selectFile = async() => {
		try {
			const res = await DocumentPicker.pick({ type: ['image/*'], })
			const fileInfo = res[0]
			if (!fileInfo) return;
			// {"fileCopyUri": null, "name": "IMG_20230309_024536.jpg", "size": 10593640, "type": "image/jpeg", "uri": "content://media/external/images/media/1463"}
			const format = fileInfo.name.split('.').pop();
			if (!format) return;
			this.props.setLoading(true);
			const formData = new FormData(), customerInfo = {...this.state.mainInfo};
			formData.append("file", fileInfo);
			formData.append("format", format);
			formData.append("type", 'profile');
			formData.append("customerId", customerInfo.id);

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", apiUrl+'other/uploadImgFile.php', true); // Mobile
			xhttp.onreadystatechange = (e) => {
				const result = e.target;
				if (result.readyState === 4 && result.status === 200) {
					const res = JSON.parse(result.responseText);
					customerInfo.image = res.file_name;
					this.props.setMainInfo(customerInfo);
					this.props.setLoading(false);
				}
			};
			xhttp.send(formData);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) { } else {  }
		}
	}

	render() {
		const {mainInfo} = this.state;
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label='Dein Account'
					hideProfile={true}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flexColumn, ...ProfileCss.avatar}}>
					<View style={{...ProfileCss.avatarImgWrapper}}>
						{mainInfo.image !== '' &&
							<Image style={{...ProfileCss.avatarImg}} source={{uri : apiUrl+'other/profile_images/'+mainInfo.image}} ></Image>
						}
						{mainInfo.image === '' &&
							<Image style={{...ProfileCss.avatarImg}} source={imgAvatarBig}></Image>
						}
						
						<TouchableOpacity style={{...MainCss.flex, height:27, width:27, position:'absolute', top:95, left:95}} onPress={e=>this.selectFile()}>
							<Image source={imgAvatarSetting} style={{width:27, height:27, resizeMode:'cover'}}></Image>
						</TouchableOpacity>
					</View>
					<Text style={{...MainCss.label}}>Willkommen, {mainInfo?mainInfo.first+' '+mainInfo.last:''}.</Text>
				</View>
				<View style={{height:300}}>
					<ListWrapper
						listArr={listArr}
						onClickListItem={listKey=>this.onClickListItem(listKey)}
					></ListWrapper>
				</View>
				
				<View
					onTouchStart={e=> onTouchS(e, this)}
					onTouchEnd={e => onTouchE(e, this, 'logout') }
					style={{...MainCss.flex, ...ProfileCss.back}}>
					<Image source={imgExit} style={{...ProfileCss.backImg}}></Image>
					<Text style={{...MainCss.title, color:white}}>Abmelden</Text>
				</View>
			</View>
		);
	}
}
