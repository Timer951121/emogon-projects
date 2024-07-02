
import React from 'react';
import { Image, Text, View} from 'react-native';

import { onTouchS, onTouchE } from '../../data/common';
import { MainCss } from '../../assets/css';

export default class RoundIconBtn extends React.Component {
	constructor(props) {
		super(props);
		// const {middleKey} = props;
		this.state = {};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	render() {
		const {img, label} = this.props;
		return (
			<View
				onTouchStart={e=>onTouchS(e, this)}
				onTouchEnd={e=>onTouchE(e, this, 'roundIconBtn')}
				style={{...MainCss.button, ...MainCss.buttonExpand}}
			>
				<Image source={img} style={{...MainCss.buttonIcon}}></Image>
				<Text style={{...MainCss.buttonLabel, fontSize:20}}>{label}</Text>
			</View>
		);
	}
}
