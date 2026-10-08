import { useState } from "react";
import { StyleSheet, Platform, Pressable } from "react-native";
import { TextInput, HelperText, useTheme, MD3Theme } from "react-native-paper";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
	DATE_TIME_MODE_DATE,
	DATE_TIME_MODE_DATETIME,
	DATE_TIME_MODE_TIME,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import {
	IDateTimeInputComponentProps,
	TDateTimeCurrentMode,
	TDateTimeModeTypes,
} from "@/interfaces/IDateTime.interface";

export const DateTimeInput = ({
	label,
	value,
	onChange,
	error,
	mode = DATE_TIME_MODE_DATETIME,
	minimumDate,
}: IDateTimeInputComponentProps) => {
	const theme = useTheme() as MD3Theme;
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [currentMode, setCurrentMode] =
		useState<TDateTimeCurrentMode>("date");

	const isAndroid = Platform.OS === "android";
	const isDateTimeMode = mode === DATE_TIME_MODE_DATETIME;

	const closeDatePicker = () => setShowDatePicker(false);
	const closeTimePicker = () => setShowTimePicker(false);

	const openDatePicker = () => {
		setCurrentMode(DATE_TIME_MODE_DATE);
		setShowDatePicker(true);
	};

	const openTimePicker = () => {
		setCurrentMode(DATE_TIME_MODE_TIME);
		setShowTimePicker(true);
	};

	const handleOpen = () => {
		openDatePicker();
	};

	const handleDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date,
	) => {
		if (event.type === "dismissed") {
			closeDatePicker();
			return;
		}

		if (event.type === "set" && selectedDate) {
			if (isAndroid && isDateTimeMode) {
				onChange(selectedDate);
				closeDatePicker();
				openTimePicker();
				return;
			}
			onChange(selectedDate);
			closeDatePicker();
		}
	};

	const handleTimeChange = (
		event: DateTimePickerEvent,
		selectedTime?: Date,
	) => {
		if (event.type === "dismissed") {
			closeTimePicker();
			return;
		}

		if (event.type === "set" && selectedTime && value) {
			const combinedDate = new Date(value);
			combinedDate.setHours(selectedTime.getHours());
			combinedDate.setMinutes(selectedTime.getMinutes());
			onChange(combinedDate);
			closeTimePicker();
		}
	};

	const getPickerMode = () => {
		if (!isAndroid && isDateTimeMode) {
			return DATE_TIME_MODE_DATETIME;
		}
		return currentMode;
	};

	return (
		<>
			<Pressable onPress={handleOpen}>
				<TextInput
					label={label}
					value={formatDate(value)}
					mode="outlined"
					editable={false}
					pointerEvents="none"
					style={styles.input}
					error={!!error}
					right={
						<TextInput.Icon
							icon="calendar-clock"
							onPress={handleOpen}
						/>
					}
					textColor={
						value
							? theme.colors.onSurface
							: theme.colors.onSurfaceVariant
					}
				/>
			</Pressable>

			<HelperText type="error" visible={!!error}>
				{error}
			</HelperText>

			{showDatePicker && (
				<DateTimePicker
					value={value || new Date()}
					mode={getPickerMode()}
					display={isAndroid ? "default" : "spinner"}
					onChange={handleDateChange}
					minimumDate={minimumDate}
				/>
			)}

			{showTimePicker && (
				<DateTimePicker
					value={value || new Date()}
					mode={DATE_TIME_MODE_TIME}
					display={isAndroid ? "default" : "spinner"}
					onChange={handleTimeChange}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	input: {
		marginBottom: 4,
	},
});
