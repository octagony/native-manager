import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { ITask } from "@/interfaces/ITask.interface";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

const REMINDER_MINUTES_BEFORE = 30;
const DEMO_MODE_DELAY_SECONDS = 30;

export const requestNotificationPermissions = async (): Promise<boolean> => {
	if (!Device.isDevice) {
		console.warn("Notifications work only on physical devices");
		return false;
	}

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("task-reminders", {
			name: "Task Reminders",
			importance: Notifications.AndroidImportance.HIGH,
			sound: "default",
		});
	}

	const { status: existingStatus } =
		await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	return finalStatus === "granted";
};

export const scheduleTaskNotification = async (
	task: ITask,
): Promise<string | null> => {
	if (task.status === "Completed" || task.status === "Cancelled") {
		return null;
	}

	const reminderTime = task.dueDate - REMINDER_MINUTES_BEFORE * 60 * 1000;
	const now = Date.now();
	const isDemoMode = reminderTime < now;

	// DEMO MODE
	if (isDemoMode) {
		console.log(
			`[DEMO NOTIFICATION] notification for task "${task.title}"`,
		);

		try {
			const notificationId =
				await Notifications.scheduleNotificationAsync({
					content: {
						title: `Task Reminder: ${task.title}`,
						body: `Demo notification - due at ${new Date(task.dueDate).toLocaleTimeString()} at ${task.location.address}`,
						data: { taskId: task.id },
						sound: "default",
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes
							.TIME_INTERVAL,
						seconds: DEMO_MODE_DELAY_SECONDS,
						repeats: false,
					},
				});

			console.log(
				`[DEMO NOTIFICATION] Demo notification scheduled with ID: ${notificationId}`,
			);
			return notificationId;
		} catch (error) {
			console.error(
				"[DEMO NOTIFICATION] Demo notification scheduling error:",
				error,
			);
			return null;
		}
	}

	// STANDARD MODE
	try {
		const secondsUntilReminder = Math.floor((reminderTime - now) / 1000);
		const notificationId = await Notifications.scheduleNotificationAsync({
			content: {
				title: `Task Reminder: ${task.title}`,
				body: `Due in 30 minutes at ${task.location.address}`,
				data: { taskId: task.id },
				sound: "default",
			},
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
				seconds: secondsUntilReminder,
				repeats: false,
			},
		});

		return notificationId;
	} catch (error) {
		console.error("Notification scheduling error:", error);
		return null;
	}
};

export const cancelAllNotificationsForTask = async (
	taskId: string,
): Promise<void> => {
	try {
		const scheduledNotifications =
			await Notifications.getAllScheduledNotificationsAsync();
		let cancelledCount = 0;

		for (const notification of scheduledNotifications) {
			const notificationData = notification.content.data as {
				taskId?: string;
			};
			if (notificationData?.taskId === taskId) {
				await Notifications.cancelScheduledNotificationAsync(
					notification.identifier,
				);
				cancelledCount++;
			}
		}
	} catch (error) {
		console.error("Notification canceling error:", error);
	}
};

export const rescheduleTaskNotification = async (
	task: ITask,
): Promise<string | null> => {
	await cancelAllNotificationsForTask(task.id);
	return scheduleTaskNotification(task);
};
