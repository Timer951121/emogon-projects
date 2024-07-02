import React from 'react';
import { TouchableOpacity, Image, Text, View, ScrollView, StyleSheet, Animated } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import TopMenuComponent from '../layout/TopMenu';
import ListWrapper from '../layout/ListWrapper';

import { moduleArr, moduleLabelArr } from '../../data/constant';
import { GetSelItem, onTouchE, onTouchS } from '../../data/common';
import { MainCss, wholeWidth, red, white } from '../../assets/css';
import imgService from '../../assets/images/service.png';
import imgCheckBox from '../../assets/images/check-box.png';
import imgClock from '../../assets/images/clock.png';
import { listServicetArr } from './ServiceMain';

export const detailH = 270, animateTime = 500;
const DetailCss = StyleSheet.create({
	courseBoard:{flex:1, flexGrow:1, width:wholeWidth},
	courseItem:{display:'flex', flexDirection:'row', alignItems:'center', marginVertical:10, marginRight:20},
	courseMain:{flex:1, marginLeft:20},
	courseRow:{display:'flex', flexDirection:'row', alignItems:'center'},
	courseTitle:{...MainCss.label, fontWeight:700},
	courseDetail:{display:'flex', flexDirection:'column', flex:1},
	courseImgCheck:{width:30, height:30, resizeMode:'contain', marginRight:3},
	courseImgTime:{width:37, height:40, resizeMode:'contain', marginRight:0},
	courseImgTimeCircle:{position:'absolute', right:1, top:23, width:18, height:18, borderRadius:9, backgroundColor:red},
})
export const DetailPanCss = StyleSheet.create({
	board: { position:'absolute', width:wholeWidth, height:detailH, backgroundColor:white },
	redBar: {...MainCss.flex, width:wholeWidth, height:60, backgroundColor:red}
})
const detailCourseList = [
	{key:'invoice', label:'Rechnung'},
	{key:'conversation', label:'Gespräch'}
];
const systemSelectArr = [];
moduleLabelArr.forEach(item => { systemSelectArr.push(item.label) });
const formatSelectArr = ['Säuberung Panele', 'Check Panele', 'Check Anlage', 'Firmware Update'];
const billContent = [
	{key:'getSystem', title:'Für welche Anlage möchten Sie Service beantragen?', options:systemSelectArr},
	{key:'getFormat', title:'Welchen Service möchten Sie für diese Anlage beantragen?', options:formatSelectArr},
]

export default class ServiceDetailComponent extends React.Component {
	constructor(props) {
		super(props);
		const {serviceKey, moduleInfo, serviceCourseArr, selSystem} = props, selItem = GetSelItem(listServicetArr, serviceKey);
		this.detailBottom = new Animated.Value(detailH * -1);
		this.state = {moduleInfo, serviceKey, selItem, serviceCourseArr, detailCourse:{}, courseOpacity:1, selSystem, selSystemIdx:0, selFormatIdx:0};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['serviceKey', 'moduleInfo', 'serviceCourseArr', 'selSystem'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]})
				if (nextProps.serviceKey) {
					const selItem = GetSelItem(listServicetArr, nextProps.serviceKey); // moduleArr
					this.setState({selItem});
				}
			}
		});
	}

	showDetailCourse = (course) => {
		if (this.state.detailCourse.status) return;
		this.setState({detailCourse:course}, () => {
			Animated.timing(this.detailBottom, { toValue: 0, duration: animateTime, useNativeDriver: false }).start();
			this.setState({courseOpacity:0.3});
		})
	}

	closeDetailCourse = (time=animateTime) => {
		Animated.timing(this.detailBottom, { toValue: -detailH, duration: time, useNativeDriver: false }).start();
		this.setState({courseOpacity:1});
		setTimeout(() => { this.setState({detailCourse:{}}); }, time);
	}

	getServiceArr = () => {
		const {serviceCourseArr, selSystem} = this.state;
		if (!serviceCourseArr || !selSystem) return [];
		return serviceCourseArr.filter(item=>{return item.systemId===selSystem.id});
	}

	render() {
		const {serviceKey, selItem, serviceCourseArr, detailCourse, courseOpacity} = this.state;
		// const selInfoKey = selTab==='building'?'build':'mat';
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={selItem.title || ''}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				{serviceKey==='course' &&
					<>
						<View style={{...DetailCss.courseBoard, opacity:courseOpacity}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
							<ScrollView>
								{this.getServiceArr().map((course, idx)=>
									<DetailCourse course={course} clickDetail={e=>this.showDetailCourse(course)} key={idx}></DetailCourse>
								)}
								{this.getServiceArr().length===0 &&
									<Text style={{color:'black', fontSize:20, marginLeft:20, marginTop:20}}>There is not any requested service.</Text>
								}
							</ScrollView>
						</View>
						<Animated.View style={[DetailPanCss.board, {bottom:this.detailBottom}]}>
							<TouchableOpacity style={{...DetailPanCss.redBar}} onPress={e=>this.closeDetailCourse()}>
								<Text style={{...MainCss.title}}>Details</Text>
							</TouchableOpacity>
							<DetailCourse course={detailCourse} clickDetail={e=>{}}></DetailCourse>
							<ListWrapper
								iconHide={true}
								listArr={detailCourseList}
								onClickListItem={itemKey=>{}}
							></ListWrapper>
						</Animated.View>
					</>
				}
				{serviceKey==='bill' &&
					<View style={{flex:1, marginHorizontal:50}}>
						{/* {billContent.map((item, idx)=>
							<View style={{marginTop:50}} key={idx}>
								<Text style={{...MainCss.label, marginBottom:20}}>{item.title}</Text>
								<SelectDropdown
									data={item.options}
									onSelect={(selectedItem, index) => {
										const selectKey = item.key==='getSystem'?'selSystemIdx':'selFormatIdx';
										this.setState({[selectKey]:index})
									}}
									defaultValue={item.options[0]}
									buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
									rowTextForSelection={(item, index) => { return item; }}
									// dropdownStyle={{width:200, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9'}}
									buttonStyle={{width:wholeWidth - 100, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9', marginBottom:20, borderRadius:7}}
								/>
							</View>
						)} */}
					</View>
				}
			</View>
		);
	}
}

class DetailCourse extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		const {course} = this.props;
		const imgStyle = course.status==='done'?DetailCss.courseImgCheck:DetailCss.courseImgTime;
		return (
			<View
				onTouchStart={e=>onTouchS(e, this) }
				onTouchEnd={e => onTouchE(e, this, 'serviceDetail') }
				style={{...DetailCss.courseItem}}>
				<Image source={imgService} style={{...MainCss.buttonIcon}}></Image>
				<View style={{...DetailCss.courseMain}}>
					<View style={{...DetailCss.courseRow}}>
						<Text style={{...DetailCss.courseTitle, flex:1}}>Service</Text>
						<Text style={{...DetailCss.courseTitle}}>{course.time}</Text>
					</View>
					<View style={{...DetailCss.courseRow}}>
						<View style={{...DetailCss.courseDetail}}>
							<Text style={{...MainCss.label, lineHeight:20}}>{course.moduleLabel}</Text>
							<Text style={{...MainCss.label, lineHeight:20}}>{course.systemLabel}</Text>
						</View>
						<Image source={course.status==='done'?imgCheckBox:imgClock} style={{...imgStyle}}></Image>
						{course.status === 'ready' &&
							<View style={{...DetailCss.courseImgTimeCircle}}></View>
						}
					</View>
				</View>
			</View>
		);
	}
}