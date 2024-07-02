import React from 'react';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import TopMenuComponent from '../layout/TopMenu';
import { apiUrl } from '../../data/config';

import { MainCss, black, grey, red, white, wholeHeight, wholeWidth } from '../../assets/css';
import { DetailPanCss } from '../detail/ServiceDetail';
import { catArr } from '../../data/constant';
import imgSupportWhite from '../../assets/images/support-white.png';
import { SendEmail } from '../../data/common';
const catLabelArr = [];
catArr.forEach(cat => { catLabelArr.push(cat.label) });

const CreateCss = StyleSheet.create({
	redBar: {...MainCss.flex, width:wholeWidth, height:60, backgroundColor:red},
	input:{width:wholeWidth-40, color:black, borderWidth:1, borderColor:'#C5C5C5', borderRadius:4, marginHorizontal:20}
})

export default class TicketCreateComponent extends React.Component {
	constructor(props) {
		super(props);
		const {selSystem, mainInfo, ticketArr, teamArr} = props;
		this.ticketCat = catArr[0].key;
		this.state = {selSystem, category:catArr[0].label, selCatIdx:0, mainInfo, title:'', description:'', ticketArr, teamArr};
	}

	componentDidMount() {
		// this._unsubscribe = navigation.addListener('focus', () => {
		// 	// do something
		// });
	}
	componentWillUnmount() {
		// this._unsubscribe();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['selSystem', 'mainInfo', 'ticketArr', 'teamArr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]})
			}
		});
	}

	onChangeInput = (str, key) => {
		this.setState({[key]: str});
	}

	submitCreate = () => {
		const {title, description, mainInfo, selSystem, ticketArr, teamArr} = this.state;
		const catInfo = catArr.find(item=>{return item.key===this.ticketCat});
		const desArr = description.split('\n');
		var newDesStr = '';
		desArr.forEach(des => {
			newDesStr += '<p>'+des+'</p>\n';
		});

		const time = Date.now();
		var ticketNum = ticketArr.length + 1, ticketNumStr = '';
		if 		(ticketNum < 10)	ticketNumStr = '00'+ticketNum;
		else if (ticketNum < 100)	ticketNumStr = '0'+ticketNum;
		const updateData = {customerId:parseInt(mainInfo.id), systemId:parseInt(selSystem.id), number:selSystem.number+ticketNumStr, category:catInfo.label, title, employeeId:0, description:newDesStr, status:'client', createTime:Math.round(time/1000)};
		this.props.setLoading(true);
		axios.post(`${apiUrl}mobile/updateTicket.php`, updateData).then(res => {
			this.props.setLoading(false);
			const {success} = res.data;
			if (success) {
				this.setState({title:'', description:''});
				this.props.callTicketAPI();
			}
		}).catch(error => {
			console.error(error);
			setLoading(false);
		});
		teamArr.forEach(emp => {
			const mailContent = `<p>Hello ${emp.name}</p></br><p>${mainInfo.name} created new '${title}' ticket as below content.</p></br><p>${newDesStr.split('\n').join()}</p>`;
			SendEmail(emp.email, mainInfo.email, 'Created new "'+title+'" ticket on ENERQ', mailContent);
		});
	}

	render() {
		const {selSystem, category, title, description, selCatIdx} = this.state;
		return (
			<KeyboardAwareScrollView style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Support'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...CreateCss.redBar}}>
					<Image style={{...MainCss.buttonIcon}} source={imgSupportWhite}></Image>
					<Text style={{...MainCss.buttonIconLabel}}>Neue Support-Anfrage:</Text>
				</View>
				<Text style={{...MainCss.label, margin:20}}>Anlage: {selSystem.name}, {selSystem.canton}</Text>
				<View style={{display:'flex', flexDirection:'row', marginHorizontal:20}}>
					<Text style={{...MainCss.label, width:100, marginTop:10}}>Kategorie:</Text>
					<SelectDropdown
						data={catLabelArr}
						onSelect={(selectedItem, index) => { this.ticketCat = catArr[index].key; }}
						defaultValue={category}
						buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
						rowTextForSelection={(item, index) => { return item }}
						selectIndex={selCatIdx}
						// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
						buttonStyle={{...MainCss.selectButton, width:wholeWidth - 140}}
					/>
				</View>
				<TextInput
					placeholder='Betreff..'
					placeholderTextColor={black}
					value={title}
					onChangeText={e=>this.onChangeInput(e, 'title')}
					style={{...CreateCss.input, padding:10}}
				></TextInput>
				<TextInput
					placeholder='Deine Anfrage hier eingeben..'
					placeholderTextColor={black}
					value={description}
					onChangeText={e=>this.onChangeInput(e, 'description')}
					style={{...CreateCss.input, height:wholeHeight - 400, marginTop:20, verticalAlign:'top', paddingHorizontal:10}}
					editable
					multiline
				></TextInput>
				<TouchableOpacity style={{...MainCss.button, width:100, borderRadius:4, marginTop:10, marginLeft:wholeWidth - 120}} onPress={e=>this.submitCreate()}>
					<Text style={{...MainCss.buttonLabel}}>Senden</Text>
				</TouchableOpacity>
			</KeyboardAwareScrollView>
		);
	}
}
