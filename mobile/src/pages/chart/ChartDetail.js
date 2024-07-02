import React from 'react';
import { Image, Text, View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import { moduleArr } from '../../data/constant';
import { GetSelItem, onTouchE, onTouchS } from '../../data/common';
import { MainCss, wholeWidth, red, green, grey, white, wholeHeight, ModalCss } from '../../assets/css';

import imgCheck from '../../assets/images/check.png';
import imgClose from '../../assets/images/close.png';
// import imgEmptyCheck from '../../assets/images/empty-check.jpg';
import { apiUrl } from '../../data/config';

function GetBuildMatData(chartKey, detailObj) {
	var selDetailItem = {buildingArr:[], materialArr:[]};
	if (chartKey && detailObj[chartKey]) {
		selDetailItem = detailObj[chartKey];
	}
	return selDetailItem;
}

function GetCheckBorderCol(check) {
	if (check === 'error') return red;
	else if (check === 'check') return green;
	else return grey;
}

const tabArr = [
	{key:'build', label:'Bau'},
	{key:'mat', label:'Material'}
]

const DetailCss = StyleSheet.create({
	topPart:{height:60, display:'flex', alignItems:'center', flexDirection:'row', borderTopWidth: 2, borderTopColor:'#C5C5C5', width:wholeWidth},
	topImg:{marginHorizontal: 30, height: 40, width:40, resizeMode: 'contain', opacity: 0.5},
	tabWrapper:{width: wholeWidth, height: 60, display:'flex', flexDirection:'row'},
	tabItem:{flex:1, height: 60, backgroundColor: red},
	checkRow:{display: 'flex', flexDirection:'row', width: wholeWidth - 40, marginVertical:7, marginHorizontal:20},
	checkBox:{width: 31, height: 31, borderRadius: 7, borderWidth:2, borderColor: '#4D4D4D88'},
	checkImg:{width:20, height:20},
	checkLabel:{marginLeft:10, marginRight:10, marginTop:0}
})

export default class ChartDetailComponent extends React.Component {
	constructor(props) {
		super(props);
		const {chartKey, moduleInfo} = props, selItem = GetSelItem(moduleArr, chartKey);
		this.moduleData = moduleInfo;
		const {build, mat} = GetBuildMatData(chartKey, this.moduleData);
		this.state = {selTab:tabArr[0].key, chartKey, build, mat, selItem};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.moduleData = nextProps.moduleInfo;
		['chartKey', 'moduleInfo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]})
				if (nextProps.chartKey) {
					const selItem = GetSelItem(moduleArr, nextProps.chartKey);
					const {build, mat} = GetBuildMatData(nextProps.chartKey, this.moduleData);
					this.setState({build, mat, selItem});
				}
				if (key==='chartkey') {
					this.setState({selTab:tabArr[0].key});
				}
			}
		});
	}

	onClickTab = (tabKey) => {
		this.setState({selTab:tabKey})
	}

	onClickCheckBox = (idx) => {
		const {selTab, chartKey} = this.state, selTabArrKey = selTab+'Arr';
		const selTabInfo = this.state[selTabArrKey];
		const oldValue = selTabInfo[idx].value;
		selTabInfo[idx].value = oldValue==='check'?'uncheck':'check';
		this.setState({[selTabArrKey]:selTabInfo});
		this.moduleData[chartKey][selTabArrKey] = selTabInfo;
	}

	closeImageModal = () => {
		this.setState({modalImg:false});
	}

	render() {
		const {selItem, selTab, modalImg} = this.state;
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={selItem.label}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...DetailCss.topPart}}>
					<Image source={selItem.imgBlack || imgCheck} style={{...MainCss.icon, ...DetailCss.topImg}}></Image>
					<Text style={{...MainCss.label}}>{selItem.label}</Text>
				</View>
				<View style={{...DetailCss.tabWrapper}}>
					{tabArr.map((item, idx)=>
						<View
							onTouchStart={e=>onTouchS(e, this) }
							onTouchEnd={e => onTouchE(e, this, 'chartTab', item.key) }
							style={{...MainCss.flex, ...DetailCss.tabItem, opacity:item.key===selTab?1:0.5}} key={idx}>
							<Text style={{...MainCss.title, color:white}}>{item.label}</Text>
						</View>
					)}
				</View>
				<View style={{flex:1, flexGrow:1, marginTop:5}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						{this.state[selTab].map((item, idx)=>
							<View style={{...DetailCss.checkRow}} key={idx}>
								<View style={{...MainCss.flex, ...DetailCss.checkBox, borderColor:GetCheckBorderCol(item.value)}}>{/* onPress={e=>this.onClickCheckBox(idx)} */}
									{item.value==='check' && <Image source={imgCheck} style={{...DetailCss.checkImg}}></Image>}
								</View>

								<View style={{flex:1, display:'flex', flexDirection:'column'}}>
									<Text style={{...MainCss.label, ...DetailCss.checkLabel}}>{idx+1} . {item.label}</Text>
									
									{item.time && // item.value==='check' && 
										<View style={{width: 210, marginVertical:5, marginLeft:25, borderRadius:4, borderWidth:1, borderColor:'#DDDDDD', paddingHorizontal:10, paddingVertical:5}}>
											{item.date !== undefined &&
												<Text style={{...MainCss.label}}>
													Termin: {item.date}
												</Text>
											}
											{item.date === undefined &&
												<Text style={{...MainCss.label}}>
													Termin kommt
												</Text>
											}
										</View>
									}
								</View>

								<View style={{display:'flex', flexDirection:'row', alignItems:'center', width:30, height:30, marginLeft:5}}>
									{item.img !== undefined &&
										<TouchableOpacity onPress={e=>{this.setState({modalImg:item.img}); console.log(item.img)}} style={{width:30, height:30}}>
											<Image source={{uri : apiUrl+'other/check_images/'+item.img+'.jpg'}} style={{width:'100%', height:'100%', resizeMode:'contain'}}></Image>
										</TouchableOpacity>
									}
								</View>
							</View>
						)}
					</ScrollView>
				</View>
				{modalImg &&
					<View style={{...ModalCss.back}}>
						<View style={{...ModalCss.wrapper, height:560}}>
							<Image source={{uri : apiUrl+'other/check_images/'+modalImg+'.jpg'}} style={{...ModalCss.image}}></Image>
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
