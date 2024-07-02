import React from 'react';

import jQuery from 'jquery';

import imgLogo from '../assets/images/logo.png';
import imgEye from '../assets/images/eye.png';
import imgEyeNone from '../assets/images/eye-none.png';
import { localhost, apiUrl, localEmail, localPassd, localLoginTokenKey, localLoginType } from '../data/config';
import { CheckEmail, GetDeviceId } from '../data/common';


export default class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey} = props;
		const email = localStorage.getItem(localEmail) || '', password = localStorage.getItem(localPassd) || '', loginType = localStorage.getItem(localLoginType) || 'employee'; // NDN0ZBKYIKFD; // '123 
		this.state = {pageKey, email, password, eye:true, loginType }; // rohan.raj@trentecsystems.com
	}

	componentDidMount() {
		// setTimeout(() => {
		// 	this.onChangeInput({target:{value:''}}, 'email');
		// 	this.onChangeInput({target:{value:''}}, 'password');
		// }, 1000);

		if (localhost) {
			// setTimeout(() => { this.onClickEmail(); }, 1000);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onChangeInput = (e, key) => {
		const str = e.target.value;
		this.setState({[key]:str});
	}

	onClickEmail = () => {
		const {loginType, email, password} = this.state, deviceId = GetDeviceId();
		if ((loginType!=='customer' && !CheckEmail(email)) || password==='') return;
		this.props.setLoading(true);
		jQuery.ajax({
			type: "POST",
			url: apiUrl+'other/login.php',
			dataType: 'json',
			data: {email, passd: password, deviceId, loginType},
			success: (res, textstatus) => {
				if (res.success) {
					const inputCheckRemember = document.getElementById('inputCheckRemember');
					const remember = inputCheckRemember?inputCheckRemember.checked:false;
					if (remember) {
						if (loginType!=='customer') localStorage.setItem(localEmail, email);
						localStorage.setItem(localPassd, password);
						localStorage.setItem(localLoginType, loginType);
					}
					localStorage.setItem(localLoginTokenKey, res.token);
					this.props.openDashboard(res.empInfo, loginType);
				} else {
					window.alert('Failed to login!');
					this.setState({error:'Failed to login!'});
				}
				this.props.setLoading(false);
			}
		});
		// this.props.openDashboard();

	}

	render() {
		const {pageKey, email, password, eye, loginType} = this.state;
		return (
			<div className={`back-board over-board login flex-column ${pageKey==='login'?'active':''}`}>
				<img className='logo-image' src={imgLogo} alt=''></img>
				<label className='logo-label red'>POWERBOARD</label>
				<div className='login-type flex'>
					<div className={`login-label ${loginType==='employee'?'active red':''}`} onClick={e=>this.setState({loginType:'employee'})}>Mitarbeiter</div> 
					<div className={`login-label ${loginType==='customer'?'active red':''}`} onClick={e=>{
						this.setState({loginType:'customer'});
						if (localhost) this.setState({password:'4FYMKTLXPDWZ'}); // NDN0ZBKYIKFD
					}}>Kunden</div>
					<div className={`login-label ${loginType==='service'?'active red':''}`} onClick={e=>{
						this.setState({loginType:'service'});
						if (localhost) this.setState({email:'rohan@worker.com', password:'rohan'});
					}}>Service</div>
				</div>
				
				{loginType!=='customer' ?
					<input placeholder='E-Mail' value={email} onChange={e=>this.onChangeInput(e, 'email')} autoComplete="off"></input> :
					<div className='email-row'></div>
				}
				
				<input placeholder='Passwort' value={password} onChange={e=>this.onChangeInput(e, 'password')} autoComplete="off" type={eye?'password':'text'}></input>
				<img className='password-eye' src={eye?imgEye:imgEyeNone} alt='' onClick={e=>this.setState({eye:!eye})}></img>

				<div className='remember-row flex'>
					<input type={'checkbox'} id='inputCheckRemember'></input>
					<label >Remember me</label>
					<div className={`button ${((loginType==='employee' && !CheckEmail(email)) || password === '') ? 'disable':''}`} onClick={e=>this.onClickEmail()}>Okay</div>
				</div>
				<label className='label forgot red'>Passwort vergessen?</label>
			</div>
		);
	}
}
