'use strict';

import React, {
	PropTypes
}               from 'react';
import {
	ListView,
	StyleSheet,
	View
}               from 'react-native';

import Month    from './Month';


export default class Calendar extends React.Component {
	static defaultProps = {
		startDate: new Date(),
		monthsCount: 12,
		onSelectionChange: () => {
		},

		monthsLocale: ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'],
		weekDaysLocale: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

		width: 280,

		bodyBackColor: 'white',
		bodyTextColor: 'black',
		headerSepColor: 'grey',

		monthTextColor: 'black',

		dayCommonBackColor: 'white',
		dayCommonTextColor: 'black',

		dayDisabledBackColor: 'white',
		dayDisabledTextColor: 'grey',

		daySelectedBackColor: '#4169e1',
		daySelectedTextColor: 'white',

		dayInRangeBackColor: '#87cefa',
		dayInRangeTextColor: 'black',

		isFutureDate: false,
		rangeSelect: true
	};

	static propTypes = {
		selectFrom: PropTypes.instanceOf(Date),
		selectTo: PropTypes.instanceOf(Date),

		monthsCount: PropTypes.number,
		startDate: PropTypes.instanceOf(Date),

		monthsLocale: PropTypes.arrayOf(PropTypes.string),
		weekDaysLocale: PropTypes.arrayOf(PropTypes.string),
		startFromMonday: PropTypes.bool,

		onSelectionChange: PropTypes.func,

		width: PropTypes.number,

		bodyBackColor: PropTypes.string,
		bodyTextColor: PropTypes.string,
		headerSepColor: PropTypes.string,

		monthTextColor: PropTypes.string,

		monthHeaderTextStyles: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.number
		]),

		monthHeaderStyles: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.number
		]),


		dayCommonBackColor: PropTypes.string,
		dayCommonTextColor: PropTypes.string,

		dayDisabledBackColor: PropTypes.string,
		dayDisabledTextColor: PropTypes.string,

		daySelectedBackColor: PropTypes.string,
		daySelectedTextColor: PropTypes.string,

		dayInRangeBackColor: PropTypes.string,
		dayInRangeTextColor: PropTypes.string,

		isFutureDate: PropTypes.bool,
		rangeSelect: PropTypes.bool,
		showFullYear: PropTypes.bool,
		weekTextStyles: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.number
		]),
		useCircleMarkers: PropTypes.bool,
		showScrollIndicator: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.changeSelection = this.changeSelection.bind(this);
		this.generateMonths = this.generateMonths.bind(this);

		let {selectFrom, selectTo, monthsCount, startDate} = this.props;

		this.selectFrom = selectFrom;
		this.selectTo = selectTo;
		this.months = this.generateMonths(monthsCount, startDate);

		var dataSource = new ListView.DataSource({rowHasChanged: this.rowHasChanged});

		this.state = {
			dataSource: dataSource.cloneWithRows(this.months)
		}
	}

	componentDidMount() {
		let date = new Date();
		let dayNum = this.props.selectFrom.getDate();
		let monthDifference = this.props.selectFrom.getMonth() - date.getMonth();

		if(monthDifference < 0) {
			monthDifference = 12 - Math.abs(monthDifference);
		}

		// selected month - this month * height of calendar
		// need to account for long months
		let scrollDistance = (monthDifference * 320) + (monthDifference * 30); // estimated height + num month headers * height

		if(dayNum >= 15) {
			let scrollOffset = (dayNum - 15) * 20;
			scrollDistance = scrollDistance + scrollOffset
		}

		this.refs.calendar.scrollTo({x: 0, y: scrollDistance, animated: true});

	}

	rowHasChanged(r1, r2) {
		for (var i = 0; i < r1.length; i++) {
			if (r1[i].status !== r2[i].status && !r1[i].disabled) {
				return true;
			}
		}
	}

	generateMonths(count, startDate) {
		var months = [];
		var dateUTC;
		var monthIterator = startDate;
		var {isFutureDate, startFromMonday} = this.props;

		var startUTC = Date.UTC(startDate.getYear(), startDate.getMonth(), startDate.getDate());

		for (var i = 0; i < count; i++) {
			var month = this.getDates(monthIterator, startFromMonday);
			let rangePosition = null;

			months.push(month.map((day) => {
				dateUTC = Date.UTC(day.getYear(), day.getMonth(), day.getDate());

				if(this.selectFrom.toDateString() === day.toDateString()){
					rangePosition = 'selectFrom';
				}else if(this.selectTo.toDateString() === day.toDateString()){
					rangePosition = 'selectTo';
				}

				return {
					date: day,
					status: this.getStatus(day, this.selectFrom, this.selectTo),
					disabled: day.getMonth() !== monthIterator.getMonth()
					|| ((isFutureDate) ? startUTC > dateUTC : startUTC < dateUTC),
					position: rangePosition
				}
			}));

			if (isFutureDate) {
				monthIterator.setMonth(monthIterator.getMonth() + 1);
			} else {
				monthIterator.setMonth(monthIterator.getMonth() - 1);
			}
		}

		return months;
	}

	getDates(month, startFromMonday) {
		month = new Date(month);
		month.setDate(1);

		var delta = month.getDay();
		if (startFromMonday) {
			delta--;
			if (delta === -1) delta = 6;
		}

		var startDate = new Date(month);
		startDate.setDate(startDate.getDate() - delta);

		month.setMonth(month.getMonth() + 1);
		month.setDate(0);

		delta = 6 - month.getDay();
		if (startFromMonday) {
			delta++;
			if (delta === 7) delta = 0;
		}

		var lastDate = new Date(month);
		lastDate.setDate(lastDate.getDate() + delta);

		var allDates = [];
		while (startDate <= lastDate) {
			allDates.push(new Date(startDate));
			startDate.setDate(startDate.getDate() + 1);
		}
		return allDates;
	}

	changeSelection(value) {
		var {selectFrom, selectTo, months} = this;

		if (!selectFrom) {
			selectFrom = value;
			selectTo = null;
		} else if (!selectTo) {
			if (value > selectFrom) {
				selectTo = value;
			} else {
				selectFrom = value;
			}
		} else if (selectFrom && selectTo) {
			selectFrom = value;
			selectTo = null;
		}

		months = months.map((month) => {
			return month.map((day) => {
				let rangePosition = null;
				let hideBgHighlight = false;

				if(day.date === selectFrom){
					rangePosition = 'selectFrom';
				}else if(day.date === selectTo){
					rangePosition = 'selectTo';
				}

				if(selectTo === null){
					hideBgHighlight =  true;
				}

				return {
					date: day.date,
					status: this.getStatus(day.date, selectFrom, selectTo),
					disabled: day.disabled,
					position: rangePosition,
					hideBgHighlight: hideBgHighlight
				}
			})
		});

		if (this.props.rangeSelect) {
			this.selectFrom = selectFrom;
			this.selectTo = selectTo;
		} else {
			this.selectFrom = this.selectTo = selectFrom;
		}

		this.months = months;

		this.props.onSelectionChange(selectFrom, selectTo);

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(months)
		});
	}

	getStatus(date, selectFrom, selectTo) {
		if (selectFrom) {
			if (selectFrom.toDateString() === date.toDateString()) {
				return 'selected';
			}
		}
		if (selectTo) {
			if (selectTo.toDateString() === date.toDateString()) {
				return 'selected';
			}
		}
		if (selectFrom && selectTo) {
			if (selectFrom < date && date < selectTo) {
				return 'inRange';
			}
		}
		return 'common';
	}

	render() {
		let {style, isFutureDate, showScrollIndicator} = this.props;
		let directionStyles = {};
		let scrollStyles = true;

		if (!isFutureDate) {
			directionStyles = {
				transform: [{scaleY: -1}]
			}
		}

		if(!showScrollIndicator){
			scrollStyles = false;
		}

		return (
			<ListView
				ref={'calendar'}
				initialListSize={5}
				scrollRenderAheadDistance={1200}
				showsVerticalScrollIndicator={scrollStyles}
				style={[styles.listViewContainer, directionStyles, style]}
				dataSource={this.state.dataSource}
				renderFooter={() => {
					return (
						<View style={styles.footer} />
					)
				}}
				renderRow={(month) => {
					return (
						<Month
							{...this.props}
							days={month}
							style={[styles.month, directionStyles]}
							changeSelection={this.changeSelection}
						/>
					);
				}}
			/>
		);
	}
}

const styles = StyleSheet.create({
	listViewContainer: {
		backgroundColor: 'white',
		alignSelf: 'center',
	},
	month: {},
	footer: {
		height: 150,
		position: 'relative',
		width: 60
	}
});
