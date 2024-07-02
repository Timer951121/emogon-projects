import React from 'react';

import imgArrowUp from '../../assets/images/arrow-up.png';
import imgArrowDown from '../../assets/images/arrow-down.png';
import imgCheckRed from '../../assets/images/check-red.png';

export default class ThOrder extends React.Component {
	constructor(props) {
		super(props);
		const {arrow} = props;
		this.state = {arrow, check:false};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['arrow'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickArrow = (itemKey) => {
		this.setState({arrow:itemKey});
		this.props.setArrow(itemKey)
	}

	onClickCheck = (check) => {
		this.setState({check});
	}

	render() {
		const {arrow, check} = this.state;
		const {width, label, checkbox, flex1, hideArrow} = this.props;
		return (
			<div className={`header-item header-order ${flex1?'flex-1':''}`} style={{width: width}}>
				{checkbox &&
					<div className='check-item error'>
						<div className='check-box' onClick={e=>this.onClickCheck(!check)}>
							<img src={check?imgCheckRed:undefined} alt=''></img>
						</div>
					</div>
				}
				<label>{label}</label>
				{!hideArrow &&
					<div className='arrow-wrapper flex-column'>
						{[{key:'up', img:imgArrowUp}, {key:'down', img:imgArrowDown}].map((item, idx)=>
							<img className={`arrow ${arrow===item.key?'active':''}`} src={item.img} alt='' onClick={e=>this.onClickArrow(item.key)} key={idx}></img>
						)}
					</div>
				}
			</div>
		);
	}
}
