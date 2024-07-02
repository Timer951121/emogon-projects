
export const apiUrl = 'https://emogon.com/configurator/admin';
export const frontUrl = 'https://emogon.com/configurator/';

export function GetDeviceInfo() {
	const navigator_info = window.navigator;
	const screen_info = window.screen;
	var id = navigator_info.mimeTypes.length;
	id += navigator_info.userAgent.replace(/\D+/g, '');
	id += navigator_info.plugins.length;
	// id += window.innerHeight || '';
	// id += window.innerWidth || '';
	// id += screen_info.height || '';
	// id += screen_info.width || '';
	// id += screen_info.pixelDepth || '';
	return id;
}
