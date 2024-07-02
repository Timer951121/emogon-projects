import React from 'react';
import jQuery from 'jquery';
import { menuArr } from './constant';
import { apiUrl } from './config';

const ticketTableW = 1178/100, ticketTableW0 = 1173/100, invoiceTableW = 1160/100;

export const thArrTicket = [
	{key:'number', label:'Ticket ID', width:189/ticketTableW},
	{key:'update', label:'Update', width:111/ticketTableW},
	{key:'customer', label:'Kundenname', width:164/ticketTableW},
	{key:'category', label:'Kategorie', width:127/ticketTableW},
	
	{key:'title', label:'Betreff', width:245/ticketTableW, flex1:true},
	{key:'employee', label:'Letzte Antwort', width:177/ticketTableW},
	{key:'status', label:'Status', width:158/ticketTableW},
]

export const thArrTicket0 = [
	{key:'number', label:'Ticket ID', width:191/ticketTableW},
	{key:'update', label:'Update', width:170/ticketTableW},
	{key:'category', label:'Kategorie', width:150/ticketTableW},
	
	{key:'title', label:'Betreff', width:293/ticketTableW, flex1:true},
	{key:'employee', label:'Letzte Antwort', width:207/ticketTableW},
	{key:'status', label:'Status', width:159/ticketTableW},
]

export const thArrInvoice = [
	{key:'name', label:'Rechnung', width:324/invoiceTableW},
	{key:'time', label:'Zeit', width:229/invoiceTableW},
	{key:'paid', label:'Bezahlt', width:125/invoiceTableW},
	{key:'delete', label:'Löschen', width:106/invoiceTableW, hideArrow:true},
	{key:'other', label:'', width:376/invoiceTableW, flex1:true, hideArrow:true},
]

export const thArrTechnical = [
	{key:'name', label:'Technologie', width:324/invoiceTableW},
	{key:'time', label:'Zeit', width:229/invoiceTableW},
	{key:'status', label:'Status', width:125/invoiceTableW},
	{key:'delete', label:'Löschen', width:106/invoiceTableW, hideArrow:true},
	{key:'other', label:'', width:376/invoiceTableW, flex1:true, hideArrow:true},
]

export function CheckEmail (str) {
	return String(str).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export function OnTouchStart (e, self) {
	self.touchS = {x:e.touches[0].pageX, y:e.touches[0].pageY};
}

export function OnTouchMove (e, self) {
	self.touchE = {x:e.touches[0].pageX, y:e.touches[0].pageY};
}

export function OnTouchEnd (e, self, stateKey) {
	if (!self.touchE || !self.state[stateKey]) return;
	// const delta = Math.abs(this.touchS.x - this.touchE.x) + Math.abs(this.touchS.y - this.touchE.y);
	if (self.touchS.x < self.touchE.x) { self.closeSide(); }
	self.touchE = undefined;
}

export function GetSelItem(arr, selKey, keyStr='key') {
	return arr.find(item=>item[keyStr]===selKey) || {};
}

export function GetSelMenuItem(pageKey) {
	var selMenu = {}, subMenu = {};
	menuArr.forEach(item => {
		if (item.key===pageKey) {
			selMenu = item;
		}
		if (item.subMenu) {
			item.subMenu.forEach(subItem => {
				if (subItem.key===pageKey) {
					selMenu = item;
					subMenu = subItem;
				}
			});
		}
	});
	return {selMenu, subMenu};
}

export function GetParseArr(arrStr, keyArr=['id']) {
	if (!arrStr) return [];
	const arr = JSON.parse(arrStr);
	arr.forEach(item => {
		keyArr.forEach(key => {
			if (item[key]) item[key] = parseInt(item[key]);
		});
	});
	return arr;
}

export function GetMonthName(num) {
	const date = new Date();
	date.setMonth(num);
	return date.toLocaleString('en-US', { month: 'short' });//long
}

export function GetParseDate(timeVal) {
	if (!timeVal) return false;
	const timeStr = new Date(parseInt(timeVal)*1000), monthName = GetMonthName(timeStr.getMonth()), dayNum = timeStr.getDate(), yearNum = timeStr.getFullYear(), hourNum = timeStr.getHours(), minNum = timeStr.getMinutes();
	const hourStr = hourNum<10?'0'+hourNum.toString():hourNum.toString(), minStr = minNum<10?'0'+minNum.toString():minNum.toString();
	return {yearNum, monthName, dayNum, hourStr, minStr}
}

export function GetScrollable(id) {
	const element = document.getElementById(id);
	if (id==='customerTicketTable' && element) {
		// console.log(element.scrollHeight, element.clientHeight);
	}
	return (element && element.scrollHeight > element.clientHeight)?'scrollable':''
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

export function GetFilterArr (sourceArr, filterArr, selectArr, state, test) {
	const resArr = [];
	sourceArr.forEach(data => {
		var checkFilter = true;
		filterArr.forEach(item => {
			const {key} = item, keyStr = state[key];
			if (!keyStr || keyStr === '') return;
			else if (!data[key].toLowerCase().includes(keyStr)) checkFilter = false;
		});
		if (checkFilter && selectArr && selectArr.length) {
			var iconCross = false;
			selectArr.forEach(iconItem => {
				const dataIcon = data[iconItem.stateKey], stateIcon = state[iconItem.key];
				if (dataIcon && stateIcon) iconCross = true;
			});
			if (iconCross===false) checkFilter = false;
		}
		if (checkFilter) resArr.push(data);
	});
	return resArr;
}

export function GetRoleStrMember(role) {
	var roleFace = false, roleShield = false, roleStar = false;
	if (role > 3) {role -= 4; roleStar = true;}
	if (role > 1) {role -= 2; roleShield = true;}
	if (role > 0) {roleFace = true;}
	return {roleFace, roleShield, roleStar};
}

export function GetRoleIntMember(roleFace, roleShield, roleStar) {
	var role = 0;
	if (roleStar) role += 4;
	if (roleShield) role += 2;
	if (roleFace) role += 1;
	return role;
}

export function GetRoleStrCustomer(role, item) {
	var roleFace = false, roleVoltaic = false, rolePump = false, roleStorage = false, roleCharge = false, roleCarport = false;
	if (role > 31) {role -= 32; roleCarport = true;}
	if (role > 15) {role -= 16; roleVoltaic = true;}
	if (role > 7) {role -= 8; rolePump = true;}
	if (role > 3) {role -= 4; roleStorage = true;}
	if (role > 1) {role -= 2; roleCharge = true;}
	if (role > 0) {roleFace = true;}
	const roleInfo = {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace};
	if (item) {
		['roleFace', 'roleVoltaic', 'rolePump', 'roleStorage', 'roleCharge', 'roleCarport'].forEach(roleKey => {
			item[roleKey] = roleInfo[roleKey];
		});
	}
	else return roleInfo;
}

export function GetRoleIntCustomer(roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace) {
	var role = 0;
	if (roleCarport) role += 32;
	if (roleVoltaic) role += 16;
	if (rolePump) role += 8;
	if (roleStorage) role += 4;
	if (roleCharge) role += 2;
	if (roleFace) role += 1;
	return role;
}

export function GetMemberId(branchArr, departArr, item) {
	const selBranch = branchArr.find(branch=>{return branch.id===item.branch});
	const selDepart = departArr.find(depart=>{return depart.id===item.depart});
	const branchShort = selBranch?selBranch.short : 'XX';
	const departShort = selDepart?selDepart.short : 'XX';
	return 'CH-'+branchShort +'-'+departShort+'-'+item.employee_id;
}

const strNum = '0123456789';
export function GetSystemNum(systemArr) {
	const numArr = [];
	systemArr.forEach(system => { numArr.push(system.number); });
	var newNum;
	do {
		newNum = '0';
		for (let i = 0; i < 6; i++) {
			newNum += strNum[Math.floor(Math.random() * 10)];
		}
	} while (!numArr.includes(newNum));
	return newNum;
}

export const codeLength = 12;
const strPassd = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function GetPassd() {
	var str = '';
	for (let i = 0; i < codeLength; i++) {
		str += strPassd[Math.floor(Math.random() * strPassd.length)] ;
	}
	return str;
}

const strSource = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=?<>:{}[],.';
export function GetId() {
	var str = '';
	for (let i = 0; i < 20; i++) {
		str += strSource[Math.floor(Math.random() * strSource.length)] ;
	}
	return str;
}

export function CheckPassd(str) {
	if (str.length !== codeLength) return false;
	var check = true;
	for (let i = 0; i < codeLength; i++) {
		if (!strPassd.includes(str[i])) check = false;
	}
	return check;
}

export function CheckLabel(str) {
	if (str.includes('"')) return false;
	if (str.includes("'")) return false;
	if (str.includes(',')) return false;
	return true;
}

export function GetDeviceId () {
	const navigator_info = window.navigator;
	const screen_info = window.screen;
	var uid = navigator_info.mimeTypes.length;
	uid += navigator_info.userAgent.replace(/\D+/g, '');
	uid += navigator_info.plugins.length;
	uid += screen_info.height || '';
	uid += screen_info.width || '';
	uid += screen_info.pixelDepth || '';
	return uid;
}

export class Icon extends React.Component {
	constructor(props) {
		super(props);
		const {classStr} = props;
		this.state = {classStr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.classStr !== nextProps.classStr) {
			this.setState({classStr:nextProps.classStr})
		}
	}

	render() {
		const {img} = this.props, {classStr} = this.state;
		return (
			<div className={`icon ${classStr || ''} ${this.props.onClickIcon?'pointer':''}`}>
				<img src={img} onClick={e=>this.props.onClickIcon?this.props.onClickIcon():{}} alt=''></img>
			</div>
		);
	}
}

export function GetStatusLabel (status) {
	if (status==='new') return 'Offen';
	else if (status==='close') return 'Geschlossen';
	else if (status==='client') return 'Offen';
	else if (status==='employee') return 'Wartet auf Kundenantwort';
	else return '';
	// Offen / Wartet auf Kundenantwort / Geschlossen / Wartet auf support team wort
}

export function SendEmail(email, from, title, content) {
	content += '</br></br></br><p>You can check detail information on ENERQ APP or <a href="https://app.enerq.ch/">Web page</a> .</p></br>'
	jQuery.ajax({ type: "POST", url:apiUrl+'email/general.php', dataType: 'json', data: {email, from, title, content},
		success: (res) => { console.log(res) }
	});
}