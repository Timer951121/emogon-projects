
import PushNotification, {Importance} from 'react-native-push-notification';

import { noteChannelId } from './config';

export function CreateNoteChannel () {
	PushNotification.channelExists(noteChannelId, exists => {
		if (exists) {  return; } // PushNotification.deleteChannel(noteChannelId);
		else {
			PushNotification.createChannel( {
				channelId: noteChannelId, // (required)
				channelName: "Enerq_Notification", // (required)
				channelDescription: "Enerq Notification description", // (optional) default: undefined.
				playSound: true, // (optional) default: true
				// soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
				importance: 5, // (optional) default: 4. Int value of the Android notification importance
				// importance: Importance.HIGH,
				vibrate: true, 
			}, (created) => {} ); 
		}
	});
}

export function SendPushNote (title, subtitle, messageStr) { //
	PushNotification.localNotification({
		title,
		subtitle,
		message: subtitle + ' ' + messageStr,
		playSound: true,
		channelId: noteChannelId,
		// date: new Date(Date.now() + 10 * 1000 ),
		// picture: "https://www.example.tld/picture.jpg",
	});
}

export function SendPushNoteTime(title, messageStr, date = new Date(Date.now())) {
	PushNotification.localNotificationSchedule({
		title, 
		playSound: true,
		channelId: noteChannelId,
		message: messageStr,
		date,
	});
}