
import React from 'react';
import { Image, Text, View, ScrollView, StyleSheet} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import ModuleComponent from '../layout/Module';
import { MainCss, wholeWidth, red, black, white } from '../../assets/css';
import imgChartWhite from '../../assets/images/chart-white.png';

const subVoltaicArr = [
	{label:'Winkel', value:'70%'},
	{label:'Wirkung', value:'68%'},
	{label:'Output', value:'3 kW'},
]
const subPumpArr = [
	{label:'Innen', value:'21°C'},
	{label:'Außen', value:'12°C'},
	{label:'Verbrauch', value:'0.2 kW/h'},
]
const infoArr = [
	{title:'Photovoltaik:', subArr:subVoltaicArr},
	{title:'Wärmepumpe', subArr:subPumpArr},
	{title:'Ladestation', subArr:subPumpArr},
]

const PartCss = StyleSheet.create({
	content: { flex: 1},
	redBar: { marginTop: 20, marginBottom:10, height: 50, width: wholeWidth, backgroundColor: red},
	redBarImg : {width:22, height:22},
	redBarLabel: {color:white, marginLeft:20},
	chartInfoMainItem:{marginHorizontal:20, marginVertical:20},
	chartInfoTitle:{marginLeft:30, color:black},
	chartInfoDetailRow:{marginTop:10},
	chartInfoDetailItem:{flex:1},
	chartInfoDetailValue:{fontSize:20, color:red, fontWeight: 900, marginBottom: 5},
	chartInfoBottom:{color: red, marginBottom: 20, fontWeight: 700, textAlign: 'center'},
	tempLabel:{...MainCss.label, fontWeight:500, fontSize:20}
});

export default class ChartFirstComponent extends React.Component {
	constructor(props) {
		super(props);
		const {roleInfo} = props;
		this.state = {roleInfo};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['roleInfo'].forEach(key => { // 'pageKey', 'pageDepth', 
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
				});
			}
		});
	}

	onClickModule = (itemKey) => {
		this.props.setChartKey(itemKey);
		this.props.navigation.navigate('ChartMain');
	}

	render() {
		const {roleInfo} = this.state;
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Anlagen'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{flex:1}}>
					<ModuleComponent
						moduleLabel='Wähle deine Anlage:'
						roleInfo={roleInfo}
						onClickModule={itemKey=>this.onClickModule(itemKey)}
					></ModuleComponent>
					<View style={{flex:1}}>
						<View style={{...MainCss.flex, ...PartCss.redBar}}>
							<Image source={imgChartWhite} style={{...PartCss.redBarImg}}></Image>
							<Text style={{...MainCss.title, ...PartCss.redBarLabel}}>{'Anlagen'}</Text>
						</View>

						<View style={{flex:1, flexGrow:1, position:'relative'}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
							<ScrollView>
								{infoArr.map((mainItem, mainIdx)=>
									<View key={mainIdx} style={{...PartCss.chartInfoMainItem}}>
										<Text style={{...MainCss.title, ...PartCss.chartInfoTitle}}>{mainItem.title}</Text>
										<View style={{...MainCss.flex, ...PartCss.chartInfoDetailRow}}>
											{mainItem.subArr.map((subItem, subIdx)=>
												<View style={{...MainCss.flexColumn, ...PartCss.chartInfoDetailItem}} key={subIdx}>
													<Text style={{...PartCss.chartInfoDetailValue}}>{subItem.value}</Text>
													<Text style={{...MainCss.label}}>{subItem.label}</Text>
												</View>
											)}
										</View>
									</View>
								)}
								<Text style={{...MainCss.title, ...PartCss.chartInfoBottom}}>Bereit zum Laden</Text>
							</ScrollView>
							<View style={{width:'100%', height:'100%', position:'absolute', backgroundColor:'#FFFFFFEE', ...MainCss.flexColumn}}>
								<Text style={{...PartCss.tempLabel, color:red}}>Hier finden Sie bald</Text>
								<Text style={{...PartCss.tempLabel, color:red}}>Live-Daten Ihrer</Text>
								<Text style={{...PartCss.tempLabel, color:red}}>ENERQ Anlagen.</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	}
}
