
import React from 'react';

import ThOrder from '../layout/ThOrder';
import imgCheckRed from '../../assets/images/check-red.png';
import { GetParseArr, GetParseDate, GetScrollable, GetStatusLabel, thArrTicket } from '../../data/common';
import { monthArr } from '../../data/constant';


export default class TicketContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, customerStr, systemStr, ticketStr, teamStr, loginType, empStr} = props;
		this.customData = [];
		this.systemData = [];
		this.employeeData = [];
		this.ticketData = [];
		this.state = {pageKey, customerStr, systemStr, ticketData:[], ticketStr, teamStr, loginType, empStr, flagOpen:false, flagLogin:false};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'ticketStr', 'customerStr', 'systemStr', 'teamStr', 'loginType', 'empStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='ticketStr') {
					const keyArr = ['id', 'customerId', 'systemId', 'employeeId'];
					this.ticketData = GetParseArr(nextProps.ticketStr, keyArr); this.setTicketData();
				} else if (key==='customerStr') {
					this.customData = GetParseArr(nextProps.customerStr); this.setTicketData();
				} else if (key==='systemStr') {
					this.systemData = GetParseArr(nextProps.systemStr); this.setTicketData();
				} else if (key==='teamStr') {
					this.employeeData = GetParseArr(nextProps.teamStr); this.setTicketData();
				}
			}
		});
	}

	setFlagValue = (key) => {
		const oldValue = this.state[key];
		this.setState({[key]:!oldValue})
	}

	setTicketData = () => {
		const ticketData = [...this.ticketData], {flagOpen, flagLogin} = this.state;
		ticketData.forEach(ticket => {
			const {customerId, systemId, employeeId, time} = ticket;
			const selCustomer = this.customData.find(item=>{return item.id===customerId});
			const selSystem = this.systemData.find(item=>{return item.id===systemId});
			const selEmployee = this.employeeData.find(item=>{return item.id===employeeId});
			const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(ticket.createTime);
			ticket.customer = selCustomer?selCustomer.name:'';
			ticket.employee = selEmployee?selEmployee.name:'';
			ticket.update = dayNum+'/'+monthName + ' ' + hourStr+':'+minStr;
		});
		this.setState({ticketData});
	}

	getTicketData = () => {
		const {flagOpen, flagLogin, ticketData} = this.state, ticketArr = [];
		ticketData.forEach(ticket => {
			if (flagOpen && ticket.status !== 'new' && ticket.status !== 'client') return;
			if (flagLogin && !ticket.readTime) return;
			ticketArr.push(ticket);
		});
		return ticketArr;
	}

	setArrow = (itemKey, arrowKey) => {
	}

	onClickCheck = (idx, check) => {
		var {ticketData} = this.state;
		ticketData[idx].check = check;
		this.setState({ticketData});
	}

	onClickTicket = (id) => {
		this.props.openDetailTicket(id);
	}

	render() {
		const {pageKey, ticketData, flagOpen, flagLogin} = this.state;
		return (
			<div className={`main-content ${pageKey==='ticket'?'active':''} content-ticket`}>
				<div className='filter-bar'>
					<div className={`button ${flagOpen?'':'empty-back'}`} onClick={e=>this.setFlagValue('flagOpen')}>Offene Tickets</div>{/* <label className='strong'>5</label> */}
					<div className={`button ${flagLogin?'':'empty-back'}`} onClick={e=>this.setFlagValue('flagLogin')}>Meine Tickets</div>{/* <label className='strong'>2</label> */}
				</div>
				<div className='table-wrapper table-filter table-ticket-wrapper'>
					<div className={`table-header ${GetScrollable('ticketTableContent')}`}>
						{thArrTicket.map((item, idx) => 
							<ThOrder
								width={'calc('+item.width+'% - 25px)'}
								label={item.label}
								setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
								key={idx}
								checkbox={idx===0}
								flex1={item.flex1}
							></ThOrder>
						)}
					</div>
					<div className='table-content scroll scroll-y' id='ticketTableContent'>
						{this.getTicketData().map((item, idx)=>
							<div className='table-row flex' key={idx}>
								{thArrTicket.map((thItem, thIdx) =>
									<div className={`ticket-${thItem.key} ${thItem.flex1?'flex-1':''}`}
										style={{width:'calc('+thItem.width+'% - 25px)'}}
										key={thIdx}
									>
										{thItem.key==='number' &&
											<>
												<div className='check-item error'>
													<div className='check-box' onClick={e=>this.onClickCheck(idx, !item.check)}>
														<img src={item.check?imgCheckRed:undefined} alt=''></img>
													</div>
												</div>
												<label className='red' onClick={e=>this.onClickTicket(item.id)} >{item[thItem.key]}</label> 
											</>
										}
										{thItem.key==='status' && GetStatusLabel(item.status) }
										{thItem.key!=='number' && thItem.key!=='status' && item[thItem.key]}
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
		);
	}
}
