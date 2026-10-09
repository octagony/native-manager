import { useMemo, useState } from "react";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import {
	Appbar,
	Text,
	Surface,
	Menu,
	Divider,
	useTheme,
	MD3Theme,
	Chip,
	IconButton,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTaskStore } from "@/store/taskStore";
import { formatDate, getTaskStatusColor } from "@/utils/helpers";
import { NotFoundTask } from "@/components/NotFoundTask";

export default function TaskDetailScreen() {
	const router = useRouter();
	const { taskId } = useLocalSearchParams<{ taskId: string }>();
	const tasks = useTaskStore((state) => state.tasks);
	const task = useMemo(
		() => tasks.find((t) => t.id === taskId),
		[tasks, taskId],
	);
	const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
	const deleteTask = useTaskStore((state) => state.deleteTask);
	const theme = useTheme() as MD3Theme;

	const [menuVisible, setMenuVisible] = useState(false);

	if (!task) {
		return <NotFoundTask />;
	}

	const handleDelete = () => {
		deleteTask(task.id);
		router.back();
	};

	return (
		<Surface
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
			]}
			elevation={0}
		>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => router.back()} />
				<Appbar.Content title="Task Details" />
				<Menu
					visible={menuVisible}
					onDismiss={() => setMenuVisible(false)}
					anchor={
						<Appbar.Action
							icon="dots-vertical"
							onPress={() => setMenuVisible(true)}
						/>
					}
				>
					<Menu.Item
						onPress={() => {
							updateTaskStatus(task.id, "New");
							setMenuVisible(false);
						}}
						title="Mark as New"
						leadingIcon="plus-circle"
					/>
					<Menu.Item
						onPress={() => {
							updateTaskStatus(task.id, "In Progress");
							setMenuVisible(false);
						}}
						title="Mark as In Progress"
						leadingIcon="progress-clock"
					/>
					<Menu.Item
						onPress={() => {
							updateTaskStatus(task.id, "Completed");
							setMenuVisible(false);
						}}
						title="Mark as Completed"
						leadingIcon="check-circle"
					/>
					<Menu.Item
						onPress={() => {
							updateTaskStatus(task.id, "Cancelled");
							setMenuVisible(false);
						}}
						title="Mark as Cancelled"
						leadingIcon="close-circle"
					/>
					<Divider />
					<Menu.Item
						onPress={handleDelete}
						title="Delete Task"
						leadingIcon="delete"
						titleStyle={{ color: theme.colors.error }}
					/>
				</Menu>
			</Appbar.Header>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.header}>
					<Text variant="headlineMedium" style={styles.title}>
						{task.title}
					</Text>
					<Chip
						style={[
							styles.statusChip,
							{
								backgroundColor: getTaskStatusColor(
									task.status,
								),
							},
						]}
						textStyle={styles.statusChipText}
					>
						{task.status}
					</Chip>
				</View>

				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						Description
					</Text>
					<Text variant="bodyLarge" style={styles.description}>
						{task.description}
					</Text>
				</View>

				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						Details
					</Text>

					<View style={styles.detailRow}>
						<IconButton
							icon="calendar-clock"
							size={20}
							style={styles.detailIcon}
						/>
						<Text variant="bodyMedium" style={styles.detailText}>
							Due: {formatDate(new Date(task.dueDate))}
						</Text>
					</View>

					<View style={styles.detailRow}>
						<IconButton
							icon="map-marker"
							size={20}
							style={styles.detailIcon}
						/>
						<Text variant="bodyMedium" style={styles.detailText}>
							{task.location.address}
						</Text>
					</View>
				</View>

				{task.attachments.length > 0 && (
					<View style={styles.section}>
						<Text variant="titleMedium" style={styles.sectionTitle}>
							Attachments ({task.attachments.length})
						</Text>
						<View style={styles.attachmentsGrid}>
							{task.attachments.map((attachment) => (
								<Image
									key={attachment.id}
									source={{ uri: attachment.uri }}
									style={styles.attachmentImage}
									resizeMode="cover"
								/>
							))}
						</View>
					</View>
				)}

				<View style={styles.section}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						History
					</Text>
					{task.history.map((log) => (
						<View key={log.id} style={styles.historyItem}>
							<Text
								variant="bodySmall"
								style={styles.historyTime}
							>
								{formatDate(new Date(log.timestamp))}
							</Text>
							<Text
								variant="bodyMedium"
								style={styles.historyAction}
							>
								{log.action}
							</Text>
							<Text
								variant="bodySmall"
								style={styles.historyDescription}
							>
								{log.description}
							</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingBottom: 40,
	},
	header: {
		marginBottom: 24,
	},
	title: {
		marginBottom: 12,
	},
	statusChip: {
		alignSelf: "flex-start",
	},
	statusChipText: {
		color: "#FFFFFF",
		fontWeight: "bold",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		marginBottom: 12,
		fontWeight: "bold",
	},
	description: {
		lineHeight: 24,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	detailIcon: {
		margin: 0,
		marginRight: 8,
	},
	detailText: {
		flex: 1,
	},
	attachmentsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	attachmentImage: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 8,
	},
	historyItem: {
		marginBottom: 16,
		paddingLeft: 16,
		borderLeftWidth: 2,
		borderLeftColor: "#E0E0E0",
	},
	historyTime: {
		opacity: 0.6,
		marginBottom: 4,
	},
	historyAction: {
		fontWeight: "bold",
		marginBottom: 4,
	},
	historyDescription: {
		opacity: 0.8,
	},
});
