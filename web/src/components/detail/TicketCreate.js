
import React from 'react';
import jQuery from 'jquery';
import { Editor } from "@tinymce/tinymce-react";

import { apiUrl, serverUrl } from '../../data/config';
import { customerDetailMenu } from '../../data/constant';

import imgTicket from '../../assets/images/ticket-black.png';
import imgClose from '../../assets/images/close.png';
import { GetParseArr, Icon, SendEmail } from '../../data/common';

export default class TicketCreate extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, empStr, loginType, customerStr, systemStr, teamStr, ticketStr} = props;
		this.customData = [];
		this.systemData = [];
		this.ticketData = [];
		this.employeeData = [];
		this.state = {pageKey, empStr, loginType, customerStr, systemStr, teamStr, ticketStr, selCustomerId:0, systemArr:[], selSystemId:0, title:'', category:'', employeeId:0, description:''};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'empStr', 'loginType', 'customerStr', 'systemStr', 'teamStr', 'ticketStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='empStr' || key==='loginType') {
					this.empInfo = JSON.parse(nextProps.empStr);
				} else if (key==='customerStr') {
					const initCustom = this.customData.length === 0;
					this.customData = GetParseArr(nextProps.customerStr);
					if (initCustom && this.customData.length) {
						setTimeout(() => {
							const initCustomerId = this.state.loginType==='customer'?parseInt(this.empInfo.id):this.customData[0].id;
							this.selectCustomer(initCustomerId);
						}, 100);
					} 
				} else if (key==='systemStr') {
					this.systemData = GetParseArr(nextProps.systemStr);
				} else if (key==='teamStr') {
					const initTeam = this.employeeData.length === 0;
					this.employeeData = GetParseArr(nextProps.teamStr);
					if (initTeam && this.employeeData.length && this.state.loginType==='employee') {
						setTimeout(() => { this.selectEmployee(this.employeeData[0].id); }, 100);
					}
				} else if (key==='ticketStr') {
					this.ticketData = GetParseArr(nextProps.ticketStr, ['id', 'customerId', 'systemId', 'employeeId']);
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}
	
	checkDisableSubmit = () => {
		const {selCustomerId, selSystemId, category, title, employeeId, loginType, description} = this.state;
		return (!selCustomerId || !selSystemId || !category || !title || (loginType==='employee' && !employeeId) || !description);
	}

	callAPI = () => {
		if (this.checkDisableSubmit()) return;
		const {loginType, selCustomerId, selSystemId, category, title, employeeId, description} = this.state;
		const existTicket = this.ticketData.find(item=>{return item.customerId===selCustomerId && item.systemId===selSystemId && item.category===category && item.title===title});
		if (existTicket) {window.alert('Already existing the ticket'); return;}
		const apiName = 'updateTicket', time = Date.now(); // , ticketCount = this.ticketData.length;
		const selSystem = this.systemData.find(item=>{return item.id===selSystemId});
		var ticketNum = this.ticketData.length + 1, ticketNumStr = '';
		if 		(ticketNum < 10)	ticketNumStr = '00'+ticketNum;
		else if (ticketNum < 100)	ticketNumStr = '0'+ticketNum;
		else ticketNumStr = ticketNum;
		const status = loginType==='employee'?'employee':'client';
		const updateData = {loginType, customerId:selCustomerId, systemId:selSystemId, number:selSystem.number+ticketNumStr, category, title, employeeId, description, status, createTime:Math.round(time/1000)};

		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/'+apiName+'.php', dataType: 'json', data: updateData,
			success: (res) => {
				this.props.setLoading(false);
				const {success, error, maxId} = res;
				if (success) {
					this.props.callTicketAPI();
					this.setState({title:'', description:'', category:''});

					const selEmployee = this.employeeData.find(item=>item.id===employeeId);
					const selCustomer = this.customData.find(item=>item.id===selCustomerId);
					const mailContent = `<p>Hello, ${selCustomer.name}</p>. </br><p>${selEmployee.name} created new ticket as '${title}' on '${selSystem.name}' system.</p>`;
					SendEmail(selCustomer.email, false, 'Created new ticket on ENERQ', mailContent);
			
				} else {
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	selectCustomer = (selCustomerId) => {
		this.setState({selCustomerId});
		const systemArr = this.systemData.filter(item=>{return item.customerId===selCustomerId});
		this.setState({systemArr, selSystemId:systemArr[0].id})
	}

	selectSystem = (selSystemId) => {
		this.setState({selSystemId});
	}

	selectEmployee = (employeeId) => {
		this.setState({employeeId});
	}

	onChangeInput = (e, key) => {
		this.setState({[key]:e.target.value});
	}

	getFilterCustoms = () => {
		const filterArr = [];
		this.customData.forEach(customer => {
			const systems = this.systemData.filter(system=>{return system.customerId===customer.id});
			if (systems.length) filterArr.push(customer);
		});
		return filterArr;
	}

	render() {
		const {pageKey, loginType, selCustomerId, systemArr, selSystemId, category, title, employeeId, description} = this.state;
		return (
			<div className={`detail-content ${pageKey==='createTicket'?'active':''} content-ticketCreate content-ticket-create`}>
				<div className={`title-wrapper flex remove-margin`}>
					<div className='icon' onClick={e=>this.props.setPageKey('ticket')}>
						<img src={imgTicket} alt=''></img>
					</div>
					<div className='label' onClick={e=>this.props.setPageKey()}>Neues Ticket erstellen:</div>
					<div className='center-space'></div>
				</div>
				<div className='main-content-wrapper'>
					<div className='input-wrapper'>
						<div className='input-item'>
							<div className='input-label'>Kunde:</div>
							<select disabled={loginType==='customer'} value={selCustomerId} onChange={e=>{ this.selectCustomer(parseInt(e.target.value)); } }>
								{this.getFilterCustoms().map((item, idx) => 
									<option value={item.id} key={idx}>{item.name}</option>
								)}
							</select>
						</div>
						<div className='input-item'>
							<div className='input-label'>Anlage:</div>
							<select value={selSystemId} onChange={e=>{ this.selectSystem(parseInt(e.target.value)); } }>
								{systemArr.map((item, idx) => 
									<option value={item.id} key={idx}>{item.name}</option>
								)}
							</select>
						</div>
						<div className='input-item'>
							<div className='input-label'></div>
							<div className='system-icons'>
								{customerDetailMenu.map((item, idx)=>
									<Icon img={item.black} key={idx}></Icon>
								)}
							</div>
						</div>
						<div className='input-item'>
							<div className='input-label'>Kategorie:</div>
							<input className='' value={category} placeholder='Kategorie wählen' onChange={e=>this.onChangeInput(e, 'category')}></input>
						</div>
						<div className='input-item'>
							<div className='input-label'>Betreff:</div>
							<input className='' value={title} placeholder='Betreff eingeben' onChange={e=>this.onChangeInput(e, 'title')}></input>
						</div>
						<div className='input-item'>
							<div className='input-label'>Ticket-Owner:</div>
							<select value={employeeId} disabled={loginType==='customer'} placeholder={'Select employee'} onChange={e=>{ this.selectEmployee(parseInt(e.target.value)); } }>
								{this.employeeData.map((item, idx) =>
									<option value={item.id} key={idx}>{item.name}</option>
								)}
							</select>
						</div>
						<div className='input-item'>
							<div className='input-label'></div>
							<Editor
								apiKey="iine2xgymzj2z3u9crwbkd7ggbq7gu6dvz19dedaud379fxi" // y7gnmtbsaxnjbgh3405ioqbdm24eit5f0ovek49w8yvq5r9q
								// disabled={typeMain==='read'}
								// initialValue={oriDescription}
								value={description}
								init={{
									branding: false,
									width: 700,
									height: 250,
									menubar: false,
									plugins: "autolink link",
									toolbar: "bold italic underline link",
									image_advtab: false
								}}
								onEditorChange={(str) => { this.setState({description:str}); }}
							></Editor>
						</div>

						<div className='footer'>
							<div className='files'>
								{/* <div className='attach-titme'>Anhänge:</div>
								<div className='file-item'>
									<label>enerqrabattcoupon10.pdf</label>
									<Icon img={imgClose}></Icon>
								</div>
								<div className='file-item'>
									<label>beispielanhang.jpg</label>
									<Icon img={imgClose}></Icon>
								</div> */}
							</div>
							<div className={`button ${this.checkDisableSubmit()?'disable':''}`} onClick={e=>this.callAPI()}>
								Anlegen
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
}
