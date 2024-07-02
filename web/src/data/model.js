
// export const controlHome = {azimuth:{max:Infinity, min:-Infinity}, polar:{max:1.84, min:1.20}};
//Rail_inner

export function GetDevice() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (window.innerWidth > 1280 || window.innerHeight > 1280) return undefined;
	else if (/windows phone/i.test(userAgent)) { return "windows"; }
	else if (/android/i.test(userAgent)) { return "android"; }
	else if (/iPhone|iPod/.test(userAgent) && !window.MSStream) { return "ipone"; }
	// else if (/iPad/.test(userAgent) && !window.MSStream) { return "ipad"; }
	else return undefined;
}

export function GetPageFormat() {
	return window.innerWidth>window.innerHeight?'land':'port';
}
