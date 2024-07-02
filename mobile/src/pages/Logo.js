
import React from 'react';
import {TouchableOpacity, Image, View} from 'react-native';

// import QRModalComponent from './ScanQR';
import imgLogo from '../assets/images/logo-image.png';
import imgLabel from '../assets/images/logo-label.png';
import { MainCss } from '../assets/css';
import {wholeHeight} from '../assets/css';

export default class LogoComponent extends React.Component {
	constructor(props) {
		super(props);
		const {} = props;
		this.state = {};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	onClickLogo = () => {
		this.props.navigation.navigate('Before');
	}

	render() {
		const {} = this.state;
		return (
			<View style={{...MainCss.backBoard}}>
				<TouchableOpacity style={{...MainCss.flexColumn, height:wholeHeight, marginTop:0}} onPress={() => this.onClickLogo() }>
					<Image source={imgLogo} style={{width:121, height:121, marginVertical:28, resizeMode: 'contain'}} />
					<Image source={imgLabel} style={{width:210, resizeMode: 'contain'}} />
				</TouchableOpacity>
			</View>
		);
	}
}
