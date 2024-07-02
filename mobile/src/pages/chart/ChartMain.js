
import React from 'react';
import { Image, Text, View} from 'react-native';

import TopMenuComponent from '../layout/TopMenu';
import ListWrapper from '../layout/ListWrapper';
import { mainListArr, moduleArr } from '../../data/constant';
import { GetSelItem, onTouchE, onTouchS } from '../../data/common';
import { MainCss } from '../../assets/css';

import imgChartWhite from '../../assets/images/chart-white.png';
import imgCheckBox from '../../assets/images/check-box.png';
import imgBill from '../../assets/images/bill.png';
import imgDoc from '../../assets/images/doc.png';
import imgInfo from '../../assets/images/info.png';
import imgService from '../../assets/images/service.png';

const listChartArr = [
	{key:'status', label:'Projektstatus', img:imgCheckBox},
	// {key:'bill', label:'Stand Rechnungen', img:imgBill},
	// {key:'certify', label:'Garantiescheine', img:imgInfo},
	// {key:'document', label:'Anlagedokumentation', img:imgDoc},
	// {key:'service', label:'Service', img:imgService},
]

const selPart = mainListArr[0];

export default class ChartMainComponent extends React.Component {
	constructor(props) {
		super(props);
		const {chartKey} = props;
		this.state = {selModule:GetSelItem(moduleArr, chartKey)};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	onClickSubItem = (itemKey) => {
		if (itemKey==='status') {
			this.props.navigation.navigate('ChartDetail');
		}
	}

	onClickMainBtn = (btnKey) => {
		console.log(btnKey);
	}

	render() {
		const {selModule} = this.state;
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label={selModule.label}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View
					onTouchStart={e=>onTouchS(e, this)}
					onTouchEnd={e=>onTouchE(e, this, 'chartMain')}
					style={{...MainCss.button, ...MainCss.buttonExpand}}
				>
					<Image source={imgChartWhite} style={{...MainCss.buttonIcon}}></Image>
					<Text style={{...MainCss.buttonLabel, fontSize:20}}>{'Anlagen'}</Text>
				</View>
				<View style={{...MainCss.flexColumn, flex:1}}>
					<ListWrapper
						listArr={listChartArr}
						onClickListItem={listKey=> this.onClickSubItem(listKey)}
					></ListWrapper>
					<View style={{flex:1}}></View>
				</View>
			</View>
		);
	}
}
