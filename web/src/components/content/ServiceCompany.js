
import React from 'react';

import Filter from '../layout/Filter';

import ThOrder from '../layout/ThOrder';
import { GetScrollable, GetFilterArr, Icon, GetParseArr } from '../../data/common';
import { customerDetailMenu } from '../../data/constant';

const tableW = 730/100;
const filterArr = [
	{key:'name', label:'Firma', width:250/tableW}, // name
	{key:'location', label:'Ortschaft', width:175/tableW},
]
const selectArr = [  ];
customerDetailMenu.forEach(item => {
	selectArr.push({...item, img:item.black});
});

export default class ServiceCompanyContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, companyStr} = props;
		this.companyArr = GetParseArr(companyStr, ['id', 'empCount']);
		this.state = {pageKey, companyArr:[...this.companyArr], companyStr, name:'', company:'', location:'', voltaic:true, pump:true, storage:true, charge:true, carport:true};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'companyStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='companyStr') {
					this.companyArr = GetParseArr(nextProps.companyStr, ['id', 'empCount']);
					this.filterSource();
				}
			}
		});
	}

	filterSource = () => {
		this.setState({companyArr:GetFilterArr(this.companyArr, filterArr, selectArr, this.state, true)});
	}

	changeFilterStr = (filterKey, str) => {
		this.setState({[filterKey]:str}, () => { this.filterSource(); });
	}

	changeFilterIcon = (iconKey, value) => {
		this.setState({[iconKey]:value}, () => { this.filterSource(); });
	}

	setArrow = (itemKey, arrowKey) => {
		this.companyArr.sort(function(a, b) {
			const nameA = a[itemKey].toUpperCase(); // ignore upper and lowercase
			const nameB = b[itemKey].toUpperCase(); // ignore upper and lowercase
			if (nameA > nameB) { return arrowKey==='up'?-1:1; }
			if (nameA < nameB) { return arrowKey==='up'?1:-1; }
			return 0;
		});
		this.filterSource();
	}

	render() {
		const {pageKey, companyArr, name, company, location, voltaic, pump, storage, charge, carport} = this.state;
		return (
			<div className={`main-content ${pageKey==='serviceCompany'?'active':''} content-serviceCompany`}>
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
					<div className={`table-header ${GetScrollable('companyTableContent')}`}>
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
							width={'calc('+136/tableW+'% - 25px)'}
							label={'Mitarbeiter'}
							flex1={true}
							hideArrow={true}
						></ThOrder>
					</div>
					<div className='table-content scroll scroll-y' id='companyTableContent'>
						{companyArr.map((item, idx)=>
							<TableRow rowInfo={item} openDetailCompany={e=>this.props.openDetailCompany(item.id)} key={idx}></TableRow>
						)}
						{companyArr.length===0 &&
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
					<div className={`company-${filterItem.key} ${filterItem.flex1?'flex-1':''}`}
						style={{width:'calc('+filterItem.width+'% - 25px)' }}
						onClick={e=>{
							// if (filterIdx===0) { this.props.openDetailCompany(); }
						}} key={filterIdx}>
						{rowInfo[filterItem.key]}
					</div>
				)}
				<div className='custom-icons icons'>
					{selectArr.map((iconItem, iconIdx) => 
						<Icon img={iconItem.img} classStr={`${rowInfo[iconItem.stateKey]?'':'hide'}`} onClickIcon={e=>{}} key={iconIdx}></Icon>
					)}
				</div>
				<div className={`custom-activeWorker flex-1`} style={{width:'calc('+136/tableW+'% - 25px)' }}>
					{rowInfo.empCount}
				</div>
			</div>
		);
	}
}