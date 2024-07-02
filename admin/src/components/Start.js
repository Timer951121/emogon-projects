import React from 'react';
import { partArr } from '../data/info';

export default class StartComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {pageKey: props.pageKey, selIdx:0};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.pageKey !== nextProps.pageKey) {
			this.setState({pageKey:nextProps.pageKey});
		}
		if (this.state.selSubPart !== nextProps.selSubPart) {
			this.setState({selSubPart:nextProps.selSubPart});
		}
	}

	onClickWrapper = (e) => {
		var wrapperClick = true;
		for (let i = 0; i < e.target.classList.length; i++) {
			if (e.target.classList[i] === 'type-button') wrapperClick = false;
		}
		if (wrapperClick) this.props.setSelSubPart(null);
	}

	render() {
		const {pageKey, selSubPart, selIdx} = this.state;
		return (
			<div className={`back-board flex start ${pageKey==='start'?'active':''}`}>
				<div className='outer-wrapper'>
					<div className={`inner-wrapper detail-select ${selSubPart?'trans':''}`}>
						<div className='group-bar flex top-bar title'>PERSONAL</div>
						<div className='group-bar flex bottom-bar title'>BUSINESS</div>
						<div className='content'>
							{partArr.map((item, selIdx) =>
								<div className='part-item' onClick={() => {
										this.props.setSelSubPart(item.key);
										this.setState({selIdx});
									} } key={selIdx}>
									<div className='part-img'>
										<img src={item.img}></img>
									</div>
									<div className='part-text'>
										<div className='part-title sub-title'>{item.title}</div>
										<div className='part-description label'>{item.description}</div>
									</div>
								</div>
							) }
						</div>
					</div>
					<div className={`inner-wrapper type-select ${selSubPart?'show':''}`}>
						<div className='type-wrapper' style={{marginLeft:selIdx*300+'px'}} onClick={this.onClickWrapper}>
							<div className='type-button title' onClick={() => this.props.callCanvasPage('custom')}>CUSTOM</div>
							<div className='type-button title' onClick={() => this.props.callCanvasPage('premade')}>PREMADE</div>
						</div>
					</div>
				</div>
				{/* <div className='button' onClick={() => this.props.callPurposePage('custom')}>CUSTOM</div>
				<div className='button' onClick={() => this.props.callPurposePage('premade')}>PREMADE</div> */}
			</div>
		);
	}
}
