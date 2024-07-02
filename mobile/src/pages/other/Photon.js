import React from 'react';
// import Photon from 'photon';
import { DemoClass } from './PhotonSDK';
import { GetRoomName } from '../data/common';
// import imgMatterLogo from '../assets/image/matter-logo.png';

const DemoAppId = "b38e5e93-8609-44f4-9dde-03086c5aa752";
const DemoAppVersion = "1.0";

export default class PhotonComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = { pageKey:props.pageKey, msgStr:'', disableCreate:true, disableJoin:true, disableLeave:true, playerCount:0, userInfo:null, status:'', playMode:props.playMode, userArr:[], sendInfo:props.sendInfo };
	}

	componentDidMount() {
		this.demo = new DemoClass(
			DemoAppId, DemoAppVersion,
			this.updateRoomInfo, this.updateButton,
			this.receiveInfo
		);
		this.demo.start();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.pageKey !== nextProps.pageKey) {
			this.setState({pageKey:nextProps.pageKey});
		}
		if (this.state.playMode !== nextProps.playMode) {
			this.setState({playMode:nextProps.playMode}, () => {
				if (this.props.userInfo.role==='guest' && this.state.playMode==='guide') this.createRoom();
				else if (this.state.playMode===null) this.leaveRoom();
			});
		}
		if (this.props.userInfo.role==='admin' && this.state.sendInfo !== nextProps.sendInfo) {
			this.setState({sendInfo: nextProps.sendInfo}, () => {
				this.sendMessage();
			});
		}
	}

	updateRoomInfo = (roomInfo, userInfo) => {
		const {playerCount} = roomInfo; // name, masterClientId, 
		if (playerCount !== this.state.playerCount) {
			this.setState({playerCount});
			this.props.updateRoomInfo(roomInfo);
		}
		const userArr = [];
		Object.keys(userInfo).forEach(key => {
			const userItem = userInfo[key];
			userArr.push({num:userItem.actorNr, id:userItem.userId});
		});
		const oldUserArr = this.state.userArr; //, oldStatus = this.state.status;
		if (userArr !== oldUserArr) {
			var status = userArr.length<2?'connecting':'connected';
			status = this.state.playMode?status:'';
			this.setState({userArr, status}, () => {
				if (userArr.length === 1 && oldUserArr.length === 2 && this.state.status !== '') {
					const userLabel = this.props.userInfo.role === 'admin'?'Guest':'Admin';
					console.log('leave');
					window.alert(userLabel+' user left from this connect');
					if (this.props.userInfo.role==='admin') {
						this.leaveRoom();
						this.setState({status:''});
					}
				}
			});
		}
	}

	receiveInfo = (code, content, actorNr) => {
		if (!content || !content.message || this.props.userInfo.role!=='guest') return;
		this.props.receiveMatterInfo(content.message);
	}

	joinRoom = () => {
		if (this.demo.isInLobby()) {
			const menu = document.getElementById("gamelist");
			const gameId = menu.children[menu.selectedIndex].textContent;
			// this.demo.output(gameId);
			// this.state.setState({playMode:'guide'});
			this.props.setPlayMode('guide');
			this.demo.joinRoom(gameId, { expectedUsers:undefined });
		} else {
			window.alert("Reload page to connect to Master");
		}
	}
	createRoom = () => {
		if (this.demo.isInLobby()) {
			const roomName = GetRoomName(this.props.userInfo);
			this.setState({status:'connecting'});
			this.demo.createRoom(roomName, { maxPlayers: 2 }); // expectedUsers: undefined, 
		} else {
			window.alert("Reload page to connect to Master");
		}
	}
	leaveRoom = () => {
		this.demo.leaveRoom();
		this.setState({status:''});
		this.props.setPlayMode(null);
	}
	sendMessage = () => {
		if (this.demo.isJoinedToRoom()) {
			this.demo.sendMessage(this.state.sendInfo);
		} else {
			if (this.demo.isInLobby()) {
				// console.log("Press Join or New Game to connect to Game");
			} else {
				// console.log("Reload page to connect to Master");
			}
		}
	}
	// changeMessage = (e) => { this.setState({msgStr:e.target.value}); }
	updateButton = (disableCreate, disableJoin, disableLeave) => {
		// console.log(disableCreate, disableJoin, disableLeave);
		this.setState({disableCreate, disableJoin, disableLeave});
	}

	render() {
		const {playMode, status, disableCreate, disableJoin, disableLeave} = this.state; // , userArr
		const {role} = this.props.userInfo
		var playStr = (role==='admin')?'self-play':'';
		if (playMode==='self') playStr = 'self-play';
		return (
			<div className={`back-board flex active photon-demo ${status} ${playStr}`}>
				 {/* ${role==='admin'&& roomName !=='' ?'admin-waiting':'admin-play'} */}
				{role==='admin' &&
					<div className={`admin-photon ${!disableJoin?'active':''}`}>
						<div className='photon-status'>Guest request</div>
						<select id="gamelist"></select>
						<div className='button-wrapper flex'>
							<div className='button' onClick={()=>this.joinRoom()}>Accept</div>
							<div className='button btn-grey' onClick={()=>this.props.setPlayMode('self')}>Cancel</div>
						</div>
						{/* <input type="text" value={msgStr} onChange={this.changeMessage}></input>
						<div className='button' onClick={this.sendMessage}>Send</div> */}
					</div>
				}
				{role === 'guest' && !playMode &&
					<div className='guest-select flex'>
						<div className='buttons flex'>
							<div className='button' onClick={()=>this.props.setPlayMode('self')}>Self Explore</div>
							{disableCreate ?
								<div className='photon-status'>Please wait...</div>:
								<div className='button' onClick={()=>this.props.setPlayMode('guide')}>Guided Tour</div>
							}
						</div>
						{/* <img src={imgMatterLogo} alt=''></img> */}
					</div>
				}
				{!disableLeave &&
					<div className='button leave-room' onClick={this.leaveRoom}>Leave Room</div>
				}
				{role==='guest' && status !== '' &&
					<div className='photon-status'>{status}</div>
				}
			</div>
		);
	}
}
