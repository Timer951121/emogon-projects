
import React from 'react';
import axios from 'axios';
import { Image, Text, View, StyleSheet} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import { MainCss } from '../../assets/css';

import imgDoc from '../../assets/images/doc.png';
import imgTicket from '../../assets/images/ticket.png';
import imgQuestion from '../../assets/images/question-black.png';

import imgSupport from '../../assets/images/support.png';
import imgSupportWhite from '../../assets/images/support-white.png';

import ListWrapper from '../layout/ListWrapper';
import RoundIconBtn from '../layout/RoundIconBtn';

import { apiUrl } from '../../data/config';

const listSupportArr = [
	{key:'ticketList', label:'Meine Support-Tickets', img:imgTicket},
	{key:'warranty', label:'Garantieübersicht', img:imgDoc},
]

const SubPartCss = StyleSheet.create({
	supportTop: { height:200, marginTop:50},
	supportTopImg: { width:60, height:60, opacity:0.6, marginBottom:40, resizeMode:'contain'},
});

export default class SupportMainComponent extends React.Component {
	constructor(props) {
		super(props);
		const {selSystem, unRead} = props;
		this.state = {selSystem, unRead};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['selSystem', 'unRead'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickSubItem = (itemKey) => {
		if (itemKey==='ticketList') {
			this.props.navigation.navigate('TicketList');
		}
	}

	onClickCreateTicket = () => {
		this.props.navigation.navigate('TicketCreate');
	}

	render() {
		const {unRead} = this.state;
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Support'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...SubPartCss.supportTop, ...MainCss.flexColumn}}>
					<Image source={imgSupport} style={{...SubPartCss.supportTopImg}}></Image>
					<ListWrapper
						listArr={[ {key:'question', label:'Häufig gestellte Fragen', img:imgQuestion}, ]}
						onClickListItem={listKey=> {console.log(listKey)}}
					></ListWrapper>
				</View>
				<RoundIconBtn
					img={imgSupportWhite}
					label='Support anfragen'
					onClick={e=>this.onClickCreateTicket()}
				></RoundIconBtn>
				<View style={{...MainCss.flexColumn, flex:1}}>
					<ListWrapper
						listArr={listSupportArr}
						unRead={unRead}
						onClickListItem={listKey=> this.onClickSubItem(listKey)}
					></ListWrapper>
					<View style={{flex:1}}></View>
				</View>
				<View style={{...MainCss.flexColumn, flex:1, marginBottom:30}}>
					{/* <Text style={{...MainCss.label}}>Du erreichst uns auch per Mail an:</Text>
					<Text style={{...MainCss.label}}>support@enerq.ch</Text> */}
				</View>
			</View>
		);
	}
}
