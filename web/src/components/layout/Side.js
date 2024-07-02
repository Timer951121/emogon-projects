
import React from 'react';

import { menuArr } from '../../data/constant';
import imgArrow from '../../assets/images/arrow-down-white.png';
import { GetRoleStrMember, Icon } from '../../data/common';
import imgDownImg from '../../assets/images/arrow-down-white.png';

export default class SideComponent extends React.Component {
	constructor(props) {
		super(props);
		const {empStr, pageKey, selMenu, loginType} = props;
		this.empRole = GetRoleStrMember(0);
		this.state = {empStr, pageKey, selMenu, loginType};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['empStr', 'pageKey', 'selMenu', 'loginType'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='empStr') {
					const empInfo = JSON.parse(nextProps.empStr);
					this.empRole = GetRoleStrMember(parseInt(empInfo.role));
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickMenu = (item) => {
		if (item.subMenu) this.props.setSelMenu(item.key);
		else {
			this.props.setSelMenu(undefined);
			this.props.setPageKey(item.key);
		}
	}

	getClassStr = (item) => {
		const {pageKey, selMenu} = this.state;
		const {key, subMenu} = item;
		var classStr = '';
		if (!subMenu && pageKey===key) {
		}
		if (subMenu && selMenu===key) classStr = 'active';
		return classStr;
	}

	getMenuArr = () => {
		const realMenuArr = [], {loginType} = this.state;
		menuArr.forEach(item => {
			const {role, key, customer, service} = item;
			if (loginType==='customer') {
				if (customer) realMenuArr.push(item); //  || key==='ticket'
			} else if (loginType==='service') {
				if (service) realMenuArr.push(item);
			} else {
				var itemRole = false;
				role.forEach(roleKey => {
					if (this.empRole['role'+roleKey]) itemRole = true;
				});
				if (itemRole) realMenuArr.push(item);
			}
		});
		return realMenuArr;
	}

	render() {
		const {pageKey, selMenu} = this.state;
		return (
			<div className='side flex-column'>
				{this.getMenuArr().map((item, idx)=>
					<React.Fragment key={idx}>
						<div className={`menu-item flex ${!item.subMenu&&item.key===pageKey?'active':''} ${this.getClassStr(item)} ${item.border?'border':''}`} onClick={e=>this.onClickMenu(item)}>
							<Icon img={item.img.white}></Icon>
							<div className='label'>{item.label}</div>
							{item.list &&
								<Icon img={imgArrow} classStr='icon-list'></Icon>
							}
						</div>
						{item.subMenu &&
							<div className={`sub-menu-wrapper active`}>
								{/* ${selMenu===item.key?'active':''} */}
								{item.subMenu.map((subItem, subIdx) =>
									<div className={`sub-menu ${subItem.key===pageKey?'active':''}`} key={subIdx}>
										<div className='chevron icon'>
											<img src={imgDownImg} alt=''></img>
										</div>
										<div className='label' onClick={e=>this.props.setPageKey(subItem.key)}>{subItem.label}</div>
									</div>
								)}
							</div>
						}
					</React.Fragment>
				)}
			</div>
		);
	}
}
