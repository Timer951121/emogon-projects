import React from 'react';
import { Image, Text, View, ScrollView, StyleSheet, Animated} from 'react-native';

import TopMenuComponent from './layout/TopMenu';
import ModuleComponent from './layout/Module';
import ListWrapper from './layout/ListWrapper';
import { mainListArr} from '../data/constant';

import { MainCss, red, white, wholeHeight, wholeWidth } from '../assets/css';

import imgWeather from '../assets/images/weather.png';
import imgNews from '../assets/images/news.png';
// import imgTime from '../assets/images/clock.png';
import imgCheckBoxGreen from '../assets/images/check-box-green.png';
import { onTouchE, onTouchS } from '../data/common';

export const TotalCss = StyleSheet.create({
	techPart: { height: 60, borderTopWidth: 2, borderTopColor: '#C5C5C5', borderBottomWidth: 2, marginTop:10, borderBottomColor: '#C5C5C5'},
	techPartImg : {height:35, width:35, marginLeft:30},
	techCheckImg : {height:31, width:31, resizeMode:'contain'},
	techPartLabels: {flex:1},
	footer:{width:wholeWidth, height: 70, borderTopWidth: 1, borderTopColor: '#C5C5C5'},
	footerItem:{flex: 1, height: '100%'},
	footerImg:{height: 35, width:35, resizeMode:'contain', marginBottom: 0}
});

export const footerArr = [
	{img:imgWeather, label:'Wetter', pageName:'Weather'},
	{img:imgNews, label:'Neuigkeiten', pageName:'News'},
]

export default class TotalComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, selSystem, unRead} = props;
		const lastUpdateStr = selSystem.lastUpdate || 'Not updated yet';
		this.labelWidth = lastUpdateStr.length*7.5;
		this.labelLeft = new Animated.Value(0);
		this.state = {pageKey, sideKey:'', partKey:'', selSystem, unRead, lastUpdateStr};
	}

	componentDidMount() {
		if (this.labelWidth > wholeWidth - 80) this.animateLabel();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['mainInfo', 'selSystem', 'unRead'].forEach(key => {// 'pageKey', 
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='selSystem') {
					const lastUpdateStr = nextProps.selSystem.lastUpdate || 'Not updated yet';
					this.setState({lastUpdateStr});
				}
			}
		});
	}

	animateLabel = () => {
		const leftEnd = (wholeWidth - 105) - this.labelWidth;
		setTimeout(() => { Animated.timing(this.labelLeft, { toValue: leftEnd, duration: 3000, useNativeDriver: false }).start(); }, 2000);
		setTimeout(() => { Animated.timing(this.labelLeft, { toValue: 0, 		duration: 500, useNativeDriver: false }).start(); }, 7000);
		setTimeout(() => { this.animateLabel(); }, 8000);
	}

	onClickPartItem = (partKey) => {
		// this.props.setPartKey(partKey);
		var pageName;
		if 		(partKey==='chart') { pageName = 'ChartFirst'; }
		else if (partKey==='time') { pageName = 'Timeline'; }
		else if (partKey==='support') { pageName = 'SupportMain'; }
		else if (partKey==='service') { pageName = 'ServiceMain'; }
		else if (partKey==='bill') { pageName = 'InvoiceMain'; }
		else if (partKey==='technical') { pageName = 'TechnicalMain'; }
		if (pageName) this.props.navigation.navigate(pageName);
	}

	onClickModule = (chartKey) => {
		// this.props.setPartKey('chart');
		this.props.setChartKey(chartKey);
		this.props.navigation.navigate('ChartDetail');
	}

	onClickFooter = (footerKey) => {
		this.props.navigation.navigate(footerKey);
	}

	render() {
		const {selSystem} = this.props, {unRead, lastUpdateStr} = this.state;
		return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Anlage '+selSystem.name}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
					<ModuleComponent
						moduleLabel='Dein Status.'
						roleInfo={selSystem.roleInfo}
						onClickModule={itemKey=>this.onClickModule(itemKey)}
					></ModuleComponent>
					<Text style={{...MainCss.label, textAlign:'left', marginLeft:30}}>Dein nächster Schritt:</Text>
					<View style={{...MainCss.flex, ...TotalCss.techPart}}>
						{/* <Image source={imgTime} style={{...TotalCss.techPartImg}}></Image> */}
						<View style={{...MainCss.flex, height:'100%', backgroundColor:white, width:75}}>
							<Image source={imgCheckBoxGreen} style={{...TotalCss.techCheckImg}}></Image>
						</View>
						
						<View style={{...TotalCss.techPartLabels, flexGrow: 1, flexDirection: 'row', zIndex:-1}}>
							<Animated.View style={[{marginLeft:this.labelLeft, width:this.labelWidth}]}>
								<Text style={{...MainCss.label}}>{lastUpdateStr}</Text>
							</Animated.View>
						</View>
					</View>

				<View style={{flex:1, flexGrow: 1}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						<ListWrapper
							listArr={mainListArr}
							unRead={unRead}
							onClickListItem={itemKey=>this.onClickPartItem(itemKey)}
						></ListWrapper>
					</ScrollView>
				</View>
				<FooterComponent onClickFooter={footerKey=>this.props.navigation.navigate(footerKey)}></FooterComponent>
			</View>
		);
	}
}

export class FooterComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() { }

	UNSAFE_componentWillReceiveProps(nextProps) { }

	render() {
		return (
			<View style={{...MainCss.flex, ...TotalCss.footer}}>
				{footerArr.map((item, idx)=>
					<View
						onTouchStart={e=>onTouchS(e, this) }
						onTouchEnd={e =>onTouchE(e, this, 'totalBottom', item.pageName)}
						style={{...MainCss.flexColumn, ...TotalCss.footerItem, borderRightWidth:idx===0?1:0, borderRightColor:'#C5C5C5', display:(this.props.type==='companyWorker'&&item.pageName==='Weather')?'none':'flex'}} key={idx}
					>
						<Image source={item.img} style={{...TotalCss.footerImg, marginTop:20}}></Image>
						<Text style={{...MainCss.label, marginBottom:10}}>{item.label}</Text>
					</View>
				)}
			</View>
		);
	}
}