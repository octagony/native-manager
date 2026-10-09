import {
	ITask,
	TTasksSortOption,
	TTaskStatus,
} from "@/interfaces/ITask.interface";
import {
	TASK_STATUS_CANCELLED,
	TASK_STATUS_COMPLETED,
	TASK_STATUS_IN_PROGRESS,
	TASK_STATUS_NEW,
} from "./constants";
import { MD3Theme, useTheme } from "react-native-paper";

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
