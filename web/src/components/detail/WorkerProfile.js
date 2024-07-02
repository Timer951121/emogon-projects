
import React from 'react';
import jQuery from 'jquery';
import QRCode from "qrcode.react";

import { customerDetailMenu } from '../../data/constant';
import { Icon, CheckEmail, GetRoleStrCustomer, GetRoleIntCustomer, GetPassd, CheckPassd, GetSystemNum, GetParseArr } from '../../data/common';
import { apiUrl, googleMapAPIKey, serverUrl } from '../../data/config';

import imgLogoImage from '../../assets/images/logo-image.png'
import imgAvatar from '../../assets/images/avatar-circle.png';
import imgPenEdit from '../../assets/images/pen-edit-red.png';
import imgDownload from '../../assets/images/download.png';
import imgDelete from '../../assets/images/delete.png';
import TitleComponent from '../layout/Title';

const mainInputArr = [
	{key:'first', label:'Vorname'},
	{key:'last', label:'Nachname'},
	{key:'street', label:'Straße & Nr'},
	{key:'location', label:'Ort'}, // city
	{key:'email', label:'E-Mail'},
	{key:'passd', label:'Password'},
]

const subInputArr = [
	{key:'sideName', label:'Name'},
	{key:'sideStreet', label:'Straße & Nr'},
	{key:'sideLocation', label:'Ort'},
]

const emptyInfo = {first:'', last:'', street:'', companyId:null, location:'', email:'', passd:'', sideName:'', sideStreet:'', sideLocation:'', role:63};

export default class WorkerProfile extends React.Component {
	constructor(props) {
		super(props);
		const {profileWorker, companyStr, imageName, workerStr} = props;
		const profileInfo = (profileWorker && profileWorker.first)?profileWorker:emptyInfo;
		const {first, last, street, companyId, location, email, passd, sideName, sideStreet, sideLocation, role} = profileInfo;
		const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport} = GetRoleStrCustomer(role);
		this.workerData = JSON.parse(workerStr); this.companyArr = [];
		this.state = {profileWorker, id:0, first, last, street, companyId, location, email, passd, sideName, sideStreet, sideLocation, role, companyStr, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, imageName};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['profileWorker', 'companyStr', 'imageName', 'workerStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
				});
				if (key==='profileWorker') {
					const profileWorker = nextProps.profileWorker.first?nextProps.profileWorker:emptyInfo;
					const {id, first, last, street, companyId, location, email, passd} = profileWorker;
					const type = first?'read':'edit';
					this.setState({typeMain:type, typeSide:type, id, first, last, street, companyId, location, email, passd}, () => {
						this.setCompanyInfo();
					});
				} else if (key==='companyStr') {
					this.companyArr = GetParseArr(nextProps.companyStr)
					this.setCompanyInfo();
				} else if (key==='workerStr') {
					this.workerData = GetParseArr(nextProps.workerStr, ['id', 'companyId']);
				}
			}
		});
	}

	setCompanyInfo = () => {
		const {companyId} = this.state;
		const selCompany = this.companyArr.find(item=>{return item.id=== parseInt(companyId)}) || {};
		const {id, name, street, location, role} = selCompany;
		const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport} = GetRoleStrCustomer(role?parseInt(role):63);
		this.setState({sideName:name, sideStreet:street, sideLocation:location, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, typeSide:id?'read':'edit'});
	}

	onChangeInput = (e, itemKey) => {
		const str = e.target.value;
		// const realStr = itemKey==='passd'?str.toUpperCase():str;
		this.setState({[itemKey]:str});
	}

	setEditPart = (partKey) => {
		this.setState({[partKey]:'edit'})
	}

	checkDisableSubmit = (part) => {
		const {typeMain, first, last, companyId, email, passd, street, location, role, sideName, sideStreet, sideLocation} = this.state;
		if (part==='main') return (typeMain==='read' || !first || !last || !companyId || !email || !street || !location || !passd || !CheckEmail(email));
		else return (!sideName || !sideStreet || !sideLocation || role===0);
	}

	submitMain = () => {
		if (this.checkDisableSubmit('main')) return;
		const {id, first, last, email, passd, companyId, street, zipCode, location, imageName} = this.state;
		const existEmail = this.workerData.find(item=> {return item.id !== id && item.email===email});
		if (existEmail) {window.alert('Already exist the Email!'); return;}
		// const existPassd = this.workerData.find(item=> {return item.id !== id && item.passd===passd});
		// if (existPassd) {window.alert('Already exist the Code!'); return;}
		const updateData = {id, first, last, email, passd, companyId, street, zipCode, location, image:imageName};
		this.callAPI('updateWorker', updateData);
	}

	submitSide = () => {
		if (this.checkDisableSubmit('side')) return;
		const {companyId, sideName, sideStreet, sideLocation, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport} = this.state;
		const role = GetRoleIntCustomer(roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport);
		const updateData = {id:companyId || undefined, name:sideName, street:sideStreet, location:sideLocation, role, updateType:'main'};
		this.callAPI('updateCompany', updateData);
	}

	callAPI = (apiName, updateData) => {
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/'+apiName+'.php', dataType: 'json', data: updateData,
			success: (res) => {
				const {success, error, maxId} = res;
				if (success) {
					this.props.setLoading(false);
					if (apiName==='updateWorker') {
						this.props.callWorkerAPI();
						if (updateData.id===undefined) {
							this.setState({id: parseInt(maxId)}, () => {}); // this.submitSide()
						} else {
							if (updateData.updateType==='delete') {
								this.props.setPageKey('customer');
							}
						}
						this.setState({typeMain:'read'});
						
					} else if (apiName==='updateCompany') {
						this.props.callCompanyAPI();
						this.setState({typeSide:'read'});
						// this.setCompanyInfo();
						if (updateData.id===undefined) {
							this.setState({companyId:maxId});
						} else {
							if (updateData.updateType==='delete') {
								this.setState({companyId:undefined, sideName:'', sideStreet:'', sideLocation:'', roleVoltaic:false, rolePump:false, roleStorage:false, roleCharge:false, roleCarport:false});
							}
						}
					}
				} else {
					this.props.setLoading(false);
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	onClickDeleteWorker = () => {
		if (window.confirm('Are you sure to delete the service company worker?')) {
			const updateData = {id:this.state.id, updateType:'delete'};
			this.callAPI('updateWorker', updateData);
		}
	}

	onClickDeleteCompany = () => {
		if (window.confirm('Are you sure to delete the company?')) {
			const updateData = {id:this.state.companyId, updateType:'delete'};
			this.callAPI('updateCompany', updateData);
		}
	}

	onClickRole = (stateKey) => {
		if (this.state.typeSide==='read') return;
		const oldVal = this.state[stateKey];
		this.setState({[stateKey]:!oldVal});
	}

	onClickIcon = e => {
		this.props.closeWorkerProfile();
	}

	render() {
		const {profileWorker, id, companyId, typeMain, typeSide, imageName, passd, loginTime} = this.state;
		return (
			<div className={`detail-content ${profileWorker?'active':''} content-detailCustomer`}>
				<TitleComponent
					pageKey={'workerProfile'}
					disableCreate={true}
					profile={true}
					onClickIcon={this.onClickIcon}
					createItem={e=>{}}
					setFilter={e=>{}}
					removeMargin={true}
				></TitleComponent>
				<div className='main-content-wrapper'>
					<div className={`main-content flex ${profileWorker?'active':''} content-profile content-profileWorker`}>
						<div className={`side-part side-left flex-column type-${typeMain}`}>
							<img className='avatar' src={imageName?serverUrl+'other/images/'+imageName+'.jpg' : imgAvatar} alt=''></img>

							<div className='input-wrapper'>
								<div className='input-item'>
									<div className='label'></div>
									<div className='button button-grey' onClick={e=>this.props.openImageModal()}>Profilbild einfügen</div>
								</div>
								<div className='input-item select-part'>
									<div className='label'>Firma:</div>
									<select value={companyId || 0} onChange={e=>{
										this.setState({companyId:parseInt(e.target.value)}, () => {
											this.setCompanyInfo();
										})
									}}>
										<option value="0" disabled>Choose a company</option>
										{this.companyArr.map((item, idx) =>
											<option value={item.id} key={idx}>{item.name}</option>
										)}
									</select>
								</div>
								
								{mainInputArr.map((item, idx) =>
									<div className='input-item' key={idx}>
										<div className='label'>{item.label} : </div>
										<input value={this.state[item.key] || ''} readOnly={typeMain==='read' || (item.key==='email' && id !== undefined)} onChange={e=>this.onChangeInput(e, item.key)}></input>
									</div>
								)}
							</div>

							<div className='bottom-row flex'>
								{typeMain === 'read' &&
									<div className='button empty-back' onClick={e=>this.setEditPart('typeMain')}>
										<div className='button-row'>
											<Icon img={imgPenEdit}></Icon>
											<label>Daten bearbeiten</label>
										</div>
									</div>
								}
								{typeMain === 'edit' &&
									<>
										<div className={`button ${this.checkDisableSubmit('main')?'disable':''}`} onClick={e=>this.submitMain()}>
											{id===undefined?'Anlegen':'Bestätigen'} 
										</div>
										{id!==undefined &&
											<div className={`button empty-back`} onClick={e=>this.setState({typeMain:'read'})}>Lesen</div>
										}
									</>
								}
							</div>
						</div>
						<div className={`side-part side-right flex-column type-${typeSide}`}>
							<div className='top-part'></div>
							<div className='title'>
								{companyId?'Firma:':'Neue Firma anlegen:'}
								{companyId &&
									<div className='button create-button' onClick={e=>{
										this.setState({companyId:undefined}, () => {
											this.setCompanyInfo();
										});
									}}>
										Firma erstellen
									</div>
								}
							</div>

							<div className='input-wrapper'>
								{subInputArr.map((item, idx) =>
									<div className='input-item' key={idx}>
										<div className='label'>{item.label} : </div>
										<input value={this.state[item.key] || ''} readOnly={typeSide==='read'} onChange={e=>this.onChangeInput(e, item.key)}></input>
									</div>
								)}
							</div>
							<div className='button-wrapper'>
								{customerDetailMenu.map((item, idx) =>
									<div className={`button expand ${this.state[item.stateKey]?'':'disable point'}`} onClick={e=>this.onClickRole(item.stateKey)} key={idx}>
										<div className='button-row'>
											<Icon img={item.white}></Icon>
											<label>{item.label}</label>
										</div>
									</div>
								)}
							</div>
							<div className='bottom-row flex'>
								{typeSide === 'read' &&
									<div className='button edit-button empty-back' onClick={e=>this.setEditPart('typeSide')}>
										<div className='button-row'>
											<Icon img={imgPenEdit}></Icon>
											<label>Daten bearbeiten</label>
										</div>
									</div>
								}
								{typeSide === 'edit' &&
									<>
										<div className={`button ${this.checkDisableSubmit('side')?'disable':''}`} onClick={e=>this.submitSide()}>
											Anlegen
										</div>
										{companyId!==undefined &&
											<div className={`button empty-back`} onClick={e=>this.setState({typeSide:'read'})}>Lesen</div>
										}
									</>
								}
							</div>
							
						</div>

						{id !== undefined &&
							<div className='button delete-button delete-button-customer empty-back' onClick={()=>this.onClickDeleteWorker()}>
								<div className='button-row'>
									<Icon img={imgDelete}></Icon>
									<label>Kunde löschen</label>
								</div>
							</div>
						}
					</div>
				</div>

			</div>
		);
	}
}
