import React from 'react';
import { SafeAreaView, StyleSheet, Text, useColorScheme, Animated, View, } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import FirstComponent from './First';
import TotalComponent from './Total';
import PartComponent from './chart/ChartFirst';
import SubPartComponent from './chart/ChartMain';
import LoadingComponent from './Loading';
import DetailComponent from './service/ServiceDetail';
import ErrorComponent from './layout/Error';
import ProfileComponent from './Profile';
import { wholeHeight, wholeWidth } from '../assets/css';
import { GetRoleStrCustomer, SetAnimate, pageTime } from '../data/common';
import { moduleData } from '../data/constant';

import {enableScreens} from 'react-native-screens';
enableScreens();

// import { GetDevice } from '../data/model';
const test = true;
const pageStyle = StyleSheet.create({
	board: {
		display:'flex', flexDirection:'row', marginLeft:0
	},
})
const swipeConfig = {
	velocityThreshold: 0.3,
	directionalOffsetThreshold: 80
};

export default class MainComponent extends React.Component {
	constructor(props) {
		super(props);
		const cloneModule = [...moduleData];
		this.state = {pageKey:'first', marginLeft:0, moduleStr:JSON.stringify(cloneModule), pageFirst:true, pageDepth:-1, loading: false, profile:false }; // first total
	}

	componentDidMount() {
		this.marginLeft = new Animated.Value(0)
		// this.setState({loading:true, loadPro:0});
	}

	openKeyModal = () => {
		// this.setCanvasSize();
	}

	openProfile = () => {
		this.setState({profile:true});
	}

	setTotalPage = (loc) => {
		this.setFlowPage(0);
		this.setState({selLoc:loc}, () => { // pageDepth:0, pageKey:'total', pageTotal:true, 
		});
	}

	setPartPage = (partKey) => {
		this.setFlowPage(1);
		this.setState({partKey}, () => { // pageDepth:1, , pagePart:true
			// this.setState({pageKey:'part'});
		})
	}

	setSubPartPage = (subPartKey) => {
		this.setFlowPage(2);
		this.setState({subPartKey}, () => { // pageDepth:2, , pageSubPart:true
			// this.setState({pageKey:'subPart'})
		})
	}

	setDetailPage = (detailKey) => {
		this.setFlowPage(3);
		this.setState({detailKey}, () => { // pageDepth:3, , pageDetail:true
			// this.setState({pageKey:'detail'})
		})
	}

	setLogout = () => {
		this.setState({profile:false, pageFirst:true});
		setTimeout(() => {
			this.setFlowPage(-1);
			// this.setState({pageDepth:-1, pageKey:'first'}, () => {
			// });
		}, 500);
	}

	closeTotal = () => {
		this.setFlowPage(-1);
	}

	closePart = () => {
		this.setFlowPage(0);
		setTimeout(() => { this.setState({partKey:false}) }, pageTime);
		// this.setState({pageTotal:true, pageDepth:0}, () => {
		// })
	}

	closeSubPart = () => {
		this.setFlowPage(1);
		setTimeout(() => { this.setState({subPartKey:false}) }, pageTime);
		// this.setState({pageKey:'part', pageDepth:1, pagePart:true}, () => {
		// })
	}

	closeDetail = () => {
		const {partKey, subPartKey} = this.state;
		const nextPageNum = (partKey && subPartKey)?2:0;
		this.setFlowPage(nextPageNum);
		setTimeout(() => { this.setState({detailKey:false}) }, pageTime);
		// this.setState({pageKey:'subPart', pageDepth:2}, () => {
		// } )
	}

	setFlowPage = (num) => {
		// const {pageDepth, marginLeft} = this.state;
		const newLeft = (-1 - num) * wholeWidth; // pageDepth
		// this.setState({marginLeft:newLeft});
		Animated.timing(this.marginLeft, {
			toValue: newLeft,
			duration: pageTime
		}).start()
		// SetAnimate('marginLeft', marginLeft, newLeft, this);
	}

	setMainInfo = (mainInfo, token, systemInfo, moduleInfo) => {
		const roleData = GetRoleStrCustomer(parseInt(systemInfo.role));
		const cloneModule = [...moduleData];
		cloneModule.forEach(row => {
			row.forEach(item => {
				item.active = roleData[item.key];
			});
		});
		this.setState({mainInfo, token, systemInfo, detailStr:JSON.stringify(moduleInfo), moduleStr:JSON.stringify(cloneModule)})
	}

	onSwipe = (dir, state) => {
		const {detailKey, subPartKey, partKey} = this.state;
		if (dir === 'SWIPE_RIGHT') {
			if 		(detailKey) this.closeDetail();
			else if (subPartKey) this.closeSubPart();
			else if (partKey) this.closePart();
			else this.closeTotal();
		}
	}

	render() {
		const {loading, profile, pageFirst, pageTotal, pagePart, detailKey, partKey, subPartKey, error, mainInfo, selLoc, systemInfo, detailStr, moduleStr} = this.state; // marginLeft, , pageKey, pageDepth, pageSubPart, pageDetail, token
		const animatedStyle = { marginLeft: this.marginLeft }
		return (
			<GestureRecognizer
				options={{gestureEnabled: false}}
				onSwipe={(dir, state) => this.onSwipe(dir, state)}
				config={swipeConfig}
				style={{width:wholeWidth, height:wholeHeight, overflow:'hidden' }}>
				<Animated.View style={[pageStyle.board, animatedStyle]}>
					<FirstComponent
						test={test}
						// pageKey={pageKey}
						pageFirst={pageFirst}
						setLoading={loading=>this.setState({loading})}
						setTotalPage={loc=>this.setTotalPage(loc)}
						setPageFirst={pageFirst=>{this.setState({pageFirst})}} 
						setLoc={selLoc=>this.setState({selLoc})}
						setMainInfo={this.setMainInfo}
						showError={error=>this.setState({error})}
					></FirstComponent>
					<TotalComponent
						// pageKey={pageKey}
						pageTotal={pageTotal}
						mainInfo={mainInfo}
						moduleStr={moduleStr}
						systemInfo={systemInfo}
						selLoc={selLoc}
						setPageTotal={pageTotal=>{}} // this.setState({pageTotal})
						closeTotal={e=>this.closeTotal()}
						setPagePart={partKey=>this.setPartPage(partKey)}
						setPageDetail={detailKey=>this.setDetailPage(detailKey)}
						openProfile={()=>this.openProfile()}
					></TotalComponent>
					<PartComponent
						mainInfo={mainInfo}
						// pageKey={pageKey}
						pagePart={pagePart}
						// pageDepth={pageDepth}
						partKey={partKey}
						closePart={e=>this.closePart()}
						setSubPartPage={subPartKey=>this.setSubPartPage(subPartKey)}
						setPagePart={pagePart=>{}} // this.setState({pagePart})
						openProfile={()=>this.openProfile()}
					></PartComponent>
					<SubPartComponent
						mainInfo={mainInfo}
						// pageKey={pageKey}
						// pageDepth={pageDepth}
						// pageSubPart={pageSubPart}
						partKey={partKey}
						subPartKey={subPartKey}
						closeSubPart={e=>this.closeSubPart()}
						setDetailPage={detailKey=>this.setDetailPage(detailKey)}
						setPageSubPart={pageSubPart=>{}} // this.setState({pageSubPart})
						openProfile={()=>this.openProfile()}
					></SubPartComponent>
					<DetailComponent
						// pageKey={pageKey}
						// pageDepth={pageDepth}
						// pageDetail={pageDetail}
						detailKey={detailKey}
						detailStr={detailStr}
						closeDetail={e=>this.closeDetail()}
						openProfile={()=>this.openProfile()}
						setPageDetail={pageDetail=>{}} // this.setState({pageDetail})
					></DetailComponent>
				</Animated.View>
				<ProfileComponent
					profile={profile}
					mainInfo={mainInfo}
					closeProfile={e=>this.setState({profile:false})}
					setLogout={e=>this.setLogout()}
				></ProfileComponent>
				<ErrorComponent
					error={error}
					resetError={e=>this.setState({error:false})}
				></ErrorComponent>
				<LoadingComponent
					loading={loading}
				></LoadingComponent>
			</GestureRecognizer>
			// SafeArea
		);
	}
}
