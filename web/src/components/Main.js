import React from 'react';
import axios from 'axios';
import jQuery, { type } from 'jquery';

import { GetDevice, GetPageFormat } from '../data/model';
import HeaderComponent from './layout/Header';
import SideComponent from './layout/Side';

import { menuArr, catArr, serviceSource, customerDetailMenu, defaultModule } from '../data/constant';
import { localLoginTokenKey, localEmail, localPassd } from '../data/config';
import LoginComponent from './Login';
import TitleComponent from './layout/Title';
import NewsContent from './content/NewsContent';
import ChannelContent from './content/ChannelContent';
import ChannelDetail from './detail/ChannelDetail';
import ChannelCreate from './detail/ChannelCreate';
import CustomContent from './content/CustomContent';
import TicketContent from './content/TicketContent';
import CustomDetail from './detail/CustomDetail';
import CustomProfile from './detail/CustomProfile';
import TicketDetail from './detail/TicketDetail';
import CategoryContent from './content/CategoryContent';
import TeamContent from './content/TeamContent';
import MemberProfile from './detail/MemberProfile';
import { localhost } from '../data/config';
import LoadingComponent from './Loading';
import { apiUrl, serverUrl } from '../data/config';
import { GetMemberId, GetRoleStrCustomer, GetRoleStrMember, GetPreviewNews, GetParseDate, GetId, GetDeviceId, GetParseArr, GetMonthName, SendEmail } from '../data/common';
import ImageModal from './modal/ImageModal';
import WarnModal from './modal/WarnModal';
import NewsDetail from './detail/NewsDetail';
import imgEmptyNews from '../assets/images/empty-news.jpg';
import ServiceContent from './content/ServiceContent';
import CalendarContent from './content/CalendarContent';
import TicketProcessContent from './content/TicketProcessContent';
import TicketCreate from './detail/TicketCreate';
import ServiceRequestContent from './content/ServiceRequest';
import ServiceModal from './modal/ServiceModal';
import ImageResize from './modal/ImageResize';
import '../assets/css/index.css';
import ServiceWorkerContent from './content/ServiceWorker';
import WorkerProfile from './detail/WorkerProfile';
import ServiceCompanyContent from './content/ServiceCompany';

const device = GetDevice();
const skipLogin = localhost;

export default class MainComponent extends React.Component {
	constructor(props) {
		super(props);
		const emptyStr = JSON.stringify([]);
		const detailCustom = undefined; // {}
		const profileCustomer = false; // {}; // 
		const profileMember =  false; // false; //
		const profileWorker =  false; // false; //
		const detailTicket = false;
		const detailChannel = false;
		const selMenu = '' // chart
		this.state = {empStr:emptyStr, selMenu, pageKey:'login', loading: false, selFirst:'none', customerStr:emptyStr, ticketStr:emptyStr, catStr:JSON.stringify(catArr), teamStr:emptyStr, departStr:emptyStr, branchStr:emptyStr, empIdArrStr:emptyStr, systemStr:emptyStr, newsStr:emptyStr, serviceStr:emptyStr, requestStr:emptyStr, invoiceStr:emptyStr, technicalStr:emptyStr, workerStr:emptyStr, companyStr:emptyStr, appointStr:emptyStr, channelStr:emptyStr, mailStr:emptyStr, detailCustom, detailChannel, profileCustomer, profileMember, profileWorker, detailTicket, detailChange:false, imageResizeIn:false, imageResizeOut:false, pageFormat:GetPageFormat() }; 
	}

	componentDidMount () {
		// this.checkLoginSession();
		window.addEventListener("resize", (e) => {
			this.setState({pageFormat:GetPageFormat()})
		});
	}

	checkLoginSession = () => {
		const deviceId = GetDeviceId(), loginToken = localStorage.getItem(localLoginTokenKey); // 'ECFa1PXIbM'; // 
		if (!loginToken) return;
		this.setState({loading:true});
		jQuery.ajax({ type: "POST", url: apiUrl+'other/getSession.php', dataType: 'json', data: {deviceId, token:loginToken},
			success: (res) => {
				if (res && res.success) {
					this.initGetData();
					this.setState({empStr:JSON.stringify(res.empInfo), pageKey:localhost?'customer':'news'});
				}	
				this.setState({loading:false});
			}
		});
	}

	initGetData = () => {
		this.getData('getDepart', 'departStr', true);
		this.getData('getBranch', 'branchStr', true);
		this.getData('getSystem', 'systemStr', true);
		this.getData('getTicket', 'ticketStr', true);
		this.getData('getChannel', 'channelStr', true);
		this.getData('getNews', 'newsStr', true);
		this.getData('getMail', 'mailStr', true);
		this.getData('getService', 'requestStr', true);
		this.getData('getInvoice', 'invoiceStr', true);
		this.getData('getTechnical', 'technicalStr', true);
		this.getData('getCompany', 'companyStr', true);
		this.getData('getWorker', 'workerStr', true);
		// this.callAPICycle();
	}

	callAPICycle = () => {
		setTimeout(() => {
			this.getData('getTicket', 'ticketStr');
			this.callAPICycle();
		}, 1000 * 60);
	}

	getPreData = () => {
		const {departStr, branchStr, systemStr} = this.state;
		return {
			departArr:JSON.parse(departStr),
			branchArr:JSON.parse(branchStr),
			systemArr:JSON.parse(systemStr),
		};
	}

	getData = (apiName, stateKey, init) => {
		this.setState({loading:true});
		jQuery.ajax({ type: "POST", url: apiUrl+'get_data/'+apiName+'.php', dataType: 'json', // data: {email, token, curTime},
			success: (res) => {
				if (res) {
					const {departArr, branchArr} = this.getPreData();
					if (apiName==='getEmployee') {
						const empIdArr = [];
						res.forEach(item => {
							item.name = item.first + ' ' + item.last;
							item.memberId = GetMemberId(branchArr, departArr, item);
							const {roleFace, roleShield, roleStar} = GetRoleStrMember(item.role);
							item.roleFace = roleFace; item.roleShield = roleShield; item.roleStar = roleStar;
							empIdArr.push(item.employee_id);
						});
						this.setState({empIdArrStr:JSON.stringify(empIdArr)})
					} else if (apiName==='getCustomer') {
						res.forEach(item => {
							item.id = parseInt(item.id);
							item.name = item.first + ' ' + item.last;
							item.zipCode = item.zipCode || '';
							if (item.lastLogin) {
								const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(item.lastLogin);
								item.loginTime = dayNum + '/' + monthName + '/' + yearNum + ' ' + hourStr + ':' + minStr;
							}
						});

						serviceSource.forEach(item => {
							GetRoleStrCustomer(parseInt(item.role || 0), item);
						});
						this.setState({serviceStr:JSON.stringify(serviceSource)});
						
					} else if (apiName==='getSystem') {
						res.forEach((item, idx) => {
							item.id = parseInt(item.id); item.customerId = parseInt(item.customerId); item.role = parseInt(item.role);
							GetRoleStrCustomer(item.role, item);
						});
					} else if (apiName==='getNews') {
						res.sort((a, b) => b.time-a.time);
						res.forEach(item => {
							const {yearNum, monthName, dayNum, hourStr, minStr} = GetParseDate(item.time)
							item.timeStr = dayNum+'. '+monthName+' '+yearNum+' - '+hourStr+':'+minStr;
							item.imgUrl = item.image?serverUrl+'other/images/'+item.image+'.jpg':imgEmptyNews;
							item.preViewStr = GetPreviewNews(item.description);
						});
					} else if (apiName==='getTicket') {
						const {loginType, empStr} = this.state, {id} = JSON.parse(empStr);
						if (loginType==='customer') {
							res = res.filter(item=>{return parseInt(item.customerId)===parseInt(id)});
						}
					} else if (apiName==='getService') {
					} else if (apiName==='getInvoice') {
					} else if (apiName==='getTechnical') {
					} else if (apiName==='getWorker') {
						res.forEach(item => {
							item.name = item.first + ' ' + item.last;
						});
					} else if (apiName==='getCompany') {
						res.forEach(item => {
							GetRoleStrCustomer(parseInt(item.role), item);
						});
					} else if (apiName==='getChannel') {
					} else if (apiName==='getMail') {
					}
					this.setState({[stateKey]:JSON.stringify(res)}, () => {
						const {departArr, branchArr, systemArr} = this.getPreData();
						if (init) {
							if ((stateKey==='departStr' || stateKey==='branchStr') && departArr.length && branchArr.length) {
								this.getData('getEmployee', 'teamStr');
							}
						}
						if ((stateKey==='systemStr') && systemArr.length) {
							this.getData('getCustomer', 'customerStr');
						} else if (stateKey==='workerStr' || stateKey==='companyStr') {
							this.updateCompany();
							if (stateKey==='workerStr') this.setAppointArr();
						} else if (stateKey==='customerStr') {
							this.setAppointArr();
						}
					});
				}
				this.setState({loading:false});
			}
		});
	}

	setAppointArr = () => {
		const {systemStr, customerStr, workerStr, companyStr} = this.state,
			systemArr = JSON.parse(systemStr),
			customerArr = JSON.parse(customerStr),
			workerArr = JSON.parse(workerStr),
			companyArr = JSON.parse(companyStr);
		if (!systemArr.length || !customerArr.length || !workerArr.length) return;
		const appointArr = [];
		systemArr.forEach((system, idx) => {
			// if (idx > 0) return;
			const {id, name, customerId, location} = system, customerItem = customerArr.find(customer=>{return customer.id===customerId}), customerName = customerItem.name;
			const mainKeyArr = ['voltaic', 'pump', 'storage', 'charge', 'carport'], subKeyArr = ['Mat', 'Build'];
			mainKeyArr.forEach(mainKey => {
				const partLabel = customerDetailMenu.find(item=>{return item.key===mainKey}).label;
				subKeyArr.forEach(subStr => {
					if (!system[mainKey+subStr]) { return; }
					const checkArr = system[mainKey+subStr].split(',');
					checkArr.forEach((checkStr, idx) => {
						const checkInfo = checkStr.split('*'), dateInfo = checkInfo[1].split('_');
						if (dateInfo.length <= 1) return;
						const dateVal = new Date(dateInfo[0]+' '+dateInfo[1]), yearNum = dateVal.getFullYear(), month = dateVal.getMonth(), monthName = GetMonthName(month), dayNum = dateVal.getDate(), selField = defaultModule[mainKey][subStr.toLowerCase()][idx];
						// const timeInfo = dateInfo[1].split(':') // , hourVal = timeInfo[0], minVal = timeInfo[1];
						const workerItem = workerArr.find(item=>{return item.id===dateInfo[2]});
						if (!workerItem) return;
						const companyItem = companyArr.find(item=>{return item.id===workerItem.companyId});
						if (!companyItem) return;
						const dateObj = {year:yearNum, month:month+1, day:dayNum};
						appointArr.push({date:dayNum+' '+monthName+' '+yearNum, time:dateInfo[1], customer:customerName, attach:name+' '+partLabel, appoint:selField?selField.label:'', partner:companyItem.name, dateObj});
					});
				});
			});
		});
		this.setState({appointStr:JSON.stringify(appointArr)});
	}

	updateCompany = () => {
		const {companyStr, workerStr} = this.state, companyArr = JSON.parse(companyStr), workerArr = JSON.parse(workerStr);
		if (!companyArr.length || !workerArr.length) return;
		companyArr.forEach(company => {
			const empArr = workerArr.filter(worker=>{return worker.companyId===company.id});
			company.empCount = empArr.length;
		});
		this.setState({companyStr:JSON.stringify(companyArr)});
	}

	openKeyModal = () => {
		this.setState({keyModal:true}, ()=>this.setState({keyInner:true}));
	}

	createItem = () => {
		const {pageKey} = this.state;
		if (pageKey==='customer') this.setState({profileCustomer:{}});
		else if (pageKey==='team') this.setState({profileMember:{}});
		else if (pageKey==='serviceWorker') this.setState({profileWorker:{}});
		else if (pageKey==='news') this.setState({detailNews:{title:'', description:'', imageName:null}});
		else if (pageKey==='ticket') this.setState({pageKey:'createTicket'});
		else if (pageKey==='channel') this.setState({pageKey:'createChannel'});
	}

	setFilter = () => {
	}

	openDetailCustomer = (systemId, customerId) => {
		this.setState({detailCustom:systemId, nonSystemId:customerId});
	}

	openProfileCustomer = () => {
		const {systemStr, detailCustom, customerStr, nonSystemId} = this.state, customerArr = JSON.parse(customerStr);
		var customerId
		if (detailCustom) {
			const systemArr = JSON.parse(systemStr);
			const selSystem = systemArr.find(system=>{return parseInt(system.id)===detailCustom}) || {};
			customerId = selSystem.customerId;
		} else {
			customerId = nonSystemId;
		}
		const customerInfo = customerArr.find(item=>{return parseInt(item.id)===parseInt(customerId)}) || {};
		const {image} = customerInfo;
		this.setState({profileCustomer:customerInfo, imageName:image});
	}

	openDetailService = (service) => {
		console.log(service);
	}

	setPageKey = (pageKey) => {
		this.setState({pageKey, detailCustom:undefined, nonSystemId:undefined, profileCustomer:false, detailTicket:false, detailChannel:false, profileMember:false, detailNews:false, profileWorker:false});
	}

	openDetailTicket = (ticketId) => {
		const ticketArr = JSON.parse(this.state.ticketStr);
		const detailTicket = ticketArr.find(item=> parseInt(item.id)===ticketId );
		this.setState({detailTicket})
	}

	openDetailChannel = (channelId) => {
		const channelArr = GetParseArr(this.state.channelStr, ['id', 'senderId', 'receiverId']);
		const detailChannel = channelArr.find(item=> item.id===channelId );
		this.setState({detailChannel})
	}

	openProfileMember = (profileMember) => {
		const {image} = profileMember;
		this.setState({profileMember, imageName:image});
	}

	openDetailWorker = (workerId) => {
		const workerArr = GetParseArr(this.state.workerStr, ['id', 'companyId']);
		const profileWorker = workerArr.find(item=> parseInt(item.id)===workerId );
		const {image} = profileWorker;
		this.setState({profileWorker, imageName:image});
	}

	openNewsDetailPage = (detailNews) => {
		const {image} = detailNews;
		this.setState({detailNews, imageName:image});
	}

	openImageModal = (type) => {
		this.setState({modalImageOut:type}, () => this.setState({modalImageIn:true}))
	}

	openImageResize = (imagePart, imageName) => {
		this.setState({imageResizeOut:imagePart}, () => this.setState({imageResizeIn:true, imageName}))
	}

	checkDetailChange = (type, value) => {
		if (value==='system') {
			const {empStr, systemStr} = this.state;
			const customerInfo = JSON.parse(empStr), systemArr = JSON.parse(systemStr);
			const system0 = systemArr.find(system=>{return system.customerId===parseInt(customerInfo.id)});
			if (system0) this.openDetailCustomer(system0.id);
			else this.openDetailCustomer(null, customerInfo.id);
		} else if (this.state.detailChange) {
			this.setState({modalWarnOut:true, saveOrder:{type, value}}, () => this.setState({modalWarnIn:true}));
		} else {
			this.processOrder(type, value);
		}
	}

	openServiceModal = (item) => {
		this.setState({modalServiceOut:item}, e=> this.setState({modalServiceIn:true}));
	}

	setWarnResult = (result) => {
		if (!result) return;
		this.setState({detailChange:false});
		const {type, value} = this.state.saveOrder;
		this.processOrder(type, value)
	}

	processOrder = (type, value) => {
		if (type==='createItem') this.createItem();
		else if (type==='pageKey') this.setPageKey(value);
	}

	setLogout = () => {
		localStorage.setItem(localEmail, '');
		localStorage.setItem(localPassd, '');
		localStorage.setItem(localLoginTokenKey, '');
		this.setState({pageKey:'login'});
	}

	getDisableCreate = () => {
		const {pageKey, loginType, detailCustom, profileCustomer, profileMember, profileWorker} = this.state;
		if (detailCustom || profileCustomer || profileMember || profileWorker || pageKey==='serviceRequest' || pageKey==='serviceCompany') return true;
		if (loginType==='customer') {
			if (pageKey==='ticket') return false;
			else return true;
		} else if (loginType==='service') {
			return true;
		}
		return false;
	}

	getDisableFilter = () => {
		return this.getDisableCreate() || this.state.pageKey==='ticket';
	}

	render() {
		const {loginType, empStr, selMenu, pageKey, loading, customerStr, ticketStr, catStr, teamStr, branchStr, departStr, empIdArrStr, systemStr, newsStr, serviceStr, requestStr, detailCustom, detailChannel, nonSystemId, profileCustomer, profileWorker, detailTicket, profileMember, modalImageOut, modalImageIn, imageResizeIn, imageResizeOut, modalWarnOut, modalWarnIn, modalServiceOut, modalServiceIn, imageName, detailChange, detailNews, pageFormat, invoiceStr, technicalStr, workerStr, companyStr, appointStr, channelStr, mailStr} = this.state;
		return (
			<div className={`back-board ${pageKey}-page flex-column`} id='mainPage'>
				<HeaderComponent
					empStr={empStr}
					setLogout={this.setLogout}
				></HeaderComponent>
				<div className='main flex'>
					<SideComponent
						loginType={loginType}
						empStr={empStr}
						pageKey={pageKey}
						selMenu={selMenu}
						setPageKey={menuKey=>{
							this.checkDetailChange('pageKey', menuKey);
						}}
						setSelMenu={selMenu=>{
							this.setState({selMenu});
						}}
					></SideComponent>
					<div className='content'>
						<TitleComponent
							pageKey={pageKey}
							disableCreate={this.getDisableCreate()}
							disableFilter={this.getDisableFilter()}
							createItem={e=>this.createItem()} // this.checkDetailChange('createItem')
							setFilter={e=>this.setFilter()}
						></TitleComponent>
						<div className='main-content-wrapper'>
							<NewsContent
								pageKey={pageKey}
								newsStr={newsStr}
								openPageDetail={item=>this.openNewsDetailPage(item)}
							></NewsContent>
							<ChannelContent
								empStr={empStr}
								pageKey={pageKey}
								teamStr={teamStr}
								channelStr={channelStr}
								mailStr={mailStr}
								openDetailChannel={this.openDetailChannel}
							></ChannelContent>
							<CustomContent
								pageKey={pageKey}
								systemStr={systemStr}
								customerStr={customerStr}
								openDetailCustomer={this.openDetailCustomer}
							></CustomContent>
							<ServiceContent
								pageKey={pageKey}
								serviceStr={serviceStr}
								openDetailService={this.openDetailService}
							></ServiceContent>
							<ServiceRequestContent
								pageKey={pageKey}
								customerStr={customerStr}
								systemStr={systemStr}
								requestStr={requestStr}
								openServiceModal={this.openServiceModal}
							></ServiceRequestContent>
							<ServiceWorkerContent
								pageKey={pageKey}
								workerStr={workerStr}
								companyStr={companyStr}
								openDetailWorker={this.openDetailWorker}
							></ServiceWorkerContent>
							<ServiceCompanyContent
								pageKey={pageKey}
								companyStr={companyStr}
							></ServiceCompanyContent>
							<CalendarContent
								appointStr={appointStr}
								pageKey={pageKey}
								catStr={catStr}
							></CalendarContent>
							<TicketContent
								loginType={loginType}
								empStr={empStr}
								pageKey={pageKey}
								customerStr={customerStr}
								systemStr={systemStr}
								teamStr={teamStr}
								ticketStr={ticketStr}
								openDetailTicket={this.openDetailTicket}
							></TicketContent>
							<CategoryContent
								pageKey={pageKey}
								catStr={catStr}
							></CategoryContent>
							<TeamContent
								pageKey={pageKey}
								departStr={departStr}
								branchStr={branchStr}
								teamStr={teamStr}
								openProfileMember={this.openProfileMember}
								setLoading={loading=>this.setState({loading})}
							></TeamContent>
							<MemberProfile
								empStr={empStr}
								profileMember={profileMember}
								branchStr={branchStr}
								departStr={departStr}
								empIdArrStr={empIdArrStr}
								imageName={imageName}
								setLoading={loading=>this.setState({loading})}
								callTeamAPI={e=>this.getData('getEmployee', 'teamStr')}
								resetImage={e=>this.setState({imageName:null})}
								setPageKey={this.setPageKey}
								openImageModal={e=>this.openImageModal('profile')}
							></MemberProfile>
							<TicketProcessContent
								pageKey={pageKey}
							></TicketProcessContent>
						</div>
						<CustomDetail
							loginType={loginType}
							customerStr={customerStr}
							detailChange={detailChange}
							teamStr={teamStr}
							systemStr={systemStr}
							ticketStr={ticketStr}
							invoiceStr={invoiceStr}
							technicalStr={technicalStr}
							detailCustom={detailCustom}
							nonSystemId={nonSystemId}
							imageName={imageName}
							workerStr={workerStr}
							companyStr={companyStr}
							setLoading={loading=>this.setState({loading})}
							openProfileCustomer={this.openProfileCustomer}
							openDetailTicket={ticketId=>this.openDetailTicket(ticketId)}
							setDetailChange={detailChange=>this.setState({detailChange})}
							checkDetailChange={this.checkDetailChange}
							setSelSystemId={systemId=>this.setState({detailCustom:systemId})}
							openImageResize={imgSrc=>this.openImageResize('check', imgSrc)}
							callInvoiceAPI={e=>this.getData('getInvoice', 'invoiceStr')}
							callTechnicalAPI={e=>this.getData('getTechnical', 'technicalStr')}
						></CustomDetail>
						<CustomProfile
							profileCustomer={profileCustomer}
							selSystemId={detailCustom}
							customerStr={customerStr}
							imageName={imageName}
							systemStr={systemStr}
							setLoading={loading=>this.setState({loading})}
							callCustomerAPI={e=>this.getData('getCustomer', 'customerStr')}
							callSystemAPI={e=>this.getData('getSystem', 'systemStr')}
							resetImage={e=>this.setState({imageName:null})}
							setPageKey={this.setPageKey}
							openImageModal={e=>this.openImageModal('profile')}
							setSelSystemId={systemId=>this.setState({detailCustom:systemId})}
							closeCustomerProfile={e=>this.setState({profileCustomer:false, imageName:false})}
						></CustomProfile>
						<WorkerProfile
							profileWorker={profileWorker}
							workerStr={workerStr}
							companyStr={companyStr}
							imageName={imageName}
							setLoading={loading=>this.setState({loading})}
							callWorkerAPI={e=>this.getData('getWorker', 'workerStr')}
							callCompanyAPI={e=>this.getData('getCompany', 'companyStr')}
							resetImage={e=>this.setState({imageName:null})}
							setPageKey={this.setPageKey}
							openImageModal={e=>this.openImageModal('profile')}
							closeWorkerProfile={e=>this.setState({profileWorker:false, imageName:false})}
						></WorkerProfile>
						<NewsDetail
							detailNews={detailNews}
							loginType={loginType}
							imageName={imageName}
							setLoading={loading=>this.setState({loading})}
							callNewsAPI={e=>this.getData('getNews', 'newsStr')}
							resetImage={e=>this.setState({imageName:null})}
							setPageKey={this.setPageKey}
							openImageModal={imgSrc=>this.openImageResize('news', imgSrc)}
							closeNewsDetail={e=>this.setState({detailNews:false, imageName:false})}
						></NewsDetail>
						<TicketDetail
							loginType={loginType}
							empStr={empStr}
							teamStr={teamStr}
							systemStr={systemStr}
							customerStr={customerStr}
							detailTicket={detailTicket}
							callTicketAPI={e=>this.getData('getTicket', 'ticketStr')}
							closeDetailTicket={e=>this.setState({detailTicket:false})}
							setLoading={loading=>this.setState({loading})}
						></TicketDetail>
						<TicketCreate
							pageKey={pageKey}
							empStr={empStr}
							loginType={loginType}
							customerStr={customerStr}
							systemStr={systemStr}
							teamStr={teamStr}
							ticketStr={ticketStr}
							callTicketAPI={e=>this.getData('getTicket', 'ticketStr')}
							setPageKey={pageKey=>this.setState({pageKey})}
							setLoading={loading=>this.setState({loading})}
						></TicketCreate>
						<ChannelDetail
							pageKey={pageKey}
							empStr={empStr}
							channelStr={channelStr}
							teamStr={teamStr}
							detailChannel={detailChannel}
							callChannelAPI={e=>this.getData('getChannel', 'channelStr')}
							setPageKey={pageKey=>this.setState({pageKey})}
							setLoading={loading=>this.setState({loading})}
							closedetailChannel={e=>this.setState({detailChannel:false})}
						></ChannelDetail>
						<ChannelCreate
							pageKey={pageKey}
							empStr={empStr}
							teamStr={teamStr}
							channelStr={channelStr}
							callChannelAPI={e=>this.getData('getChannel', 'channelStr')}
							setPageKey={pageKey=>this.setState({pageKey})}
							setLoading={loading=>this.setState({loading})}
						></ChannelCreate>
					</div>
				</div>
				<ImageModal
					modalImageOut={modalImageOut}
					modalImageIn={modalImageIn}
					setLoading={loading=>this.setState({loading})}
					setImageName={imageName=>this.setState({imageName})}
					closeModal={key=>this.setState({[key]:false})}
				></ImageModal>
				<ImageResize
					imageResizeIn={imageResizeIn}
					imageResizeOut={imageResizeOut}
					imageName={imageName}
					setLoading={loading=>this.setState({loading})}
					setImageName={imageName=>this.setState({imageName})}
					closeModal={key=>this.setState({[key]:false})}
				></ImageResize>
				<ServiceModal
					modalServiceOut={modalServiceOut}
					modalServiceIn={modalServiceIn}
					closeModal={key=>this.setState({[key]:false})}
				></ServiceModal>
				<WarnModal
					modalWarnOut={modalWarnOut}
					modalWarnIn={modalWarnIn}
					closeModal={key=>this.setState({[key]:false})}
					setResult={confirm=>{ this.setWarnResult(confirm) }}
				></WarnModal>
				<LoginComponent
					pageKey={pageKey}
					openDashboard={ (empInfo, loginType) => {
						this.setState({loginType, empStr:JSON.stringify(empInfo), pageKey:(localhost&&loginType==='employee')?'customer':'news'}, () => { // 
							this.initGetData();
							// SendEmail(empInfo.email, 'bule_house@yahoo.com', 'Login Success', '<p>You are logged on ENERQ project.</p>')
						});
						// login news mail customer ticket category team service calendar ticketProcess
						// if (localhost) setTimeout(() => { this.createItem() }, 1000);
					}}
					setLoading={loading=>this.setState({loading})}
				></LoginComponent>
				<a></a>
				<LoadingComponent
					loading={loading}
				></LoadingComponent>
				
				{device?
					<div className={`back-board over-board device-note flex-column`}>
						<div className='note-wrapper flex'>
							<label>Please open on desktop device</label>
						</div>
					</div>:
					<div className={`back-board over-board device-note flex-column ${pageFormat==='port'?'active':''}`}>
						<div className='note-wrapper flex'>
							<label>Please use with landscape mode</label>
						</div>
					</div>
				}
				
			</div>
		);
	}
}
