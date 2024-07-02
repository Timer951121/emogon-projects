
import React from 'react';

import Filter from '../layout/Filter';

import imgEmail from '../../assets/images/mail-red.png';
import imgPenEdit from '../../assets/images/pen-edit-red.png';
import ThOrder from '../layout/ThOrder';
import { GetFilterArr, GetScrollable, Icon } from '../../data/common';
import { roleMemberArr } from '../../data/constant';

const tableW = (1072+48)/100;
const filterArr = [
	{key:'name', label:'Name', width:195/tableW},
	{key:'memberId', label:'Mitarbeiter ID', width:180/tableW},
	{key:'depart', label:'Abteilung', width:145/tableW},
	{key:'branch', label:'Niederlassung', width:157/tableW},
	{key:'email', label:'E-Mail', width:244/tableW, flex1:true},
]

export default class TeamContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, teamStr, branchStr, departStr} = props, branchArr = JSON.parse(branchStr), departArr = JSON.parse(departStr);
		this.teamArr = JSON.parse(teamStr);
		this.state = {pageKey, teamStr, teamArr:[...this.teamArr], name:'', memberId:'', depart:'', branch:'', email:'', face:true, shield:true, star:true, branchStr, departStr, branchArr, departArr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'teamStr', 'branchStr', 'departStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='teamStr') {
					this.teamArr = JSON.parse(nextProps.teamStr);
					this.setState({teamArr:[...this.teamArr]}, () => {
					});
				} else if (key==='branchStr') {
					this.setState({branchArr:JSON.parse(nextProps.branchStr)});
				} else if (key==='departStr') {
					this.setState({departArr:JSON.parse(nextProps.departStr)});
				}
			}
		});
	}
	filterSource = () => {
		this.setState({teamArr:GetFilterArr(this.teamArr, filterArr, roleMemberArr, this.state)});
	}

	changeFilterStr = (filterKey, str) => {
		this.setState({[filterKey]:str}, () => { this.filterSource(); });
	}

	changeFilterIcon = (iconKey, value) => {
		this.setState({[iconKey]:value}, () => { this.filterSource(); });
	}

	setArrow = (itemKey, arrowKey) => {
		this.teamArr.sort(function(a, b) {
			const nameA = a[itemKey].toUpperCase();
			const nameB = b[itemKey].toUpperCase();
			if (nameA > nameB) { return arrowKey==='up'?-1:1; }
			if (nameA < nameB) { return arrowKey==='up'?1:-1; }
			return 0;
		});
		this.filterSource();
	}

	getTableData = (key, item) => {
		const {branchArr, departArr} = this.state, itemValue = item[key];
		if (key==='depart') {
			const selDepart = departArr.find(depart=>{return depart.id===itemValue});
			if (!selDepart) {
				console.log(departArr.length);
				console.log(departArr);
			}
			return selDepart?selDepart.label:'';
		} else if (key==='branch') {
			const selBranch = branchArr.find(branch=>{return branch.id===itemValue});
			return selBranch?selBranch.label:'';
		} else return itemValue;
	}

	render() {
		const {pageKey, teamArr, name, memberId, depart, branch, email, face, shield, star} = this.state;
		return (
			<div className={`main-content ${pageKey==='team'?'active':''} content-team`}>
				<Filter
					filterArr={filterArr}
					selectArr={roleMemberArr}
					name={name}
					memberId={memberId}
					depart={depart}
					branch={branch}
					email={email}
					face={face}
					shield={shield}
					star={star}
					space={'110px'}
					changeFilterStr={this.changeFilterStr}
					changeFilterIcon={this.changeFilterIcon}
				></Filter>
				<div className='table-wrapper table-filter'>
					<div className={`table-header ${GetScrollable('teamTableContent')}`}>
						{filterArr.map((item, idx) => 
							<ThOrder
								width={'calc('+item.width+'% - 25px)'}
								label={item.label}
								setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
								key={idx}
								flex1={item.flex1}
							></ThOrder>
						)}
						<div className='icons'>Info</div>
						<div className='end-icon icon'></div>
						<div className='end-icon icon'></div>
					</div>
					<div className='table-content scroll scroll-y' id='teamTableContent'>
						{teamArr.map((item, idx)=>
							<div className='table-row flex' key={idx}>
								{filterArr.map((filterItem, filterIdx) =>
									<div className={`team-${filterItem.key} ${filterItem.flex1?'flex-1':''}`} style={{width:'calc('+filterItem.width+'% - 25px)' }} key={filterIdx}
										onClick={e=>{
											if (filterIdx===0) this.props.openProfileMember(item)
										}}
									>
										{this.getTableData(filterItem.key, item)}
									</div>
								)}
								<div className='team-icons icons'>
									{roleMemberArr.map((roleItem, iconIdx) => 
										<Icon img={roleItem.img} classStr={`${item[roleItem.stateKey]?'':'hide'}`} key={iconIdx}></Icon>
										// <div className={`icon ${item[roleItem.stateKey]?'':'hide'}`} key={iconIdx}>
										// 	<img src={roleItem.img} alt=''></img>
										// </div>
									)}
								</div>
								<div className='end-icon end-email icon'>
									<img src={imgEmail} alt=''></img>
								</div>
								<div className='end-icon end-edit icon'>
									<img src={imgPenEdit} alt=''></img>
								</div>
							</div>
						)}
						{teamArr.length===0 &&
							<div className='label empty-label'>There is not any data</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
