
import React, {useState, useEffect} from 'react';
import { Platform, Alert, PermissionsAndroid, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from "@react-native-firebase/messaging";

import notifee from '@notifee/react-native';
import axios from 'axios';

import { apiUrl, batteryKey, deviceTokenKey, storageKey, workerInfoKey } from './src/data/config';
import { navigationRef } from './src/pages/RootNavigation';
import FirstComponent from './src/pages/First';
import TotalComponent from './src/pages/Total';
import ChartFirstComponent from './src/pages/chart/ChartFirst';
import ChartMainComponent from './src/pages/chart/ChartMain';
import ServiceDetailComponent from './src/pages/service/ServiceDetail';
import ProfileComponent from './src/pages/Profile';
import NewsComponent from './src/pages/News';
import WeatherComponent from './src/pages/Weather';
import LoadingComponent from './src/pages/Loading';
import ErrorComponent from './src/pages/layout/Error';

import { CreateNoteChannel, SendPushNote } from './src/data/pushNote';
import { GetIdStr, GetRoleStrCustomer, GetMonthName, GetPreviewNews, UpdateHtmlStr, parseApiData, GetTimeStr, SortComCustomArr, SendEmail } from './src/data/common';
import { detailDataSource, moduleLabelArr, tempArrServiceCourse } from './src/data/constant';
import { wholeWidth, wholeHeight } from './src/assets/css';
import TicketInfoComponent from './src/pages/support/TicketInfo';
import imgEmptyNews from './src/assets/images/empty-news.jpg';
import TicketCreateComponent from './src/pages/support/TicketCreate';
import TicketListComponent from './src/pages/support/TicketList';
import TicketChatComponent from './src/pages/support/TicketChat';
import CameraComponent from './src/pages/Camera';
import SupportMainComponent from './src/pages/support/SupportMain';
import ServiceMainComponent from './src/pages/service/ServiceMain';
import ServiceCreateComponent from './src/pages/service/ServiceCreate';
import ChartDetailComponent from './src/pages/chart/ChartDetail';
import LogoComponent from './src/pages/Logo';
import BeforeComponent from './src/pages/Before';
import AGBComponent from './src/pages/profile/AGB';
import ImpressComponent from './src/pages/profile/Impress';
// import DeviceInfo from 'react-native-device-info';
import VersionNoteComponent from './src/pages/VersionNote';
import ComMainComponent from './src/pages/company/ComMain';
import ComPartComponent from './src/pages/company/ComPart';
import InvoiceMainComponent from './src/pages/invoice/InvoiceMain';
import InvoicePDFComponent from './src/pages/invoice/InvoicePDF';
import TimelineComponent from './src/pages/Timeline';
import TechnicalMainComponent from './src/pages/technical/TechnicalMain';
import TechnicalPDFComponent from './src/pages/technical/TechnicalPDF';

const appVerInstall = 1.01;
// rohan.raj@trentecsystems.com
if (Platform.OS==='ios') {
	async function requestUserPermission() {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;
		if (enabled) { } // console.log('Authorization status:', authStatus);
	}
	requestUserPermission();
} else {
	PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

enableScreens();

const weekArr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], monthArr = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const test = false, skipWeather = true, skipToken = true, skipData = false, skipBattery = true;
const Stack = createNativeStackNavigator();
var saveSelIdx = 0, saveSystemInfo = [];
var loadStatus = {news:false, ticket:false, team:false, token:false};

function App() {

	const areaSize = useSafeAreaInsets();
	const otherHeight = areaSize.top + areaSize.bottom;

	const [codeStr, setCodeStr] = useState('');
	const [noteArr, setNoteArr] = useState([]);
	const [selFirst, setSelFirst] = useState('input');
	const [systemOptionArr, setSystemOptionArr] = useState([]);
	const [error, setError] = useState();
	const [verNote, setVerNote] = useState();
	const [token, setToken] = useState(); // test?
	const [newsArr, setNewsArr] = useState([]);
	const [weatherArr, setWeatherArr] = useState([]);
	const [ticketArr, setTicketArr] = useState([]);
	const [invoiceArr, setInvoiceArr] = useState([]);
	const [selInvoice, setSelInvoice] = useState(null);
	const [technicalArr, setTechnicalArr] = useState([]);
	const [selTechnical, setSelTechnical] = useState(null);
	const [comCustomerArr, setComCustomerArr] = useState([]);
	const [selCustomer, setSelCustomer] = useState({});

	const [chartKey, setChartKey] = useState();
	const [serviceKey, setServiceKey] = useState();

	const [loading, setLoading] = useState(false);
	const [profile, setProfile] = useState(false);
	const [mainInfo, setMainInfo] = useState({});
	// const [detailStr, setDetailStr] = useState();
	const [moduleInfo, setModuleInfo] = useState({});
	const [systemInfo, setSystemInfo] = useState([]);
	// const [serviceInfo, setServiceInfo] = useState([]);
	const [selSystem, setSelSystem] = useState({});
	const [selIdx, setSelIdx] = useState(0);
	const [roleInfo, setRoleInfo] = useState({});
	const [serviceCourseArr, setServiceCourseArr] = useState([]);
	const [selTicketId, setSelTicketId] = useState(0);
	const [teamArr, setTeamArr] = useState([]);
	const [unRead, setUnread] = useState(0);

	useEffect( () => { // async
		// AsyncStorage.getItem(deviceTokenKey).then((str) => {
		// 	if (str) {
		// 		setToken(str);
		// 		setTimeout(() => { checkLoadStatus('token'); }, 100); 
		// 	} else {
				if (skipToken) {
					setToken(GetIdStr());
					setTimeout(() => { checkLoadStatus('token'); }, 100);
				} else {
					messaging().getToken().then(token => {
						setToken(token);
						// AsyncStorage.setItem( deviceTokenKey, token);
						setTimeout(() => { checkLoadStatus('token'); }, 100);
					}).catch(err => {
						setError('Failed to get token from firebase');
						setToken(GetIdStr());
						setTimeout(() => { checkLoadStatus('token'); }, 100);
					});
				}
		// 	}
		// });

		if (Platform.OS == 'ios') {
		} else if (Platform.OS == 'android' && !skipBattery) {
			AsyncStorage.getItem(batteryKey).then( (check) => { // async
				if (test) {}
				else if (check) {  }
				else {
					// const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
					// if (batteryOptimizationEnabled) {
						Alert.alert(
							'Restrictions Detected',
							'To ensure notifications are delivered, please disable battery optimization for background push notification.',
							[
								{ text: 'OK', onPress: async () => {
									AsyncStorage.setItem( batteryKey, true);
									notifee.openBatteryOptimizationSettings();
									// notifee.openPowerManagerSettings();
								}, },
								{ text: "Cancel", onPress: () => { AsyncStorage.setItem( batteryKey, true); }, style: "cancel" },
								{ text: "Later", onPress: () => {}, style: "cancel" }
							],
							{ cancelable: false }
						);
					// };
				}
			});
		}
		
		// messaging().onNotificationOpenedApp(async (remoteMessage) => { // this.backgroundNotificationListener = // When a user tap on a push notification and the app is in background
		// 	console.log("Background Push Notification opened")
		// });
		
		// messaging().getInitialNotification().then((remoteMessage) => { // this.closedAppNotificationListener = // When a user tap on a push notification and the app is CLOSED
		// 	if (remoteMessage) { console.log("App Closed Push Notification opened")	}
		// });

		// messaging().setBackgroundMessageHandler(async remoteMessage => {
		// 	console.log('Message handled in the background!', remoteMessage);
		// });

		// messaging().onTokenRefresh(newToken => {
		// 	setToken(newToken);
		// 	if (codeStr) {
		// 		setTimeout(() => { onClickCode(); }, 100);
		// 	}
		// });

		messaging().onMessage((res) => {
			// const messageData = {"collapseKey": "com.enerqproject", "data": {}, "from": "605626815686", "messageId": "0:1690380517340836%6b4919eb6b4919eb", "notification": {"android": {"color": "", "smallIcon": "", "sound": "default"}, "body": "Sie haben eine neue Antwort vom ENERQ Team!", "title": "ENERQ Support"}, "sentTime": 1690380517320, "ttl": 2419200}
			// const checkData   = {"collapseKey": "com.enerqproject", "data": {}, "from": "605626815686", "messageId": "0:1690380810800312%6b4919eb6b4919eb", "notification": {"android": {"color": "", "smallIcon": "", "sound": "default"}, "body": "Photovoltaik : Provisorischer Terminplan wurde abgeschlossen!", "title": "System0"}, "sentTime": 1690380810779, "ttl": 2419200}
			const {title, body} = res.notification;
			SendPushNote(title, '', body);

			if (title !== 'ENERQ Support') {
				AsyncStorage.getItem(storageKey).then((str) => {
					if (str) { onClickCode(false, str); }
				});
			} else {
				getTicketData();
			}
		});

		setLoading('first');
		CreateNoteChannel();
		if (skipData) {
			setTimeout(() => { checkLoadStatus('news'); checkLoadStatus('team'); }, 3000);
		} else {
			getNewsData();
			getTeamData();
		}
	}, []);

	useEffect(() => {
		saveSystemInfo = [...systemInfo];
	}, [systemInfo]);
	useEffect(() => {
		saveSelIdx = selIdx;
	}, [selIdx]);
	useEffect(() => {
		getTicketData();
		getInvoiceData();
		getTechnicalData();
	}, [selSystem])
	useEffect(() => {
		if (selInvoice) navigationRef.navigate('InvoicePDF');
	}, [selInvoice]);
	useEffect(() => {
		if (selTechnical) navigationRef.navigate('TechnicalPDF');
	}, [selTechnical]);

	const setCustomerInfo = (mainInfo, newSystemInfo) => {
		mainInfo.id = parseInt(mainInfo.id);
		setMainInfo(mainInfo);
		setSystemInfo(newSystemInfo);
		setTimeout(() => { setSelSystemIdx(saveSelIdx); }, 100);
	}

	const getNewsData = () => {
		axios.get(`${apiUrl}get_data/getNews.php`).then(res => {
			const {data} = res;
			data.sort((a, b) => b.time-a.time);
			data.forEach(item => {
				item.timeStr = GetTimeStr(item.time, 'news');
				// item.imgUrl = item.image?apiUrl+'other/images/'+item.image+'.jpg':imgEmptyNews;
				item.preViewStr = GetPreviewNews(item.description);
				item.description = UpdateHtmlStr(item.description);
				item.preViewStr = UpdateHtmlStr(item.preViewStr);
			});
			setNewsArr(data);
			checkLoadStatus('news');
		}).catch(error => { });
	}

	const getTicketData = () => {
		if (!selSystem || !selSystem.id) return;
		axios.post(`${apiUrl}mobile/getTicket.php`, {systemId:selSystem.id}).then(res => {
			const data = parseApiData(res.data, ['id', 'customerId', 'systemId']);
			var unReadCount = 0;
			data.forEach(item => {
				item.lastTimeStr = GetTimeStr(item.lastTime, 'ticket');
				unReadCount += item.unRead;
			});
			setTicketArr(data);
			setUnread(unReadCount);
		}).catch(error => {  });
	}

	const getInvoiceData = () => {
		if (!selSystem || !selSystem.id) return;
		axios.post(`${apiUrl}mobile/getInvoice.php`, {systemId:selSystem.id}).then(res => {
			const data = parseApiData(res.data, ['id', 'customerId', 'systemId', 'time']);
			setInvoiceArr(data);
		}).catch(error => {  });
	}

	const getTechnicalData = () => {
		if (!selSystem || !selSystem.id) return;
		axios.post(`${apiUrl}mobile/getTechnical.php`, {systemId:selSystem.id}).then(res => {
			const data = parseApiData(res.data, ['id', 'customerId', 'systemId', 'time']);
			setTechnicalArr(data);
		}).catch(error => {  });
	}

	const getTeamData = () => {
		axios.get(`${apiUrl}get_data/getEmployee.php`).then(res => {
			const data = parseApiData(res.data, ['id', 'customerId', 'systemId']);
			data.forEach(item => {
				item.id = parseInt(item.id);
				item.name = item.first + ' ' + item.last;
			});
			setTeamArr(data);
			checkLoadStatus('team');
		}).catch(error => {
			console.error(error);
		});
	}

	const checkLoadStatus = (key) => {
		loadStatus[key] = true;
		if (loadStatus.news && loadStatus.team && loadStatus.token) {
			setLoading(false);
			AsyncStorage.getItem(workerInfoKey).then((str) => {
				console.log('------      saved worker info      -------');
				console.log(str);
				if (str) {
					const workerInfo = JSON.parse(str);
					onClickEmail(workerInfo.email, workerInfo.passd);
				} else {
					navigationRef.navigate('Before');
					AsyncStorage.getItem(storageKey).then((str) => {
						console.log('------      saved qr-code      -------');
						console.log(str);
						if (str) {
							setSelFirst('input');
							setCodeStr(str);
							navigationRef.navigate('Before');
							setTimeout(() => { onClickCode(true, str); }, 100);
						} else {
							navigationRef.navigate('Before');
						}
					});
				}
			});
		}
	}

	const onClickCode = (loading, savedCode, type) => {
		if (loading) setLoading(true);
		var qrCodeStr = codeStr || savedCode;
		if (type==='camera') qrCodeStr = savedCode;
		axios.post(`${apiUrl}mobile/login-custom.php`, {'passd': qrCodeStr, token}).then(response => {
			const {success, mainInfo, systemInfo, serviceInfo, appVersion, updateSql} = response.data;
			if (appVerInstall < parseFloat(appVersion)) {
				setVerNote(true);
			} else if (success) {
				mainInfo.name = mainInfo.first + ' ' + mainInfo.last;
				const optionArr = [], serviceArr = [];
				systemInfo.forEach(item => {
					optionArr.push(item.name+' '+item.canton);
					GetRoleStrCustomer(item);
				});
				setSystemOptionArr(optionArr);
				serviceInfo.forEach(service => {
					const {id, customerId, mainType, subType, content, time} = service;
					const systemId = parseInt(service.systemId);
					const moduleLabel = moduleLabelArr.find(item=>item.key===mainType).label;
					const selSystem = systemInfo.find(system=>{return system.id===systemId}) || {};
					const systemLabel = selSystem.name + ' ' + selSystem.canton;
					serviceArr.push({type:'service', id:parseInt(id), customerId:parseInt(customerId), systemId, time:GetTimeStr(time, 'service'), moduleLabel, systemLabel, subType, content});
				});
				setCustomerInfo(mainInfo, systemInfo);
				// setServiceInfo(serviceArr);
				tempArrServiceCourse.forEach(course => {
					course.moduleLabel = moduleLabelArr.find(item=>item.key===course.module).label;
					course.systemLabel = 'Baumstraße 4';
				});
				setServiceCourseArr(serviceArr); // tempArrServiceCourse
				if (loading) {
					navigationRef.navigate('First');
					setCodeStr(qrCodeStr);
					AsyncStorage.setItem( storageKey, qrCodeStr);
					saveSelIdx = 0;
					setSelSystemIdx(0);
					setSelFirst('confirm');
					// SendEmail('bule_house@yahoo.com', 'rohan.raj@trentecsystems.com', 'test', '<p>test content</p>');
				} else {
					setTimeout(() => { setSelSystemIdx(saveSelIdx); }, 100);
				}
			} else {
				if (type==='camera') setError('Login fehlgeschlagen!');
				else setError('Login failed!');
			}
			setLoading(false);
		}).catch(error => { console.error(error); setLoading(false); });
	}

	const onClickEmail = (email, passd) => {
		setLoading(true);
		axios.post(`${apiUrl}mobile/login-worker.php`, {email, passd}).then(response => {
			const {success, mainInfo, customerInfo, systemInfo, appVersion, updateSql} = response.data;
			if (appVerInstall < parseFloat(appVersion)) {
				setVerNote(true);
			} else if (success) {
				const serviceArr = [];
				// {"canton": "", "company_id": "1", "email": "worker0@gmail.com", "first": "first", "id": "1", "image": "", "last": "worker", "location": "location work 0", "other": null, "passd": "password0", "street": "street work 0"}
				systemInfo.forEach((system, systemIdx) => {
					const {customerId, location, id} = system;
					['voltaic', 'pump', 'storage', 'charge', 'carport'].forEach(mainKey => {
						['Build', 'Mat'].forEach(subKey => {
							const fieldStr = system[mainKey+subKey], subLabel = subKey==='Build'?'buildingArr':'materialArr';
							if (!fieldStr) return;
							const partInfo = detailDataSource[mainKey][subLabel];
							const fieldArr = fieldStr.split(',');
							fieldArr.forEach((itemStr, fieldIdx) => {
								const itemArr = itemStr.split('*'), timePartStr = itemArr[1];
								if (!timePartStr || timePartStr === ' ') return;
								const timeInfo = timePartStr.split('_'), workerNum = timeInfo[2];
								if (!workerNum || workerNum !== mainInfo.id) return;
								const customerItem = customerInfo.find(customer=>{return customer.id === customerId});
								if (!customerItem) {console.log('error', customerId); return;}
								const {first, last, email} = customerItem, lastNum = serviceArr.length;
								const dateStr = timeInfo[0], timeStr = timeInfo[1];
								const dateTimeStr = dateStr+'_'+timeStr;
								const fieldInfo = partInfo[fieldIdx]||{};
								
								serviceArr.push({id, key:'service'+lastNum, name:first+' '+last, email, location, dateStr, timeStr, dateTimeStr, mainKey, subKey, fieldIdx, fieldLabel:fieldInfo.label}) // , timeStr:timeInfo[0]+'T'+timeInfo[1]
							});
						});
					});
				});
				mainInfo.name = mainInfo.first + ' ' +mainInfo.last;
				setMainInfo(mainInfo);
				setSystemInfo(systemInfo);
				const sortedArr = SortComCustomArr(serviceArr);
				setComCustomerArr(sortedArr);
				AsyncStorage.setItem( workerInfoKey, JSON.stringify({email, passd}));
				navigationRef.navigate('ComMain');
			} else {
				setError('Login failed!');
			}
			setLoading(false);
		}).catch(error => { console.error(error); setLoading(false); });
	}

	const callWeatherAPI = (selSystem) => {
		const {latitude, longitude} = selSystem;
		
		// axios.get(`https://api.pirateweather.net/forecast/3RGeAn0zO2BZukIu/${latitude},${longitude}?&units=ca`).then(res => { // ca si us uk
		// 	res.data.daily.data.forEach(day => {
		// 		const {temperatureHigh, temperatureLow, icon, time} = day;
		// 		const dateVal = new Date(time * 1000), monthNum = dateVal.getMonth(), dayNum = dateVal.getDay(), dateNum = dateVal.getDate();
		// 		weatherArr.push({date:weekArr[dayNum]+', '+dateNum+'. '+monthArr[monthNum], high:temperatureHigh, low:temperatureLow, status:icon});
		// 	});
		// 	setWeatherArr(weatherArr);
		// }).catch(error => {
		// 	console.error(error);
		// });


		if (skipWeather) {
			const weatherTextArr = ['sonnig', 'bedeckt', 'wolkig', 'leicht bewölkt', 'Regen', 'leicht Regen'];
			for (let i = 0; i < 7; i++) {
				weatherArr.push({date:weekArr[i]+', '+(i+12)+'. '+monthArr[5], high:Math.round(Math.random()*30), low:Math.round(Math.random()*20), status:Math.round(Math.random()*6), label:weatherTextArr[Math.floor(Math.random()*6)]})
			}
			setWeatherArr(weatherArr);
		} else {
			setLoading(true);
			const apiUrl = 'https://forecast9.p.rapidapi.com/rapidapi/forecast/'+latitude+'/'+longitude+'/summary/';
			const headers = { 'X-RapidAPI-Key': '1a4051298dmsh680adcb8fb0b8b1p1acb67jsn0b256fd5fe36', 'X-RapidAPI-Host': 'forecast9.p.rapidapi.com' }
			const options = { method: 'GET', url: apiUrl, headers };

			axios.request(options).then(res => {
				res.data.items.forEach(item => {
					const {date, temperature, weather} = item, {min, max} = temperature, {state, text} = weather;
					const dateInfo = date.split('-'), yearNum = dateInfo[0], monthNum = parseInt(dateInfo[1]) - 1, dateNum = dateInfo[2], dateVal = new Date(item.date), dayNum = dateVal.getDay();
					weatherArr.push({date:weekArr[dayNum]+', '+dateNum+'. '+monthArr[monthNum], high:max, low:min, status:state, label:text});
					// if (state===4 || state===5 || state>6) console.log(state, text);
				});
				setWeatherArr(weatherArr);
				setLoading(false);
			}).catch(err => {console.log(err); setLoading(false);})
		}
	}

	const setComSelDate = (itemKey, dateStr, timeStr) => {
		const newCustomer = {...selCustomer}, tempCustomerArr = [...comCustomerArr];
		newCustomer.dateStr = dateStr;
		newCustomer.timeStr = timeStr;
		newCustomer.dateTimeStr = dateStr+'_'+timeStr;
		setSelCustomer(newCustomer);
		var selServiceItem;
		tempCustomerArr.forEach(item => {
			if (item.key!==itemKey) return;
			item.dateStr = dateStr;
			item.timeStr = timeStr;
			item.dateTimeStr = dateStr+'_'+timeStr;
			selServiceItem = {...item};
		});
		const newCustomerArr = SortComCustomArr(tempCustomerArr);
		// newCustomerArr.sort((a, b) => {
		// 	if (a.dateTimeStr < b.dateTimeStr) { return -1; }
		// 	if (a.dateTimeStr > b.dateTimeStr) { return 1; }
		// 	return 0;
		// });
		setComCustomerArr(newCustomerArr);
		const cloneSystemInfo = [...systemInfo];
		const {id, mainKey, subKey, fieldIdx} = selServiceItem;
		cloneSystemInfo.forEach(system => {
			if (system.id !== id) return;
			const fieldStr = system[mainKey+subKey];
			if (!fieldStr) return;
			const fieldArr = fieldStr.split(','), newFieldArr = [];
			fieldArr.forEach((itemStr, oldIdx) => {
				if (oldIdx !== fieldIdx) {newFieldArr.push(itemStr); return;}
				const itemArr = itemStr.split('*');
				itemArr[1] = dateStr + '_' + timeStr + '_' + mainInfo.id;
				// itemStr = itemArr.join('*');
				newFieldArr.push(itemArr.join('*'));
			});
			const newFieldStr = newFieldArr.join(',');
			setLoading(true);
			axios.post(`${apiUrl}mobile/updateSystem.php`, {id, mainKey, subKey, str:newFieldStr}).then(res => {
				// const {} = response.data;
				setLoading(false);
			}).catch(error => { console.error(error); setLoading(false); });
		});
	}

	const setLogout = () => {
		setProfile(false);
		setMainInfo({});
		setSelFirst('input');
		setCodeStr('');
		setSystemInfo([]);
		setSelSystem({});
		AsyncStorage.setItem( storageKey, '');
		AsyncStorage.setItem( workerInfoKey, '');
		setTimeout(() => { navigationRef.navigate('First'); }, 0);
	}

	const setSelSystemIdx = (newIdx) => {
		const systemInfo = [...saveSystemInfo];
		if (!systemInfo.length) return;
		setSelIdx(newIdx);
		const selectedSystem = systemInfo[newIdx];
		if (!selectedSystem) return;
		setSelSystem(selectedSystem);
		callWeatherAPI(selectedSystem);
		setModuleInfo(selectedSystem.moduleInfo || {});
		setRoleInfo(selectedSystem.roleInfo || {});
	}

	const openTicketInfo = () => {
		navigationRef.navigate('TicketInfo');
	}

	return (
		<SafeAreaView
			style={{backgroundColor:'white', width:wholeWidth, height: wholeHeight}} // wholeHeight
			onTouchStart={e=>{
				this.touchSX = e.nativeEvent.pageX;
				this.touchSY = e.nativeEvent.pageY;
				this.touchST = Date.now();
			} }
			onTouchEnd={e => {
				const touchDisX = e.nativeEvent.pageX - this.touchSX,
					  touchDisY = e.nativeEvent.pageY - this.touchSY,
					  touchDisT = Date.now() - this.touchST,
					  routeName = navigationRef.getCurrentRoute().name;
				if (touchDisT < 400 && touchDisX > 100 && touchDisY < touchDisX  && routeName !== 'Logo') {
					navigationRef.goBack();
					getTicketData();
					setSelTicketId(0);
				}
			} }>
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator initialRouteName="Logo"  mode="modal" gestureEnabled={!profile}
					screenOptions={{
						headerShown: false,
						headerMode: 'none', header: () => null,
						gestureEnabled: false
						// animationTypeForReplace:'pop', animationEnabled:true,
					}}>
					<Stack.Screen name="Logo">{(props) =>
						<LogoComponent {...props} />}
					</Stack.Screen>
					<Stack.Screen name="Before" options={{headerShown: false}}>{(props) =>
						<BeforeComponent {...props}
							otherHeight={otherHeight}
						/>}
					</Stack.Screen>
					<Stack.Screen name="First">{(props) => //  options={horizontalAnimation}
						<FirstComponent {...props}
							test={test}
							codeStr={codeStr}
							selIdx={selIdx}
							selFirst={selFirst}
							mainInfo={mainInfo}
							systemOptionArr={systemOptionArr}
							setCodeStr={setCodeStr}
							setSelFirst={setSelFirst}
							showError={error=>setError(error)}
							onClickCode={onClickCode}
							onClickEmail={onClickEmail}
							setLoading={setLoading}
							setSelSystemIdx={newIdx=> {
								saveSelIdx = newIdx;
								setSelSystemIdx(newIdx);
							}}
						/>}
					</Stack.Screen>
					<Stack.Screen name="QRScan">{(props) => //  options={horizontalAnimation}
						<CameraComponent {...props}
							openProfile={()=>setProfile(true)}
							setCodeStr={str=>{
								setTimeout(() => { onClickCode(true, str, 'camera') }, 100);
							}}
						/>}
					</Stack.Screen>
					<Stack.Screen name="Total">{(props) => // options={horizontalAnimation}
						<TotalComponent {...props}
							mainInfo={mainInfo}
							selSystem={selSystem}
							unRead={unRead}
							setChartKey={chartKey=>setChartKey(chartKey)}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="InvoiceMain">{(props) => // options={horizontalAnimation}
						<InvoiceMainComponent {...props}
							mainInfo={mainInfo}
							selSystem={selSystem}
							invoiceArr={invoiceArr}
							setSelInvoice={setSelInvoice}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="InvoicePDF">{(props) => // options={horizontalAnimation}
						<InvoicePDFComponent {...props}
							mainInfo={mainInfo}
							selInvoice={selInvoice}
							setSelInvoice={setSelInvoice}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="ChartFirst">{(props) => 
						<ChartFirstComponent {...props}
							mainInfo={mainInfo}
							roleInfo={roleInfo}
							setChartKey={chartKey=>setChartKey(chartKey)}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="ChartMain">{(props) =>
						<ChartMainComponent {...props}
							mainInfo={mainInfo}
							selSystem={selSystem}
							chartKey={chartKey}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="ChartDetail">{(props) =>
						<ChartDetailComponent {...props}
							moduleInfo={moduleInfo}
							chartKey={chartKey}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>

					<Stack.Screen name="Profile">{(props) =>
						<ProfileComponent {...props}
							profile={profile}
							mainInfo={mainInfo}
							closeProfile={e=>setProfile(false)}
							setLogout={e=>setLogout()}
							setMainInfo={setMainInfo}
							setLoading={loading=>setLoading(loading)}
						></ProfileComponent>}
					</Stack.Screen>
					<Stack.Screen name="Timeline">{(props) =>
						<TimelineComponent {...props}
							mainInfo={mainInfo}
							selSystem={selSystem}
							openProfile={()=>setProfile(true)}
						></TimelineComponent>}
					</Stack.Screen>
					<Stack.Screen name="AGB">{(props) =>
						<AGBComponent {...props}
						></AGBComponent>}
					</Stack.Screen>
					<Stack.Screen name="Impress">{(props) =>
						<ImpressComponent {...props}
						></ImpressComponent>}
					</Stack.Screen>
					<Stack.Screen name="News">{(props) =>
						<NewsComponent {...props}
							mainInfo={mainInfo}
							newsArr={newsArr}
						></NewsComponent>}
					</Stack.Screen>
					<Stack.Screen name="Weather">{(props) =>
						<WeatherComponent {...props}
							mainInfo={mainInfo}
							weatherArr={weatherArr}
						></WeatherComponent>}
					</Stack.Screen>

					<Stack.Screen name="SupportMain">{(props) =>
						<SupportMainComponent {...props}
							selSystem={selSystem}
							unRead={unRead}
						/>}
					</Stack.Screen>
					<Stack.Screen name="TicketCreate">{(props) =>
						<TicketCreateComponent {...props}
							selSystem={selSystem}
							mainInfo={mainInfo}
							ticketArr={ticketArr}
							teamArr={teamArr}
							setLoading={loading=>setLoading(loading)}
							callTicketAPI={e=>getTicketData()}
						/>}
					</Stack.Screen>
					<Stack.Screen name="TicketList">{(props) =>
						<TicketListComponent {...props}
							mainInfo={mainInfo}
							selSystem={selSystem}
							ticketArr={ticketArr}
							openDetailTicket={ticketId=>{
								setSelTicketId(ticketId);
								setTimeout(() => { navigationRef.navigate('TicketChat'); }, 0);
							}}
						></TicketListComponent>}
					</Stack.Screen>
					<Stack.Screen name="TicketChat">{(props) =>
						<TicketChatComponent {...props}
							teamArr={teamArr}
							ticketArr={ticketArr}
							mainInfo={mainInfo}
							selTicketId={selTicketId}
							setLoading={loading=>setLoading(loading)}
							openTicketInfo={openTicketInfo}
							resetSelTicketId={e=>{
								getTicketData();
								setSelTicketId(0);
							}}
						></TicketChatComponent>}
					</Stack.Screen>
					<Stack.Screen name="TicketInfo">{(props) =>
						<TicketInfoComponent {...props}
							ticketArr={ticketArr}
							mainInfo={mainInfo}
							selSystem={selSystem}
							selTicketId={selTicketId}
						></TicketInfoComponent>}
					</Stack.Screen>

					<Stack.Screen name="ServiceMain">{(props) =>
						<ServiceMainComponent {...props}
							setServiceKey={serviceKey=>setServiceKey(serviceKey)}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="ServiceDetail">{(props) =>
						<ServiceDetailComponent {...props}
							serviceKey={serviceKey}
							selSystem={selSystem}
							serviceCourseArr={serviceCourseArr}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="ServiceCreate">{(props) =>
						<ServiceCreateComponent {...props}
							teamArr={teamArr}
							mainInfo={mainInfo}
							selSystem={selSystem}
							setLoading={loading=>setLoading(loading)}
							setError={error=>setError(error)}
						/>}
					</Stack.Screen>

					<Stack.Screen name="ComMain">{(props) =>
						<ComMainComponent {...props}
							mainInfo={mainInfo}
							comCustomerArr={comCustomerArr}
							setSelCustomer={setSelCustomer}
							setLogout={setLogout}
						/>}
					</Stack.Screen>
					<Stack.Screen name="ComPart">{(props) =>
						<ComPartComponent {...props}
							mainInfo={mainInfo}
							selCustomer={selCustomer}
							setSelDate={(key, dateStr, timeStr)=>setComSelDate(key, dateStr, timeStr)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="TechnicalMain">{(props) =>
						<TechnicalMainComponent {...props}
							mainInfo={mainInfo}
							technicalArr={technicalArr}
							setSelTechnical={setSelTechnical}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>
					<Stack.Screen name="TechnicalPDF">{(props) => // options={horizontalAnimation}
						<TechnicalPDFComponent {...props}
							mainInfo={mainInfo}
							selTechnical={selTechnical}
							setSelTechnical={setSelTechnical}
							openProfile={()=>setProfile(true)}
						/>}
					</Stack.Screen>

				</Stack.Navigator>
			</NavigationContainer>
			<ErrorComponent
				error={error}
				resetError={e=>setError(false)}
			></ErrorComponent>
			<VersionNoteComponent
				appVerInstall={appVerInstall}
				verNote={verNote}
				otherHeight={otherHeight}
				closeNoteModal={e=>setVerNote(false)}
			></VersionNoteComponent>
			<LoadingComponent
				loading={loading}
			></LoadingComponent>
		</SafeAreaView>
	);
}

export default App;
