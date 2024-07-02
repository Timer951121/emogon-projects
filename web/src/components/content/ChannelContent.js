
import React from 'react';
import imgMailRed from '../../assets/images/mail-red.png';
import { GetParseArr, GetParseDate, GetScrollable } from '../../data/common';

const sourceData = [
	{key:'mail0', time:'Vor 30 Min', sender:'ENERQ Team', title:'Neue Preisliste Wärmepumpen'},
]

export function GetEmpInfo(str) {
	const empInfo = JSON.parse(str);
	empInfo.id = parseInt(empInfo.id);
	return empInfo;
}

function GetChannelArr(channelStr, teamStr, empId) {
	const channelSource = {inArr:[], outArr:[]};
	if (teamStr==='[]' || channelStr==='[]') return channelSource;
	const channelArr = GetParseArr(channelStr, ['id', 'senderId', 'receiverId']);
	const employeeArr = GetParseArr(teamStr, ['id']);
	channelArr.forEach(channel => {
		const {senderId, receiverId} = channel;
		const sender = employeeArr.find(emp=>{return emp.id===senderId});
		const receiver = employeeArr.find(emp=>{return emp.id===receiverId});
		if (!sender || !receiver) return;
		if 		(empId===senderId) channelSource.outArr.push({...channel, empName:receiver.first+' '+receiver.last, type:'sender'});
		else if (empId===receiverId) channelSource.inArr.push({...channel, empName:sender.first+' '+sender.last, type:'receiver'});
	});
	return channelSource;
}

export default class ChannelContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, channelStr, empStr, teamStr} = props, selTab = 'in';
		this.empInfo = GetEmpInfo(empStr);
		const {inArr, outArr} = GetChannelArr(channelStr, teamStr, this.empInfo.id);
		this.inArr = inArr; this.outArr = outArr;
		this.state = {pageKey, channelStr, selTab, teamStr, channelArr:inArr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'empStr', 'channelStr', 'teamStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
			if (key==='empStr' || key==='channelStr') {
				if (key==='empStr') {
					this.empInfo = GetEmpInfo(nextProps.empStr);
					this.setChannelArr(this.state.channelStr);
				}
				else if (key==='channelStr') {
					this.setChannelArr(nextProps.channelStr);
				}
			}
		});
	}

	setChannelArr = (channelStr) => {
		const {teamStr, selTab} = this.state;
		if (teamStr==='[]' || channelStr==='[]') return;
		const {inArr, outArr} = GetChannelArr(channelStr, teamStr, this.empInfo.id);
		this.inArr = inArr; this.outArr = outArr;
		const channelArr = selTab==='in'?inArr:outArr;
		this.setState({channelArr});
	}

	onClickTab = (selTab) => {
		const channelArr = selTab==='in'?this.inArr:this.outArr;
		this.setState({selTab, channelArr});
	}

	onClickChannel = (channelId) => {
		this.props.openDetailChannel(channelId);
	}

	getTimeStr = (timeVal) => {
		if (!timeVal) return '';
		const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(timeVal);
		return dayNum+'. '+monthName+' '+yearNum+' '+hourStr+':'+minStr;
	}

	render() {
		const {pageKey, channelArr, selTab} = this.state;
		return (
			<div className={`main-content ${pageKey==='channel'?'active':''} content-mail`}>
				<div className='tab-wrapper'>
					<div className={`tab-item ${selTab==='in'?'active':''}`} onClick={e=>this.onClickTab('in')}>Inbox</div>
					<div className={`tab-item ${selTab==='out'?'active':''}`} onClick={e=>this.onClickTab('out')}>Outbox</div>
				</div>
				<div className='table-wrapper'>
					<div className={`table-header pink ${GetScrollable('mailTableContent')}`}>
						<div className='mail-time'>
							<img src={imgMailRed} alt=''></img>
							Datum
						</div>
						<div className='mail-sender'>{selTab==='in'?'Absender':'Empfänger'}</div>
						<div className='mail-title'>Betreff</div>
					</div>
					<div className='table-content scroll scroll-y' id='mailTableContent'>
						{channelArr.map((item, idx)=>
							<div className='table-row flex' key={idx} onClick={e=>this.onClickChannel(item.id)}>
								<div className='mail-time'>{this.getTimeStr(item.updateTime)}</div>
								<div className='mail-sender'>{item.empName}</div>
								<div className='mail-title red'>{item.title}</div>
							</div>
						)}
						{channelArr.length===0 &&
							<div className='label empty-label'>There is not any data</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
