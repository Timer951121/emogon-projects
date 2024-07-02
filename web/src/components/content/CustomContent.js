
import React from 'react';

import Filter from '../layout/Filter';

import ThOrder from '../layout/ThOrder';
import { GetScrollable, GetFilterArr, Icon } from '../../data/common';
import { roleCustomerArr } from '../../data/constant';

const tableW = 1092/100;
const filterArr = [
	{key:'customerName', label:'Kundenname', width:258/tableW}, // name
	{key:'number', label:'Projektnummer', width:190/tableW}, // systemName
	{key:'street', label:'Straße', width:256/tableW, flex1:true},
	{key:'location', label:'Ortschaft', width:206/tableW},
]
const selectArr = [  ];
roleCustomerArr.forEach(item => {
	selectArr.push({...item, img:item.black});
});

export default class CustomContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, customerStr, systemStr} = props;
		this.customData = JSON.parse(customerStr);
		// this.systemData = JSON.parse(systemStr);
		this.systemArr = JSON.parse(systemStr);
		this.state = {pageKey, customerStr, systemStr, systemArr:[...this.systemArr], customerName:'', number:'', street:'', location:'', face:true, voltaic:true, pump:true, storage:true, charge:true, carport:true};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'customerStr', 'systemStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='customerStr') {
					this.customData = JSON.parse(nextProps.customerStr);
					this.updateSystemArr();
				} else if (key==='systemStr') {
					this.systemSource = JSON.parse(nextProps.systemStr);
					this.updateSystemArr();
				}
			}
		});
	}

	updateSystemArr = () => {
		const systemData = [], nonSystemData = [];
		this.systemSource.forEach(system => {
			const customerInfo = this.customData.find(custom=> {return custom.id===parseInt(system.customerId)} )
			if (!customerInfo) return;
			system.customerName = customerInfo.name;
			systemData.push(system);
		});
		this.customData.forEach(custom => {
			const selSystem = this.systemSource.find(system=>{return system.customerId===custom.id})
			if (!selSystem) {
				const {id, name} = custom;
				nonSystemData.push({customerId:id, customerName:name, id:undefined});
			}
		});
		this.systemArr = [...systemData, ...nonSystemData];
		this.setState({systemArr:[...this.systemArr]});
	}

	filterSource = () => {
		this.setState({systemArr:GetFilterArr(this.systemArr, filterArr, selectArr, this.state)});
	}

	changeFilterStr = (filterKey, str) => {
		this.setState({[filterKey]:str}, () => { this.filterSource(); });
	}

	changeFilterIcon = (iconKey, value) => {
		this.setState({[iconKey]:value}, () => { this.filterSource(); });
	}

	setArrow = (itemKey, arrowKey) => {
		this.systemArr.sort(function(a, b) {
			const nameA = a[itemKey].toUpperCase(); // ignore upper and lowercase
			const nameB = b[itemKey].toUpperCase(); // ignore upper and lowercase
			if (nameA > nameB) { return arrowKey==='up'?-1:1; }
			if (nameA < nameB) { return arrowKey==='up'?1:-1; }
			return 0;
		});
		this.filterSource();
	}

	onClickCustomer = (customer) => {
		this.props.openProfileCustomer(customer);
	}

	render() {
		const {pageKey, systemArr, customerName, number, street, location, face, voltaic, pump, storage, charge, carport} = this.state;
		return (
			<div className={`main-content ${pageKey==='customer'?'active':''} content-customer`}>
				<Filter
					filterArr={filterArr}
					selectArr={selectArr}
					customerName={customerName}
					number={number}
					street={street}
					location={location}
					face={face}
					voltaic={voltaic}
					pump={pump}
					storage={storage}
					charge={charge}
					carport={carport}
					changeFilterStr={this.changeFilterStr}
					changeFilterIcon={this.changeFilterIcon}
				></Filter>
				<div className='table-wrapper table-filter'>
					<div className={`table-header ${GetScrollable('customTableContent')}`}>
						{filterArr.map((item, idx) => 
							<ThOrder
								width={'calc('+item.width+'% - 25px)'}
								label={item.label}
								setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
								key={idx}
								flex1={item.flex1}
							></ThOrder>
						)}
						<div className='header-item icons'>Info</div>
					</div>
					<div className='table-content scroll scroll-y' id='customTableContent'>
						{systemArr.map((item, idx)=>
							<TableRow rowInfo={item} openDetailCustomer={e=>this.props.openDetailCustomer(item.id, item.id?undefined:item.customerId)} key={idx}></TableRow>
						)}
						{systemArr.length===0 &&
							<div className='label empty-label'>There is not any data</div>
						}
					</div>
				</div>
			</div>
		);
	}
}


class TableRow extends React.Component {
	constructor(props) {
		super(props);
		const {rowInfo} = props;
		this.state = {rowInfo};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['rowInfo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	render() {
		const {rowInfo} = this.state;
		return (
			<div className='table-row flex'>
				{filterArr.map((filterItem, filterIdx) =>
					<div className={`custom-${filterItem.key} ${filterItem.flex1?'flex-1':''} ${filterItem.key==='customerName'?'click-userName':''}`}
						style={{width:'calc('+filterItem.width+'% - 25px)' }}
						onClick={e=>{
							if (filterIdx===0) {
								this.props.openDetailCustomer();
							}
						}} key={filterIdx}> {/* this.onClickCustomer(item) , iconItem.key*/}
						{rowInfo[filterItem.key]}
					</div>
				)}
				<div className='custom-icons icons'>
					{selectArr.map((iconItem, iconIdx) => 
						<Icon img={iconItem.img} classStr={`${rowInfo[iconItem.stateKey]?'':'hide'}`} onClickIcon={e=>{}} key={iconIdx}></Icon>
					)}
				</div>
			</div>
		);
	}
}