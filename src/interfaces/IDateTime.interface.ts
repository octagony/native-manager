import {
	DATE_TIME_MODE_DATE,
	DATE_TIME_MODE_DATETIME,
	DATE_TIME_MODE_TIME,
} from "@/utils/constants";

export type TDateTimeCurrentMode = Exclude<
	TDateTimeModeTypes,
	typeof DATE_TIME_MODE_DATETIME
>;

export type TDateTimeModeTypes =
	| typeof DATE_TIME_MODE_DATE
	| typeof DATE_TIME_MODE_DATETIME
	| typeof DATE_TIME_MODE_TIME;

export interface IDateTimeInputComponentProps {
	label: string;
	value: Date | null;
	onChange: (date: Date) => void;
	error?: string;
	mode?: TDateTimeModeTypes;
	minimumDate?: Date;
}
