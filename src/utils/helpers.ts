import { ITask, TTasksSortOption } from "@/interfaces/ITask.interface";

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
