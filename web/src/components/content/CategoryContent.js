
import React from 'react';
import Filter from '../layout/Filter';
import imgArrow from '../../assets/images/arrow-down-black.png';
import { Icon } from '../../data/common';

const tableW = 1178/100;
const filterArr = [
	{key:'keyword', label:'Stichwörter', width:358/tableW},
]

export default class CategoryContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, catStr} = props;
		this.state = {pageKey, keyword:'', catStr, catArr:JSON.parse(catStr)};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'catStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key=== 'catStr') {
					this.setState({catArr:JSON.parse(nextProps.catStr)});
				}
			}
		});
	}

	changeFilterStr = (filterKey, str) => {
		this.setState({[filterKey]:str})
	}

	setFilter = () => {
		console.log('filter');
	}

	render() {
		const {pageKey, keyword, catArr} = this.state;
		return (
			<div className={`main-content ${pageKey==='category'?'active':''} content-category`}>
				<Filter
					filterArr={filterArr}
					keyword={keyword}
					button={true}
					changeFilterStr={this.changeFilterStr}
					setFilter={e=>this.setFilter()}
				></Filter>
				<div className='content'>
					{catArr.map((item, idx)=>
						<div className='cat-item' key={idx}>
							<div className='line'></div>
							<Icon classStr='icon-small' img={imgArrow}></Icon>
							<div className='label'>{item.label}</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}
