
import React from 'react';
import { Image, Text, View, TouchableOpacity} from 'react-native';
import { MainCss, wholeWidth, red, wholeHeight, white, black, ModalCss, grey } from '../assets/css';

import imgClose from '../assets/images/close.png';

export default class VersionNoteComponent extends React.Component {
	constructor(props) {
		super(props);
		const {verNote} = props;
		this.state = {verNote};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.verNote !== nextProps.verNote) {
			this.setState({verNote:nextProps.verNote}, () => {
			})
		}
	}

	render() {
		const {verNote} = this.state;
		return (
			<View style={{...ModalCss.back, height:wholeHeight-this.props.otherHeight, zIndex:verNote?5:-1}}>
				<View style={{...ModalCss.wrapper, height:280, paddingBottom:0}}>
					<View>
						<Text style={{...MainCss.label, fontSize:18, marginBottom:20, color:black}}>Ihre Version der ENERQ App ist veraltet.</Text>
						<Text style={{...MainCss.label, fontSize:18, color:black}}>Um die Funktionalität wieder zu ermöglichen, aktualisieren Sie bitte Ihre App.</Text>
						<Text style={{...MainCss.label, fontSize:14, color:grey, marginTop:30, textAlign:'center'}}>Version {this.props.appVerInstall}</Text>
					</View>
					<TouchableOpacity style={{...MainCss.flex, position:'absolute', top:10, right:10, width:30, height:30}} onPress={e=>this.props.closeNoteModal()}>
						<Image source={imgClose} style={{width:16, height:16, resizeMode:'contain', opacity:0.7}}></Image>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
