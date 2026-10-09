import { ITask } from "@/interfaces/ITask.interface";
import { SERVICE_STORAGE_KEY } from "@/utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateCreator } from "zustand";

export const persistService = <
	T extends { tasks: ITask[]; isLoading: boolean },
>(
	config: StateCreator<T, [], []>,
): StateCreator<T, [], []> => {
	return (set, get, api) => {
		const loadFromStorage = async (): Promise<void> => {
			try {
				const storedTasks =
					await AsyncStorage.getItem(SERVICE_STORAGE_KEY);
				if (storedTasks) {
					const tasks = JSON.parse(storedTasks);
					set({ tasks, isLoading: false } as Partial<T>);
				} else {
					set({ isLoading: false } as Partial<T>);
				}
			} catch (error) {
				console.error("Error loading tasks from storage:", error);
				set({ isLoading: false } as Partial<T>);
			}
		};

		api.subscribe((state) => {
			if (state.tasks) {
				AsyncStorage.setItem(
					SERVICE_STORAGE_KEY,
					JSON.stringify(state.tasks),
				).catch((error: unknown) => {
					console.error("Error saving tasks to storage:", error);
				});
			}
		});

		loadFromStorage();

		return config(set, get, api);
	};
};
