import React from 'react';

export default class ModuleComponent extends React.Component {
	constructor(props) {
		super(props);
		const {moduleStr} = props;
		this.state = {moduleStr, moduleArr:JSON.parse(moduleStr)};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['moduleStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='moduleStr') {
					this.setState({moduleArr:JSON.parse(nextProps[key])})
				}
			}
		});
	}

	render() {
		const {moduleArr} = this.state;
		return (
			<>
				<div className='label main-label module-label'>{this.props.moduleLabel}</div>
				<div className='module-part flex-column'>
					{moduleArr.map((row, rowidx)=>
						<div className='module-row flex' key={rowidx}>
							{row.map((item, itemIdx)=>
								<div className={`button button-module ${item.active?'':'unactive'}`} key={itemIdx} onClick={e=>this.props.onClickModule(item.key)}>
									<div className='button-row'>
										<img src={item.img} alt=''></img>
										<label>{item.label}</label>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</>
		);
	}
}
