
import React from 'react';
import jQuery from 'jquery';

import { CheckEmail, GetMemberId, GetRoleStrMember, GetRoleIntMember, Icon } from '../../data/common';
import { apiUrl, serverUrl } from '../../data/config';
import { roleMemberArr } from '../../data/constant';
import imgAvatar from '../../assets/images/avatar-circle.png';
import imgPenEdit from '../../assets/images/pen-edit-red.png';
import imgDelete from '../../assets/images/delete.png';

const mainInputArr = [
	{key:'first', label:'Vorname'},
	{key:'last', label:'Nachname'},
	{key:'email', label:'E-Mail'},
	{key:'passd', label:'Passwort'},
	{key:'branch', label:'Niederlassung', type:'select'},
	{key:'depart', label:'Ableitung', type:'select'},
]

const subInputArr = [
	{key:'street', label:'Straße & Nr'},
	{key:'address', label:'Wohnort'},
]

const sourceStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sourceNum = '0123456789';

function GetEmpId(empIdArr) {
	var newId;
	do {
		newId = '';
		for (let i = 0; i < 4; i++) {
			newId += sourceNum[Math.floor(sourceNum.length * Math.random())]
		}
	} while (empIdArr.find(id=> {return id === newId}));
	return newId
}

const emptyInfo = {first:'', last:'', email:'', passd:'', branch:'', depart:'', role:7, street:'', address:''};
// const emptyInfo = {first:'fist', last:'last', email:'test@gmail.com', passd:'passd', branch:'branch', depart:'depart', role:3, street:'street', address:'address'};

export default class MemberProfile extends React.Component {
	constructor(props) {
		super(props);
		const {profileMember, branchStr, departStr, empIdArrStr, imageName, empStr} = props;
		const profileData = profileMember.first?profileMember:emptyInfo;
		const {id, first, last, email, passd, branch, depart, role, street, address, employee_id} = profileData;
		this.type=profileMember.first?'edit':'create';
		const {roleFace, roleShield, roleStar} = GetRoleStrMember(role);
		this.empInfo = JSON.parse(empStr);
		this.state = {empStr, profileMember, branchStr, departStr, empIdArrStr, branchArr:JSON.parse(branchStr), departArr:JSON.parse(departStr), empIdArr:JSON.parse(empIdArrStr), type:first?'read':'edit', id, first, last, email, passd, branch, depart, street, address, employee_id, roleFace, roleShield, roleStar, imageName};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['profileMember', 'branchStr', 'departStr', 'empIdArrStr', 'imageName', 'empStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='profileMember') {
					const {branchArr, departArr} = this.state;
					const profileMember = nextProps.profileMember.first?nextProps.profileMember:emptyInfo;
					const {id, first, last, email, passd, branch, depart, role, street, address} = profileMember;
					this.type=nextProps.profileMember.first?'edit':'create';
					const {roleFace, roleShield, roleStar} = GetRoleStrMember(role);
					const employee_id = this.type==='create'?GetEmpId(this.state.empIdArr):profileMember.employee_id;
					this.setState({type:first?'read':'edit', id, first, last, email, passd, branch:branch||branchArr[0].id, depart:depart||departArr[0].id, street, address, roleFace, roleShield, roleStar, employee_id});
				} else if (key==='branchStr') {
					const branchArr = JSON.parse(nextProps.branchStr), branch = branchArr[0].id;
					this.setState({branchArr, branch});
				} else if (key==='departStr') {
					const departArr = JSON.parse(nextProps.departStr), depart = departArr[0].id;
					this.setState({departArr, depart});
				} else if (key==='empIdArrStr') {
					const empIdArr = JSON.parse(nextProps.empIdArrStr);
					this.setState({empIdArr});
				} else if (key==='empStr') {
					this.empInfo = JSON.parse(nextProps.empStr);
				}
			}
		});
	}

	onChangeInput = (e, itemKey) => {
		const str = e.target.value;
		this.setState({[itemKey]:str});
	}

	setEditPart = () => {
		this.setState({type:'edit'})
	}

	onClickRole = (roleKey) => {
		if (this.state.type === 'read') return;
		const oldVal = this.state[roleKey];
		this.setState({[roleKey]:!oldVal});
	}

	checkDisableSubmit = () => {
		const {first, last, email, passd, street, address, type, role} = this.state;
		if (type==='read') return true;
		return (!first || !last || !email || !passd || !street || !address || role===0 || !CheckEmail(email)) 
	}

	submitProfile = () => {
		if (this.checkDisableSubmit()) return;
		const {id, first, last, email, passd, branch, branchArr, depart, departArr, street, address, employee_id, roleFace, roleShield, roleStar, imageName} = this.state;
		const role = GetRoleIntMember(roleFace, roleShield, roleStar);
		const updateData = {id, first, last, email, passd, branch:branch||branchArr[0].id, depart:depart||departArr[0].id, street, address, employee_id, role, image:imageName};
		this.callAPI(updateData)
	}

	callAPI = (updateData) => {
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/updateEmployee.php', dataType: 'json', data: updateData,
			success: (res) => {
				this.props.setLoading(false);
				const {success, error} = res;
				if (success) {
					this.props.callTeamAPI();
					if (this.type==='create') {
						this.props.resetImage();
						const {branchArr, departArr} = this.state;
						this.setState({first:'', last:'', email:'', passd:'', branch:branchArr[0].id, depart:departArr[0].id, role:0, street:'', address:''});
					} else {
						this.setState({type:'read'});
						if (updateData.updateType==='delete') this.props.setPageKey('team');
					}
				} else {
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	getSelectArr = (itemKey) => {
		const {branchArr, departArr} = this.state;
		return itemKey==='branch'? branchArr:departArr;
	}

	onClickDelete = () => {
		if (window.confirm('Are you sure to delete the employee?')) {
			const updateData = {id:this.state.id, updateType:'delete'};
			this.callAPI(updateData);
		}
	}

	checkRoleShield = () => {
		const {roleShield, profileMember} = this.state;
		if (!profileMember) return false;
		if (!roleShield) return true;
		else {
			const profileId = parseInt(profileMember.id);
			const empId = parseInt(this.empInfo.id);
			if (profileId === empId) return true;
			else return false;
		}
	}

	render() {
		const {profileMember, type, branchArr, departArr, branch, depart, employee_id, imageName, roleShield} = this.state;
		return (
			<div className={`main-content flex ${profileMember?'active':''} content-profile content-profileMember`}>
				<div className={`side-part side-left flex-column type-${type}`}>
					<img className='avatar over-zoom' src={imageName?serverUrl+'other/images/'+imageName+'.jpg' : imgAvatar} alt=''></img>
					<div className='input-wrapper'>
						<div className='input-item'>
							<div className='label'></div>
							<div className='button button-grey' onClick={e=>this.props.openImageModal()}>Profilbild einfügen</div>
						</div>
						{mainInputArr.map((item, idx) =>
							<div className='input-item' key={idx}>
								<div className='label'>{item.label} : </div>
								{item.type==='select' &&
									<select onChange={e=>this.setState({[item.key]:e.target.value})} readOnly={type==='read'} disabled={type==='read'}>
										{this.getSelectArr(item.key).map((optionItem, optionIdx) =>
											<option value={optionItem.id} key={optionIdx}>{optionItem.label}</option>
										)}
									</select>
								}
								{item.type !== 'select' &&
									<input value={this.state[item.key]} readOnly={type==='read'} onChange={e=>this.onChangeInput(e, item.key)}></input>
								}
							</div>
						)}
						<div className='role-row input-item'>
							<div className='label'>Rolle: </div>
							<div className='value flex'>
								{roleMemberArr.map((item, idx) =>
									<Icon img={item.img} classStr={this.state[item.stateKey]?'':'disable point'} key={idx} onClickIcon={e=>this.onClickRole(item.stateKey)}></Icon>
								)}
							</div>
						</div>
					</div>

					<div className='bottom-row flex'>
						{type === 'read' && this.checkRoleShield() &&
							<div className='button empty-back' onClick={e=>this.setEditPart()}>
								<div className='button-row'>
									<Icon img={imgPenEdit}></Icon>
									<label>Daten bearbeiten</label>
								</div>
							</div>
						}
						{type==='edit' &&
							<>
								<div className={`button ${this.checkDisableSubmit()?'disable':''}`} onClick={e=>this.submitProfile()}>{this.type==='create'?'Anlegen':'Bestätigen'}</div>
								<div className={`button empty-back`} onClick={e=>this.setState({type:'read'})}>Lesen</div>
							</>
							
						}
					</div>
				</div>
				<div className={`side-part side-right flex-column type-${type}`}>
					<div className='top-part'>
						
					</div>
					<div className='input-wrapper'>
						{subInputArr.map((item, idx) =>
							<div className='input-item' key={idx}>
								<div className='label'>{item.label} : </div>
								<input value={this.state[item.key]} readOnly={type==='read'} onChange={e=>this.onChangeInput(e, item.key)}></input>
							</div>
						)}
						<div className='input-item member-id'>
							<div className='label'>Mitarbeiter-ID: </div>
							<div className='value' id='memberId'>{GetMemberId(branchArr, departArr, {branch, depart, employee_id})}</div>
						</div>
					</div>
					
				</div>
				{this.type==='edit' && !roleShield &&
					<div className='button delete-button empty-back' onClick={()=>this.onClickDelete()}>
						<div className='button-row'>
							<Icon img={imgDelete}></Icon>
							<label>Mitarbeiterin löschen</label>
						</div>
					</div>
				}
			</div>
		);
	}
}
