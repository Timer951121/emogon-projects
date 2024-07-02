import React from 'react';
import imgClose from '../../assets/images/close.png';

import ThOrder from '../layout/ThOrder';
import { customerDetailMenu } from '../../data/constant';
import { GetScrollable, Icon } from '../../data/common';

const tableW = 938/100;
const filterArr = [
	{key:'name', label:'Name', width:257/tableW}, // name
	{key:'companyName', label:'Firmen', width:365/tableW, flex1:true},
]
const selectArr = [  ];
customerDetailMenu.forEach(item => {
	selectArr.push({...item, img:item.black});
});

export default class WorkerSelect extends React.Component {
	constructor(props) {
		super(props);
		const {modalWorkerOut, modalWorkerIn, workerArr, selWorker} = props;
		this.state = {modalWorkerOut, modalWorkerIn, selWorker, workerArr, newWorker:false};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['modalWorkerOut', 'modalWorkerIn', 'selWorker', 'workerArr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='selWorker') this.setState({newWorker:false});
				// else if (key==='workerArr') {
				// 	const workerArr = [];
				// 	for (let i = 0; i < 10; i++) {
				// 		nextProps.workerArr.forEach(item => {
				// 			workerArr.push(item);
				// 		});
				// 	}
				// 	this.setState({workerArr});
				// }
			}
		});
	}

	closeWorkerModal = () => {
		this.props.closeModal('modalWorkerIn');
		setTimeout(() => {
			this.props.closeModal('modalWorkerOut');
			this.props.closeModal('selWorker');
		}, 300);
	}

	onClickWorker = (newId) => {
		this.setState({newWorker:newId});
	}

	submitWorker = () => {
		const {newWorker, selWorker} = this.state;
		if (newWorker===false || newWorker===selWorker) return;
		this.props.setWorker(newWorker);
		setTimeout(() => { this.closeWorkerModal(); }, 100);
	}

	render() {
		const {modalWorkerOut, modalWorkerIn, selWorker, workerArr, newWorker} = this.state;
		return (
			<div className={`modal-back worker-modal flex ${modalWorkerOut?'active':''}`}>
				<div className={`modal-wrapper ${modalWorkerIn?'active':''}`}>
					<div className='modal-title'>Select Servicepartner</div>
					<div className='modal-content'>
						<div className='table-wrapper table-filter'>
							<div className={`table-header ${GetScrollable('partnerTableContent')}`}>
								{filterArr.map((item, idx) => 
									<ThOrder
										width={'calc('+item.width+'% - 25px)'}
										label={item.label}
										setArrow={arrowKey=>this.setArrow(item.key, arrowKey)}
										key={idx}
										flex1={item.flex1}
									></ThOrder>
								)}
								<div className='header-item icons'>Kompetenzen</div>
								<ThOrder
									width={'calc('+147/tableW+'% - 25px)'}
									label={'Aktive Kunden'}
									hideArrow={true}
								></ThOrder>
							</div>
							<div className='table-content scroll scroll-y' id='partnerTableContent'>
								{workerArr.map((item, idx)=>
									<div className={`table-row flex ${item.id===newWorker?'new-worker':''} ${item.id===selWorker?'sel-worker':''}`} key={idx} onClick={e=>{ this.onClickWorker(item.id) }}>
										{filterArr.map((filterItem, filterIdx) =>
											<div className={`worker-${filterItem.key} ${filterItem.flex1?'flex-1':''}`}
												style={{width:'calc('+filterItem.width+'% - 25px)' }}
												key={filterIdx}>
												{item[filterItem.key]}
											</div>
										)}
										<div className='custom-icons icons'>
											{selectArr.map((iconItem, iconIdx) => 
												<Icon img={iconItem.img} classStr={`${item[iconItem.stateKey]?'':'hide'}`} onClickIcon={e=>{}} key={iconIdx}></Icon>
											)}
										</div>
										<div className={`custom-activeWorker`} style={{width:'calc('+147/tableW+'% - 25px)' }}>
											{item.customerCount}
										</div>
									</div>
								)}
								{workerArr.length===0 &&
									<div className='label empty-label'>There is not any data</div>
								}
							</div>
						</div>
					</div>
					<div className={`button ${(newWorker===false || newWorker===selWorker)?'disable':''}`} onClick={e=>this.submitWorker()}>Select</div>
					<div className='close-icon' onClick={e=>this.closeWorkerModal()}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>
		);
	}
}
