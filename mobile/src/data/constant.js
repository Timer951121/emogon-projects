
import imgChart from '../assets/images/chart.png';
import imgTime from '../assets/images/timeline.png';
import imgBill from '../assets/images/bill.png';
import imgService from '../assets/images/service.png';
import imgSupport from '../assets/images/support.png';
import imgDoc from '../assets/images/doc.png';

import imgChartWhite from '../assets/images/chart-white.png';
import imgTimeWhite from '../assets/images/timeline-white.png';
import imgBillWhite from '../assets/images/bill-white.png';
import imgServiceWhite from '../assets/images/service-white.png';
import imgSupportWhite from '../assets/images/support-white.png';
import imgDocWhite from '../assets/images/doc-white.png';

import imgVoltaic from '../assets/images/voltaic.png';
import imgPump from '../assets/images/pump.png';
import imgStorage from '../assets/images/storage.png';
import imgCharge from '../assets/images/charge.png';
import imgCarport from '../assets/images/carport.png';

import imgVoltaicBlack from '../assets/images/voltaic-black.png';
import imgPumpBlack from '../assets/images/pump-black.png';
import imgStorageBlack from '../assets/images/storage-black.png';
import imgChargeBlack from '../assets/images/charge-black.png';
import imgCarportBlack from '../assets/images/carport-black.png';


export const mainListArr = [
	{key:'chart', img:imgChart, imgWhite:imgChartWhite, label:'Anlagen'},
	{key:'time', img:imgTime, imgWhite:imgTimeWhite, label:'Timeline'},
	{key:'bill', img:imgBill, imgWhite:imgBillWhite, label:'Rechnungen'},
	{key:'service', img:imgService, imgWhite:imgServiceWhite, label:'Service'},
	{key:'support', img:imgSupport, imgWhite:imgSupportWhite, label:'Support'},
	{key:'technical', img:imgDoc, imgWhite:imgDocWhite, label:'Technische Daten'},
]

// export const moduleData = [
// 	[
// 		{key:'voltaic', img:imgVoltaic, imgBlack:imgVoltaicBlack, label:'Photovoltaik'},
// 		{key:'pump', img:imgPump, imgBlack:imgPumpBlack, label:'Wärmepumpe'},
// 		{key:'carport', img:imgCarport, imgBlack:imgCarportBlack, label:'Carport'},
// 	],
// 	[
// 		{key:'storage', img:imgStorage, imgBlack:imgStorageBlack, label:'Speicher'},
// 		{key:'charge', img:imgCharge, imgBlack:imgChargeBlack, label:'Ladestation'},
// 		{key:null},
// 	]
// ]

export const moduleLabelArr = [
	{key:'voltaic', label:'Photovoltaik'},
	{key:'pump', label:'Wärmepumpe'},
	{key:'storage', label:'Speicher'},
	{key:'charge', label:'Ladestation'},
	{key:'carport', label:'Carport'},
]

// export const moduleArr = [...moduleData[0], ...moduleData[1]];
export const moduleArr = [
	{key:'voltaic', img:imgVoltaic, imgBlack:imgVoltaicBlack, label:'Photovoltaik'},
	{key:'pump', img:imgPump, imgBlack:imgPumpBlack, label:'Wärmepumpe'},
	{key:'carport', img:imgCarport, imgBlack:imgCarportBlack, label:'Carport'},
	{key:'storage', img:imgStorage, imgBlack:imgStorageBlack, label:'Speicher'},
	{key:'charge', img:imgCharge, imgBlack:imgChargeBlack, label:'Ladestation'},
];

const buildingVotaicInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Provisorischer Terminplan', value:'uncheck'},
	{label:'Dachaufmass und Dachkontrolle', value:'uncheck', time:true}, //  (20.05.2023)
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Baumeldung', value:'uncheck'},
	{label:'Gebäudeversicherung', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Gerüst', value:'uncheck', time:true}, //  (14.06.2023)
	{label:'Ausführung', value:'uncheck', time:true}, //  (28.06.2023)
	{label:'Wechselrichterinbetriebnahme', value:'uncheck', time:true}, //  (07.07.2023)
	{label:'PRONOVO-Anmeldung und unabhängige Kontrolle', value:'uncheck'},
	{label:'Anlagenübergabe mit Monitoring und Anlagendoku', value:'uncheck'},
]

const materialVoltaicInfo = [
	{label:'Unterkonstruktion', value:'uncheck'},
	{label:'Photovoltaikmodule', value:'uncheck', time:true}, //  (23.05.2023)
	{label:'Optimizer', value:'uncheck'},
	{label:'Generatorkasten', value:'uncheck'},
	{label:'Wechselrichter', value:'uncheck'},
	{label:'Unterverteilung', value:'uncheck'},
]

const buildingPumpInfo = [
	{label:'Bestellung', value:'uncheck'},
	{label:'Provisorischer Terminplan', value:'uncheck'},
	{label:'Detaillierte Projektaufnahme', value:'uncheck', time:true}, //  (20.05.2023)
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Baumeldung', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true}, //  (28.06.2023)
	{label:'Inbetriebnahme', value:'uncheck', time:true}, //  (05.07.2023)
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
	{label:'Detaillierte Projektaufnahme', value:'uncheck', time:true}, //  (20.05.2023)
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true}, //  (28.06.2023)
	{label:'Inbetriebnahme', value:'uncheck', time:true}, //  (05.07.2023)
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
	{label:'Detaillierte Projektaufnahme', value:'uncheck', time:true}, //  (20.05.2023)
	{label:'Anschlussgesuch', value:'uncheck'},
	{label:'Technische Projektfreigabe', value:'uncheck'},
	{label:'Installationsanzeige', value:'uncheck'},
	{label:'Ausführung', value:'uncheck', time:true}, //  (28.06.2023)
	{label:'Inbetriebnahme', value:'uncheck', time:true}, //  (05.07.2023)
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

export const detailDataSource = {
	voltaic:{buildingArr:buildingVotaicInfo, materialArr:materialVoltaicInfo},
	pump:{buildingArr:buildingPumpInfo, materialArr:materialPumpInfo},
	storage:{buildingArr:buildingStorageInfo, materialArr:materialStorageInfo},
	charge:{buildingArr:buildingChargeInfo, materialArr:materialChargeInfo},
	carport:{buildingArr:buildingCarportInfo, materialArr:materialCarportInfo},
}

export const defaultModule = {
	voltaic:{build:buildingVotaicInfo, mat:materialVoltaicInfo},
	pump:{build:buildingPumpInfo, mat:materialPumpInfo},
	storage:{build:buildingStorageInfo, mat:materialStorageInfo},
	charge:{build:buildingChargeInfo, mat:materialChargeInfo},
	carport:{build:buildingCarportInfo, mat:materialCarportInfo},
}

export const tempArrServiceCourse = [
	{type:'service', module:'pump', time :'30. März 2023', status:'ready'},
	{type:'service', module:'storage', time :'25. März 2023', status:'ready'},
	{type:'service', module:'charge', time :'23. März 2023', status:'done'},
	{type:'service', module:'voltaic', time :'22. März 2023', status:'ready'},
	{type:'service', module:'storage', time :'20. März 2023', status:'done'},
	{type:'service', module:'storage', time :'18. März 2023', status:'done'},
	{type:'service', module:'charge', time :'15. März 2023', status:'done'},
	{type:'service', module:'pump', time :'12. März 2023', status:'ready'},
	{type:'service', module:'voltaic', time :'10. März 2023', status:'done'},
]

export const swipeConfig = {
	// velocityThreshold: 0.3,
	// directionalOffsetThreshold: 80,
	// gestureIsClickThreshold: 10
};

export const catArr = [
	{ key:'customer', label:'Neukunde' },
	{ key:'status', label:'Status' },
	{ key:'attach', label:'Anlage' },
	{ key:'app', label:'App' },
]