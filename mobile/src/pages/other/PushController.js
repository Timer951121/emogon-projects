import { Component } from 'react';
import PushNotification from 'react-native-push-notification';

import { noteChannelId } from '../../data/constant';

export default class PushController extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.createNoteChannel();
	}

	createNoteChannel = () => {
		
	}
	
	render() {
		return null;
	}
}