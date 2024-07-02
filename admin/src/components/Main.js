import React from 'react';
import AdminComponent from './Admin';
import LoginComponent from './Login';
function getDevice() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/windows phone/i.test(userAgent)) { return "windows"; }
	if (/android/i.test(userAgent)) { return "android"; }
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) { return "ios"; }
	return undefined;
}
const testMode = false, device = getDevice();

export default class MainComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {pageKey:'login'};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
	}

	render() {
		const {pageKey, userInfo} = this.state;
		return (
			<div className={`page-wrapper ${device?'mobile':''}`}>
                <LoginComponent
                    pageKey={pageKey}
					testMode={testMode}
                    setAdminPage={(userInfo)=>this.setState({pageKey:'admin', userInfo})}
                ></LoginComponent>
                <AdminComponent
                    pageKey={pageKey}
					userInfo={userInfo}
                    setPageKey={(pageKey)=>this.setState({pageKey})}
                ></AdminComponent>
			</div>
		);
	}
}
