import React from 'react';
import jQuery from 'jquery';
import LoadingComponent from './Loading';
import {apiUrl, frontUrl} from '../data/info';
import imgClose from '../assets/images/close.png';

const keyInfo = [
	{label:'Part', str:'part', type:'text', disable:true},
	{label:'Name', str:'label', type:'text'},
	{label:'Name (DE)', str:'label_de', type:'text'},
	{label:'Price', str:'price', type:'number'},
	// {label:'Pieces', str:'piece', type:'text'},
	{label:'Description', str:'description', type:'text'},
	{label:'Description (DE)', str:'description_de', type:'text'},
	{label:'Image', str:'img', type:'file'},
]
const colorKeyInfo = [
	{label:'Part', str:'part', type:'text', disable:true},
	{label:'Name', str:'label', type:'text'},
	{label:'Name (DE)', str:'label_de', type:'text'},
	{label:'Price', str:'price', type:'number'},
]
const selectKeyInfo = [
	{label:'Name', str:'label', type:'text'},
	{label:'Name (DE)', str:'label_de', type:'text'},
	{label:'Base Price', str:'price', type:'number'},
	{label:'Description', str:'description', type:'text'},
	{label:'Description (DE)', str:'description_de', type:'text'},
	{label:'Image', str:'img', type:'file'},
]

const catKeyInfo = [
	{label:'Name', str:'label', type:'text'},
	{label:'Name (DE)', str:'label_de', type:'text'},
]

const labelKeyInfo = [
	{label:'Name', str:'label', type:'text', disable:false},
	{label:'Name (DE)', str:'label_de', type:'text'},
]

export default class EditComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.modalInfo !== nextProps.modalInfo) {
			const {dataType} = nextProps.modalInfo;
			if (dataType === 'optionArr') {
				this.keyArr = nextProps.modalInfo.part==='color'?colorKeyInfo:keyInfo;
			} else if (dataType === 'customArr' || dataType === 'premadeArr' || dataType === 'protoArr') {
				this.keyArr = selectKeyInfo;
			} else if (dataType === 'catArr') {
				this.keyArr = catKeyInfo;
			} else if (dataType==='labelArr') {
				this.keyArr = labelKeyInfo;
			}
			this.setState({modalInfo:nextProps.modalInfo, imgFile:null});
		}
		if (this.state.modalInner !== nextProps.modalInner) {
			this.setState({modalInner:nextProps.modalInner});
		}
	}

	onChangeInput = (e, keyStr) => {
		var {modalInfo} = this.state;
		modalInfo[keyStr] = e.target.value;
		this.setState({modalInfo});
	}

	submitEdit = (updateType) => {
		var self = this;
		this.setState({loading:true});
		const {imgFile} = this.state, formData = new FormData();
		if (imgFile) {
			formData.append("file", imgFile);
			// formData.append("fileName", modalInfo.img);
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", frontUrl+'./uploadImgFile.php', true);
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					self.updateData(updateType, this.responseText);
				}
			};
			xhttp.send(formData);
		} else this.updateData(updateType);
	}

	updateData = (updateType, imgName) => {
		var {modalInfo} = this.state, {dataType} = modalInfo, subApiUrl = '';
		Object.keys(modalInfo).forEach(key => {
			if (key==='price' || !modalInfo[key]) return;
			modalInfo[key] = modalInfo[key].trim();
		});
		if (imgName) modalInfo.img = imgName;
		const {label, label_de, description, description_de, price} = modalInfo;
		if (!label || !label_de || (description && !description_de) || ((dataType==='optionArr' || dataType==='customArr' || dataType==='premadeArr' || dataType==='protoArr') && !price)) {window.alert('Please insert correct info.'); return;}
		this.setState({loading:true});
		if 		(dataType==='optionArr') subApiUrl = 'Option';
		else if (dataType==='customArr') subApiUrl = 'Custom';
		else if (dataType==='premadeArr') subApiUrl = 'Premade';
		else if (dataType==='protoArr') subApiUrl = 'Proto';
		else if (dataType==='catArr') subApiUrl = 'Cat';
		else if (dataType==='labelArr') subApiUrl = 'Label';
		jQuery.ajax({ type: "POST", url: apiUrl+'update'+subApiUrl+'Data.php', dataType: 'json',
			data: {...this.state.modalInfo, updateType},
			success: (res) => {
				if (res.error) {
					window.alert(res.error);
				} else {
					this.setState({dataArr:res.data});
				}
				this.closeModal(true);
				this.setState({loading:false});
			}
		});
	}

	closeModal = (submit) => {
		this.props.closeModal('modalInner');
		setTimeout(() => { this.props.closeModal('modalInfo', submit); }, 500);
	}

	render() {
		const {modalInfo, modalInner, loading, imgFile, imgSrc} = this.state;
		return (
			<div className={`modal-wrapper flex ${modalInfo?'active':''}`}>
				<div className={`modal-inner ${modalInner?'active':''}`}>
					<div className='big-title'>{modalInfo&&modalInfo.id?'Edit':'Add'} Part</div>
					{modalInfo &&
						<div className='content'>
							{this.keyArr.map((keyItem, idx) =>
								<div className='edit-item flex' key={idx}>
									<label className='key-label'>{keyItem.label}</label>
										{keyItem.str !== 'img' &&
											<input className={`key-value edit-${keyItem.str}`}
												type={keyItem.type}
												value={modalInfo[keyItem.str]}
												disabled={keyItem.disable}
												onChange={(e)=> this.onChangeInput(e, keyItem.str)}></input>
										}
										{keyItem.str === 'img' &&
											<div className='key-value'>
												<div className='input'>
													<input type="file" id="imgFile" accept='.jpg, .png' onChange={() => {
														const imgFile = document.getElementById("imgFile").files[0];
														if (!imgFile) return;
														if (imgFile.type !== 'image/jpeg' || imgFile.name.split('.').pop() !== 'jpg') window.alert('Please select jpg file type!');
														else if (imgFile.size > 5029549) window.alert('File size too big! should be small than 5 M.');
														else {
															const reader = new FileReader();
															reader.onload = ()=> {
																this.setState({imgFile, imgSrc:reader.result, errorDrag:''});
															}
															reader.readAsDataURL(imgFile);
														}
													} }></input>
												</div>
												<div className='preview'>
													<img src={imgFile?imgSrc:frontUrl+'images/'+modalInfo.img+'.jpg'} alt=''></img>
												</div>
											</div>
										}
								</div>
							) }
						</div>
					}
					<div className='footer'>
						<div className='button submit' onClick={() => this.submitEdit('edit')}>Submit</div>
						{/* {modalInfo && modalInfo.id && <div className='button delete' onClick={() => this.submitEdit('delete')}>Delete</div>} */}
					</div>
					
					<div className='close' onClick={()=>this.closeModal(false)}><img src={imgClose}></img></div>
				</div>
				<LoadingComponent
					loading={loading}
				></LoadingComponent>
			</div>
		);
	}
}
