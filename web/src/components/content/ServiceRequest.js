
import React from 'react';

import Filter from '../layout/Filter';

import ThOrder from '../layout/ThOrder';
import { GetScrollable, GetFilterArr, Icon, GetParseArr } from '../../data/common';
import { customerDetailMenu } from '../../data/constant';
import imgInfoRed from '../../assets/images/info-red.png';

const monthArr = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const tableW = 1257/100;
const filterArr = [
	{key:'customerName', label:'Kundenname', width:232/tableW},
	{key:'projectNum', label:'Firma', width:218/tableW},
	{key:'location', label:'Ortschaft', width:202/tableW, flex1:true},
	{key:'subLabel', label:'Anfrageart', width:308/tableW},
];
const otherThArr = [
	{key:'time', label:'Zeitpunkt', width:162/tableW},
	{key:'annotation', label:'Anmerkung', width:136/tableW},
]
const subCatKeyArr = [
	['module-clean', 'inverter-clean'],
	['blower-clean', 'temp-regulation'],
	['adjustment']
]
const subCatArr = [
	['Modulreinigung', 'Wechselrichterreinigung'],
	['Gebläsereinigung', 'Temperatureinregelung'],
	['Priorisierungsanpassung']
]

// {key:'capacity', label:'Kompetenzen', width:206/tableW},
// {key:'active', label:'Aktive Kunden', width:206/tableW},

const selectArr = [  ];
customerDetailMenu.forEach(item => {
	selectArr.push({...item, img:item.black});
});

export default class ServiceRequestContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, requestStr, customerStr, systemStr} = props;
		this.customerData = []; this.systemData = []; this.serviceArr = []; this.serviceSource = [];
		this.state = {pageKey, requestStr, customerStr, systemStr, serviceArr:[], customerName:'', projectNum:'', location:'', subLabel:''};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'requestStr', 'customerStr', 'systemStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					if (key==='requestStr' || key==='customerStr' || key==='systemStr') {
						if 		(key==='customerStr') this.customerData = GetParseArr(this.state[key]);
						else if (key==='systemStr') this.systemData = GetParseArr(this.state[key], ['id', 'customerId']);
						else if (key==='requestStr') this.serviceSource = GetParseArr(this.state[key], ['id', 'customerId', 'systemId', 'time']);
						this.setServiceData();
					}
				});
			}
		});
	}

	setServiceData = () => {
		if (!this.customerData.length || !this.systemData.length || !this.serviceSource.length) return;
		const serviceArr = [];
		this.serviceSource.forEach(item => {
			const selCustomer = this.customerData.find(customer=>{return customer.id===item.customerId});
			const selSystem = this.systemData.find(system=>{return system.id===item.systemId});
			const selModule = customerDetailMenu.find(module=>{return module.key===item.mainType}) || {};
			if (!selCustomer || !selSystem || !selModule) return;
			item.customerName = selCustomer.name;
			item.projectNum = selSystem.number;
			item.location = selSystem.location;
			const dateInfo = new Date(item.time * 1000);
			item.time = dateInfo.getDay() + '/' + monthArr[dateInfo.getMonth()] + '/' + dateInfo.getFullYear();
			item.moduleImg = selModule.black;
			item.mainLabel = selModule.label;
			subCatKeyArr.forEach((keyRow, rowIdx) => {
				keyRow.forEach((key, keyIdx) => {
					if (item.subType===key) item.subLabel = subCatArr[rowIdx][keyIdx];
				});
			});
			serviceArr.push({...item});
		});
		this.serviceArr = [...serviceArr];
		this.setState({serviceArr:[...this.serviceArr]});
	}

	filterSource = () => {
		this.setState({serviceArr:GetFilterArr(this.serviceArr, filterArr, [], this.state)});
	}

	changeFilterStr = (filterKey, str) => {
		this.setState({[filterKey]:str}, () => { this.filterSource(); });
	}

	changeFilterIcon = (iconKey, value) => {
		this.setState({[iconKey]:value}, () => { this.filterSource(); });
	}

	setArrow = (itemKey, arrowKey) => {
		this.serviceArr.sort(function(a, b) {
			const nameA = a[itemKey].toUpperCase();
			const nameB = b[itemKey].toUpperCase();
			if (nameA > nameB) { return arrowKey==='up'?-1:1; }
			if (nameA < nameB) { return arrowKey==='up'?1:-1; }
			return 0;
		});
		this.filterSource();
	}

	render() {
		const {pageKey, serviceArr, customerName, projectNum, location, subLabel, pump, storage, charge} = this.state;
		return (
			<div className={`main-content ${pageKey==='serviceRequest'?'active':''} content-service`}>
				<Filter
					filterArr={filterArr}
					// selectArr={selectArr}
					customerName={customerName}
					projectNum={projectNum}
					location={location}
					subLabel={subLabel}
					changeFilterStr={this.changeFilterStr}
					changeFilterIcon={this.changeFilterIcon}
					space={(162+136)/tableW+'%'}
				></Filter>
				<div className='table-wrapper table-filter'>
					<div className={`table-header ${GetScrollable('serviceRequestTableContent')}`}>
						{filterArr.map((item, idx) => 
							<ThOrder
								width={'calc('+item.width+'% - 25px)'}
								label={item.label}
								setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
								key={idx}
								flex1={item.flex1}
							></ThOrder>
						)}
						{otherThArr.map((item, idx) => 
							<ThOrder
								width={'calc('+item.width+'% - 25px)'}
								label={item.label}
								setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
								key={idx}
								flex1={item.flex1}
								hideArrow={item.key==='annotation'}
							></ThOrder>
						)}
					</div>
					<div className='table-content scroll scroll-y' id='serviceRequestTableContent'>
						{serviceArr.map((item, idx)=>
							<div className='table-row flex' key={idx}>
								{filterArr.map((filterItem, filterIdx) =>
									<div className={`service-request-${filterItem.key} ${filterItem.flex1?'flex-1':''}`}
										style={{width:'calc('+filterItem.width+'% - 25px)' }}
										onClick={e=>{
											// if (filterIdx===0) this.props.openDetailService(item.id)
										}} key={filterIdx}>
										{filterItem.key==='subLabel' &&
											<Icon classStr='module-icon' img={item.moduleImg}></Icon>
										}
										{item[filterItem.key]}
									</div>
								)}
								{otherThArr.map((filterItem, filterIdx) =>
									<div className={`service-request-${filterItem.key} ${filterItem.key==='annotation'?'flex':''}`}
										style={{width:'calc('+filterItem.width+'% - 25px)' }} key={filterIdx}
										onClick={e=> {if (filterItem.key==='annotation') this.props.openServiceModal(item); } }>
										{filterItem.key==='annotation'?
											<Icon classStr='annotation-icon' img={imgInfoRed}></Icon>:
											item[filterItem.key]
										}
									</div>
								)}
							</div>
						)}
						{serviceArr.length===0 &&
							<div className='label empty-label'>There is not any data</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
