import React from 'react';
import { Image, Text, View, StyleSheet, ScrollView} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import { MainCss, wholeHeight, wholeWidth, red, white, grey, black } from '../../assets/css';

import imgClockWhite from '../../assets/images/clock-white.png';
import imgVoltaicBlack from '../../assets/images/voltaic-black.png';
import imgHome from '../../assets/images/home.png';
import imgChevron from '../../assets/images/chevron-white.png';

import { GetTimeLabel, SetAnimate, onTouchE, onTouchS } from '../../data/common';
import { FooterComponent } from '../Total';
import { ListsCss } from '../layout/ListWrapper';
import { moduleArr } from '../../data/constant';

export const ComMainCss = StyleSheet.create({
	redBar:{width:wholeWidth, height:55, backgroundColor:red},
	label:{color:black, fontSize:18, fontFamily:'SF Pro Rounded', lineHeight:22}
});

export default class ComMainComponent extends React.Component {
	constructor(props) {
		super(props);
		const {comCustomerArr, mainInfo} = props;
		this.state = {comCustomerArr, mainInfo};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['comCustomerArr', 'mainInfo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickComCustomer = (key) => {
		const selCustomer = this.state.comCustomerArr.find(item=>{return item.key===key});
		if (!selCustomer || selCustomer.disable) {return;}
		this.props.setSelCustomer(selCustomer);
		setTimeout(() => { this.props.navigation.navigate('ComPart') }, 0);
	}

	render() {
		const {comCustomerArr, mainInfo} = this.state, firstItem = comCustomerArr[0], firstModule = firstItem?moduleArr.find(item=>{return item.key===firstItem.mainKey}) : {};
		const name = mainInfo?mainInfo.first+' '+mainInfo.last:'';
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Hallo '+name}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>{
						this.props.setLogout();
						this.props.navigation.goBack();
					}}
				></TopMenuComponent>
				<View style={{...MainCss.flex, ...ComMainCss.redBar}}>
					<Image source={imgClockWhite} style={{marginLeft:10, width:35, height:35, resizeMode:'contain'}}></Image>
					<Text style={{...ComMainCss.label, flex:1, textAlign:'center', color:white}}>Dein nächster Termin:</Text>
				</View>
				<View style={{padding:15, borderBottomColor:'#C5C5C5', borderBottomWidth:2, width:wholeWidth}}>
					{firstItem &&
						<View>
							<Text style={{...MainCss.title, color:black}}>{GetTimeLabel(firstItem.dateStr, firstItem.timeStr)}</Text>
							{/* {firstItem.dateStr} / {firstItem.timeStr} */}
							<View style={{...MainCss.flex, marginVertical:20}}>
								<Image source={firstModule.imgBlack} style={{width:40, height:40, resizeMode:'contain', marginRight:15}}></Image>
								<View style={{flex:1}}>
									<Text style={{...ComMainCss.label}}>{firstModule.label}</Text>
									<Text style={{...ComMainCss.label, fontWeight:700}}>{firstItem.fieldLabel}</Text>
								</View>
							</View>
							<Text style={{...ComMainCss.label}}>Kunde: {firstItem.name}</Text>
							<Text style={{...ComMainCss.label}}>Anlage: {firstItem.location}</Text>
						</View>
					}
				</View>

				<View style={{flex:1, flexGrow: 1}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						<Text style={{...ComMainCss.label, marginTop:15, marginLeft:30, marginBottom:10}}>Deine zugeteilten Kunden:</Text>
						<View style={{...MainCss.flexColumn}}>
							{comCustomerArr.map((item, idx)=>
								<View style={{...ListsCss.listItem, opacity:item.disable?0.3:1}} key={idx}>
									<View style={{...ListsCss.icon}}>
										<Image source={imgHome} style={{...ListsCss.iconImg}}></Image>
									</View>
									<View style={{...ListsCss.label}}>
										<Text style={{...ComMainCss.label }}>{item.name}</Text>
										<Text style={{...ComMainCss.label }}>{item.location}</Text>
									</View>
									<View onTouchStart={e=>onTouchS(e, this) }
										onTouchEnd={e =>onTouchE(e, this, 'comCustomer', item.key) }
										style={{...MainCss.flex, width:43, height:43, borderRadius:8, backgroundColor:red}}>
										<Image source={imgChevron} style={{...ListsCss.chevronImg}}></Image>
									</View>
								</View>
							)}
							{comCustomerArr.length===0 &&
								<Text style={{...ComMainCss.label}}>There is not any related data</Text>
							}
						</View>
					</ScrollView>
				</View>
				<FooterComponent type={'companyWorker'} onClickFooter={footerKey=>this.props.navigation.navigate(footerKey)}></FooterComponent>
			</View>
		);
	}
}
