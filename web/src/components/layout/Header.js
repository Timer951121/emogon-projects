
import React from 'react';

import imgLogo from '../../assets/images/logo.png';

export default class HeaderComponent extends React.Component {
	constructor(props) {
		super(props);
		const {empStr} = props;
		this.empInfo = JSON.parse(empStr);
		this.state = {empStr, showMenu:false};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['empStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='empStr') this.empInfo = JSON.parse(nextProps.empStr);
				this.setState({[key]:nextProps[key]})
			}
		});
	}

	openMenu = () => {
		this.setState({showMenu:!this.state.showMenu});
	}

	render() {
		const {first, last} = this.empInfo, {showMenu} = this.state;
		return (
			<div className='header flex'>
				<div className='part part-left'>
					<img className='logo-image' src={imgLogo} alt=''></img>
					<label className='power-board red'>POWERBOARD</label>
				</div>
				<div className='part part-center space'></div>
				<div className='part part-right'>
					<div className='button button-small'>{first?first[0]:''}</div>
					<div className='user-name'>Willkommen, {first} {last}</div>
					<div className='arrow-down' onClick={e=>this.openMenu()}></div>
					<div className={`menu ${showMenu?'show':''}`}>
						<div className='menu-item' onClick={e=>{
							this.setState({showMenu:false})
							this.props.setLogout()
						}}>Log out</div>
					</div>
				</div>
			</div>
		);
	}
}
