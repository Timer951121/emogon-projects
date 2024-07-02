import React from 'react';
import { GetSelItem, GetSelMenuItem } from '../../data/common';

import imgServiceBlack from '../../assets/images/service-black.png';
import imgServiceCustom from '../../assets/images/custom-service.png';

export default class TitleComponent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, disableCreate, disableFilter} = props, {selMenu, subMenu} = GetSelMenuItem(pageKey);
		this.state = {pageKey, disableCreate, disableFilter, selMenu, subMenu};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'disableCreate', 'disableFilter'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='pageKey') {
					const {selMenu, subMenu} = GetSelMenuItem(nextProps.pageKey);
					this.setState({selMenu, subMenu } );
					// console.log(subMenu);
				}
			}
		});
	}

	getIcon = () => {
		const {pageKey, selMenu} = this.state;
		if 		(pageKey==='workerProfile') return imgServiceBlack;
		else if (pageKey==='serviceCompany') return imgServiceCustom;
		const titleImg = selMenu.img?selMenu.img.black:undefined;
		return titleImg;
	}

	getLabel = () => {
		const {pageKey, selMenu, subMenu} = this.state;
		if 		(pageKey==='workerProfile') return 'Servicepartner anlegen:';
		else if (pageKey==='serviceCompany') return 'Servicepartner-Firmen:';
		else return subMenu.label || selMenu.subLabel || selMenu.label;
	}

	render() {
		const {selMenu, disableCreate, disableFilter, subMenu} = this.state;
		return (
			<div className={`title-wrapper flex ${this.props.profile?'profile-title':''} ${this.props.removeMargin?'remove-margin':''}`}>
				<div className='icon' onClick={e=>this.props.profile?this.props.onClickIcon():{}}>
					<img src={this.getIcon()} alt=''></img>
				</div>
				<div className='label' onClick={e=>this.props.profile?this.props.onClickIcon():{}}>{this.getLabel()}</div>
				<div className='center-space'></div>
				{selMenu.create && !disableCreate &&
					<div className='button' onClick={e=>this.props.createItem()}>{selMenu.create}</div>
				}
				{selMenu.filter && !disableFilter &&
					<div className='button button-filter' onClick={e=>this.props.setFilter()}>Filtern</div>
				}
			</div>
		);
	}
}
