
import React from 'react';
import { Image, Text, View} from 'react-native';
import { MainCss, wholeWidth, red } from '../../assets/css';
import { SetAnimate } from '../../data/common';

import imgClose from '../../assets/images/close-white.png';

export default class ErrorComponent extends React.Component {
	constructor(props) {
		super(props);
		const {error} = props;
		this.state = {error, top:-60};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.error !== nextProps.error) {
			this.setState({error:nextProps.error}, () => {
				const {error} = this.state;
				SetAnimate('top', error?-60:0, error?0:-60, this);
				if (error) {
					setTimeout(() => {
						this.props.resetError();
					}, 3000);
				}
			})
		}
	}

	render() {
		const {top, error} = this.state;
		return (
			<View style={{...MainCss.flex, position:'absolute', height:60, width:wholeWidth, left:0, top:top, backgroundColor:red}}>
				<Image source={imgClose} style={{width:15, height:15}}></Image>
				<Text style={{marginLeft:20, color:'white'}}>{error}</Text>
			</View>
		);
	}
}
