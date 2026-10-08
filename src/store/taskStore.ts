import { ITask, ITaskStore } from "@/interfaces/ITask.interface";
import { create } from "zustand";

export const useTaskStore = create<ITaskStore>((set) => ({
	tasks: [],
	isLoading: false,

	addTask: (taskData) => {
		const newTask = {
			...taskData,
			id: Date.now().toString(),
			status: "New",
			syncStatus: "pending",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			history: [
				{
					id: Date.now().toString(),
					timestamp: Date.now(),
					action: "Created",
					description: "Task created",
				},
			],
		};

		set((state) => ({ tasks: [...state.tasks, newTask as ITask] }));
	},

	updateTaskStatus: (id, status) => {
		set((state) => ({
			tasks: state.tasks.map((task) => {
				if (task.id === id) {
					return {
						...task,
						status,
						updatedAt: Date.now(),
						history: [
							...task.history,
							{
								id: Date.now().toString(),
								timestamp: Date.now(),
								action: "Status Updated",
								description: `Status changed to ${status}`,
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
}));
