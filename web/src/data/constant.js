
import imgNewsWhite from '../assets/images/news-white.png';
import imgNewsBlack from '../assets/images/news-black.png';

import imgMailWhite from '../assets/images/mail-white.png';
import imgMailBlack from '../assets/images/mail-black.png';
import imgMailRed from '../assets/images/mail-red.png';

import imgCustomerWhite from '../assets/images/customer-white.png';
import imgCustomerBlack from '../assets/images/customer-black.png';

import imgCheckboxWhite from '../assets/images/checkbox-white.png';
import imgCheckboxBlack from '../assets/images/checkbox-black.png';

import imgTicketWhite from '../assets/images/ticket-white.png';
import imgTicketBlack from '../assets/images/ticket-black.png';

import imgDocWhite from '../assets/images/doc-white.png';
import imgDocBlack from '../assets/images/doc-black.png';

import imgSchoolWhite from '../assets/images/school-white.png';
import imgSchoolBlack from '../assets/images/school-black.png';

import imgGroupWhite from '../assets/images/group-white.png';
import imgGroupBlack from '../assets/images/group-black.png';

import imgChartWhite from '../assets/images/chart-white.png';
import imgChartBlack from '../assets/images/chart-black.png';

import imgSettingWhite from '../assets/images/setting-white.png';
import imgSettingBlack from '../assets/images/setting-black.png';

import imgSerViceWhite from '../assets/images/service-white.png';
import imgServiceBlack from '../assets/images/service-black.png';

import imgCalendarWhite from '../assets/images/calendar-white.png';
import imgCalendarBlack from '../assets/images/calendar-black.png';

import imgVoltaicWhite from '../assets/images/voltaic-white.png';
import imgPumpWhite from '../assets/images/pump-white.png';
import imgStorageWhite from '../assets/images/storage-white.png';
import imgChargeWhite from '../assets/images/charge-white.png';
import imgCarportWhite from '../assets/images/carport-white.png';

import imgVoltaicBlack from '../assets/images/voltaic-black.png';
import imgPumpBlack from '../assets/images/pump-black.png';
import imgStorageBlack from '../assets/images/storage-black.png';
import imgChargeBlack from '../assets/images/charge-black.png';
import imgCarportBlack from '../assets/images/carport-black.png';

import imgFace from '../assets/images/face-red.png';
import imgShield from '../assets/images/shield-red.png';
import imgStar from '../assets/images/star-red.png';


const imgNews = {white:imgNewsWhite, black:imgNewsBlack},
	imgMail = {white:imgMailWhite, black:imgMailBlack, red:imgMailRed},
	imgCheckbox = {white:imgCheckboxWhite, black:imgCheckboxBlack},
	imgCustomer = {white:imgCustomerWhite, black:imgCustomerBlack},
	imgTicket = {white:imgTicketWhite, black:imgTicketBlack},
	imgDoc = {white:imgDocWhite, black:imgDocBlack},
	imgSchool = {white:imgSchoolWhite, black:imgSchoolBlack},
	imgGroup = {white:imgGroupWhite, black:imgGroupBlack},
	imgChart = {white:imgChartWhite, black:imgChartBlack},
	imgSetting = {white:imgSettingWhite, black:imgSettingBlack},
	imgVoltaic = {white:imgVoltaicWhite, black:imgVoltaicBlack},
	imgPump = {white:imgPumpWhite, black:imgPumpBlack},
	imgStorage = {white:imgStorageWhite, black:imgStorageBlack},
	imgCharge = {white:imgChargeWhite, black:imgChargeBlack},
	imgCarport = {white:imgCarportWhite, black:imgCarportBlack},
	imgService = {white:imgSerViceWhite, black:imgServiceBlack},
	imgCalendar = {white:imgCalendarWhite, black:imgCalendarBlack};


const subMenuChart = [
	{key:'ticketProcess', label:'Ticketbearbeitung'},
	{key:'customerSatis', label:'Kundenzufriedenheit'},
]

const subMenuService = [
	{key:'serviceRequest', label:'Serviceanfragen:'},
	{key:'serviceWorker', label:'Servicepartner:'},
	{key:'serviceCompany', label:'Servicefirmen:'},
]

export const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const menuArr = [
	{key:'news', 	label:'Enerq News',   img:imgNews, 	create:'News posten', 		role:['Face', 'Shield', 'Star'], customer:true, service:true},
	{key:'channel', label:'Mitteilungen', img:imgMail, 	create:'Neue Nachricht', 	role:['Face', 'Shield', 'Star'], border:true},
	{key:'customer',label:'Kunden', 	  img:imgCustomer,create:'Kunde anlegen', 	role:[		  'Shield'		  ], filter:true},
	{key:'ticket', 	label:'Tickets', 	  img:imgTicket, create:'Neues Ticket', 	role:['Face', 'Shield', 'Star'], filter:true, list:true, customer:true},
	{key:'service', label:'Service', 	  img:imgService, create:'Partner anlegen', role:['Face', 'Shield', 'Star'], filter:true, list:true, subMenu:subMenuService},
	{key:'calendar',label:'Kalender', 	  img:imgCalendar, 							role:['Face', 'Shield', 'Star'], subLabel:'ENERQ Kalender'},
	// {key:'category',label:'Vorlagen', img:imgDoc,create:'Kategorie / Vorlage anlegen',role:['Face', 'Shield', 'Star'], list:true},
	// {key:'school', 	label:'Dokumentation',img:imgSchool, create:false, 				role:['Face', 'Shield', 'Star'], border:true, list:true},
	{key:'team', 	label:'Enerq Team',   img:imgGroup, create:'Mitarbeiter anlegen', role:[	  'Shield', 	  ], subLabel:'ENERQ TEAM', filter:true},
	{key:'system', label:'Projekt',   	  img:imgCustomer, create:'', role:[], customer:true, employeeDisable:true},
	{key:'serviceRequest', label:'Serviceanfragen', img:imgService, create:'', role:[], service:true, employeeDisable:true},
	// {key:'chart', 	label:'Statistiken',  img:imgChart, create:false, 				role:['Face', 'Shield', 'Star'], border:true, list:true, subMenu:subMenuChart},
	// {key:'setting', label:'Einstellungen',img:imgSetting, create:false, 			role:['Face', 'Shield', 'Star'], border:true},
	// {key:'customer', label:'Test Page',   img:imgCustomer, create:false,			role:[		  'Shield'		  ], filter:false, testMode:true},
]

const buildingVotaicInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Provisorischer Terminplan', value:'uncheck'},
	{label:'Dachaufmass und Dachkontrolle', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Baumeldung', value:'uncheck'},
	{label:'Gebäudeversicherung', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Gerüst', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Ausführung', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Wechselrichterinbetriebnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'PRONOVO-Anmeldung und unabhängige Kontrolle', value:'uncheck'},
	{label:'Anlagenübergabe mit Monitoring und Anlagendoku', value:'uncheck'},
]

const materialVoltaicInfo = [
	{label:'Unterkonstruktion', value:'uncheck'},
	{label:'Photovoltaikmodule', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Optimizer', value:'uncheck'},
	{label:'Generatorkasten', value:'uncheck'},
	{label:'Wechselrichter', value:'uncheck'},
	{label:'Unterverteilung', value:'uncheck'},
]

const buildingPumpInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Provisorischer Terminplan', value:'uncheck'},
	{label:'Detaillierte Projektaufnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Baumeldung', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Inbetriebnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anlagenübergabe mit Monitoring und Anlagendoku', value:'uncheck'},
]

const materialPumpInfo = [
	{label:'Wärmepumpe', value:'uncheck'},
	{label:'Speicher', value:'uncheck'},
	{label:'Zubehör', value:'uncheck'},
]

const buildingStorageInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Provisorischer Terminplan', value:'uncheck'},
	{label:'Detaillierte Projektaufnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Inbetriebnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anlagenübergabe mit Monitoring und Anlagendoku', value:'uncheck'},
]

const materialStorageInfo = [
	{label:'Speichermodule', value:'uncheck'},
	{label:'Wechselrichter', value:'uncheck'},
	{label:'Unterverteilung', value:'uncheck'},
]

const buildingChargeInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Provisorischer Terminplan', value:'uncheck'},
	{label:'Detaillierte Projektaufnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Inbetriebnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Anlagenübergabe mit Monitoring und Anlagendoku', value:'uncheck'},
]

const materialChargeInfo = [
	{label:'Ladestation', value:'uncheck'},
	{label:'Lastmanagement', value:'uncheck'},
	{label:'Zubehör', value:'uncheck'},
	{label:'Unterverteilung', value:'uncheck'},
]

const buildingCarportInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Prov. Terminplan', value:'uncheck'},
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Baueingabe', value:'uncheck'},
	{label:'Tech. PRojektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Baustelleneinrichtung', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'Wechselrichterinbetriebnahme', value:'uncheck', time:true, hour:'00', min:'00'},
	{label:'PRONOVO-Anmeldung', value:'uncheck'},
	{label:'Anlageübergabe', value:'uncheck'},
]

const materialCarportInfo = [
	{label:'Carport', value:'uncheck'},
	{label:'Befestigung', value:'uncheck'},
	{label:'Opitmizer', value:'uncheck'},
	{label:'Module', value:'uncheck'},
	{label:'Wechselrichter', value:'uncheck'},
	{label:'Unterverteilung', value:'uncheck'},
]

export const customerDetailMenu = [
	{key:'voltaic', ...imgVoltaic, label:'Photovoltaik', stateKey:'roleVoltaic'},
	{key:'pump', ...imgPump, label:'Wärmepumpe', stateKey:'rolePump'},
	{key:'storage', ...imgStorage, label:'Speicher', stateKey:'roleStorage'},
	{key:'charge', ...imgCharge, label:'Charge', stateKey:'roleCharge'},
	{key:'carport', ...imgCarport, label:'Carport', stateKey:'roleCarport'},
]

export const roleCustomerArr = [ {key:'face', white:imgFace, black:imgFace, stateKey:'roleFace'}, ...customerDetailMenu ];

export const defaultModule = {
	voltaic:{build:buildingVotaicInfo, mat:materialVoltaicInfo},
	pump:{build:buildingPumpInfo, mat:materialPumpInfo},
	storage:{build:buildingStorageInfo, mat:materialStorageInfo},
	charge:{build:buildingChargeInfo, mat:materialChargeInfo},
	carport:{build:buildingCarportInfo, mat:materialCarportInfo},
}

export const serviceSource = [
	{key:'', name:'A abc defg', company:'A abcdefg', location:'location A', role:25, active:3},
	{key:'', name:'B abc defg', company:'B abcdefg', location:'location B', role:17, active:2},
	{key:'', name:'C abc defg', company:'C abcdefg', location:'location C', role:6, active:1},
	{key:'', name:'D abc defg', company:'D abcdefg', location:'location D', role:9, active:4},
	{key:'', name:'E abc defg', company:'E abcdefg', location:'location E', role:18, active:5},
	{key:'', name:'A abc defg', company:'A abcdefg', location:'location A', role:25, active:3},
	{key:'', name:'B abc defg', company:'B abcdefg', location:'location B', role:17, active:2},
	{key:'', name:'C abc defg', company:'C abcdefg', location:'location C', role:6, active:1},
	{key:'', name:'D abc defg', company:'D abcdefg', location:'location D', role:9, active:4},
	{key:'', name:'E abc defg', company:'E abcdefg', location:'location E', role:18, active:5},
	{key:'', name:'A abc defg', company:'A abcdefg', location:'location A', role:25, active:3},
	{key:'', name:'B abc defg', company:'B abcdefg', location:'location B', role:17, active:2},
	{key:'', name:'C abc defg', company:'C abcdefg', location:'location C', role:6, active:1},
	{key:'', name:'D abc defg', company:'D abcdefg', location:'location D', role:9, active:4},
	{key:'', name:'E abc defg', company:'E abcdefg', location:'location E', role:18, active:5},
]

export const catArr = [
	{key:'main0', label:'Anlagen', subCat:[] },
	{key:'main1', label:'Rechnungen', subCat:[] },
	{key:'main2', label:'Mobile App', subCat:[] },
]

export const roleMemberArr = [
	{key:'face', img:imgFace, stateKey:'roleFace'},
	{key:'shield', img:imgShield, stateKey:'roleShield'},
	{key:'star', img:imgStar, stateKey:'roleStar'},
]

export const projectStatusArr = [
	'Projektstart',
	'Amtliche Eingaben',
	'Baufreigabe',
	'TAG pendent',
	'Baustart',
	'Anlagenbau',
	'Abschluss DC',
	'Abschluss AC',
	'IA pendent',
	'WA pendent',
	'Zählermontage',
	'Erstellung Dokumentation',
	'Projektabschluss'
]