// src/screens/TaskHistoryScreen.tsx
import { useMemo } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import {
	Appbar,
	Surface,
	Text,
	useTheme,
	MD3Theme,
	Button,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTaskStore } from "@/store/taskStore";
import {
	formatDate,
	getHistoryActionColor,
	getHistoryActionIcon,
} from "@/utils/helpers";

export default function TaskHistoryScreen() {
	const router = useRouter();
	const { taskId } = useLocalSearchParams<{ taskId: string }>();
	const tasks = useTaskStore((state) => state.tasks);
	const theme = useTheme() as MD3Theme;

	const task = useMemo(
		() => tasks.find((t) => t.id === taskId),
		[tasks, taskId],
	);

	if (!task) {
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
					<Appbar.Content title="History Not Found" />
				</Appbar.Header>
				<View style={styles.notFound}>
					<Text variant="headlineSmall">Task not found</Text>
				</View>
			</Surface>
		);
	}

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
				<Appbar.Content title="Task History" />
			</Appbar.Header>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.header}>
					<Text variant="headlineMedium" style={styles.title}>
						{task.title}
					</Text>
					<Text variant="bodyMedium" style={styles.subtitle}>
						Complete history of changes
					</Text>
				</View>

				<View style={styles.timeline}>
					{task.history.map((log, index) => (
						<View key={log.id} style={styles.historyItem}>
							<View style={styles.historyContent}>
								<View style={styles.historyHeader}>
									<Button
										mode="contained"
										icon={getHistoryActionIcon(log.action)}
										buttonColor={getHistoryActionColor(
											log.action,
										)}
										textColor="#FFFFFF"
										compact
										style={styles.actionButton}
										contentStyle={
											styles.actionButtonContent
										}
										labelStyle={styles.actionButtonLabel}
									>
										{log.action}
									</Button>
									<Text
										variant="bodySmall"
										style={styles.timestamp}
									>
										{formatDate(new Date(log.timestamp))}
									</Text>
								</View>
								<Text
									variant="bodyMedium"
									style={styles.description}
								>
									{log.description}
								</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
	scrollView: { flex: 1 },
	scrollContent: { padding: 16, paddingBottom: 40 },
	header: { marginBottom: 24 },
	title: { marginBottom: 8 },
	subtitle: { opacity: 0.6 },
	timeline: { marginTop: 16 },
	historyItem: { flexDirection: "row", marginBottom: 24 },
	timelineLine: { width: 40, alignItems: "center" },
	timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
	line: { width: 2, flex: 1, marginTop: 4 },
	historyContent: { flex: 1, paddingLeft: 8 },
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	actionButton: { height: 32, borderRadius: 16 },
	actionButtonContent: { height: 32, paddingHorizontal: 12 },
	actionButtonLabel: { fontSize: 12, fontWeight: "bold", lineHeight: 16 },
	timestamp: { opacity: 0.6 },
	description: { lineHeight: 20 },
});
