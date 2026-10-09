import { create } from "zustand";
import { ITask, ITaskStore } from "@/interfaces/ITask.interface";
import { persistService } from "@/services/persistService";
import {
	SYNC_STATUS_PENDING,
	TASK_HISTORY_CREATED,
	TASK_HISTORY_DEFAULT_MESSAGE,
	TASK_HISTORY_STATUS_DEFAULT_MESSAGE,
	TASK_HISTORY_STATUS_UPDATED,
	TASK_STATUS_NEW,
} from "@/utils/constants";

export const useTaskStore = create<ITaskStore>()(
	persistService((set) => ({
		tasks: [],
		isLoading: true,

		addTask: (taskData) => {
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
		},

		updateTaskStatus: (id, status) => {
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
		},

		deleteTask: (id) => {
			set((state) => ({
				tasks: state.tasks.filter((task) => task.id !== id),
			}));
		},
	})),
);
