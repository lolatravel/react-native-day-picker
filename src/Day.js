'use strict';

import React    from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	View
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

	_renderCircleBg(position, hide) {
		let selectedStyle;
		let bgColor = this.props.dayInRangeBackColor;

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

		if(hide){
			bgColor = 'transparent';
		}

		if (this.props.useCircleMarkers){
			return [{backgroundColor: bgColor}, selectedStyle];
		}
	}

	render() {
		let {date, status, disabled, onDayPress, width, position, hideBgHighlight} = this.props;
		let onPress, textColor, backColor, borderColor, borderRadius;

		let updatedWidth = Math.trunc(width / 7);
		let checkedWidth = updatedWidth % 2;

		if(checkedWidth > 0){
			updatedWidth = updatedWidth - 1;
		}

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
				style={[styles.common, {width: updatedWidth, height: updatedWidth}, this._renderCircleBg(position, hideBgHighlight)]}
				onPress={onPress}>
				<View style={[{backgroundColor: backColor}, this._isCircle(borderRadius, borderColor), {width: updatedWidth, height: updatedWidth}, {justifyContent: 'center',
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
