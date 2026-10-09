import {
	ITask,
	TTasksSortOption,
	TTaskStatus,
} from "@/interfaces/ITask.interface";
import {
	TASK_HISTORY_CREATED,
	TASK_HISTORY_EDITED,
	TASK_HISTORY_STATUS_UPDATED,
	TASK_STATUS_CANCELLED,
	TASK_STATUS_COMPLETED,
	TASK_STATUS_IN_PROGRESS,
	TASK_STATUS_NEW,
} from "./constants";
import { MD3Theme, useTheme } from "react-native-paper";
import { IPredefinedLocation } from "@/interfaces/ILocation.interface";

export const taskComparators: Record<
	TTasksSortOption,
	(a: ITask, b: ITask) => number
> = {
	dueDate: (a, b) => a.dueDate - b.dueDate,
	dateAdded: (a, b) => b.createdAt - a.createdAt,
	status: (a, b) => a.status.localeCompare(b.status),
};

export const sortTasks = (
	tasks: ITask[],
	sortBy: TTasksSortOption,
): ITask[] => {
	const comparator = taskComparators[sortBy];
	return [...tasks].sort(comparator);
};

export const formatDate = (date: Date | null): string => {
	return date
		? date.toLocaleString(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})
		: "";
};

export const getTaskStatusColor = (status: TTaskStatus) => {
	const theme = useTheme() as MD3Theme;

	switch (status) {
		case TASK_STATUS_NEW:
			return theme.colors.primary;
		case TASK_STATUS_IN_PROGRESS:
			return theme.colors.tertiary;
		case TASK_STATUS_COMPLETED:
			return theme.colors.secondary;
		case TASK_STATUS_CANCELLED:
			return theme.colors.error;
		default:
			return theme.colors.onSurfaceVariant;
	}
};

export const STATUS_OPTIONS: { status: TTaskStatus; icon: string }[] = [
	{ status: TASK_STATUS_NEW, icon: "plus-circle" },
	{ status: TASK_STATUS_IN_PROGRESS, icon: "progress-clock" },
	{ status: TASK_STATUS_COMPLETED, icon: "check-circle" },
	{ status: TASK_STATUS_CANCELLED, icon: "close-circle" },
];

export const PREDEFINED_LOCATIONS: IPredefinedLocation[] = [
	{
		id: "home",
		name: "Home",
		address: "Moskovskaya Street, 25",
		latitude: 53.889474,
		longitude: 27.509135,
	},
	{
		id: "work",
		name: "Work",
		address: "Yakub Kolas Street, 24",
		latitude: 53.925927,
		longitude: 27.59376,
	},
];

export const getHistoryActionColor = (action: string) => {
	const theme = useTheme() as MD3Theme;
	switch (action) {
		case TASK_HISTORY_CREATED:
			return theme.colors.primary;
		case TASK_HISTORY_EDITED:
			return theme.colors.tertiary;
		case TASK_HISTORY_STATUS_UPDATED:
			return theme.colors.secondary;
		default:
			return theme.colors.onSurfaceVariant;
	}
};

export const getHistoryActionIcon = (action: string) => {
	switch (action) {
		case TASK_HISTORY_CREATED:
			return "plus-circle";
		case TASK_HISTORY_EDITED:
			return "pencil";
		case TASK_HISTORY_STATUS_UPDATED:
			return "update";
		default:
			return "circle-small";
	}
};
