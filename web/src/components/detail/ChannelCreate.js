
import React from 'react';
import jQuery from 'jquery';
import { Editor } from "@tinymce/tinymce-react";

import { apiUrl, serverUrl } from '../../data/config';

import imgTicket from '../../assets/images/ticket-black.png';
import { GetParseArr, Icon } from '../../data/common';
import { GetEmpInfo } from '../content/ChannelContent';

function GetChannelData(channelStr, empId) {
	const channelArr = GetParseArr(channelStr, ['id', 'senderId', 'receiverId', 'time']);
	return channelArr.filter(channel=>{return channel.senderId===empId});
}

export default class ChannelCreate extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, empStr, teamStr, channelStr} = props;
		this.channelData = [];
		this.employeeData = [];
		this.empInfo = GetEmpInfo(empStr);
		this.state = {pageKey, empStr, teamStr, channelStr, title:'', employeeId:-1, description:''};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'empStr', 'teamStr', 'channelStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='empStr') {
					this.empInfo = GetEmpInfo(nextProps.empStr);
					this.channelData = GetChannelData(this.state.channelStr, this.empInfo.id);
				} else if (key==='teamStr') {
					const initTeam = this.employeeData.length === 0;
					this.employeeData = GetParseArr(nextProps.teamStr);
					if (initTeam && this.employeeData.length) {
						setTimeout(() => { this.selectEmployee(this.employeeData[0].id); }, 100);
					}
				} else if (key==='channelStr') {
					this.channelData = GetChannelData(nextProps.channelStr, this.empInfo.id);
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}
	
	checkDisableSubmit = () => {
		const {title, employeeId, description} = this.state;
		return (!title || employeeId===-1 || !description);
	}

	callAPI = () => {
		const {title, employeeId, description} = this.state;
		const existChannel = this.channelData.find(item=>{return item.title===title});
		if (existChannel) {window.alert('Already existing the channel'); return;}
		const apiName = 'updateChannel', time = Date.now(); // , channelCount = this.channelData.length;
		const updateData = {title, senderId:this.empInfo.id, receiverId:employeeId, description, time:Math.round(time/1000)};

		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/'+apiName+'.php', dataType: 'json', data: updateData,
			success: (res) => {
				this.props.setLoading(false);
				const {success, error, maxId} = res;
				if (success) {
					this.props.callChannelAPI();
					this.setState({title:'', description:'', employeeId:-1});
				} else {
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	selectEmployee = (employeeId) => {
		this.setState({employeeId});
	}

	onChangeInput = (e, key) => {
		this.setState({[key]:e.target.value});
	}

	render() {
		const {pageKey, title, employeeId, description} = this.state;
		return (
			<div className={`detail-content ${pageKey==='createChannel'?'active':''} content-channelCreate content-ticket-create`}>
				<div className={`title-wrapper flex remove-margin`}>
					<div className='icon' onClick={e=>this.props.setPageKey('channel')}>
						<img src={imgTicket} alt=''></img>
					</div>
					<div className='label' onClick={e=>this.props.setPageKey()}>Neues Channel erstellen:</div>
					<div className='center-space'></div>
				</div>
				<div className='main-content-wrapper'>
					<div className='input-wrapper'>
						<div className='input-item'>
							<div className='input-label'>Betreff:</div>
							<input className='' value={title} placeholder='Betreff eingeben' onChange={e=>this.onChangeInput(e, 'title')}></input>
						</div>
						<div className='input-item'>
							<div className='input-label'>Empfänger:</div>
							<select value={employeeId} onChange={e=>{ this.selectEmployee(parseInt(e.target.value)); } }>
								{this.employeeData.filter(item=>{return item.id!==this.empInfo.id}).map((item, idx) =>
									<option value={item.id} key={idx}>{item.name}</option>
								)}
							</select>
						</div>
						<div className='input-item'>
							<div className='input-label'></div>
							<Editor
								apiKey="iine2xgymzj2z3u9crwbkd7ggbq7gu6dvz19dedaud379fxi" // y7gnmtbsaxnjbgh3405ioqbdm24eit5f0ovek49w8yvq5r9q
								// disabled={typeMain==='read'}
								// initialValue={oriDescription}
								value={description}
								init={{
									branding: false,
									width: 700,
									height: 250,
									menubar: false,
									plugins: "autolink link",
									toolbar: "bold italic underline link",
									image_advtab: false
								}}
								onEditorChange={(str) => { this.setState({description:str}); }}
							></Editor>
						</div>

						<div className='footer'>
							<div className='files'>
								{/* <div className='attach-titme'>Anhänge:</div>
								<div className='file-item'>
									<label>enerqrabattcoupon10.pdf</label>
									<Icon img={imgClose}></Icon>
								</div>
								<div className='file-item'>
									<label>beispielanhang.jpg</label>
									<Icon img={imgClose}></Icon>
								</div> */}
							</div>
							<div className={`button ${this.checkDisableSubmit()?'disable':''}`} onClick={e=>this.callAPI()}>
								Anlegen
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
}
