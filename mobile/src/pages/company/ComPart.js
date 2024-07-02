import React from 'react';
import { Image, Text, View, StyleSheet, Linking, TouchableOpacity, Animated} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import CalendarPicker from 'react-native-calendar-picker';

import TopMenuComponent from '../layout/TopMenu';
import { MainCss, wholeHeight, wholeWidth, red, whiteGrey, white, black, grey } from '../../assets/css';

import imgHome from '../../assets/images/home.png';
import imgCheckBoxGreen from '../../assets/images/check-box-green.png';
import imgClockWhite from '../../assets/images/clock-white.png';
import imgServiceWhite from '../../assets/images/service-white.png';
import imgPhone from '../../assets/images/phone.png';

import { Get2Digits, GetTimeLabel, GetTimeStrInfo, SendEmail, SetAnimate, onTouchE, onTouchS, timeAnimate } from '../../data/common';
import { ListsCss } from '../layout/ListWrapper';
import { moduleArr } from '../../data/constant';
import { ComMainCss } from './ComMain';
import RoundIconBtn from '../layout/RoundIconBtn';

const heightTime = 600, hourStrArr = [], minStrArr = [];

for (let i = 0; i < 24; i++) {
	if (i<10) hourStrArr.push('0'+i.toString());
	else hourStrArr.push(i.toString());
}
for (let i = 0; i < 60; i++) {
	if (i<10) minStrArr.push('0'+i.toString());
	else minStrArr.push(i.toString());
}

const ComPartCss = StyleSheet.create({
	redBar:{width:wholeWidth, height:55, backgroundColor:red},
});

const typeArr = [
	'Dachaufmass und Dachkontrolle',
	'Gerüst',
	'Ausführung',
	'Wechselrichterinbetriebnahme'
]

function getTimeIdx(timeStr) {
	if (!timeStr) return {hourIdx:0, minIdx:0};
	const timeArr = timeStr.split(':');
	return {hourIdx:parseInt(timeArr[0]), minIdx:parseInt(timeArr[1])};
}

export default class ComPartComponent extends React.Component {
	constructor(props) {
		super(props);
		const {selCustomer, mainInfo} = props, {timeStr, dateStr} = selCustomer;
		const {hourIdx, minIdx} = getTimeIdx(timeStr);
		this.bottomTime = new Animated.Value(-heightTime);
		
		const selDate = dateStr+'T'+'00:00'+':00.000Z';
		this.state = {selCustomer, mainInfo, selModule:moduleArr[0].key, typeIdx:0, modal:false, hourIdx, minIdx, selDate};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['selCustomer', 'mainInfo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='selCustomer') {
					if (nextProps.selCustomer) {
						const {dateStr, timeStr} = nextProps.selCustomer;
						const {hourIdx, minIdx} = getTimeIdx(timeStr);
						this.setState({selDate:dateStr+'T'+'00:00'+':00.000Z', hourIdx, minIdx})
					}
				}
			}
		});
	}

	onClickModule = (itemKey) => {
		this.setState({selModule:itemKey});
	}

	getModuleLabel = () => {
		const selModule = moduleArr.find(item=>{return item.key===this.state.selModule});
		if (selModule) return selModule.label;
		else return '';
	}

	setTypeIdx = (idx) => {
		this.setState({typeIdx:idx});
	}

	onClickTimeButton = () => {
		// const phoneNumber = '+41794742558';
		// Linking.openURL(`tel:${phoneNumber}`);
		this.setState({modal:true})
		Animated.timing(this.bottomTime, { toValue: 0, duration: 500, useNativeDriver: false }).start();
	}

	onClickSettingButton = () => {

	}

	callPhone = () => {
		const phoneNumber = '+41415158888';
		Linking.openURL(`tel:${phoneNumber}`);
	}

	hideModal = () => {
		const timeAnimate = 500;
		Animated.timing(this.bottomTime, { toValue: -heightTime, duration: timeAnimate, useNativeDriver: false }).start();
		setTimeout(() => { this.setState({modal:false}); }, timeAnimate);
	}

	submitTime = () => {
		const {selDate, hourIdx, minIdx, selCustomer, mainInfo} = this.state, {key} = selCustomer; // 2023-08-10T04:00
		const newDateInfo = GetTimeStrInfo(new Date(selDate));
		// console.log(newDateInfo.dateStr); // .substring(10)
		const hourStr = Get2Digits(hourIdx), minStr = Get2Digits(minIdx);
		this.props.setSelDate(key, newDateInfo.dateStr, hourStr+':'+minStr);
		Animated.timing(this.bottomTime, { toValue: -heightTime, duration: timeAnimate, useNativeDriver: false }).start();
		setTimeout(() => { this.setState({modal:false}); }, timeAnimate);

		const mailContent = `<p>Hello ${selCustomer.name}</p></br><p>${mainInfo.name} udpated a service time.</p></br><p></p>`;
		SendEmail(selCustomer.email, mainInfo.email, 'Updated a service time on ENERQ', mailContent);
	}

	render() {
		const {selModule, mainInfo, typeIdx, hourIdx, minIdx, modal, selCustomer} = this.state, {key, name, location, dateStr, timeStr, mainKey, fieldLabel} = selCustomer;
		const comName = mainInfo?mainInfo.first+' '+mainInfo.last:'';
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Hallo '+comName}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{width:wholeWidth, backgroundColor:whiteGrey, height:2}}></View>
				<View style={{...ListsCss.listItem}}>
					<View style={{...ListsCss.icon}}>
						<Image source={imgHome} style={{...ListsCss.iconImg}}></Image>
					</View>
					<View style={{...ListsCss.label}}>
						<Text style={{...MainCss.label, lineHeight:22 }}>{name}</Text>
						<Text style={{...MainCss.label, lineHeight:22 }}>{location}</Text>
					</View>
				</View>
				<View style={{...MainCss.flex, width:wholeWidth, height:55}}>
					{moduleArr.map((item, idx)=>
						<View style={{flex:1, height:'100%', ...MainCss.flex, backgroundColor:red, opacity:mainKey===item.key?1:0.5, borderLeftColor:'#D9271C88', borderLeftWidth:1, borderRightColor:'#D9271C88', borderRightWidth:1}} key={idx}>{/* onPress={e=>this.onClickModule(item.key)} */}
							<Image style={{width:32, height:32, resizeMode:'contain'}} source={item.img}></Image>
						</View>
					)}
				</View>
				<Text style={{...MainCss.label, fontSize:20, marginVertical:6}}>{this.getModuleLabel()}</Text>
				<View style={{...MainCss.flexColumn, width:wholeWidth, paddingVertical:20, paddingHorizontal:15, borderTopColor:'#C5C5C5', borderTopWidth:2, borderBottomColor:'#C5C5C5', borderBottomWidth:2, flex:1}}>
					<View style={{width:'100%'}}>
						<Text style={{...ComMainCss.label, marginBottom:5, marginLeft:10}}>Terminart:</Text>
						{/* <SelectDropdown
							data={typeArr}
							onSelect={(selectedItem, index) => { this.setTypeIdx(index); }} // this.setState({selLocIdx:index})
							defaultValue={typeArr[typeIdx]}
							buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
							rowTextForSelection={(item, index) => { return item }}
							buttonStyle={{...MainCss.selectButton, width:wholeWidth-40}}
						/> */}
						<View style={{...MainCss.selectButton, width:wholeWidth-40}}>
							<Text style={{...ComMainCss.label, marginLeft:15, marginVertical:10}}>{fieldLabel}</Text>
						</View>
					</View>
					<View style={{...MainCss.flex}}>
						<Text style={{...MainCss.label, fontWeight:700}}>{GetTimeLabel(dateStr, timeStr)}</Text>
						<Image style={{width:25, height:25, resizeMode:'contain', marginLeft:10}} source={imgCheckBoxGreen}></Image>
					</View>
					<View style={{...MainCss.flex, flex:1}}>
						<RoundIconBtn
							img={imgClockWhite}
							label='Termin ändern'
							onClick={e=>this.onClickTimeButton()}
						></RoundIconBtn>
					</View>
					{/* <RoundIconBtn
						img={imgServiceWhite}
						label='Termin bestätigen'
						onClick={e=>this.onClickSettingButton()}
					></RoundIconBtn>
					<View style={{flex:1}}></View> */}
				</View>

				<View style={{...MainCss.flexColumn}}>
					{/* <Text style={{...MainCss.label, marginTop:10}}>Kunden kontaktieren:</Text>
					<TouchableOpacity style={{...MainCss.button, marginBottom:8}} onPress={e=>this.callPhone()}>
						<View style={{...MainCss.buttonIcon}}>
							<Image source={imgPhone} style={{...MainCss.buttonImg}}></Image>
						</View>
						<Text style={{...MainCss.buttonIconLabel}}>+41 41 515 88 88</Text>
					</TouchableOpacity>
					<Text style={{...MainCss.label, marginBottom:10}}>petermueller@sunrise.ch</Text> */}
				</View>
				<TouchableOpacity style={{position:'absolute', width:wholeWidth, height:modal?wholeHeight:0, left:0, top:0, backgroundColor:'#FFFFFFCC'}} onPress={e=>this.hideModal()}></TouchableOpacity>
				<Animated.View style={[{position:'absolute', width:wholeWidth, height:heightTime, backgroundColor:white, bottom:this.bottomTime}]}>
					<TouchableOpacity style={{...MainCss.flex, width:wholeWidth, height:55, backgroundColor:red, marginBottom:10}} onPress={e=>this.hideModal()}>
						<Text style={{...MainCss.label, color:white}}>Termin für Dachaufmass u. Dachkontrolle:</Text>
					</TouchableOpacity>
					<CalendarPicker
						scrollable={true}
						textStyle={{color:black}}
						todayBackgroundColor={grey}
						weekdays={['M', 'D', 'M', 'D', 'F', 'S', 'S']}
						firstDay={1}
						previousTitle={'<'}
						nextTitle={'>'}
						selectedDayTextColor={white}
						selectedDayStyle={{backgroundColor:red}}
						// headerWrapperStyle={{borderTopWidth:1, borderTopColor:white, borderBottomWidth:1, borderBottomColor:white}}
						dayLabelsWrapper={{borderTopWidth:0, borderTopColor:grey, borderBottomWidth:0, borderBottomColor:grey}}
						disabledDatesTextStyle={{opacity:0.5}}
						// initialDate={"2023-09-28T04:00:00.000Z"} //new Date(dateStr)
						// minRangeDuration={[]}
						// maxRangeDuration={[]}
						// minDate={''}
						// maxDate={''}
						// styles={{}}
						// currentYear={new Date(dateStr).getFullYear()+1}
						// currentMonth={new Date(dateStr).getMonth()+1}
						// startFromMonday={false}
						// maxDate={todayStr}
						onDateChange={date=>{
							// "2023-08-10T04:00:00.000Z"
							// this.changeTime(date, 'date');
							this.setState({ selDate: date, });
						}}
					/>
					<View style={{...MainCss.flexColumn, width:wholeWidth, paddingVertical:20, borderTopWidth:1, borderTopColor:grey, borderBottomWidth:1, borderBottomColor:grey}}>
						<Text style={{...MainCss.label}}>Uhrzeit wählen:</Text>
						<View style={{...MainCss.flex}}>
							<SelectDropdown
								data={hourStrArr}
								onSelect={(selectedItem, index) => { this.setState({hourIdx:index}); }} // this.setState({selLocIdx:index})
								defaultValue={hourStrArr[hourIdx]}
								buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
								rowTextForSelection={(item, index) => { return item }}
								buttonStyle={{...MainCss.selectButton, width:70, marginHorizontal:10}}
							/>
							<Text style={{...MainCss.label}}> : </Text>
							<SelectDropdown
								data={minStrArr}
								onSelect={(selectedItem, index) => { this.setState({minIdx:index}); }} // this.setState({selLocIdx:index})
								defaultValue={minStrArr[minIdx]}
								buttonTextAfterSelection={(selectedItem, index) => { return selectedItem }}
								rowTextForSelection={(item, index) => { return item }}
								buttonStyle={{...MainCss.selectButton, width:70, marginHorizontal:10}}
							/>
						</View>
					</View>
					<View style={{...MainCss.flex, flex:1}}>
						<TouchableOpacity style={{...MainCss.button, marginBottom:8}} onPress={e=>this.submitTime()}>
							<Text style={{...MainCss.buttonLabel}}>Weiter</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		);
	}
}
