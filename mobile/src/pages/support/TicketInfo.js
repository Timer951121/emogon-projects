import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

import TopMenuComponent from '../layout/TopMenu';

import { MainCss, black, grey, red, wholeWidth } from '../../assets/css';
import imgSupport from '../../assets/images/support.png';
import imgInfoRed from '../../assets/images/info-red.png';
import imgAttachRed from '../../assets/images/attach-red.png';
import { GetTimeStr } from '../../data/common';

const InfoCss = StyleSheet.create({
	textRow:{display:'flex', flexDirection:'row', marginVertical:5},
	textLabel:{...MainCss.label, color:grey}
})

function GetTicketInfo(ticketArr, selTicketId) {
	if (ticketArr && ticketArr.length && selTicketId) {
		return ticketArr.find(item=>parseInt(item.id)===parseInt(selTicketId));
	} else return {};
}

export default class TicketInfoComponent extends React.Component {
	constructor(props) {
		super(props);
		const {mainInfo, ticketArr, selTicketId, selSystem} = props;
		this.ticketInfo = GetTicketInfo(ticketArr, selTicketId);
		this.state = {mainInfo, ticketArr, selTicketId, selSystem};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['mainInfo', 'ticketArr', 'selTicketId', 'selSystem'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='selTicketId') {
					this.ticketInfo = GetTicketInfo(this.state.ticketArr, nextProps.selTicketId);
				}
				this.setState({[key]:nextProps[key]})
			}
		});
	}

	render() {
		const {selSystem} = this.state, {number, category, lastTime} = this.ticketInfo;
		return (
			<SafeAreaView style={{...MainCss.backBoard, ...MainCss.flexColumn, height:'100%'}}>
				<TopMenuComponent
					label={'Chat-Support'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{borderTopColor:grey, borderTopWidth:2, width:wholeWidth, marginBottom:20}}></View>
				<Image source={imgInfoRed} style={{...MainCss.buttonIcon}}></Image>
				<Text style={{...MainCss.title, color:black, marginVertical:20}}>Ticket Details:</Text>
				
				<View style={{flex:1, display:'flex', flexDirection:'row', width:300}}>
					<Image source={imgSupport} style={{...MainCss.buttonIcon, marginRight:15}}></Image>
					<View style={{display:'flex', flexDirection:'column'}}>
						<View style={{...InfoCss.textRow}}>
							<Text style={{...InfoCss.textLabel}}>Ticket-Nummer: </Text>
							<Text style={{...InfoCss.textLabel}}> {number}</Text>
						</View>
						<View style={{...InfoCss.textRow}}>
							<Text style={{...InfoCss.textLabel}}>Anlage: </Text>
							<Text style={{...InfoCss.textLabel}}> {selSystem?selSystem.canton:''}</Text>
						</View>
						<View style={{...InfoCss.textRow}}>
							<Text style={{...InfoCss.textLabel}}>Projektnr.: </Text>
							<Text style={{...InfoCss.textLabel}}> {selSystem?selSystem.number:''}</Text>
						</View>
						<View style={{...InfoCss.textRow}}>
							<Text style={{...InfoCss.textLabel}}>Kategorie: </Text>
							<Text style={{...InfoCss.textLabel}}> {category}</Text>
						</View>
						<View style={{...InfoCss.textRow, flexDirection:'column'}}>
							<Text style={{...InfoCss.textLabel}}>Letzte Antwort: </Text>
							<Text style={{...InfoCss.textLabel}}>    {GetTimeStr(lastTime, 'news')}</Text>
							{/* <Text style={{...InfoCss.textLabel}}>    von Peter M.</Text> */}
						</View>
						<View style={{...InfoCss.textRow}}>
							<Text style={{...InfoCss.textLabel}}>Bearbeiter: </Text>
							<Text style={{...InfoCss.textLabel}}> Peter M.</Text>
						</View>
					</View>
				</View>

				{/* <View style={{...MainCss.flexColumn, marginHorizontal:40, borderTopColor:grey, borderTopWidth:2, marginBottom:30}}>
					<Image source={imgAttachRed} style={{...MainCss.buttonIcon, marginTop:20}}></Image>
					<Text style={{...MainCss.title, color:black, marginVertical:10}}>Anhänge:</Text>
					<View style={{display:'flex', flexDirection:'column'}}>
						<Text style={{...MainCss.label, color:red, marginVertical:10}}>enerqrabattcoupon10.pdf</Text>
						<Text style={{...MainCss.label, color:red, marginVertical:10}}>beispielanhang.jpg</Text>
					</View>
				</View> */}
			</SafeAreaView>
		);
	}
}
