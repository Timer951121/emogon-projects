import React from 'react';
import imgClose from '../../assets/images/close.png';

export default class ServiceModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {modalServiceOut:false, modalServiceIn:false };
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['modalServiceOut', 'modalServiceIn'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	closeServiceModal = () => {
		this.props.closeModal('modalServiceIn');
		setTimeout(() => {
			this.props.closeModal('modalServiceOut');
		}, 300);
	}

	render() {
		const {modalServiceOut, modalServiceIn} = this.state;
		const selService = modalServiceOut || {};
		const {customerName, projectNum, location, mainLabel, subLabel, content} = selService;
		return (
			<div className={`modal-back service-modal flex ${modalServiceOut?'active':''}`}>
				<div className={`modal-wrapper ${modalServiceIn?'active':''}`}>
					<div className='modal-title'>Service Request</div>
					<div className='modal-content'>
						<div className='info-row'>
							<div className='info-label'>Customer Name</div>
							<div className='info-value'>{customerName}</div>
						</div>
						<div className='info-row'>
							<div className='info-label'>Project Number</div>
							<div className='info-value'>{projectNum}</div>
						</div>
						<div className='info-row'>
							<div className='info-label'>location</div>
							<div className='info-value'>{location}</div>
						</div>
						<div className='info-row'>
							<div className='info-label'>mainLabel</div>
							<div className='info-value'>{mainLabel}</div>
						</div>
						<div className='info-row'>
							<div className='info-label'>subLabel</div>
							<div className='info-value'>{subLabel}</div>
						</div>
						<div className='info-row'>
							<div className='info-label'>content</div>
							<div className='info-value'>{content}</div>
						</div>
					</div>
					<div className='close-icon' onClick={e=>this.closeServiceModal()}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>
		);
	}
}
