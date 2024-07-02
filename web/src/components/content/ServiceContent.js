
import React from 'react';

import Filter from '../layout/Filter';

import ThOrder from '../layout/ThOrder';
import { GetScrollable, GetFilterArr, Icon } from '../../data/common';
import { customerDetailMenu } from '../../data/constant';

const tableW = 1245/100;
const filterArr = [
	{key:'name', label:'Kundenname', width:343/tableW},
	{key:'company', label:'Firma', width:255/tableW},
	{key:'location', label:'Ortschaft', width:235/tableW, flex1:true},
]
// {key:'capacity', label:'Kompetenzen', width:206/tableW},
// {key:'active', label:'Aktive Kunden', width:206/tableW},

const selectArr = [  ];
customerDetailMenu.forEach(item => {
	selectArr.push({...item, img:item.black});
});

export default class ServiceContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, serviceStr} = props;
		this.serviceArr = JSON.parse(serviceStr);
		this.state = {pageKey, serviceStr, serviceArr:[...this.serviceArr], name:'', company:'', location:'', voltaic:true, pump:true, storage:true, charge:true};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'serviceStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='serviceStr') {
					this.serviceArr = JSON.parse(nextProps.serviceStr);
					this.setState({serviceArr:[...this.serviceArr]});
				}
			}
		});
	}

	filterSource = () => {
		this.setState({serviceArr:GetFilterArr(this.serviceArr, filterArr, selectArr, this.state)});
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
		const {pageKey, serviceArr, name, company, location, voltaic, pump, storage, charge} = this.state;
		return (
			<div className={`main-content ${pageKey==='service'?'active':''} content-service`}>
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
					changeFilterStr={this.changeFilterStr}
					changeFilterIcon={this.changeFilterIcon}
					space={196/tableW+'%'}
				></Filter>
				<div className='table-wrapper table-filter'>
					<div className={`table-header ${GetScrollable('serviceTableContent')}`}>
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
							width={'calc('+196/tableW+'% - 25px)'}
							label={'Aktive Kunden'}
							setArrow={arrowKey=>this.setArrow('active', arrowKey)}
							flex1={false}
						></ThOrder>
					</div>
					<div className='table-content scroll scroll-y' id='serviceTableContent'>
						{serviceArr.map((item, idx)=>
							<div className='table-row flex' key={idx}>
								{filterArr.map((filterItem, filterIdx) =>
									<div className={`service-${filterItem.key} ${filterItem.flex1?'flex-1':''}`}
										style={{width:'calc('+filterItem.width+'% - 25px)' }}
										onClick={e=>{
											if (filterIdx===0) this.props.openDetailService(item.id)
										}} key={filterIdx}>
										{item[filterItem.key]}
									</div>
								)}
								<div className='service-icons icons'>
									{selectArr.map((iconItem, iconIdx) => 
										<Icon img={iconItem.img} classStr={`${item[iconItem.stateKey]?'':'hide'}`} onClickIcon={e=>{}} key={iconIdx}></Icon>
									)}
								</div>
								<div className={`service-active`} style={{width:'calc('+196/tableW+'% - 25px)' }}>
									{item.active}
								</div>
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
