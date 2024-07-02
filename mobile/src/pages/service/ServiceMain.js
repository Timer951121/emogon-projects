
import React from 'react';
import { Image, Text, View, StyleSheet} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import { MainCss } from '../../assets/css';

import imgBill from '../../assets/images/bill.png';
import imgClock from '../../assets/images/clock.png';

import imgServiceWhite from '../../assets/images/service-white.png';

import ListWrapper from '../layout/ListWrapper';
import RoundIconBtn from '../layout/RoundIconBtn';

export const listServicetArr = [
	{key:'course', label:'Verlauf', title : 'Serviceverlauf', img:imgClock},
	{key:'bill', label:'Stand Rechnungen', title:'Stand Rechnungen', img:imgBill},
]

export default class ServiceMainComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state={};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	onClickSubItem = (itemKey) => {
		this.props.setServiceKey(itemKey);
		this.props.navigation.navigate('ServiceDetail');
	}

	onClickCreateService = () => {
		this.props.navigation.navigate('ServiceCreate');
	}

	render() {
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={'Service'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<RoundIconBtn
					img={imgServiceWhite}
					label='Service beantragen'
					onClick={e=>this.onClickCreateService()}
				></RoundIconBtn>
				<View style={{...MainCss.flexColumn, flex:1}}>
					<ListWrapper
						listArr={listServicetArr} // []
						onClickListItem={listKey=> this.onClickSubItem(listKey)}
					></ListWrapper>
					<View style={{flex:1}}></View>
				</View>
			</View>
		);
	}
}
