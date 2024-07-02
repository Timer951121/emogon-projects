import React from 'react';

export default class LoadingComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loading: props.loading};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.loading !== nextProps.loading) {
			this.setState({loading:nextProps.loading});
		}
	}

	render() {
		const {loading} = this.state;
		return (
			<div className={`page-back loading-wrapper ${loading?'active':''}`}>
				<div className='loading-circle grey'></div>
			</div>
		);
	}
}
