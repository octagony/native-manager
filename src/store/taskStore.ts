import { create } from "zustand";
import { ITask, ITaskStore, TTaskToAdd } from "@/interfaces/ITask.interface";
import { persistService } from "@/services/persistService";
import {
	SYNC_STATUS_PENDING,
	TASK_HISTORY_CREATED,
	TASK_HISTORY_DEFAULT_MESSAGE,
	TASK_HISTORY_EDITED,
	TASK_HISTORY_EDITED_DEFAULT_MESSAGE,
	TASK_HISTORY_STATUS_DEFAULT_MESSAGE,
	TASK_HISTORY_STATUS_UPDATED,
	TASK_STATUS_NEW,
} from "@/utils/constants";
import {
	cancelAllNotificationsForTask,
	rescheduleTaskNotification,
	scheduleTaskNotification,
} from "@/services/notificationService";

export const useTaskStore = create<ITaskStore>()(
	persistService((set, get) => ({
		tasks: [],
		isLoading: true,

		addTask: async (taskData) => {
			const newTask: ITask = {
				...taskData,
				id: Date.now().toString(),
				status: TASK_STATUS_NEW,
				syncStatus: SYNC_STATUS_PENDING,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				history: [
					{
						id: Date.now().toString(),
						timestamp: Date.now(),
						action: TASK_HISTORY_CREATED,
						description: TASK_HISTORY_DEFAULT_MESSAGE,
					},
				],
			};

			set((state) => ({ tasks: [...state.tasks, newTask] }));
			await scheduleTaskNotification(newTask);
		},

		updateTask: async (id, taskData) => {
			set((state) => ({
				tasks: state.tasks.map((task) => {
					if (task.id === id) {
						const updatedTask: ITask = {
							...task,
							...taskData,
							updatedAt: Date.now(),
							syncStatus: SYNC_STATUS_PENDING,
							history: [
								...task.history,
								{
									id: Date.now().toString(),
									timestamp: Date.now(),
									action: TASK_HISTORY_EDITED,
									description:
										TASK_HISTORY_EDITED_DEFAULT_MESSAGE,
								},
							],
						};
						return updatedTask;
					}
					return task;
				}),
			}));

			const updatedTask = get().tasks.find((t) => t.id === id);
			if (updatedTask) {
				await rescheduleTaskNotification(updatedTask);
			}
		},

		updateTaskStatus: async (id, status) => {
			set((state) => ({
				tasks: state.tasks.map((task) => {
					if (task.id === id) {
						return {
							...task,
							status,
							updatedAt: Date.now(),
							syncStatus: SYNC_STATUS_PENDING,
							history: [
								...task.history,
								{
									id: Date.now().toString(),
									timestamp: Date.now(),
									action: TASK_HISTORY_STATUS_UPDATED,
									description: `${TASK_HISTORY_STATUS_DEFAULT_MESSAGE} ${status}`,
								},
							],
						};
					}
					return task;
				}),
			}));

			const updatedTask = get().tasks.find((t) => t.id === id);
			if (updatedTask) {
				await rescheduleTaskNotification(updatedTask);
			}
		},

		deleteTask: async (id) => {
			await cancelAllNotificationsForTask(id);
			set((state) => ({
				tasks: state.tasks.filter((task) => task.id !== id),
			}));
		},
	})),
);
