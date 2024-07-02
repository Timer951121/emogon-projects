
import React from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, utils } from 'react-modern-calendar-datepicker';

import Filter from '../layout/Filter';
import imgService from '../../assets/images/service-black.png';
import { GetMonthName, GetParseArr, Icon } from '../../data/common';

const tableW = 1178/100;
const filterArr = [
	{key:'client', label:'Partnername', width:358/tableW},
	{key:'location', label:'Ortschaft', width:358/tableW},
]

const timeLabelArr = [
	{key:'customer', label:'Kunde'}, 
	{key:'attach', label:'Anlage'},
	{key:'appoint', label:'Terminart'},
	{key:'partner', label:'Partner'}
];

const fieldArr = [
	{key:'date', width:15},
	{key:'customer', width:15},
	{key:'attach', width:30},
	{key:'appoint', width:20, flex1:true},
	{key:'partner', width:20},
]

const today = new Date(), year = today.getFullYear(), month = today.getMonth()+1, day = today.getDate();
const todayObj = {year, month, day}

function GetTimeArr(srcArr, e) {
	const timeArr = [], {year, month, day} = e;
	srcArr.forEach(item => {
		if (item.dateObj.year===year && item.dateObj.month===month && item.dateObj.day===day) timeArr.push(item);
	});
	return timeArr;
}

export default class CalendarContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, catStr, appointStr} = props;
		this.appointArr = GetParseArr(appointStr, ['id']);
		this.state = {pageKey, keyword:'', catStr, catArr:JSON.parse(catStr), selDay:todayObj, appointDays:[], timeArr:[], appointStr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'catStr', 'appointStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key=== 'catStr') {
					this.setState({catArr:JSON.parse(nextProps.catStr)});
				} else if (key==='appointStr') {
					this.appointArr = GetParseArr(nextProps.appointStr, ['id']);
					const appointDays = [];
					this.appointArr.forEach(appoint => { appointDays.push({...appoint.dateObj, className:'appoint'}); });
					this.setState({appointDays, timeArr:GetTimeArr(this.appointArr, todayObj)});
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

	setSelDay = (e) => {
		this.setState({selDay:e, timeArr:GetTimeArr(this.appointArr, e)});
	}

	render() {
		const {pageKey, keyword, selDay, appointDays, timeArr} = this.state;
		return (
			<div className={`main-content ${pageKey==='calendar'?'active':''} content-calendar`}>
				<div className='calendar-wrapper'>
					<Calendar
						value={selDay}
						onChange={e=>this.setSelDay(e)}
						minimumDate={utils().getToday()}
						// colorPrimary="#F4ABA7" // added this
						// colorPrimaryLight="rgba(75, 207, 250, 0.4)"
						calendarClassName="calendar-inner" // and this
						calendarTodayClassName="calendar-today"
						shouldHighlightWeekends
						customDaysClassName = {appointDays}
						// renderFooter={() => (
						// 	<div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 2rem' }}>
						// 		<button type="button" onClick={() => { this.setSelDay(null) }} style={{ border: '#0fbcf9', color: '#fff', borderRadius: '0.5rem', padding: '1rem 2rem', }}>
						// 			Reset Value!
						// 	  </button>
						// 	</div>
						// )}
					/>
					<div className='time-wrapper'>
						<div className='label'>Enerq Termine für den {selDay.day}. {GetMonthName(selDay.month-1)} {selDay.year}</div>
						<div className='time-list scroll scroll-y'>
							{timeArr.map((item, itemIdx)=>
								<div className='time-item flex' key={itemIdx}>
									<div className='time-label flex'>{item.time}</div>
									<div className='time-value'>
										{timeLabelArr.map((subItem, subIdx) => 
											<div className='sub-item' key={subIdx}>
												<div className='sub-label'>{subItem.label} : </div>
												<div className='sub-value'>{item[subItem.key]} </div>
											</div>
										)}
									</div>
									<div className='icon-wrapper flex'>
										<Icon img={imgService}></Icon>
									</div>
								</div>
							)}
							{timeArr.length===0 &&
								<div className='no-appoint'>There is not any appoint on selected day.</div>
							}
						</div>
					</div>
				</div>
				<Filter
					filterArr={filterArr}
					keyword={keyword}
					button={true}
					changeFilterStr={this.changeFilterStr}
					setFilter={e=>this.setFilter()}
				></Filter>
				<div className='content'>
					<div>Termine nach Kriterien:</div>
					<div className='table-content scroll scroll-y' id='calendarTableContent'>
						{this.appointArr.map((item, idx)=>
							<div className='table-row flex' key={idx}>
								{fieldArr.map((field, fieldIdx) =>
									<div className={`calender-${field.key} ${field.flex1?'flex-1':''}`} style={{width:'calc('+field.width+'% - 25px)' }} key={fieldIdx}>
										{item[field.key]}
									</div>
								)}
							</div>
						)}
						{this.appointArr.length===0 &&
							<div className='label empty-label'>There is not any data</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
