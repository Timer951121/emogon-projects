
import React from 'react';

import Filter from '../layout/Filter';

import ThOrder from '../layout/ThOrder';
import { GetScrollable, GetFilterArr, Icon, GetParseArr } from '../../data/common';
import { customerDetailMenu } from '../../data/constant';

const tableW = 938/100;
const filterArr = [
	{key:'name', label:'Name', width:257/tableW}, // name
	{key:'company', label:'Firmenname', width:190/tableW},
	{key:'location', label:'Ortschaft', width:175/tableW, flex1:true},
]
const selectArr = [  ];
customerDetailMenu.forEach(item => {
	selectArr.push({...item, img:item.black});
});

export default class ServiceWorkerContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, workerStr, companyStr} = props;
		this.workerArr = JSON.parse(workerStr);
		this.companyArr = JSON.parse(companyStr);
		this.workerSource = []; this.companySource = [];
		this.state = {pageKey, workerStr, companyStr, workerArr:[...this.workerArr], name:'', company:'', location:'', voltaic:true, pump:true, storage:true, charge:true, carport:true};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'workerStr', 'companyStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='workerStr') {
					this.workerSource = GetParseArr(nextProps.workerStr, ['id', 'companyId']);
					this.updateWorkerArr();
				} else if (key==='companyStr') {
					this.companySource = GetParseArr(nextProps.companyStr);
					this.updateWorkerArr();
				}
			}
		});
	}

	updateWorkerArr = () => {
		const workerData = [];
		this.workerSource.forEach(worker => {
			const selCompany = this.companySource.find(item=>item.id===worker.companyId) ||
							{roleVoltaic:true, rolePump:true, roleStorage:true, roleCharge:true, roleCarport:true, name:'Undefined Company'};
			const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, name} = selCompany;
			workerData.push({...worker, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, company:name});
		});
		this.workerArr = [...workerData];
		this.setState({workerArr:[...this.workerArr]});
		this.filterSource();
	}

	filterSource = () => {
		this.setState({workerArr:GetFilterArr(this.workerArr, filterArr, selectArr, this.state, true)});
	}

	changeFilterStr = (filterKey, str) => {
		this.setState({[filterKey]:str}, () => { this.filterSource(); });
	}

	changeFilterIcon = (iconKey, value) => {
		this.setState({[iconKey]:value}, () => { this.filterSource(); });
	}

	setArrow = (itemKey, arrowKey) => {
		this.workerArr.sort(function(a, b) {
			const nameA = a[itemKey].toUpperCase(); // ignore upper and lowercase
			const nameB = b[itemKey].toUpperCase(); // ignore upper and lowercase
			if (nameA > nameB) { return arrowKey==='up'?-1:1; }
			if (nameA < nameB) { return arrowKey==='up'?1:-1; }
			return 0;
		});
		this.filterSource();
	}

	render() {
		const {pageKey, workerArr, name, company, location, voltaic, pump, storage, charge, carport} = this.state;
		return (
			<div className={`main-content ${pageKey==='serviceWorker'?'active':''} content-serviceWorker`}>
				<Filter
					filterArr={filterArr}
					selectArr={selectArr}
					name={name}
					company={company}
					location={location}
					voltaic={voltaic}
					pump={pump}
					storage={storage}
					charge={charge}
					carport={carport}
					changeFilterStr={this.changeFilterStr}
					changeFilterIcon={this.changeFilterIcon}
					space={147/tableW+'%'}
				></Filter>
				<div className='table-wrapper table-filter'>
					<div className={`table-header ${GetScrollable('workerTableContent')}`}>
						{filterArr.map((item, idx) => 
							<ThOrder
								width={'calc('+item.width+'% - 25px)'}
								label={item.label}
								setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
								key={idx}
								flex1={item.flex1}
							></ThOrder>
						)}
						<div className='header-item icons'>Kompetenzen</div>
						<ThOrder
							width={'calc('+147/tableW+'% - 25px)'}
							label={'Aktive Kunden'}
							hideArrow={true}
						></ThOrder>
					</div>
					<div className='table-content scroll scroll-y' id='workerTableContent'>
						{workerArr.map((item, idx)=>
							<TableRow rowInfo={item} openDetailWorker={e=>this.props.openDetailWorker(item.id)} key={idx}></TableRow>
						)}
						{workerArr.length===0 &&
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
					<div className={`worker-${filterItem.key} ${filterItem.flex1?'flex-1':''}  ${filterItem.key==='name'?'click-userName':''}`}
						style={{width:'calc('+filterItem.width+'% - 25px)' }}
						onClick={e=>{
							if (filterIdx===0) {
								this.props.openDetailWorker();
							}
						}} key={filterIdx}>
						{rowInfo[filterItem.key]}
					</div>
				)}
				<div className='custom-icons icons'>
					{selectArr.map((iconItem, iconIdx) => 
						<Icon img={iconItem.img} classStr={`${rowInfo[iconItem.stateKey]?'':'hide'}`} onClickIcon={e=>{}} key={iconIdx}></Icon>
					)}
				</div>
				<div className={`custom-activeWorker`} style={{width:'calc('+147/tableW+'% - 25px)' }}>
					{rowInfo.customerCount}
				</div>
			</div>
		);
	}
}