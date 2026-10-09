import {
	ATTACHMENT_TASK_PDF,
	ATTACHMENT_TASK_IMAGE,
	ATTACHMENT_TASK_OTHER,
	TASK_STATUS_NEW,
	TASK_STATUS_IN_PROGRESS,
	TASK_STATUS_COMPLETED,
	TASK_STATUS_CANCELLED,
	SYNC_STATUS_PENDING,
	TASK_STATUS_SYNCED,
	TASK_STATUS_FAILED,
	TASK_HISTORY_EDITED,
	TASK_HISTORY_STATUS_UPDATED,
	TASK_ATTACHMENT_ADDED,
	TASK_DELETED,
	TASK_SYNCED,
	TASK_HISTORY_CREATED,
	TASK_SORT_TYPE_DATE_ADDED,
	TASK_SORT_TYPE_DUE_DATE,
	TASK_SORT_TYPE_STATUS,
} from "@/utils/constants";

export type TTaskAttachment =
	| typeof ATTACHMENT_TASK_PDF
	| typeof ATTACHMENT_TASK_IMAGE
	| typeof ATTACHMENT_TASK_OTHER;

export type TTaskStatus =
	| typeof TASK_STATUS_NEW
	| typeof TASK_STATUS_IN_PROGRESS
	| typeof TASK_STATUS_COMPLETED
	| typeof TASK_STATUS_CANCELLED;

export type TSyncStatus =
	| typeof SYNC_STATUS_PENDING
	| typeof TASK_STATUS_SYNCED
	| typeof TASK_STATUS_FAILED;

export type TTaskHistoryAction =
	| typeof TASK_HISTORY_CREATED
	| typeof TASK_HISTORY_EDITED
	| typeof TASK_HISTORY_STATUS_UPDATED
	| typeof TASK_ATTACHMENT_ADDED
	| typeof TASK_DELETED
	| typeof TASK_SYNCED;

export interface ITask {
	id: string;
	title: string;
	description: string;
	dueDate: number;
	location: ITaskLocation;
	attachments: ITaskAttachment[];
	status: TTaskStatus;
	history: IHistoryTaskLog[];
	syncStatus: TSyncStatus;
	createdAt: number;
	updatedAt: number;
}

export interface ITaskLocation {
	address: string;
	coordinates?: ITaskCoordinates;
}

export interface ITaskAttachment {
	id: string;
	uri: string;
	name: string;
	type: TTaskAttachment;
}

export interface ITaskCoordinates {
	latitude: number;
	longitude: number;
}

export interface IHistoryTaskLog {
	id: string;
	timestamp: number;
	action: TTaskHistoryAction;
	description: string;
}

export type TTaskToAdd = Omit<
	ITask,
	"id" | "history" | "syncStatus" | "createdAt" | "updatedAt" | "status"
>;

export type TTaskToEdit = Partial<
	Omit<ITask, "id" | "history" | "syncStatus" | "createdAt">
>;

export interface IAttachmentPreviewComponentProps {
	attachment: ITaskAttachment;
	onRemove: (id: string) => void;
}

// STORE
export interface ITaskStore {
	tasks: ITask[];
	isLoading: boolean;
	addTask: (taskData: TTaskToAdd) => Promise<void>;
	updateTask: (id: string, taskData: TTaskToEdit) => Promise<void>;
	updateTaskStatus: (id: string, status: TTaskStatus) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
}

// COMPONENTS
export interface ITaskCardComponentProps {
	task: ITask;
	onPress: () => void;
}

// SCREENS
export type TTasksSortOption =
	| typeof TASK_SORT_TYPE_DATE_ADDED
	| typeof TASK_SORT_TYPE_DUE_DATE
	| typeof TASK_SORT_TYPE_STATUS;
