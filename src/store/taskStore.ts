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
import { showToast } from "@/utils/toast";
import {
	checkServerConnection,
	createTaskOnServer,
	deleteTaskOnServer,
	fetchAllTasks,
	updateTaskOnServer,
} from "@/services/apiService";

export const useTaskStore = create<ITaskStore>()(
	persistService((set, get) => ({
		tasks: [],
		isLoading: true,

		syncWithServer: async () => {
			const isOnline = await checkServerConnection();
			if (!isOnline) {
				showToast(
					"Offline Mode",
					"info",
					"Server is not available. Changes saved locally.",
				);
				return;
			}

			const tasks = get().tasks;
			const pendingTasks = tasks.filter(
				(t) => t.syncStatus === "pending",
			);

			if (pendingTasks.length === 0) {
				showToast("Already Synced", "info", "All tasks are up to date");
				return;
			}

			let successCount = 0;
			for (const task of pendingTasks) {
				const success = await updateTaskOnServer(task);
				if (success) successCount++;
			}

			set((state) => ({
				tasks: state.tasks.map((task) => {
					const wasPending = pendingTasks.find(
						(t) => t.id === task.id,
					);
					if (wasPending) {
						return { ...task, syncStatus: "synced" as const };
					}
					return task;
				}),
			}));

			showToast(
				"Sync Complete",
				"success",
				`${successCount}/${pendingTasks.length} tasks synced`,
			);
		},

		loadFromServer: async () => {
			const isOnline = await checkServerConnection();
			if (!isOnline) return;

			const serverTasks = await fetchAllTasks();
			if (serverTasks.length > 0) {
				set({ tasks: serverTasks });
				showToast(
					"Server Data Loaded",
					"info",
					`${serverTasks.length} tasks loaded from server`,
				);
			}
		},

		addTask: async (taskData) => {
			try {
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

				const isOnline = await checkServerConnection();
				if (isOnline) {
					const success = await createTaskOnServer(newTask);
					if (success) {
						set((state) => ({
							tasks: state.tasks.map((t) =>
								t.id === newTask.id
									? { ...t, syncStatus: "synced" as const }
									: t,
							),
						}));
					}
				}

				showToast(
					"Task Created",
					"success",
					`"${newTask.title}" has been created`,
				);
			} catch (e: unknown) {
				console.error("Error creating task:", (e as Error).message);
				showToast("Error", "error", "Failed to create task");
			}
		},

		updateTask: async (id, taskData) => {
			try {
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

					const isOnline = await checkServerConnection();
					if (isOnline) {
						const success = await updateTaskOnServer(updatedTask);
						if (success) {
							set((state) => ({
								tasks: state.tasks.map((t) =>
									t.id === id
										? {
												...t,
												syncStatus: "synced" as const,
											}
										: t,
								),
							}));
						}
					}
				}
			} catch (e: unknown) {
				console.error("Error updating task:", (e as Error).message);
				showToast("Error", "error", "Failed to update task");
			}
		},

		updateTaskStatus: async (id, status) => {
			try {
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

					const isOnline = await checkServerConnection();
					if (isOnline) {
						const success = await updateTaskOnServer(updatedTask);
						if (success) {
							set((state) => ({
								tasks: state.tasks.map((t) =>
									t.id === id
										? {
												...t,
												syncStatus: "synced" as const,
											}
										: t,
								),
							}));
						}
					}
				}
			} catch (e: unknown) {
				console.error(
					"Error updating task status:",
					(e as Error).message,
				);
				showToast("Error", "error", "Failed to update task status");
			}
		},

		deleteTask: async (id) => {
			try {
				const taskToDelete = get().tasks.find((t) => t.id === id);

				await cancelAllNotificationsForTask(id);

				const isOnline = await checkServerConnection();
				if (isOnline) {
					await deleteTaskOnServer(id);
				}

				set((state) => ({
					tasks: state.tasks.filter((task) => task.id !== id),
				}));

				showToast(
					"Task Deleted",
					"success",
					`"${taskToDelete?.title}" has been deleted`,
				);
			} catch (e: unknown) {
				console.error("Error deleting task:", (e as Error).message);
				showToast("Error", "error", "Failed to delete task");
			}
		},
	})),
);
