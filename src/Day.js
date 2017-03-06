'use strict';

import React    from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	Text
}               from 'react-native';

export default class Day extends React.Component {
	_isCircle(borderRadius, borderColor){
		if(this.props.useCircleMarkers){
			return {
				borderRadius: borderRadius,
				borderWidth: 1,
				borderColor: borderColor,
				overflow: 'hidden'
			}
		}
	}

	_renderCircleBg(position) {
		let selectedStyle;

		if (position === 'selectFrom') {
			selectedStyle = {
				borderTopLeftRadius: 30,
				borderBottomLeftRadius: 30
			}
		}else if (position === 'selectTo') {
			selectedStyle = {
				borderTopRightRadius: 30,
				borderBottomRightRadius: 30
			}
		}

		if (this.props.useCircleMarkers){
			return [{backgroundColor: this.props.dayInRangeBackColor}, selectedStyle];
		}
	}

	render() {
		let {date, status, disabled, onDayPress, width, position} = this.props;
		let onPress, textColor, backColor, borderColor, borderRadius;

		if (disabled) {
			status = 'disabled';
			onPress = null;
		} else {
			onPress = () => {
				onDayPress(date);
			}
		}

		switch (status) {
			case 'disabled':
				backColor = this.props.dayDisabledBackColor;
				textColor = this.props.dayDisabledTextColor;
				borderColor = 'transparent';
				borderRadius = 0;
				break;

			case 'common':
				backColor = this.props.dayCommonBackColor;
				textColor = this.props.dayCommonTextColor;
				borderColor = 'transparent';
				borderRadius = 0;
				break;

			case 'selected':
				backColor = this.props.daySelectedBackColor;
				textColor = this.props.daySelectedTextColor;
				borderColor = this.props.daySelectedBackColor;
				borderRadius = 30;
				break;

			case 'inRange':
				backColor = this.props.dayInRangeBackColor;
				textColor = this.props.dayInRangeTextColor;
				borderColor = 'transparent';
				borderRadius = 0;
				break;
		}

		return (
			<TouchableOpacity
				activeOpacity={disabled ? 1 : 0.5}
				style={[styles.common, {width: width / 7, height: width / 7}, this._renderCircleBg(position)]}
				onPress={onPress}>
				<View style={[{backgroundColor: backColor}, this._isCircle(borderRadius, borderColor), {width: width / 7, height: width / 7}, {justifyContent: 'center',
				alignItems: 'center'}]}>
					<Text style={{color: textColor}}>{date.getDate()}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	common: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	}
});
