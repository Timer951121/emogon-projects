import React from 'react';
import axios from 'axios';
import { Image, Text, View, ScrollView, StyleSheet} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import { apiUrl } from '../../data/config';
import { onTouchS, onTouchE, GetStatusLabel } from '../../data/common';

import { MainCss, wholeWidth, red, wholeHeight, black, white } from '../../assets/css';

import imgClock from '../../assets/images/clock.png';
import imgLock from '../../assets/images/lock-black.png';
import imgSupportWhite from '../../assets/images/support-white.png';

const ListCss = StyleSheet.create({
	redBar: {...MainCss.flex, width:wholeWidth, height:60, backgroundColor:red},
	listItem:{paddingVertical:10, paddingHorizontal:0, borderBottomColor:'#C5C5C5', borderBottomWidth:2, display:'flex', flexDirection:'row'},
	listIcon:{width:70, display:'flex', flexDirection:'row', justifyContent:'center', position:'relative'},
	listIconImg:{width:35, height:35, resizeMode:'contain', marginTop:5},
	listTextWrapper:{flex:1},
	listTextRow:{display:'flex', flexDirection:'row', marginVertical:3},
	listTextLabel:{},
	listTextValue:{fontWeight:500}
})


export default class TicketListComponent extends React.Component {
	constructor(props) {
		super(props);
		const {ticketArr, mainInfo, selSystem} = props;
		this.state = {ticketArr, mainInfo, selSystem};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['ticketArr', 'mainInfo', 'selSystem'].forEach(key => {// 'pageKey', 
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickModule = (detailKey) => {
		this.props.setDetailKey(detailKey);
		this.props.navigation.navigate('Detail');
	}

	getTicketArr = () => {
		const {mainInfo, selSystem, ticketArr} = this.state;
		if (!mainInfo || !selSystem) return [];
		return ticketArr.filter(item=> {return item.customerId===mainInfo.id && item.systemId===selSystem.id});
	}

	render() {
		return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Support'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...ListCss.redBar}}>
					<Image style={{...MainCss.buttonIcon}} source={imgSupportWhite}></Image>
					<Text style={{...MainCss.buttonIconLabel}}>Meine Support-Tickets:</Text>
				</View>
				<View style={{flex:1, flexGrow: 1, marginBottom:20}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						{this.getTicketArr().map((ticket, idx)=>
							<View style={{...ListCss.listItem}} key={idx}>
								<View style={{...ListCss.listIcon}}>
									<View style={{width:35, height:35}}>
										<Image source={ticket.status==='close'?imgLock:imgClock} style={{...ListCss.listIconImg}}></Image>
										{ticket.unRead>0 &&
											<View style={{...MainCss.flex, position:'absolute', bottom:-6, right:-6, width:20, height:20, backgroundColor:red, borderRadius:10}}>
												<Text style={{color:white, marginTop:-1.5}}>{ticket.unRead}</Text>
											</View>
										}
									</View>
								</View>
								<View style={{...ListCss.listTextWrapper}}
									onTouchStart={e=>onTouchS(e, this)}
									onTouchEnd={e=>onTouchE(e, this, 'openTicket', ticket.id)}
								>
									<View style={{...ListCss.listTextRow}}>
										<Text style={{...MainCss.title, color:black}}>{ticket.title}</Text>
									</View>
									<View style={{...ListCss.listTextRow}}>
										<Text style={{...MainCss.label}}>Kategorie: </Text>
										<Text style={{...MainCss.label, ...ListCss.listTextValue}}>{ticket.category}</Text>
									</View>
									<View style={{...ListCss.listTextRow}}>
										<Text style={{...MainCss.label}}>Letzte Antwort: </Text>
										<Text style={{...MainCss.label, ...ListCss.listTextValue}}>{ticket.lastTimeStr}</Text>
									</View>
									<View style={{...ListCss.listTextRow}}>
										<Text style={{...MainCss.label}}>Status: </Text>
										<Text style={{...MainCss.label, ...ListCss.listTextValue}}>{GetStatusLabel(ticket.status)}</Text>
									</View>
								</View>
							</View>
						)}
					</ScrollView>
				</View>
			</View>
		);
	}
}
