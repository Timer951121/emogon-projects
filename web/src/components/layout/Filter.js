
import React from 'react';

// import imgLogo from '../../assets/images/logo.png';

export default class Filter extends React.Component {
	constructor(props) {
		super(props);
		// const {middleKey} = props;
		this.state = {};
	}

	componentDidMount() {
		const {filterArr, selectArr} = this.props;
		filterArr.forEach(item => {
			this.setState({[item.key]:''})
		});
		if (selectArr && selectArr.length) {
			selectArr.forEach(item => {
				this.setState({[item.key]:true})
			});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const {filterArr, selectArr} = this.props;
		filterArr.forEach(item => {
			if (this.state[item.key] !== nextProps[item.key]) {
				this.setState({[item.key]:nextProps[item.key]})
			}
		});
		if (selectArr && selectArr.length) {
			selectArr.forEach(item => {
				if (this.state[item.key] !== nextProps[item.key]) {
					this.setState({[item.key]:nextProps[item.key]})
				}
			});
		}
	}

	onChangeInput = (e, itemKey) => {
		const str = e.target.value;
		this.props.changeFilterStr(itemKey, str);
	}

	onClickIcon = (itemKey) => {
		const newVal = !this.state[itemKey]
		this.props.changeFilterIcon(itemKey, newVal);
	}

	render() {
		const {filterArr, selectArr, button, space} = this.props;
		return (
			<div className='filter-wrapper'>
				<div className='filter-title'>Suchen:</div>
				<div className='filter-content flex'>
					{filterArr.map((item, idx)=>
						<div className={`filter-item ${item.flex1?'flex-1':''}`} style={{width: 'calc('+item.width+'% - 1px)'}} key={idx}>
							<input placeholder={item.label} value={this.state[item.key] || ''} onChange={e=>this.onChangeInput(e, item.key)}></input>
						</div>
					)}
					{selectArr && selectArr.length > 1 &&
						<div className='filter-item icons'>
							{selectArr.map((item, idx) => 
								<div className={`icon over-zoom ${this.state[item.key]?'':'disable'}`} key={idx}>
									<img src={item.img} onClick={e=>this.onClickIcon(item.key)} key={idx}></img>
								</div>
							)}
						</div>
					}
					{button &&
						<div className='button-wrapper'>
							<div className='button' onClick={e=>this.props.setFilter}>Filtern</div>
						</div>
					}
					{space !== undefined &&
						<div style={{width:space}}></div>
					}
				</div>
			</div>
		);
	}
}
