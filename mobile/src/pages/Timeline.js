import React from 'react';
import { Image, Text, View, ScrollView, Animated} from 'react-native';
import { SvgXml, SvgUri } from 'react-native-svg';

import TopMenuComponent from './layout/TopMenu';
import { apiUrl } from '../data/config';

import { MainCss, wholeWidth, red, black } from '../assets/css';
import imgTimeline from '../assets/images/timeline-page.jpg';
import imgBlueArrow from '../assets/images/blue-arrow.png';
// import { timelineSvgXmlStr } from '../data/timelinexml';

// const statusPos = [60, 128, 186, 242, 300, 356, 414, 470, 528, 583, 641, 698, 763];
const statusPos = [74, 140, 198, 254, 312, 368, 426, 482, 540, 595, 653, 710, 775];

export default class TimelineComponent extends React.Component {
	constructor(props) {
		super(props);
		const {mainInfo, selSystem} = props;
		this.circleScale = new Animated.Value(1);
		this.state = {mainInfo, selSystem};
	}

	componentDidMount() {
		var scale = 1.5;
		setInterval(() => {
			if (scale===1.5) scale = 1;
			else scale = 1.5;
			Animated.timing(this.circleScale, { toValue: scale, duration: 700, useNativeDriver: false }).start();
		}, 700);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['mainInfo', 'selSystem'].forEach(key => {// 'pageKey', 
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickModule = (detailKey) => {
		this.props.setDetailKey(detailKey);
		this.props.navigation.navigate('Detail');
	}

	render() {
		const {mainInfo, selSystem} = this.state, status = selSystem?selSystem.status:0;
		const svgH = wholeWidth*86/60;
		return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Timeline'}
					hideProfile={!(mainInfo&&mainInfo.first)}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				
				<View style={{flex:1, marginBottom:20}}>
					<View style={{margin:20, display:'flex', flexDirection:'row'}}>
						<View style={{width:24, height:24, borderRadius:12, backgroundColor:red, marginRight:20}} source={imgBlueArrow} ></View>
						<Text style={{color:black}}>Aktueller Auftragsstand</Text>
					</View>
					<View style={{width:'100%', height:svgH, position:'relative'}}>
						<Image style={{width:'100%', height:'100%', resizeMode:'contain'}} source={imgTimeline} ></Image>
						<Animated.View style={{width:24, height:24, position:'absolute', transform: [{scale: this.circleScale}], top:statusPos[status] * svgH/860 - 12, left:wholeWidth*27.8/60-12}}>
							<View style={{width:24, height:24, borderRadius:12, backgroundColor:red, opacity:0.8}}></View>
						</Animated.View>
						
					</View>
					
					{/* <SvgUri
						width="100%"
						height="100%"
						uri={apiUrl+'other/images/timeline.svg'}
					/> */}
					{/* <View style={{width:'100%', height:20, backgroundColor:red}}></View> */}
				</View>
			</View>
		);
	}
}
