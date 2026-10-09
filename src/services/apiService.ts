import { ITask } from "@/interfaces/ITask.interface";

const API_BASE_URL = "http://10.0.2.2:3001";

export const checkServerConnection = async (): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/tasks`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		return response.ok;
	} catch (error) {
		console.warn("[API] Server is not available:", error);
		return false;
	}
};

export const fetchAllTasks = async (): Promise<ITask[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/tasks`);
		if (!response.ok) throw new Error("Failed to fetch tasks");
		return await response.json();
	} catch (error) {
		console.error("[API] Error fetching tasks:", error);
		return [];
	}
};

export const createTaskOnServer = async (task: ITask): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/tasks`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(task),
		});
		return response.ok;
	} catch (error) {
		console.error("[API] Error creating task:", error);
		return false;
	}
};

export const updateTaskOnServer = async (task: ITask): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(task),
		});
		return response.ok;
	} catch (error) {
		console.error("[API] Error updating task:", error);
		return false;
	}
};

export const deleteTaskOnServer = async (taskId: string): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
			method: "DELETE",
		});
		return response.ok;
	} catch (error) {
		console.error("[API] Error deleting task:", error);
		return false;
	}
};
