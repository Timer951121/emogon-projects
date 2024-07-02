import React from 'react';
import { View, Image} from 'react-native';
import { ModalCss, red } from '../assets/css';

import { SetAnimateArr } from '../data/common';

import imgLoading from '../assets/images/loading.png';

export default class LoadingComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, loading} = props;
		this.state = {pageKey, loading, loadOpa:loading?1:0, centerRot:0 };
	}

	componentDidMount() {
		setInterval(() => {
			var {centerRot} = this.state;
			centerRot += 6;
			if (centerRot >= 360) centerRot = 0;
			this.setState({centerRot});
		}, 30);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.pageKey !== nextProps.pageKey) {
			this.setState({pageKey:nextProps.pageKey});
		}
		if (this.state.loading !== nextProps.loading) {
			if (nextProps.loading)
				this.setState({loading:nextProps.loading}, () => {
					this.setLoadOpa(true);
				});
			else {
				this.setLoadOpa(false);
				setTimeout(() => {
					this.setState({loading:false})
				}, 500);
			}
		}
	}

	setLoadOpa = (load) => {
		const animateArr = [
			{ key:'loadOpa', old: load?0:1, new: load?1:0},
		]
		SetAnimateArr(animateArr, this);
	}

	render() {
		const {loading, loadOpa, centerRot} = this.state;
		return (
			<View style={{...ModalCss.back, backgroundColor:loading==='first'?'#00000000':'#00000088', zIndex:loading?5:-1}}>
				{loading==='first'?
					<Image source={imgLoading} style={{position:'absolute', top:20, right:20, width: 40, height:40, resizeMode:'contain', transform:[{ rotate: centerRot+'deg'}]}} ></Image>:
					<View style={{width: 120, height: 120,  borderWidth: 16, borderColor:'#f3f3f3', borderTopWidth: 16, borderTopColor: red, opacity:0.8, borderRadius: 60, transform:`rotate(${centerRot}deg)`}}></View>
				}
			</View>
		);
	}
}
