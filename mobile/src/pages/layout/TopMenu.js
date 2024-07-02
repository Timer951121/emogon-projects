
import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet} from 'react-native';
import { MainCss, wholeWidth, wholeHeight, grey } from '../../assets/css';

import imgBackArrow from '../../assets/images/arrow-back.png';
import imgLogoImage from '../../assets/images/logo-image.png';
import imgAvatar from '../../assets/images/avatar.png';

const styles = StyleSheet.create({
	topMenu:{ display: 'flex', alignItems: 'center', flexDirection:'row', width:wholeWidth},
	label:{flex:1, textAlign:'center'},
	iconImg:{height:36, width:36, margin:10, resizeMode: 'contain'}
});

export default class TopMenuComponent extends React.Component {
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
		return (
			<View style={{...styles.topMenu}}>
				<TouchableOpacity onPress={this.props.goBack}>
					<Image source={imgBackArrow} onClick={this.props.goBack} style={{...styles.iconImg, width:24, height:24, marginLeft:15}}></Image>
				</TouchableOpacity>
				
				<Text style={{...MainCss.label, ...styles.label}}>{this.props.label}</Text>
				{this.props.hideProfile ?
					<View style={{width:56, height:36}}></View>:
					<TouchableOpacity onPress={() => this.props.openProfile() }>
						<Image source={imgLogoImage} style={{...styles.iconImg}}></Image>
					</TouchableOpacity>
				}
			</View>
		);
	}
}
