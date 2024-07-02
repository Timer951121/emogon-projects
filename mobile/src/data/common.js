import { apiUrl } from "./config";
import { defaultModule, moduleData } from "./constant";
import axios from "axios";

export function GetTimeStrInfo(dateVal) {
	const year = dateVal.getFullYear(),
		month = Get2Digits(dateVal.getMonth() + 1),
		day = Get2Digits(dateVal.getDate()),
		minNum = Get2Digits(dateVal.getHours()),
		secNum = Get2Digits(dateVal.getSeconds());
	return {dateStr:year+'-'+month+'-'+day, timeStr:minNum+':'+secNum};
}
const todayInfo = GetTimeStrInfo(new Date()), curTimeStr = todayInfo.dateStr+'_'+todayInfo.timeStr;

export function Get2Digits(num) {
	return num < 10?'0'+num.toString():num.toString();
}

export const pageTime = 500;
export const timeAnimate = 100, intFrame = 5, intTime = timeAnimate/intFrame;


export function GetIdStr(strLength=10) {
	const oriStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890-=!@#$%^&*()_+';
	var idStr = '';
	for (let i = 0; i < strLength; i++) {
		idStr += oriStr[Math.floor(oriStr.length * Math.random()) ]
	}
	return idStr;
}

export function GetSelItem(arr, selKey) {
	return arr.find(item=>item.key===selKey) || {};
}

export function GetPageDepth(pageKey) {
	if 		(pageKey === 'first') return -1;
	else if (pageKey === 'total') return 0;
	else if (pageKey === 'part') return 1;
	else if (pageKey === 'subPart') return 2;
	else if (pageKey === 'detail') return 3;
}

export function GetRoleStrCustomer(item) {
	item.id = parseInt(item.id);
	var role = parseInt(item.role);
	const roleInfo = {face:false, voltaic:false, pump:false, storage:false, charge:false, carport:false};
	// var roleFace = false, roleVoltaic = false, rolePump = false, roleStorage = false, roleCharge = false;
	if (role > 31) {role -= 32; roleInfo.carport = true;}
	if (role > 15) {role -= 16; roleInfo.voltaic = true;}
	if (role > 7) {role -= 8; roleInfo.pump = true;}
	if (role > 3) {role -= 4; roleInfo.storage = true;}
	if (role > 1) {role -= 2; roleInfo.charge = true;}
	if (role > 0) {			  roleInfo.face = true;}
	item.roleInfo = roleInfo;

	const moduleInfo = JSON.parse(JSON.stringify(defaultModule));
	const moduleKeyArr = ['voltaicMat', 'voltaicBuild', 'pumpMat', 'pumpBuild', 'storageMat', 'storageBuild', 'chargeMat', 'chargeBuild', 'carportMat', 'carportBuild'];
	moduleKeyArr.forEach(key => {
		if (!item[key]) return;
		const checkArr = item[key].split(',');
		var mainKey;
		['voltaic', 'pump', 'storage', 'charge', 'carport'].forEach(item => { if (key.includes(item)) mainKey = item; });
		const subKey = key.includes('Mat')?'mat':'build';
		if (!mainKey || !subKey) return;
		// checkArr.forEach(checkInfo => {
		// 	if (!checkInfo) return; //2023-04-18T00:00+0800 // 5_2023-04-18_00:00
		// 	var checkIdxStr = checkInfo, dateVal, timeVal;
		// 	if (checkInfo.includes('_')) {
		// 		const splitArr = checkInfo.split('_');
		// 		checkIdxStr = splitArr[0];
		// 		dateVal = splitArr[1];
		// 		timeVal = splitArr[2];
		// 	}
		// 	const checkIdx = parseInt(checkIdxStr);
		// 	moduleInfo[mainKey][subKey][checkIdx].value = 'check';
		// 	if (moduleInfo[mainKey][subKey][checkIdx].time) {
		// 		if (dateVal && dateVal > todayStr) {
		// 			moduleInfo[mainKey][subKey][checkIdx].date = dateVal + ' ' + timeVal;
		// 		}
		// 	}
		// });
		checkArr.forEach((checkStr, idx) => {
			const checkInfo = checkStr.split('*');
			moduleInfo[mainKey][subKey][idx].value = checkInfo[0];
			moduleInfo[mainKey][subKey][idx].img = checkInfo[2];
			
			if (moduleInfo[mainKey][subKey][idx].time) {
				var dateVal;
				if (checkInfo[1].includes('_')) {
					dateVal = checkInfo[1].split('_').join(' ');
				}
				moduleInfo[mainKey][subKey][idx].date = dateVal;
			}
		});
	});

	item.moduleInfo = moduleInfo;

	// const moduleRole = JSON.parse(JSON.stringify(moduleData));
	// moduleRole.forEach(row => {
	// 	row.forEach(item => {
	// 		item.active = roleInfo[item.key];
	// 	});
	// });
	// item.moduleRole = moduleRole;
}

export function GetMonthName(num) {
	const date = new Date();
	date.setMonth(num);
	return date.toLocaleString('en-US', { month: 'long' });
}

export function GetPreviewNews(des) {
	var overLine = false, preViewStr = '';
	des.split('<p>').forEach((line, idx) => {
		if (idx > 5) {overLine = true; return;}
		if (line) {
			preViewStr += '<p>' + line;
		}
	});
	if (overLine) preViewStr += '\n<p>... ... ...</p>';
	return preViewStr;
}

export function UpdateHtmlStr(content, messageType) {
	if (messageType==='image') return content;
	const desArr = content.split('<p>');
	const newDesStr = desArr.join('<p style="color: black; margin: 3px 0px;">');
	return newDesStr;
}

export function parseApiData(source, keyArr=['id']) {
	source.forEach(item => {
		keyArr.forEach(key => {
			item[key] = parseInt(item[key]);
		});
	});
	return source;
}

export function GetRoleIntCustomer(roleVoltaic, rolePump, roleStorage, roleCharge, roleFace) {
	var role = 0;
	if (roleVoltaic) role += 16;
	if (rolePump) role += 8;
	if (roleStorage) role += 4;
	if (roleCharge) role += 2;
	if (roleFace) role += 1;
	return role;
}

export function CheckChangeSystem(oldSystemInfo, newSystemInfo) {
	if (!oldSystemInfo.length) return false;
	const changeArr = [];
	// var flagChange = false;
	oldSystemInfo.forEach(oldSystem => {
		const {id, name, canton} = oldSystem;
		const newSystem = newSystemInfo.find(item=>item.id===id);
		if (!newSystem) return;
		['voltaic', 'pump', 'storage', 'charge'].forEach(mainKey => {
			['Build', 'Mat'].forEach(subKey => {
				// if (flagChange) return;
				const key = mainKey+subKey;
				const oldStr = oldSystem[key], oldNumArr = GetCheckNumArr(oldStr);
				const newStr = newSystem[key], newNumArr = GetCheckNumArr(newStr);
				newNumArr.forEach(newNum => {
					// if (flagChange) return;
					if (!oldNumArr.includes(newNum)) changeArr.push({systemKey:name+' '+canton, mainKey, subKey, newNum})  // flagChange = {systemKey:name+' '+canton, mainKey, subKey, newNum};
				});
			});
		});
	});
	return changeArr;
}

function GetCheckNumArr(str) {
	const numArr = [];
	if (!str || str === '') return numArr;
	const nodeArr = str.split(',');
	nodeArr.forEach(nodeItem => {
		const firstNum = parseInt(nodeItem.split('_')[0]);
		numArr.push(firstNum);
	});
	return numArr;
}

export function SetAnimate (key, oldVal, newVal, self) {
	const intVal = (newVal - oldVal) / intFrame;
	for (let i = 1; i <= intFrame; i++) {
		setTimeout(() => {
			self.setState({[key]:oldVal + Math.round(i * intVal)})
		}, intTime * i);
	}
}

export function SetAnimateOpa (key, oldVal, newVal, self) {
	const intVal = (newVal - oldVal) / intFrame;
	for (let i = 1; i <= intFrame; i++) {
		setTimeout(() => {
			self.setState({[key]:oldVal + i * intVal})
		}, intTime * i);
	}
}

export function SetAnimateArr (arr, self) {
	arr.forEach(item => {
		item.intVal = (item.new - item.old) / intFrame;
	});
	for (let i = 1; i <= intFrame; i++) {
		setTimeout(() => {
			if (arr.length===1) {
				self.setState({
					[arr[0].key]:arr[0].old + Math.round(i * arr[0].intVal),
				})
			} else if (arr.length===2) {
				self.setState({
					[arr[0].key]:arr[0].old + Math.round(i * arr[0].intVal),
					[arr[1].key]:arr[1].old + Math.round(i * arr[1].intVal),
				})
			} else if (arr.length===3) {
				self.setState({
					[arr[0].key]:arr[0].old + Math.round(i * arr[0].intVal),
					[arr[1].key]:arr[1].old + Math.round(i * arr[1].intVal),
					[arr[2].key]:arr[2].old + Math.round(i * arr[2].intVal),
				})
			} else if (arr.length===4) {
				self.setState({
					[arr[0].key]:arr[0].old + Math.round(i * arr[0].intVal),
					[arr[1].key]:arr[1].old + Math.round(i * arr[1].intVal),
					[arr[2].key]:arr[2].old + Math.round(i * arr[2].intVal),
					[arr[3].key]:arr[3].old + Math.round(i * arr[3].intVal),
				})
			} else if (arr.length===5) {
				self.setState({
					[arr[0].key]:arr[0].old + Math.round(i * arr[0].intVal),
					[arr[1].key]:arr[1].old + Math.round(i * arr[1].intVal),
					[arr[2].key]:arr[2].old + Math.round(i * arr[2].intVal),
					[arr[3].key]:arr[3].old + Math.round(i * arr[3].intVal),
					[arr[4].key]:arr[4].old + Math.round(i * arr[4].intVal),
				})
			} else if (arr.length===6) {
				self.setState({
					[arr[0].key]:arr[0].old + Math.round(i * arr[0].intVal),
					[arr[1].key]:arr[1].old + Math.round(i * arr[1].intVal),
					[arr[2].key]:arr[2].old + Math.round(i * arr[2].intVal),
					[arr[3].key]:arr[3].old + Math.round(i * arr[3].intVal),
					[arr[4].key]:arr[4].old + Math.round(i * arr[4].intVal),
					[arr[5].key]:arr[5].old + Math.round(i * arr[5].intVal),
				})
			}
		}, intTime * i);
	}
}

export function onTouchS(e, self) {
	self.touchSX = e.nativeEvent.pageX; self.touchST = Date.now();
}

export function onTouchE(e, self, type, buttonKey) {
	const touchDisX = Math.abs(e.nativeEvent.pageX - self.touchSX),
		touchDisT = Date.now() - self.touchST;
	if (touchDisX < 40 && touchDisT < 200) {
		if 		(type==='totalBottom') self.props.onClickFooter(buttonKey);
		else if (type==='beforeBottom') self.onClickFooterBtn(buttonKey);
		else if (type==='chartMain') self.onClickMainBtn();
		else if (type==='list') self.props.onClickListItem(buttonKey);
		else if (type==='openTicket') self.props.openDetailTicket(buttonKey);
		else if (type==='module') self.props.onClickModule(buttonKey);
		else if (type==='login') self.setLogin();
		else if (type==='logout') self.props.setLogout();
		else if (type==='chartTab') self.onClickTab(buttonKey);
		else if (type==='serviceDetail') self.props.clickDetail();
		else if (type==='serviceCreate') self.props.submitCreate();
		else if (type==='roundIconBtn') self.props.onClick();
		else if (type==='infoOut') self.closeInfoModal();
		else if (type==='comCustomer') self.onClickComCustomer(buttonKey);
	}
}


export function GetTimeStr(time, apiName) {
	if (!time) return '';
	const timeStr = new Date(parseInt(time)*1000),
		monthNum = timeStr.getMonth() + 1,
		monthName = GetMonthName(monthNum - 1),
		dayNum = timeStr.getDate(),
		yearNum = timeStr.getFullYear(),
		hourNum = timeStr.getHours(),
		minNum = timeStr.getMinutes();
	const minStr = minNum<10?'0'+minNum.toString():minNum.toString(),
		hourStr = hourNum<10?'0'+hourNum.toString():hourNum.toString(),
		monthInt = monthNum<10?'0'+monthNum.toString():monthNum.toString();
	if (apiName==='news') return dayNum+'. '+monthName+' '+yearNum+' - '+hourStr+':'+minStr;
	else if (apiName==='ticket') return hourStr+':'+minStr + ' - ' + dayNum+'. '+monthName+' '+yearNum;
	else if (apiName==='invoice') return dayNum+'/'+monthInt+'/'+yearNum;
	else if (apiName==='service') return dayNum+'. '+monthName+' '+yearNum;
}

export function GetParseDate(timeVal) {
	const timeStr = new Date(parseInt(timeVal)*1000), monthName = GetMonthName(timeStr.getMonth()), dayNum = timeStr.getDate(), yearNum = timeStr.getFullYear(), hourNum = timeStr.getHours(), minNum = timeStr.getMinutes();
	const hourStr = hourNum<10?'0'+hourNum.toString():hourNum.toString(), minStr = minNum<10?'0'+minNum.toString():minNum.toString();
	return {yearNum, monthName, dayNum, hourStr, minStr}
}

export function GetStatusLabel (status) {
	if (status==='new') return 'Offen';
	else if (status==='close') return 'Geschlossen';
	else if (status==='employee') return 'Wartet auf Kundenantwort';
	else if (status==='client') return 'Offen';
	else return '';
	// Offen / Wartet auf Kundenantwort / Geschlossen / Wartet auf support team wort
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function GetTimeLabel(dateStr, timeStr) {
	if (!dateStr || !timeStr) return '';
	const dayArr = dateStr.split('-'), timeArr = timeStr.split(':');
	const numYear = dayArr[0], labelMonth = monthNames[parseInt(dayArr[1] - 1)], numDay = parseInt(dayArr[2]);
	var	numHour = parseInt(timeArr[0]), apStr = 'am', numMin = timeArr[1];
	if (numHour > 12) {
		numHour -= 12, apStr = 'pm';
	}
	return numDay+'. '+labelMonth+' '+numYear + ' / '+numHour+':'+numMin+' '+apStr;
}

export function SortComCustomArr(arr) {
	const realArr = [], unableArr = [];
	arr.forEach((item, idx) => {
		const dateTimeStr = item.dateStr+'_'+item.timeStr;
		if (dateTimeStr < curTimeStr) {unableArr.push({...item}); return;}
		else realArr.push({...item});
	});
	realArr.sort((a, b) => {
		if (a.dateTimeStr < b.dateTimeStr) { return -1; }
		if (a.dateTimeStr > b.dateTimeStr) { return 1; }
		return 0;
	});
	unableArr.forEach(item => {
		realArr.push({...item, disable:true});
	});
	return realArr;
}

export function SendEmail(email, from, title, content) {
	content += '</br></br></br><p>You can check detail information on ENERQ APP or <a href="https://app.enerq.ch/">Web page</a> .</p></br>';
	axios.post(`${apiUrl}email/mobile.php`, {email, from, title, content}).then(res => {
		// console.log(res.data);
	}).catch(error => { });
}