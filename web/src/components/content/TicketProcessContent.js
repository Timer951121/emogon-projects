
import React from 'react';
import jQuery from 'jquery';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';

import { Icon } from '../../data/common';

import imgClose from '../../assets/images/close.png';
import imgCalendar from '../../assets/images/calendar-black.png';
import imgTimeFooter from '../../assets/images/time-footer-icon.png';

const timeArr = [
	{key:'min10', label:'10 Min', value:5.9},
	{key:'min30', label:'30 Min', value:12},
	{key:'hour1', label:'1 Std', value:8},
	{key:'hour2', label:'2 Std', value:7},
	{key:'hour4', label:'4 Std', value:14},
	{key:'day1', label:'1 Tag', value:21},
	{key:'week1', label:'1 Woche', value:2.1},
]
const maxTimeVal = Math.max(...timeArr.map(item => item.value)) * 2

export default class TicketProcessContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey} = props;
		this.state = {pageKey, dateS:new Date(), dateE:new Date(), numStatus:60, numAnswer:75};
	}

	componentDidMount() {
		this.docH = document.documentElement.offsetHeight;
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='pageKey') {
				}
			}
		});
	}

	onChangeDate = (date, key) => {
		this.setState({[key]:date});
	}

	getProLabel = (mainKey, subKey) => {
		const selPro = this.state[mainKey];
		const realPro = subKey==='close'?selPro:100-selPro;
		return realPro.toFixed(1);
	}

	render() {
		const {pageKey, dateS, dateE, imageName, title, description, oriDescription} = this.state;
		return (
			<div className={`main-content ${pageKey==='ticketProcess'?'active':''} content-ticketProcess`}>
				<div className='main-part main-top'>
					<div className='title'>Ticketbearbeitungsstatus Enerq Team:</div>
					<div className='select-wrapper'>
						<div className='select-label'>Kategorie:</div>
						<select>
							<option value={0}>Value 1</option>
							<option value={1}>Value 2</option>
							<option value={2}>Value 3</option>
						</select>
					</div>
					<div className='select-wrapper'>
						<div className='select-label'>Mitarbeiter:</div>
						<select>
							<option value={0}>Value 1</option>
							<option value={1}>Value 2</option>
							<option value={2}>Value 3</option>
						</select>
					</div>
					<div className='select-wrapper'>
						<div className='select-label'>Zeitraum:</div>
						<div className='select-inner'>
							<div className='check-wrapper'>
								<div className='check-box flex'><img src={imgClose}></img></div>
								<div className='check-label'>Alles</div>
							</div>
							<div className='check-wrapper'>
								<div className='check-box flex'><img src={imgClose}></img></div>
								<div className='check-label'>Dieser Monat</div>
							</div>
							<div className='check-wrapper'>
								<div className='check-box'></div>
								<div className='check-label'>Von:</div>
								<div className='calendar'>
									<DatePicker onChange={e=>this.onChangeDate(e, 'dateS')} value={dateS} />
									<img className='vir-icon' src={imgCalendar}></img>
								</div>
								<div className='check-label'>Bis:</div>
								<div className='calendar'>
									<DatePicker onChange={e=>this.onChangeDate(e, 'dateE')} value={dateE} />
									<img className='vir-icon' src={imgCalendar}></img>
								</div>
							</div>
						</div>
					</div>
					<div className='button'>Filtern</div>
				</div>
				<div className='main-part main-bottom'>
					<div className='bar-area'>
						{[
							{key:'numStatus', label:'Offene & Geschlossense Tickets derzeit'},
							{key:'numAnswer', label:'Offene Tickets: Beantwortet oder Unbeantwortet'}
						].map((mainItem, mainIdx)=>
							<div className='bar-item' key={mainIdx}>
								<div className='bar-label'>{mainItem.label} : </div>
								<div className='bar-outer'>
									<div className='bar-inner' style={{width:this.state[mainItem.key]+'%' }}></div>
								</div>
								<div className='bar-value'>
									{[{key:'close', label:'Geschlossen'}, {key:'open', label:'Offen'}].map((subItem, subIdx)=>
										<div className='value-item' key={subIdx}>
											<div className={`value-icon icon-${subItem.key}`}></div>
											<div className='value-label'>{subItem.label}</div>
											<div className='value-pro'>{this.getProLabel(mainItem.key, subItem.key)} %</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
					<div className='time-area'>
						<div className='time-title'>Zeit bis zur ersten Antwort des Personals:</div>
						<div className='time-canvas time-width flex'>
							{timeArr.map((item, idx)=>
								<div className='time-item' key={idx}>
									<div className='time-space'></div>
									<div className='time-label'>{item.value.toFixed(1)} %</div>
									<div className='time-color' style={{height:120*item.value/maxTimeVal+'px'}}></div>
								</div>
							)}
						</div>
						<div className='time-labels time-width flex'>
							{timeArr.map((item, idx)=>
								<div className='time-item flex' key={idx}>
									<label>{item.label}</label>
								</div>
							)}
						</div>
						<div className='time-footer'>
							<img src={imgTimeFooter}></img>
							<label>Durchschnittliche Zeit bis zur ersten Antwort: 10 Std</label>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
