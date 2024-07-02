import React from 'react';
import imgClose from '../../assets/images/close.png';

export default class WarnModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {modalWarnOut:false, modalWarnIn:false, crop:undefined, scale:1, rotate:0 };
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['modalWarnOut', 'modalWarnIn'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	closeWarnModal = (res) => {
		this.props.closeModal('modalWarnIn');
		setTimeout(() => {
			this.props.closeModal('modalWarnOut');
			this.props.setResult(res);
		}, 300);
	}

	render() {
		const {modalWarnOut, modalWarnIn} = this.state;
		return (
			<div className={`modal-back warn-modal flex ${modalWarnOut?'active':''}`}>
				<div className={`modal-wrapper ${modalWarnIn?'active':''}`}>
					<div className='modal-title'>Confirm to ignore current change</div>
					<div className='modal-content'>
						<div className='label'>There are some changes in the table</div>
						<div className='label'>Do you want to open other page without save the changes?</div>
					</div>
					<div className='footer flex'>
						<div className={`button`} onClick={e=>this.closeWarnModal(true)}>Yes</div>
						<div className={`button empty-back`} onClick={e=>this.closeWarnModal(false)}>No</div>
					</div>
					<div className='close-icon' onClick={e=>this.closeWarnModal(false)}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>
		);
	}
}
