import React from 'react';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import TopMenuComponent from '../layout/TopMenu';
import { apiUrl } from '../../data/config';

import { MainCss, black, wholeHeight, wholeWidth } from '../../assets/css';
import { moduleLabelArr } from '../../data/constant';
import { SendEmail } from '../../data/common';

const mainCatArr = ['Photovoltaikanlage', 'Wärmepumpe', 'Speicher'];

const subCatKeyArr = [
	['module-clean', 'inverter-clean'],
	['blower-clean', 'temp-regulation'],
	['adjustment']
]

const subCatArr = [
	['Modulreinigung', 'Wechselrichterreinigung'],
	['Gebläsereinigung', 'Temperatureinregelung'],
	['Priorisierungsanpassung']
]

const CreateCss = StyleSheet.create({
	label: {...MainCss.label, marginTop:20, marginBottom:10, marginHorizontal:40, fontSize:18},
	select: {width:wholeWidth - 80, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9', marginHorizontal:40, marginBottom:10, borderRadius:7, textAlign:'left'},
	input:{width:wholeWidth-80, color:black, borderWidth:1, borderColor:'#C5C5C5', borderRadius:4, marginHorizontal:40, fontSize:16}
})

export default class ServiceCreateComponent extends React.Component {
	constructor(props) {
		super(props);
		const {mainInfo, selSystem, teamArr} = props;
		this.subSelect = React.createRef();
		this.state = {mainInfo, selSystem, teamArr, selMainIdx:null, selSubIdx:null, description:''};
	}

	componentDidMount() {
	}
	componentWillUnmount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['mainInfo', 'selSystem', 'teamArr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onChangeInput = (str, key) => {
		this.setState({[key]: str});
	}

	checkDisable = () => {
		const {description, selMainIdx, selSubIdx} = this.state;
		return (!description || selMainIdx===null || selSubIdx===null);
	}

	submitCreate = () => {
		if (this.checkDisable()) return;
		const {mainInfo, selSystem, description, selMainIdx, selSubIdx, teamArr} = this.state;
		const selMainLabel = moduleLabelArr.find(item=>{return mainCatArr[selMainIdx].includes(item.label)}) || {};
		const mainType = selMainLabel.key, subType = subCatKeyArr[selMainIdx][selSubIdx];
		
		const time = Date.now();
		const updateData = {customerId:parseInt(mainInfo.id), systemId:parseInt(selSystem.id), mainType, subType, content:description, time:Math.round(time/1000)};
		this.props.setLoading(true);
		axios.post(`${apiUrl}mobile/updateService.php`, updateData).then(res => {
			const {success} = res.data;
			if (success) {
				this.setState({selMainIdx:null, selSubIdx:null, description:''});
			} else {
				this.props.setError('Failed to create the service request');
			}
			this.props.setLoading(false);
		}).catch(error => {
			console.error(error);
			setLoading(false);
			this.props.setLoading(false);
		});
		teamArr.forEach(emp => {
			const mailContent = `<p>Hello ${emp.name}</p></br><p>${mainInfo.name} created new service as below content.</p></br><p>${description}</p>`;
			SendEmail(emp.email, mainInfo.email, 'Created new ticket on ENERQ', mailContent);
		});
	}

	render() {
		const { description, selMainIdx, selSubIdx} = this.state;
		return (
			<KeyboardAwareScrollView style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Service'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<Text style={{...CreateCss.label}}>Für welche Anlage möchten Sie Service beantragen?</Text>
				<View style={{...MainCss.flex}}>
					<SelectDropdown
						data={mainCatArr}
						onSelect={(selectedItem, index) => { this.setState({selMainIdx:index, selSubIdx:null}); this.subSelect.current.reset(); }}
						defaultValue={''}
						buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
						rowTextForSelection={(item, index) => { return item }}
						selectIndex={selMainIdx}
						// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
						buttonStyle={{...MainCss.selectButton, width:wholeWidth - 80, marginBottom:10, textAlign:'left'}}
					/>
				</View>

				<Text style={{...CreateCss.label}}>Welchen Service möchten Sie für diese Anlage beantragen?</Text>
				<View style={{...MainCss.flex}}>
					<SelectDropdown
						ref={this.subSelect}
						data={subCatArr[selMainIdx] || []}
						onSelect={(selectedItem, index) => { this.setState({selSubIdx:index}); }}
						defaultValue={''}
						buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
						rowTextForSelection={(item, index) => { return item }}
						selectIndex={selSubIdx}
						// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
						buttonStyle={{...MainCss.selectButton, width:wholeWidth - 80, marginBottom:10, textAlign:'left'}}
					/>
				</View>

				<Text style={{...CreateCss.label}}>Anmerkungen:</Text>
				<TextInput
					placeholder='Deine Anfrage hier eingeben..'
					placeholderTextColor={black}
					value={description}
					onChangeText={e=>this.onChangeInput(e, 'description')}
					style={{...CreateCss.input, height:wholeHeight - 510, verticalAlign:'top', paddingHorizontal:10}}
					editable
					multiline
				></TextInput>
				<TouchableOpacity style={{...MainCss.button, width:200, borderRadius:4, marginTop:10, marginLeft:wholeWidth - 240, opacity:this.checkDisable()?0.5:1}} onPress={e=>this.submitCreate()}>
					<Text style={{...MainCss.buttonLabel}}>Angebot anfordern</Text>
				</TouchableOpacity>
				{/* <View style={{...MainCss.button, width:200, borderRadius:4, marginTop:10, marginLeft:wholeWidth - 240, opacity:this.checkDisable()?0.5:1}} 
					onTouchStart={e=>onTouchS(e, this) }
					onTouchEnd={e => onTouchE(e, this, 'serviceCreate') }>
					<Text style={{...MainCss.buttonLabel}}>Angebot anfordern</Text>
				</View> */}
			</KeyboardAwareScrollView>
		);
	}
}
