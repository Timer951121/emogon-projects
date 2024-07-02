
import React from 'react';
import jQuery from 'jquery';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ThOrder from '../layout/ThOrder';
import { customerDetailMenu, defaultModule, projectStatusArr } from '../../data/constant';
import { GetSelItem, Icon, GetRoleStrCustomer, GetScrollable, thArrTicket0, GetParseArr, GetParseDate, thArrInvoice, GetStatusLabel, thArrTechnical, SendEmail } from '../../data/common';
import { apiUrl, serverUrl } from '../../data/config';
import imgAvatarBig from '../../assets/images/avatar-big.png';
import imgCheckWhite from '../../assets/images/checkbox-white.png';
import imgBillWhite from '../../assets/images/bill-white.png';
import imgDocWhite from '../../assets/images/doc-white.png';
import imgTicketWhite from '../../assets/images/ticket-white.png';
import imgCheckBoxRed from '../../assets/images/checkbox-red.png';
import imgCheckRed from '../../assets/images/check-red.png';
import imgCheckGreen from '../../assets/images/check.png';
import imgBillRed from '../../assets/images/bill-red.png';
import imgDocRed from '../../assets/images/doc-red.png';
import imgTicketRed from '../../assets/images/ticket-red.png';
import imgPenEditRed from '../../assets/images/pen-edit-red.png';
import imgClock from '../../assets/images/clock.png';
import imgCheck from '../../assets/images/check.png';
import imgCalendar from '../../assets/images/calendar-black.png';
import imgEmptyCheck from '../../assets/images/empty-check.jpg';
import imgDownload from '../../assets/images/download.png';
import imgDeleteBlack from '../../assets/images/delete-black.png';
import imgUpload from '../../assets/images/upload.png';
import imgTimeline from '../../assets/images/timeline-page.jpg';
import WorkerSelect from '../modal/WorkerSelect';

const tabArr = [
	{key:'status', label:'Projektstatus', imgWhite:imgCheckWhite, imgRed:imgCheckBoxRed},
	{key:'bill', label:'Rechnungen', imgWhite:imgBillWhite, imgRed:imgBillRed},
	{key:'technical', label:'Technische Daten', imgWhite:imgDocWhite, imgRed:imgDocRed},
	{key:'ticket', label:'Tickets', imgWhite:imgTicketWhite, imgRed:imgTicketRed},
]
const statusPos = [74, 140, 198, 254, 312, 368, 426, 482, 540, 595, 653, 710, 775];

Object.keys(defaultModule).forEach(key => {
	['build', 'mat'].forEach(arrKey => {
		defaultModule[key][arrKey].forEach(item => {
			item.value = 'uncheck';
		});
	});
});

const hourStrArr = [], minStrArr = [];
for (let h = 0; h < 24; h++) {
	const label = h<10?'0'+h.toString():h.toString();
	hourStrArr.push({label, value:label});
}
for (let m = 0; m < 60; m++) {
	const label = m<10?'0'+m.toString():m.toString();
	minStrArr.push({label, value:label});
}

export default class CustomDetail extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, loginType, customerStr, systemStr, nonSystemId, detailChange, imageName, ticketStr, teamStr, invoiceStr, technicalStr, workerStr, companyStr} = props;
		const iconKey = customerDetailMenu[0].key;
		// const {customerId, iconKey} = detailCustom || {};
		const selIconInfo = {build:[], mat:[]};
		const {build, mat} = selIconInfo; this.customerArr = []; this.selSystemArr = []; this.systemArr = []; this.ticketArr = []; this.teamArr = []; this.invoiceArr = []; this.technicalArr = []; this.selTechnicalArr = []; this.selInvoiceArr = []; this.workerArr = []; this.companyArr = [];
		this.state = {pageKey, loginType, customerStr, systemStr, imageName, customerInfo:{}, tabKey:'status', iconKey, build, mat, detailChange, ticketStr, teamStr, invoiceStr, technicalStr, ticketData:[], invoiceData:[], technicalData:[], invoiceSearch:'', technicalSearch:'', nonSystemId, modalWorkerOut:false, modalWorkerIn:false, selWorker:false, workerStr, companyStr};
		this.timelineRef = React.createRef();
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'loginType', 'customerStr', 'systemStr', 'ticketStr', 'teamStr', 'detailCustom', 'nonSystemId', 'detailChange', 'imageName', 'invoiceStr', 'technicalStr', 'workerStr', 'companyStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					
				});
				if (key==='customerStr') {
					this.customerArr = GetParseArr(nextProps.customerStr);
				} else if (key==='systemStr') {
					this.systemArr = GetParseArr(nextProps.systemStr, ['id', 'customerId', 'status']);
					this.systemArr.forEach((item, idx) => {
						const moduleInfo = JSON.parse(JSON.stringify(defaultModule));
						GetRoleStrCustomer(parseInt(item.role) || 0, item);
						const moduleKeyArr = ['voltaicMat', 'voltaicBuild', 'pumpMat', 'pumpBuild', 'storageMat', 'storageBuild', 'chargeMat', 'chargeBuild', 'carportMat', 'carportBuild'];
						moduleKeyArr.forEach(key => {
							if (!item[key]) return;
							const checkArr = item[key].split(',');
							var mainKey;
							['voltaic', 'pump', 'storage', 'charge', 'carport'].forEach(item => { if (key.includes(item)) mainKey = item; });
							if (!mainKey) return;
							const subKey = key.includes('Mat')?'mat':'build';
							checkArr.forEach((checkStr, idx) => {
								const checkInfo = checkStr.split('*');
								moduleInfo[mainKey][subKey][idx].value = checkInfo[0];
								moduleInfo[mainKey][subKey][idx].img = checkInfo[2];
								
								if (moduleInfo[mainKey][subKey][idx].time) {
									var dateVal, hourVal = '00', minVal = '00', worker = false;
									const dateInfo = checkInfo[1].split('_');
									if (dateInfo.length>1) {
										dateVal = new Date(dateInfo[0]);
										const timeInfo = dateInfo[1].split(':');
										hourVal = timeInfo[0];
										minVal = timeInfo[1];
										worker = dateInfo[2]?parseInt(dateInfo[2]):null;
									}
									moduleInfo[mainKey][subKey][idx].date = dateVal;
									moduleInfo[mainKey][subKey][idx].hour = hourVal;
									moduleInfo[mainKey][subKey][idx].min = minVal;
									moduleInfo[mainKey][subKey][idx].worker = worker;
								}
							});
						});
						item.moduleInfo = moduleInfo;
					});
				} else if (key==='ticketStr') {
					this.ticketArr = GetParseArr(nextProps.ticketStr, ['id', 'customerId', 'systemId', 'employeeId']);
					this.ticketArr.forEach(ticket => {
						const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(ticket.createTime);
						ticket.update = dayNum+'/'+monthName + ' ' + hourStr+':'+minStr;
					});
					this.setTicketArr();
				} else if (key==='teamStr') {
					this.teamArr = GetParseArr(nextProps.teamStr);
					this.setTicketArr();
				} else if (key==='detailCustom') {
					const selSystem = this.systemArr.find(system=>{return system.id===nextProps.detailCustom}) || {};
					const {customerId} = selSystem;
					const customerInfo = GetSelItem(this.customerArr, customerId, 'id');
					this.setState({customerInfo, tabKey:'status'});
					this.selSystemArr = this.systemArr.filter(item=>{return item.customerId===customerId});
					this.setState({selSystemId:nextProps.detailCustom}, e=>this.setSelSystemId())
				} else if (key==='nonSystemId') {
					const customerInfo = GetSelItem(this.customerArr, nextProps.nonSystemId, 'id');
					this.setState({customerInfo, tabKey:'status'});
					this.selSystemArr = [];
					this.setState({selSystemId:undefined}, e=>this.setSelSystemId())
				} else if (key==='detailChange') {
					if (this.state.detailChange && !nextProps.detailChange) {
						const {nextPage} = this.state;
						this.setSelSystemId();
						if (nextPage) {
							const {name, value} = nextPage;
							this.processOrder(name, value);
						}
					}
				} else if (key==='imageName') {
					if (!this.state.detailCustom) return; // || !nextProps.imageName
					this.setCheckImg(nextProps.imageName);
				} else if (key==='invoiceStr') {
					this.invoiceArr = GetParseArr(nextProps.invoiceStr, ['id', 'customerId', 'systemId', 'time']);
					this.invoiceArr.forEach(item => { item.paid= item.paid==='0'?false:true;});
					this.selInvoiceArr = this.invoiceArr.filter(item=>{return item.systemId===this.state.selSystemId});
					this.setInvoiceData();
				} else if (key==='technicalStr') {
					this.technicalArr = GetParseArr(nextProps.technicalStr, ['id', 'customerId', 'systemId', 'time']);
					// this.invoiceArr.forEach(item => { item.paid= item.paid==='0'?false:true;});
					this.selTechnicalArr = this.technicalArr.filter(item=>{return item.systemId===this.state.selSystemId});
					this.setTechnicalData();
				} else if (key==='workerStr') {
					this.workerArr = GetParseArr(nextProps.workerStr, ['id', 'companyId']);
					this.updateWorkerArr();
				} else if (key==='companyStr') {
					this.companyArr = GetParseArr(nextProps.companyStr);
					this.updateWorkerArr();
				}
			}
		});
	}

	updateWorkerArr = () => {
		this.workerArr.forEach(worker => {
			const selCompany = this.companyArr.find(item=>item.id===worker.companyId) || {roleVoltaic:true, rolePump:true, roleStorage:true, roleCharge:true, roleCarport:true, name:'Undefined Company', location:'Unknown'};
			const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, name, location} = selCompany;
			worker.roleVoltaic = roleVoltaic;
			worker.rolePump = rolePump;
			worker.roleStorage = roleStorage;
			worker.roleCharge = roleCharge;
			worker.roleCarport = roleCarport;
			worker.companyName = name+','+ location;
		});
	}

	onChangeInvoiceSearch = (searchStr) => {
		this.setState({invoiceSearch:searchStr}, () => {
			this.setInvoiceData();
		})
	}

	setInvoiceData = () => {
		const invoiceData = [], {invoiceSearch} = this.state;
		this.selInvoiceArr.forEach(item => {
			if (!invoiceSearch) {
				invoiceData.push(item);
			} else if (item.name.toLowerCase().includes(invoiceSearch.toLowerCase())) {
				invoiceData.push(item);
			}
		});
		this.setState({invoiceData})
	}

	getInvoiceCellLabel = (item, key) => {
		const val = item[key];
		if (key==='name') return val+'.pdf';
		else if (key==='time') {
			const {yearNum, monthName, dayNum} = GetParseDate(val);
			return dayNum+'/'+monthName+'/'+yearNum;
		} else if (key==='status') {
			return '';
		}
	}

	openInvoicePDF = (pdfName) => {
		const pdfUrl = apiUrl+'other/invoice_pdf/'+pdfName+'.pdf';
		window.open(pdfUrl, '_blank');
	}

	onChangeTechnicalSearch = (searchStr) => {
		this.setState({technicalSearch:searchStr}, () => {
			this.setTechnicalData();
		})
	}

	setTechnicalData = () => {
		const technicalData = [], {technicalSearch} = this.state;
		this.selTechnicalArr.forEach(item => {
			if (!technicalSearch) {
				technicalData.push(item);
			} else if (item.name.toLowerCase().includes(technicalSearch.toLowerCase())) {
				technicalData.push(item);
			}
		});
		this.setState({technicalData})
	}

	getTechnicalCellLabel = (item, key) => {
		const val = item[key];
		if (key==='name') return val+'.pdf';
		else if (key==='time') {
			const {yearNum, monthName, dayNum} = GetParseDate(val);
			return dayNum+'/'+monthName+'/'+yearNum;
		}
	}

	openTechnicalPDF = (pdfName) => {
		const pdfUrl = apiUrl+'other/technical_pdf/'+pdfName+'.pdf';
		window.open(pdfUrl, '_blank');
	}

	selectPDFFile = (key) => {
		const pdfInput = document.getElementById('pdf'+key+'File');
		pdfInput.click();
	}

	uploadPDFFile = (e, str) => {
		const {customerInfo, selSystemId} = this.state
		const key = str.toLowerCase(), pdfInput = document.getElementById('pdf'+str+'File');
		const selSystem = this.systemArr.find(item=>{return item.id===selSystemId}), {customerId, id} = selSystem;
		const selFile = pdfInput.files[0];
		if (!selFile) return;
		const fileName = selFile.name.substring(0, selFile.name.length-4);
		if (!fileName) return;
		const existArr = str==='Invoice'?this.invoiceArr:this.technicalArr;
		const existName = existArr.find(item=>item.name===fileName);
		if (existName) {window.alert('Aleady exist the file name for '+key+' PDF , please check unique file'); return;}

		const formData = new FormData();
		formData.append("file", selFile);
		formData.append("type", key);
		formData.append("fileName", fileName);
		formData.append("customerId", customerId);
		formData.append("systemId", id);

		this.props.setLoading(true);
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", apiUrl+'other/uploadImgFile.php', true);
		xhttp.onreadystatechange = (e) => {
			const result = e.target;
			if (result.readyState === 4 && result.status === 200) {
				const res = JSON.parse(result.responseText);
				this.props.setLoading(false);
				if (str==='Invoice') this.props.callInvoiceAPI();
				if (str==='Technical') this.props.callTechnicalAPI();
			}
		};
		xhttp.send(formData);
		const {email, name} = customerInfo;
		const mailContent = `<p>Hello, ${name}.</p> </br> <p>ENERQ team sent ${fileName}.pdf file for new ${str} PDF.</p>`;
		SendEmail(email, false, 'Send new Invoice PDF', mailContent);
	}

	changeInvoiceStatus = (invoiceId, value) => {
		this.selInvoiceArr.forEach(item => {
			if (item.id===invoiceId) item.paid = value;
		});
		this.setInvoiceData();
	}

	updateInvoicePDF = (invoiceId, updateType, value) => {
		if (updateType==='delete' && !window.confirm('Are you sure to delete the invoice?')) { return; }
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateInvoice.php', dataType: 'json', data: {invoiceId, updateType, value},
			success: (res) => {
				this.props.setLoading(false);
				if (res.success) this.props.callInvoiceAPI();
				else {window.alert('Failed to update the invoice info!')}
			}
		});
	}

	updateTechnicalPDF = (technicalId, updateType, value) => {
		if (updateType==='delete' && !window.confirm('Are you sure to delete the technical pdf?')) { return; }
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateTechnical.php', dataType: 'json', data: {technicalId, updateType, value},
			success: (res) => {
				this.props.setLoading(false);
				if (res.success) this.props.callTechnicalAPI();
				else {window.alert('Failed to update the technical pdf!')}
			}
		});
	}

	submitInvoiceStatus = () => {
		const statusArr = [], {customerInfo, selSystemId} = this.state;
		this.selInvoiceArr.forEach(item => { statusArr.push({id:item.id, paid:item.paid}) });
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateInvoiceStatus.php', dataType: 'json', data: {statusArr},
			success: (res) => {
				this.props.setLoading(false);
				if (res.success) this.props.callInvoiceAPI();
				else {window.alert('Failed to update the invoice info!')}
			}
		});
		const selSystem = this.systemArr.find(item=>{return item.id===selSystemId});
		const mailStr = `<p>Hello ${customerInfo.name}</p></br><p>The invoice status of '${selSystem.name}' system was updated.</p>`;
		SendEmail(customerInfo.email, false, 'Updated Invoice status of '+selSystem.name+' system', mailStr);
	}

	setTicketArr = () => {
		this.ticketArr.forEach(ticket => {
			const empInfo = this.teamArr.find(emp=>{return emp.id===ticket.employeeId});
			if (empInfo) ticket.employee = empInfo.first + ' ' + empInfo.last;
		});
	}

	getFirstIdx = (selSystem) => {
		const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport } = selSystem;
		var firstIdx = 0;
		if 		(roleVoltaic) firstIdx = 0;
		else if (rolePump) firstIdx = 1;
		else if (roleStorage) firstIdx = 2;
		else if (roleCharge) firstIdx = 3;
		else if (roleCarport) firstIdx = 4;
		return firstIdx;
	}

	setSelSystemId = () => {
		const {selSystemId} = this.state;
		const selSystem = this.systemArr.find(item=>{return item.id===selSystemId}) || {};

		const {id, name, number, location, street, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, moduleInfo, status} = selSystem;
		this.moduleInfo = moduleInfo || {};
		this.moduleOldStr = JSON.stringify(this.moduleInfo);
		const ticketData = this.ticketArr.filter(item=>{return item.systemId===selSystemId});
		const statusTop = statusPos[status] * 487/860 - 8;
		if (this.timelineRef && this.timelineRef.current) {
			this.timelineRef.current.scrollTo({top:Math.max(0, statusTop - 100)});
		}
		this.setState({systemName:name, systemNum:number, systemLocation:location, systemStreet:street, systemStatus:status, statusTop, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, nextPage:false, ticketData});
		this.selInvoiceArr = this.invoiceArr.filter(item=>{return item.systemId===selSystemId});
		this.selTechnicalArr = this.technicalArr.filter(item=>{return item.systemId===selSystemId});
		this.setInvoiceData();
		this.setTechnicalData();
		this.props.setDetailChange(false);
		this.setIconIdx(this.getFirstIdx(selSystem));
	}

	changeSystemStatus = (systemStatus) => {
		this.props.setDetailChange(true);
		this.setState({systemStatus});
	}

	setIconIdx = (iconIdx) => {
		const iconKey = customerDetailMenu[iconIdx].key;
		const selIconInfo = this.moduleInfo[iconKey] || {build:[], mat:[]};
		const {build, mat} = selIconInfo;
		this.setState({iconIdx, build, mat});
	}

	onClickMenu = (iconKey) => {
		const {build, mat} = this.state.moduleInfo[iconKey];
		this.setState({iconKey, build, mat});
	}

	onClickCheck = (idx, value, sideKey) => {
		if (this.state.loginType!=='employee') return;
		const iconKey = customerDetailMenu[this.state.iconIdx].key;
		const selArr = [...this.moduleInfo[iconKey][sideKey]];
		selArr[idx].value = value==='check'?'uncheck':'check';
		this.moduleInfo[iconKey][sideKey] = selArr;
		const {build, mat} = this.moduleInfo[iconKey];
		const change = JSON.stringify(this.moduleInfo) !== this.moduleOldStr;
		this.props.setDetailChange(change);
		this.setState({build, mat, change});
	}

	onClickTicketCheck = (idx) => {
		var {ticketData} = this.state;
		ticketData[idx].check = !ticketData[idx].check;
		this.setState({ticketData});
	}

	onChangeTime = (idx, selectVal, sideKey, timeKey) => {
		const iconKey = customerDetailMenu[this.state.iconIdx].key;
		const selArr = [...this.moduleInfo[iconKey][sideKey]];
		selArr[idx][timeKey] = selectVal;
		this.moduleInfo[iconKey][sideKey] = selArr;
		const {build, mat} = this.moduleInfo[iconKey];
		const change = JSON.stringify(this.moduleInfo) !== this.moduleOldStr;
		this.props.setDetailChange(change);
		this.setState({build, mat, change});
	}

	getWorkerName = (workerId) => {
		const selWorker = this.workerArr.find(item=>item.id===workerId);
		if (selWorker) return selWorker.name;
		else return 'Select Servicepartner';
	}

	checkDetailChange = (name, value) => {
		if (this.state.detailChange) {
			this.setState({nextPage:{name, value}})
			this.props.checkDetailChange();
		} else {
			this.processOrder(name, value);
		}
	}

	processOrder = (name, value) => {
		if (name==='selectSystem') this.props.setSelSystemId(value);
		else if (name==='tabKey') this.setState({tabKey:value});
		else if (name==='openProfile') this.props.openProfileCustomer(value);
	}

	submitData = () => {
		const {tabKey, selSystemId, detailChange, systemStatus, customerInfo} = this.state;
		if (!detailChange) return;
		var apiName, updateData,  lastUpdate = '';
		if (tabKey !== 'status') return;
		const selSystem = this.systemArr.find(item=>{return item.id===selSystemId});
		if (!selSystem || !selSystem.id) return;
		updateData = {id:selSystem.id, status:systemStatus}; apiName = 'updateSystem';
		const oldInfo = JSON.parse(this.moduleOldStr), updateArr = [];
		if (selSystem.status !== systemStatus) {
			updateArr.push({id:selSystem.id, title:selSystem.name, message: 'Updated system status', type:'changeCheck'});
			this.systemArr.forEach(system => {
				if (system.id !== selSystemId) return;
				system.status = systemStatus;
			});
		}
		['voltaic', 'pump', 'storage', 'charge', 'carport'].forEach(mainKey => {
			const moduleItem = this.moduleInfo[mainKey];
			['Build', 'Mat'].forEach(subStr => {
				const subKey = subStr.toLowerCase()
				const subPart = moduleItem[subKey];
				var checkStr = '';
				subPart.forEach((item, idx) => {
					if (idx > 0) checkStr += ',' ;
					checkStr += item.value;
					checkStr += '*';

					if (item.time && item.date && item.hour && item.min) {
						const yearNum = item.date.getFullYear(), monthNum = item.date.getMonth() + 1, dateNum = item.date.getDate();
						const monthStr = monthNum < 10?'0'+monthNum.toString():monthNum.toString(),
								dateStr = dateNum < 10?'0'+dateNum.toString():dateNum.toString();
						checkStr += yearNum.toString()+'-' + monthStr + '-' + dateStr +'_'+item.hour+':'+item.min;
						if (item.worker) checkStr += '_'+item.worker;
					} else checkStr += ' ';
					checkStr += '*';
					if (item.img) checkStr += item.img;

					const oldItem = oldInfo[mainKey][subKey][idx];
					if (item.value !== oldItem.value) {
						if (item.value==='check' && oldItem.value!=='check') {
							// const changeStr = item.value==='check'?'was delivered!':'was undelivered!'
							const selModule = customerDetailMenu.find(mItem=>{return mItem.key===mainKey});
							const endStr = subStr==='Build'?' wurde abgeschlossen!':' wurde geliefert!';
							updateArr.push({id:selSystem.id, title:selSystem.name, message: selModule.label + ' : ' + item.label + endStr, type:'changeCheck'});
							const selPart = customerDetailMenu.find(partItem=>{return partItem.key===mainKey});
							const subLabel = subStr==='Mat'?'Material':'Bau';
							lastUpdate = selPart.label+' '+subLabel+': '+item.label;
						}
					}
				});
				updateData[mainKey+subStr] = checkStr;
			});
		});
		updateArr.forEach(item => {
			jQuery.ajax({ type: "POST", url: apiUrl+'update_data/sendPushNote.php', dataType: 'json', data: item,
				success: (res) => {}
			});
		});
		updateData.lastUpdate = lastUpdate;
		if (apiName && updateData) { this.callAPI(apiName, updateData); }
		const mailStr = `<p>Hello ${customerInfo.name}</p></br><p>'${selSystem.name}' system status updated.</p>`;
		SendEmail(customerInfo.email, false, 'Updated '+selSystem.name+' status', mailStr);
	}

	callAPI = (apiName, updateData) => {
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/'+apiName+'.php', dataType: 'json', data: updateData,
			success: (res) => {
				this.props.setLoading(false);
				const {success, error} = res;
				if (success) {
					this.setState({nextPage:false});
					this.props.setDetailChange(false);
				} else {
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	setArrow = (itemKey, arrowKey) => {
		this.ticketArr.sort(function(a, b) {
			const nameA = a[itemKey].toUpperCase(); // ignore upper and lowercase
			const nameB = b[itemKey].toUpperCase(); // ignore upper and lowercase
			if (nameA > nameB) { return arrowKey==='up'?-1:1; }
			if (nameA < nameB) { return arrowKey==='up'?1:-1; }
			return 0;
		});
		const ticketData = this.ticketArr.filter(item=>{return item.systemId===this.state.selSystemId});
		this.setState({ticketData});
	}

	onClickTicket = (ticketId) => {
		this.props.openDetailTicket(ticketId);
	}

	setCheckImg = (imageName) => {
		const {imgType, imgIdx, selSystemId, iconIdx} = this.state;
		const iconKey = customerDetailMenu[iconIdx].key;
		if (!iconKey || !imgType || !this.moduleInfo[iconKey] || !this.moduleInfo[iconKey][imgType]) return;
		const selArr = [...this.moduleInfo[iconKey][imgType]];
		selArr[imgIdx].img = imageName;
		this.moduleInfo[iconKey][imgType] = selArr;
		const {build, mat} = this.moduleInfo[iconKey];
		const change = JSON.stringify(this.moduleInfo) !== this.moduleOldStr;
		this.props.setDetailChange(change);
		this.setState({build, mat, change});
	}

	openImageModal = (type, idx, img) => {
		this.setState({imgType:type, imgIdx:idx});
		this.props.openImageResize(img);
	}

	downloadPDF = () => {
		const {first, last} = this.state.customerInfo;
		const firstSystem = this.selSystemArr[0];
		if (!firstSystem) {
			window.alert('Bitte zuerst Anlage erstellen.');
			return;
		}
		// const pdfName = firstSystem?firstSystem.name:first+'_'+last;
		const pdfUrl = apiUrl+'other/mail_pdf/'+firstSystem.name+'_App-Zugang.pdf';
		window.open(pdfUrl, '_blank');
	}

	openWorkerModal = (idx, sideKey, workerId) => {
		this.setState({modalWorkerOut:{idx, sideKey}, selWorker:workerId}, () => this.setState({modalWorkerIn:true}))
	}

	render() {
		const {detailCustom, loginType, nonSystemId, customerInfo, selSystemId, statusTop, tabKey, iconIdx, systemName, systemNum, systemLocation, systemStreet, systemStatus, build, mat, detailChange, ticketData, invoiceData, invoiceSearch, technicalData, technicalSearch, modalWorkerOut, modalWorkerIn, selWorker} = this.state;
		return (
			<div className={`detail-content ${(detailCustom || nonSystemId)?'active':''} ${loginType} content-detailCustomer`}>
				<div className='avatar-area'>
					<div className='image-part flex'>
						<img src={imgAvatarBig} alt=''></img>
					</div>
					<div className='info-part'>
						<div className='top-part'>
							<div className='label-part'>
								<div className='title'>Kunde:</div>
								<div className='description'>
									{customerInfo.company && <div>{customerInfo.company}</div>}
									<div>{customerInfo.name}</div>
									<div>{customerInfo.street}</div>
									<div>{customerInfo.location}</div>
									<div>CH</div>
								</div>
							</div>
							<div className='button-part'>
								<div className='label-wrapper'>
									<div className='label'>Letzter Login : {customerInfo.loginTime}</div>
								</div>
								<div className='button-wrapper'>
									<div className='button empty-back edit-button' onClick={e=>{ this.checkDetailChange('openProfile', false); }} >
										<div className='button-row'>
											<Icon img={imgPenEditRed}></Icon>
											<label>Daten bearbeiten</label>
										</div>
									</div>
									<div className='button empty-back' onClick={e=>this.downloadPDF()}>
										<div className='button-row'>
											<Icon img={imgDownload}></Icon>
											<label>Neukunden-PDF</label>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='bottom-part'>
							<div className='attach-item'>
								<label>Anlage:</label>
								<select value={selSystemId} disabled={false} onChange={e=>{ this.checkDetailChange('selectSystem', parseInt(e.target.value)); } }>
									{this.selSystemArr.map((item, idx) => 
										<option value={item.id} key={idx}>{item.name}</option>
									)}
								</select>
								<label className='project-status'>Status:</label>
								{loginType==='employee' &&
									<select value={systemStatus} onChange={e=>{ this.changeSystemStatus(parseInt(e.target.value)); } }>
										{projectStatusArr.map((item, idx) => 
											<option value={idx} key={idx}>{item}</option>
										)}
									</select>
								}
								{loginType==='customer' &&
									<div className='timeline-wrapper scroll scroll-y' ref={this.timelineRef}>
										<div className='timeline-inner'>
											<img src={imgTimeline}></img>
											<div className='time-point' style={{top:statusTop || 0, left:340*27.9/60-8}}></div>
										</div>
									</div>
								}
							</div>
							<div className='project-item'>
								<div className='project-column'>
									<div className='project-label'>Projektnummer: </div>
									<div className='project-value'>{systemNum} </div>
								</div>
								<div className='project-column'>
									<div className='project-label'>Projektadresse: </div>
									<div className='project-value'>
										<div>{systemStreet}</div>
										<div>{systemLocation}</div>
										<div>CH</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>

				<div className='tab-area'>
					{tabArr.map((item, idx) =>
						<div className={`button ${tabKey===item.key?'':'empty-back'}`} key={idx} onClick={e=>{ this.checkDetailChange('tabKey', item.key) }} >
							<div className='button-row'>
								<Icon img={tabKey===item.key?item.imgWhite:item.imgRed}></Icon>
								<label>{item.label}</label>
							</div>
						</div>
					)}
				</div>

				<div className='detail-area'>
					{tabKey==='status' &&
						<>
							<div className='left-buttons'>
								{customerDetailMenu.map((item, idx) => 
									<div className={`button expand ${idx===iconIdx?'':'disable point'} ${this.state[item.stateKey]?'':'hide'}`} onClick={e=>this.setIconIdx(idx)} key={idx}>
										<div className='button-row'>
											<Icon img={item.white}></Icon>
											<label>{item.label}</label>
										</div>
									</div>
								)}
								<div className='space'></div>
								<div className='button empty-back hide-customer'>
									<div className='button-row'>
										<Icon img={imgClock}></Icon>
										<label>Termine ändern</label>
									</div>
								</div>
							</div>
							<div className='right-table'>
								<div className='table-wrapper'>
									<div className='side-part'>
										<div className='side-header'>Bau</div>
										<div className='side-content scroll scroll-y'>
											{build.map((item, idx)=>
												<div className={`check-item  ${item.value}`} key={idx}>
													<div className='check-item-row'>
														<div className='check-box' onClick={e=>this.onClickCheck(idx, item.value, 'build')}>
															<img src={item.value==='check'?imgCheck:undefined} alt=''></img>
														</div>
														<div className='label'>{idx+1} {item.label}</div>
														<Icon img={item.img?serverUrl+'other/check_images/'+item.img+'.jpg' : imgEmptyCheck} onClickIcon={e=>this.openImageModal('build', idx, item.img)}></Icon>
													</div>
													{item.time &&
														<>
															<div className='check-item-row check-time-row'>
																<DatePicker
																	selected={item.date}
																	onChange={(date) => { this.onChangeTime(idx, date, 'build', 'date'); }}
																	disabled={item.value === 'check'}
																	dateFormat="dd/MM/yyyy"
																/>
																<select value={item.hour} onChange={e=>this.onChangeTime(idx, e.target.value, 'build', 'hour')} disabled={item.value === 'check'}>
																	{hourStrArr.map((item, hourIdx)=>
																		<option value={item.value} key={hourIdx}>{item.label}</option>
																	)}
																</select>
																:
																<select value={item.min} onChange={e=>this.onChangeTime(idx, e.target.value, 'build', 'min')} disabled={item.value === 'check'}>
																	{minStrArr.map((item, minIdx)=>
																		<option value={item.value} key={minIdx}>{item.label}</option>
																	)}
																</select>
																<Icon img={imgCalendar}></Icon>
															</div>
															<div className='check-item-row check-time-row' onClick={e=>this.openWorkerModal(idx, 'build', item.worker)}>
																<div className={`label worker-label ${item.worker?'':'hold'}`}>{this.getWorkerName(item.worker)}</div>
															</div>
														</>
													}
												</div>
											)}
										</div>
									</div>
									<div className='side-part'>
										<div className='side-header'>Material</div>
										<div className='side-content scroll scroll-y'>
											{mat.map((item, idx)=>
												<div className={`check-item ${item.value}`} key={idx}>
													<div className='check-item-row'>
														<div className='check-box' onClick={e=>this.onClickCheck(idx, item.value, 'mat')}>
															<img src={item.value==='check'?imgCheck:undefined} alt=''></img>
														</div>
														<div className='label'>{idx+1} {item.label}</div>
														<Icon img={item.img?serverUrl+'other/check_images/'+item.img+'.jpg' : imgEmptyCheck} onClickIcon={e=>this.openImageModal('mat', idx, item.img)}></Icon>
													</div>
													{item.time &&
														<>
															<div className='check-item-row check-time-row'>
																<DatePicker
																	selected={item.date}
																	onChange={(date) => { this.onChangeTime(idx, date, 'mat', 'date'); }}
																	disabled={item.value === 'check'}
																	dateFormat="dd/MM/yyyy"
																/>
																<select value={item.hour} onChange={e=>this.onChangeTime(idx, e.target.value, 'mat', 'hour')} disabled={item.value === 'check'}>
																	{hourStrArr.map((item, hourIdx)=>
																		<option value={item.value} key={hourIdx}>{item.label}</option>
																	)}
																</select>
																:
																<select value={item.min} onChange={e=>this.onChangeTime(idx, e.target.value, 'mat', 'min')} disabled={item.value === 'check'}>
																	{minStrArr.map((item, minIdx)=>
																		<option value={item.value} key={minIdx}>{item.label}</option>
																	)}
																</select>
																<Icon img={imgCalendar}></Icon>
															</div>
															<div className='check-item-row check-time-row' onClick={e=>this.openWorkerModal(idx, 'mat', item.worker)}>
																<div className={`label worker-label ${item.worker?'':'hold'}`}>{this.getWorkerName(item.worker)}</div>
															</div>
															{/* <div className='check-item-row check-time-row' onClick={e=>this.openWorkerModal(idx, 'mat', item.worker)}>
																<div className={`label worker-label ${item.worker?'':'hold'}`}>{this.getWorkerName(item.worker)}</div>
															</div> */}
														</>
													}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</>
					}
					{tabKey==='ticket' &&
						<>
							<div className='left-buttons' id='leftButtonsCustomerTicket'>
							</div>
							<div className='right-table'>
								<div className='table-wrapper table-filter table-ticket-wrapper' id='tableCustomerTicketWrapper'>
									<div className={`table-header ${GetScrollable('customerTicketTable')}`}>
										{thArrTicket0.map((item, idx) => 
											<ThOrder
												width={'calc('+item.width+'% - 25px)'}
												label={item.label}
												setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
												key={idx}
												flex1={item.flex1}
											></ThOrder>
										)}
									</div>
									<div className='table-content scroll scroll-y' id='customerTicketTable'>
										{ticketData.map((item, idx)=>
											<div className='table-row flex' key={idx}>
												{thArrTicket0.map((thItem, thIdx) =>
													<div className={`ticket-${thItem.key} ${thItem.flex1?'flex-1':''}`}
														style={{width:'calc('+thItem.width+'% - 25px)'}}
														key={thIdx}
													>
														{thIdx===0 &&
															<>
																<div className='check-item error'>
																	<div className='check-box' onClick={e=>this.onClickTicketCheck(idx)}>
																		<img src={item.check?imgCheckRed:undefined} alt=''></img>
																	</div>
																</div>
																<label className='red' onClick={e=>this.onClickTicket(item.id)} >{item[thItem.key]}</label> 
															</>
														}
														{thIdx !== 0 && thItem.key !== 'status' && item[thItem.key]}
														{thItem.key === 'status' && GetStatusLabel(item[thItem.key])}
													</div>
												)}
											</div>
										)}
										{ticketData.length===0 &&
											<div className='label empty-label'>There is not any data</div>
										}
									</div>
								</div>
							</div>
						</>
					}
					{tabKey==='bill' &&
						<div className='invoice-content-wrapper'>
							<div className='invoice-search-wrapper filter-wrapper'>
								<div className='filter-content flex'>
									<div className={`filter-item `} style={{width: 'calc('+324/11.6+'% - 1px)'}}>
										<input placeholder={'Suchen'} value={invoiceSearch} onChange={e=>this.onChangeInvoiceSearch(e.target.value)}></input>
									</div>
									<div className={`button expand`} onClick={e=>{ this.selectPDFFile('Invoice') }} >
										<div className='button-row'>
											<Icon img={imgUpload}></Icon>
											<label>Rechnung hochladen</label>
										</div>
									</div>
									<input type="file" id="pdfInvoiceFile" accept="application/pdf" onChange={e=>this.uploadPDFFile(e, 'Invoice')}/>
								</div>
							</div>
							<div className='table-wrapper table-filter'>
								<div className={`table-header ${GetScrollable('customerInvoiceTable')}`}>
									{thArrInvoice.map((item, idx) => 
										<ThOrder
											width={'calc('+item.width+'% - 25px)'}
											label={item.label}
											hideArrow={item.hideArrow}
											setArrow={arrowKey=>{this.setArrow(item.key, arrowKey, 'invoice')}}
											key={idx}
										></ThOrder>
									)}
								</div>
								<div className='table-content scroll scroll-y' id='customerInvoiceTable'>
										{invoiceData.map((item, idx)=>
											<div className='table-row flex' key={idx}>
												{thArrInvoice.map((thItem, thIdx) =>
													<div className={`invoice-${thItem.key} ${thItem.flex1?'flex-1':''}`}
														style={{width:'calc('+thItem.width+'% - 25px)'}}
														onClick={e=>{
															if (thItem.key==='name') this.openInvoicePDF(item.name);
														}}
														key={thIdx}
													>
														{thItem.key==='paid' &&
															<div className='check-item error' onClick={e=>{this.changeInvoiceStatus(item.id, !item.paid)}}>
																<div className='check-box'>
																	{item.paid && <img src={imgCheckGreen} alt=''></img>}
																</div>
															</div>
														}
														{thItem.key==='delete' &&
															<Icon img={imgDeleteBlack} onClickIcon={e=>{this.updateInvoicePDF(item.id, 'delete')}}></Icon>
														}
														{thItem.key !== 'paid' && thItem.key!=='delete' &&
															this.getInvoiceCellLabel(item, thItem.key)
														}
													</div>
												)}
											</div>
										)}
										{invoiceData.length===0 &&
											<div className='label empty-label'>There is not any data</div>
										}
									</div>
							</div>
						</div>
					}
					{tabKey==='technical' &&
						<div className='invoice-content-wrapper'>
							<div className='invoice-search-wrapper filter-wrapper'>
								<div className='filter-content flex'>
									<div className={`filter-item `} style={{width: 'calc('+324/11.6+'% - 1px)'}}>
										<input placeholder={'Suchen'} value={technicalSearch} onChange={e=>this.onChangeTechnicalSearch(e.target.value)}></input>
									</div>
									<div className={`button expand`} onClick={e=>{ this.selectPDFFile('Technical') }} >
										<div className='button-row'>
											<Icon img={imgUpload}></Icon>
											<label>PDF hochladen</label>
										</div>
									</div>
									<input type="file" id="pdfTechnicalFile" accept="application/pdf" onChange={e=>this.uploadPDFFile(e, 'Technical')}/>
								</div>
							</div>
							<div className='table-wrapper table-filter'>
								<div className={`table-header ${GetScrollable('customerTechnicalTable')}`}>
									{thArrTechnical.map((item, idx) => 
										<ThOrder
											width={'calc('+item.width+'% - 25px)'}
											label={item.label}
											hideArrow={item.hideArrow}
											setArrow={arrowKey=>{this.setArrow(item.key, arrowKey, 'technical')}}
											key={idx}
										></ThOrder>
									)}
								</div>
								<div className='table-content scroll scroll-y' id='customerTechnicalTable'>
										{technicalData.map((item, idx)=>
											<div className='table-row flex' key={idx}>
												{thArrTechnical.map((thItem, thIdx) =>
													<div className={`invoice-${thItem.key} ${thItem.flex1?'flex-1':''}`}
														style={{width:'calc('+thItem.width+'% - 25px)'}}
														onClick={e=>{
															if (thItem.key==='name') this.openTechnicalPDF(item.realName);
														}}
														key={thIdx}
													>
														{thItem.key==='delete' &&
															<Icon img={imgDeleteBlack} onClickIcon={e=>{this.updateTechnicalPDF(item.id, 'delete')}}></Icon>
														}
														{thItem.key!=='delete' &&
															this.getInvoiceCellLabel(item, thItem.key)
														}
													</div>
												)}
											</div>
										)}
										{technicalData.length===0 &&
											<div className='label empty-label'>There is not any data</div>
										}
									</div>
							</div>
						</div>
					}
				</div>
				<div className='button-footer'>
					<div className={`button ${(tabKey==='status'&&!detailChange)?'disable':''} hide-customer`} onClick={e=>{
						if (tabKey==='status') this.submitData();
						else if (tabKey==='bill') this.submitInvoiceStatus();
					}}>Bestätigen</div>
				</div>
				<WorkerSelect
					modalWorkerOut={modalWorkerOut}
					modalWorkerIn={modalWorkerIn}
					selWorker={selWorker}
					workerArr={this.workerArr}
					closeModal={key=>this.setState({[key]:false})}
					setWorker={workerId=>{
						const {idx, sideKey} = modalWorkerOut;
						this.onChangeTime(idx, workerId, sideKey, 'worker')
					}}
				></WorkerSelect>
			</div>
		);
	}
}
