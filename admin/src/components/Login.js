import React from 'react';
import jQuery from 'jquery';
import md5 from 'md5';
import LoadingComponent from './Loading';
import { apiUrl, GetDeviceInfo } from '../data/info';

export default class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		if (!props.testMode) this.state = {pageKey:props.pageKey, selIdx:0, email:'', passd:''};
		else 				 this.state = {pageKey:props.pageKey, selIdx:0, email:'admin@gmail.com', passd:'admin'};
	}

	componentDidMount() {
		setTimeout(() => { if (this.props.testMode) this.submitEmail(); }, 1000);
		document.addEventListener("keypress", (e) => {
			if (this.state.pageKey==='login' && e.key === "Enter") {
				this.submitEmail();
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.pageKey !== nextProps.pageKey) {
			this.setState({pageKey:nextProps.pageKey, email:'', passd:''});
		}
	}

	onChangeInput = (e, key) => {
		this.setState({[key]:e.target.value});
	}

	submitEmail = () => {
		const deviceId = GetDeviceInfo();
		const {email, passd} = this.state, curTime = new Date().getTime(), expire = curTime + 3 * 60 * 60 * 1000;
		if (!this.checkEmail(email.trim())) {
			window.alert('Please write correct email format'); return;
		} else if (!passd || passd==='') {
			window.alert('Please insert password'); return;
		} else {
			this.setState({loading:true});
			jQuery.ajax({
				type: "POST",
				url: apiUrl+'login.php',
				dataType: 'json',
				data: {email, passd: md5(passd), expire, curTime, deviceId},
				success: (res, textstatus) => {
					if (res.success) {
						this.props.setAdminPage({email, token:res.token});
					} else window.alert(res.token);
					this.setState({loading:false});
				}
			});
			// this.props.setPageKey('admin')
		}
	}

	checkEmail = (str) => {
		return String(str).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	}

	render() {
		const {pageKey, email, passd, loading} = this.state;
		return (
			<div className={`page-back login-page flex ${pageKey==='login'?'active':''}`}>
				<div className='login-wrapper flex'>
					<div className='big-title'>Login</div>
					<div className='content'>
						<div className='input-item flex'>
							<label className='title'>Email</label>
							<input className='title' value={email} onChange={(e)=>this.onChangeInput(e, 'email')}></input>
						</div>
						<div className='input-item flex'>
							<label className='title'>Password</label>
							<input className='title' value={passd} onChange={(e)=>this.onChangeInput(e, 'passd')} type='password'></input>
						</div>
					</div>
					<div className='button' onClick={this.submitEmail}>Submit</div>
				</div>
				<LoadingComponent
					loading={loading}
				></LoadingComponent>
			</div>
		);
	}
}
