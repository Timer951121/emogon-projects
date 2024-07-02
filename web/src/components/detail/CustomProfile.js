
import React from 'react';
import jQuery from 'jquery';
import QRCode from "qrcode.react";

import { customerDetailMenu } from '../../data/constant';
import { Icon, CheckEmail, GetRoleStrCustomer, GetRoleIntCustomer, GetPassd, CheckPassd, GetSystemNum } from '../../data/common';
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
	{key:'company', label:'Firma'},
	{key:'street', label:'Straße & Nr'},
	{key:'location', label:'Ort'}, // city
	{key:'zipCode', label:'PLZ'},
	{key:'email', label:'E-Mail'},
	{key:'tel1', label:'Tel 1'},
	{key:'tel2', label:'Tel 2'},
	{key:'passd', label:'QR Code'},
]

const subInputArr = [
	{key:'sideName', label:'Name'},
	{key:'number', label:'Projektnummer'},
	{key:'sideStreet', label:'Straße & Nr'},
	{key:'sideLocation', label:'Ort'},
	{key:'sideZip', label:'PLZ'},
]

const emptyInfo = {first:'', last:'', street:'', company:'', location:'', tel1:'', tel2:'', loginTime:'', zipCode:'', email:'', passd:'', sideName:'', sideStreet:'', sideLocation:'', role:31};

export default class CustomProfile extends React.Component {
	constructor(props) {
		super(props);
		const {profileCustomer, systemStr, imageName, customerStr, selSystemId} = props;
		const profileInfo = profileCustomer.first?profileCustomer:emptyInfo;
		const {first, last, street, company, location, tel1, tel2, loginTime, zipCode, email, passd, sideName, sideStreet, sideLocation, role} = profileInfo;
		const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace} = GetRoleStrCustomer(role);
		this.customData = JSON.parse(customerStr); this.systemArr = [];  this.selSystemArr = [];
		this.state = {profileCustomer, id:0, first, last, street, company, location, tel1, tel2, loginTime, zipCode, email, passd, sideName, sideStreet, sideLocation, role, systemStr, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace, imageName, selSystemId};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['profileCustomer', 'systemStr', 'imageName', 'customerStr', 'selSystemId'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]}, () => {
					if (key==='selSystemId') {
						this.setSelSystemArr(this.state.id);
						this.setSelSystemInfo();
					}
				});
				if (key==='profileCustomer') {
					const profileCustomer = nextProps.profileCustomer.first?nextProps.profileCustomer:emptyInfo;
					const {id, first, last, street, company, location, tel1, tel2, loginTime, zipCode, email, passd} = profileCustomer;
					const type = first?'read':'edit';
					this.setState({typeMain:type, typeSide:type, id, first, last, street, company, location, tel1, tel2, loginTime, zipCode, email, passd:passd || GetPassd()});
					this.setSelSystemArr(id);
					this.setSelSystemInfo();
				} else if (key==='systemStr') {
					this.systemArr = JSON.parse(nextProps.systemStr);
					this.systemArr.forEach(item => {
						item.id = parseInt(item.id); item.customerId = parseInt(item.customerId);
					});
					this.setSelSystemArr(this.state.id);
					this.setSelSystemInfo();
				} else if (key==='customerStr') {
					this.customData = JSON.parse(nextProps.customerStr);
				}
			}
		});
	}

	setSelSystemArr = (customerId) => {
		if (!customerId || !this.systemArr.length) return;
		this.selSystemArr = this.systemArr.filter(item=>{return item.customerId===customerId}) || {};
		this.setSelSystemInfo(); // this.selSystemArr[0].id
	}

	setSelSystemInfo = () => {
		const {selSystemId} = this.state;
		const selSystem = this.selSystemArr.find(item=>{return item.id===selSystemId}) || {};
		const {id, name, street, location, role, number, zipCode} = selSystem;
		const {roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace} = GetRoleStrCustomer(role?parseInt(role):63);
		this.setState({systemId:id, sideName:name, number, sideStreet:street, sideLocation:location, sideZip:zipCode, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace});
		this.setState({typeSide:id?'read':'edit'});
	}

	onChangeInput = (e, itemKey) => {
		const str = e.target.value;
		const realStr = itemKey==='passd'?str.toUpperCase():str;
		this.setState({[itemKey]:realStr});
	}

	setEditPart = (partKey) => {
		this.setState({[partKey]:'edit'})
	}

	checkDisableSubmit = (part) => {
		const {typeMain, first, last, email, passd, street, location, zipCode, sideZip, role, sideName, number, sideStreet, sideLocation} = this.state; // , systemId
		if (part==='main') return (typeMain==='read' || !first || !last || !email || !street || !location || !zipCode || !CheckPassd(passd) || !CheckEmail(email)); //  || systemId===undefined
		else return (!sideName || !sideStreet || !sideLocation || !number || !sideZip || role===0);
	}

	submitMain = () => {
		if (this.checkDisableSubmit('main')) return;
		const {id, first, last, email, passd, company, street, zipCode, location, tel1, tel2, imageName} = this.state; // , systemId
		const existEmail = this.customData.find(item=> {return item.id !== id && item.email===email});
		if (existEmail) {window.alert('Already exist the Email!'); return;}
		const existPassd = this.customData.find(item=> {return item.id !== id && item.passd===passd});
		if (existPassd) {window.alert('Already exist the Code!'); return;}
		const updateData = {id, first, last, email, passd, company, street, zipCode, location, tel1, tel2, image:imageName};
		this.callAPI('updateCustomer', updateData);
		this.uploadQRImage();
	}

	submitSide = () => {
		if (this.checkDisableSubmit('side')) return;
		const {id, systemId, sideName, number, sideStreet, sideLocation, sideZip, roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace} = this.state;
		const existNumItem = this.systemArr.find(item=>{return item.id!==systemId && item.number===number});
		if (existNumItem) {window.alert('The project number already existing'); return;}
		const role = GetRoleIntCustomer(roleVoltaic, rolePump, roleStorage, roleCharge, roleCarport, roleFace);
		
		this.props.setLoading(true);
		const locationAPIUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + sideZip + '&key='+googleMapAPIKey;
		jQuery.ajax({ type: "GET", url: locationAPIUrl, dataType: 'json',
			success: (res) => {
				const {results} = res;
				if (results && results[0]) {
					const {lat, lng} = results[0].geometry.location;
					const updateData = {id:systemId || undefined, customerId:id, name:sideName, number, street:sideStreet, location:sideLocation, latitude:lat, longitude:lng, role, updateType:'main', zipCode:sideZip};
					this.callAPI('updateSystem', updateData);
				} else {
					window.alert('Failed to set system zip code!');
					this.props.setLoading(false);
				}
			}, error: (res, status, error) => {
				window.alert(res.responseText);
				this.props.setLoading(false);
			}
		});
	}

	callAPI = (apiName, updateData) => {
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/'+apiName+'.php', dataType: 'json', data: updateData,
			success: (res) => {
				const {success, error, maxId} = res;
				if (success) {
					if (apiName==='updateCustomer') {
						this.props.callCustomerAPI();
						this.props.setLoading(false);
						if (updateData.id===undefined) {
							this.setState({typeMain:'read', id: parseInt(maxId)}, () => this.submitSide());
						} else {
							this.setState({typeMain:'read'});
							if (updateData.updateType==='delete') {
								this.props.setPageKey('customer');
							}
						}
						setTimeout(() => { this.callPDFAPI(); }, 1000);
						setTimeout(() => { this.props.setLoading(false); }, 1500);
						
					} else if (apiName==='updateSystem') {
						this.props.callSystemAPI();
						this.props.setLoading(false);
						if (updateData.id===undefined) {
							this.setState({systemId:maxId});
							this.setState({typeSide:'read'});
							this.props.setSelSystemId(parseInt(maxId));
						} else {
							if (updateData.updateType==='delete') {
								this.setState({systemId:undefined, sideName:'', number:'', sideStreet:'', sideLocation:'', sideZip:'', roleVoltaic:false, rolePump:false, roleStorage:false, roleCharge:false, roleCarport:false, roleFace:false});
								this.props.setSelSystemId(undefined);
							} else {
								this.setState({typeSide:'read'});
							}
						}
						setTimeout(() => { this.callPDFAPI(); }, 1000);
					}
				} else {
					this.props.setLoading(false);
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	callPDFAPI = () => {
		const {first, last, email, passd, company, zipCode, street, location} = this.state;
		const firstSystem = this.selSystemArr[0];
		if (!firstSystem) return;
		const {number, name} = firstSystem;
		// const systemNumber = firstSystem?firstSystem.number:'Not any system';
		// const pdfName = firstSystem?firstSystem.name:first+'_'+last;
		const customerData = {name:first+' '+last, email, passd, company, street, location, zipCode, systemNumber:number, pdfName:name+'_App-Zugang'};
		jQuery.ajax({ type: "POST", url: apiUrl+'other/createPDF.php', dataType: 'json', data: customerData,
			success: (res) => { console.log(res); }
		});
	}

	onClickDeleteCustom = () => {
		if (window.confirm('Are you sure to delete the customer?')) {
			const updateData = {id:this.state.id, updateType:'delete'};
			this.callAPI('updateCustomer', updateData);
		}
	}

	onClickDeleteSystem = () => {
		if (window.confirm('Are you sure to delete the system?')) {
			const updateData = {id:this.state.systemId, updateType:'delete'};
			this.callAPI('updateSystem', updateData);
		}
	}

	onClickRole = (stateKey) => {
		if (this.state.typeSide==='read') return;
		const oldVal = this.state[stateKey];
		this.setState({[stateKey]:!oldVal});
	}

	onChangeSystem = (e) => {
		const systemId = e.target.value;
		this.setState({systemId});
	}

	onClickIcon = e => {
		this.props.closeCustomerProfile();
	}

	uploadQRImage = () => {
		const canvas = document.getElementById("QR_Code_SVG");
		const dataURL = canvas.toDataURL();
		const blobBin = atob(dataURL.split(',')[1]);
		const array = [];
		for(var i = 0; i < blobBin.length; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		const file=new Blob([new Uint8Array(array)], {type: 'image/jpg'});

		const formData = new FormData();
		formData.append("file", file);
		formData.append("QRCode", this.state.passd);
		this.props.setLoading(true);
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", apiUrl+'other/uploadQRImgFile.php', true);
		xhttp.onreadystatechange = (e) => {
			const result = e.target;
			if (result.readyState === 4 && result.status === 200) {
				// const res = JSON.parse(result.responseText);
			}
		};
		xhttp.send(formData);
	}

	downloadPDF = () => {
		const {first, last} = this.state;
		const firstSystem = this.selSystemArr[0];
		if (!firstSystem) {
			window.alert('Bitte zuerst Anlage erstellen.');
			return;
		}
		// const pdfName = firstSystem?firstSystem.name:first+'_'+last;

		const pdfUrl = apiUrl+'other/mail_pdf/'+firstSystem.name+'_App-Zugang.pdf';
		window.open(pdfUrl, '_blank');
		// const a = document.createElement('a');
		// a.href = pdfUrl;
		// a.download = 'pdf';
		// document.body.appendChild(a);
		// a.click();
		// document.body.removeChild(a);
	}

	render() {
		const {profileCustomer, id, systemId, typeMain, typeSide, selSystemId, imageName, passd, loginTime} = this.state;
		return (
			<div className={`detail-content ${profileCustomer?'active':''} content-detailCustomer`}>
				<TitleComponent
					pageKey={'customer'}
					disableCreate={true}
					profile={true}
					onClickIcon={this.onClickIcon}
					createItem={e=>{}}
					setFilter={e=>{}}
					removeMargin={true}
				></TitleComponent>
				<div className='main-content-wrapper'>
					<div className={`main-content flex ${profileCustomer?'active':''} content-profile content-profileCustomer`}>
						<div className={`side-part side-left flex-column type-${typeMain}`}>
							<img className='avatar' src={imageName?serverUrl+'other/images/'+imageName+'.jpg' : imgAvatar} alt=''></img>

							<div className='input-wrapper'>
								<div className='input-item'>
									<div className='label'></div>
									<div className='button button-grey' onClick={e=>this.props.openImageModal()}>Profilbild einfügen</div>
								</div>
								{mainInputArr.map((item, idx) =>
									<div className='input-item' key={idx}>
										<div className='label'>{item.label} : </div>
										<input value={this.state[item.key] || ''} readOnly={typeMain==='read' || item.key==='loginTime'} onChange={e=>this.onChangeInput(e, item.key)}></input>
										{/* || (item.key==='email' && id !== undefined) */}
									</div>
								)}
								{id !== undefined &&
									<div className='input-item'>
										<div className='label'>Letzter Login : </div>
										<input value={loginTime || ''} readOnly={true} ></input>
									</div>
								}
							</div>
							<div className='qr-code-wrapper' style={{width:0, height:0, overflow:'hidden'}}>
								<QRCode id="QR_Code_SVG" className='qr-code-svg' size={256} value={passd} level={"H"} />
							</div>

							<div className='bottom-row flex'>
								{typeMain === 'read' &&
									<>
										<div className='button empty-back' onClick={e=>this.setEditPart('typeMain')}>
											<div className='button-row'>
												<Icon img={imgPenEdit}></Icon>
												<label>Daten bearbeiten</label>
											</div>
										</div>
										<div className='button empty-back' onClick={e=>this.downloadPDF()}>
											<div className='button-row'>
												<Icon img={imgDownload}></Icon>
												<label>Neukunden-PDF</label>
											</div>
										</div>
									</>
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
							<div className='top-part'>
								<div className='select-part'>
									<div className='label'>Anlage:</div>
									<select disabled={!systemId} value={selSystemId} onChange={e=>{
										this.props.setSelSystemId(parseInt(e.target.value));
										// this.setSelSystemInfo(parseInt(e.target.value))
									}}>
										{this.selSystemArr.map((item, idx) =>
											<option value={item.id} key={idx}>{item.name}</option>
										)}
									</select>
								</div>
								{systemId !== undefined &&
									<div className='button create-button' onClick={e=>{
										this.props.setSelSystemId(undefined);
										// this.setSelSystemInfo(undefined)
									}}>
										<div className='button-row'>
											<Icon img={imgLogoImage}></Icon>
											<label>Anlage erstellen</label>
										</div>
									</div>
								}
							</div>
							<div className='title'>{systemId===undefined?'Neue Anlage anlegen:':'Anlage bearbeiten:'}</div>
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
								{(id!==undefined && typeSide === 'edit') &&
									<>
										<div className={`button ${this.checkDisableSubmit('side')?'disable':''}`} onClick={e=>this.submitSide()}>
											{systemId === undefined?'Anlegen':'Bestätigen'}
										</div>
										{systemId!==undefined &&
											<div className={`button empty-back`} onClick={e=>this.setState({typeSide:'read'})}>
												Lesen
											</div>
										}
									</>
								}
							</div>
							
						</div>

						{id !== undefined &&
							<div className='button delete-button delete-button-customer empty-back' onClick={()=>this.onClickDeleteCustom()}>
								<div className='button-row'>
									<Icon img={imgDelete}></Icon>
									<label>Kunde löschen</label>
								</div>
							</div>
						}
						{systemId !== undefined &&
							<div className='button delete-button delete-button-system empty-back' onClick={()=>this.onClickDeleteSystem()}>
								<div className='button-row'>
									<Icon img={imgDelete}></Icon>
									<label>System löschen</label>
								</div>
							</div>
						}

					</div>
				</div>

			</div>
		);
	}
}
