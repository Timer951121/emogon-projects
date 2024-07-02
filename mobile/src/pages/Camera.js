import React from 'react';
import { AppRegistry, Text, View, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';

import TopMenuComponent from './layout/TopMenu';

import { MainCss, wholeWidth, red, black } from '../assets/css';

const styles = StyleSheet.create({
	centerText: { flex: 1, fontSize: 18, padding: 32, color: '#777', textAlign:'center' },
	textBold: { color: '#000', textAlign:'center' },
	// fontWeight: '500', 
	buttonText: { fontSize: 21, color: 'rgb(0,122,255)' },
	buttonTouchable: { padding: 16 }
});

export default class CameraComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	onSuccess = e => {
		const str = e.data;
		this.setState({codeStr:str})
		if (str.length !== 12) return;
		this.props.setCodeStr(str);
		this.props.navigation.goBack();
		// Linking.openURL(e.data).catch(err =>
		// 	console.error('An error occured', err)
		// );
	};

	render() {
		const {codeStr} = this.state;
		return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'QR-Code Scanner'}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<QRCodeScanner
					onRead={this.onSuccess}
					// flashMode={RNCamera.Constants.FlashMode.torch}
					topContent={
						<View style={{margin:5}}>
							<Text style={{...MainCss.label, color:black}}>Halten Sie den QR-Code auf Ihrem Neukunden-Brief in den Sucher der Kamera.</Text>
							<Text style={{...MainCss.label, color:black}}>Bewegen Sie sie etwas vor und zurück.</Text>
						</View>
					}
					topViewStyle={{display:'flex', flexDirection:'row', alignItems:'flex-start'}}
					bottomViewStyle={{backgroundColor:'none', height:50}}
					bottomContent={
						<TouchableOpacity style={styles.buttonTouchable} onPress={e=>this.props.navigation.goBack()}>
							<Text style={styles.buttonText}>Go Back</Text>
						</TouchableOpacity>
					}
					
				/>
			</View>
		);
	}
}
