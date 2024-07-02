import React from 'react';
import { Image, Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking} from 'react-native';

import { serverUrl } from '../../data/config';
import TopMenuComponent from '../layout/TopMenu';
import { MainCss, wholeHeight, wholeWidth, red, white, grey, black, green } from '../../assets/css';

import imgDoc from '../../assets/images/doc.png';
import imgCheck from '../../assets/images/check.png';
import { GetTimeStr } from '../../data/common';
import { InvoiceMainCss } from '../invoice/InvoiceMain';

// 205, 126, 57
const tdPaddingLeft = 10;
const wName = 215, wTime = 136, wPaid = 37, wTotal = wholeWidth / (wName + wTime + wPaid);
const pName = wName * wTotal - tdPaddingLeft,
	pTime = wTime * wTotal - tdPaddingLeft,
	pPaid = wPaid * wTotal;

export default class TechnicalMainComponent extends React.Component {
	constructor(props) {
		super(props);
		const {technicalArr} = props;
		this.state = {technicalArr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['technicalArr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	render() {
		const {technicalArr} = this.state;
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label='Rechnungen der Anlage'
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flex, width:wholeWidth, marginTop:45, marginBottom:50}}>
					<Image source={imgDoc} style={{width:55, height:70, resizeMode:'contain', opacity:0.5}}></Image>
				</View>

				<View style={{flex:1, flexGrow: 1}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						<View style={{...MainCss.flex, width:wholeWidth, height:50, borderTopColor:grey, borderBottomColor:grey, borderTopWidth:1, borderBottomWidth:1 }}>
							<View style={{width:pName, ...InvoiceMainCss.borderRight}}><Text style={{...MainCss.label}}>Technische Daten</Text></View>
							<View style={{width:pTime, ...InvoiceMainCss.borderRight}}><Text style={{...MainCss.label}}>Datum</Text></View>
							<View style={{...MainCss.flex, flex:1, marginLeft:3}}><Text style={{...MainCss.label}}>Status</Text></View>
						</View>
						{technicalArr.map((item, idx)=>
							<View style={{...MainCss.flex, width:wholeWidth, height:50, borderBottomColor:grey, borderBottomWidth:idx===technicalArr.length-1?1:0 }} key={idx}>
								<View style={{width:pName, ...InvoiceMainCss.borderRight}}>
									<TouchableOpacity onPress={e=>this.props.setSelTechnical(item.realName)}>{/*  openInvoicePDF*/}
										<Text style={{...MainCss.label, color:red, textDecorationLine:'underline'}}>{item.name+'.pdf'}</Text>
									</TouchableOpacity>
								</View>
								<View style={{width:pTime, ...InvoiceMainCss.borderRight}}>
									<Text style={{...MainCss.label}}>{GetTimeStr(item.time, 'invoice')}</Text>
								</View>
								<View style={{...MainCss.flex, flex:1, marginLeft:3}}>
									{/* <View style={{...MainCss.flex, width:27, height:27, borderRadius:4, borderWidth:item.paid==='1'?2:1, borderColor:item.paid==='1'?green:grey}}>
										{item.paid==='1' && <Image style={{width:20, height:20, resizeMode:'contain'}} source={imgCheck}></Image>}
									</View> */}
								</View>
							</View>
						)}
						{technicalArr.length===0 &&
							<View style={{...MainCss.flex, marginTop:30}}><Text style={{...MainCss.label}}>Leere Daten</Text></View>
						}
					</ScrollView>
				</View>
				{/* <View style={{...MainCss.flex, width:wholeWidth, paddingVertical:7, borderTopColor:grey, borderTopWidth:1}}>
					<Text style={{...MainCss.label, textAlign:'center', fontSize:15}}>Rechnungen mit grünem Haken wurden beglichen.</Text>
				</View> */}
			</View>
		);
	}
}
