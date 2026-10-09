import { useMemo } from "react";
import { StyleSheet, Linking, Platform } from "react-native";
import {
	Appbar,
	Surface,
	Text,
	Button,
	List,
	useTheme,
	MD3Theme,
	Card,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useTaskStore } from "@/store/taskStore";

export default function MapScreen() {
	const router = useRouter();
	const tasks = useTaskStore((state) => state.tasks);
	const theme = useTheme() as MD3Theme;

	const tasksWithLocation = useMemo(
		() => tasks.filter((t) => t.location.latitude && t.location.longitude),
		[tasks],
	);

	const openMapForTask = (task: (typeof tasksWithLocation)[0]) => {
		const { latitude, longitude } = task.location;
		const title = encodeURIComponent(task.title);

		const url = Platform.select({
			ios: `maps://app?daddr=${latitude},${longitude}&dirflg=d`,
			android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${title})`,
		});

		Linking.openURL(url!).catch(() => {
			Linking.openURL(
				`https://www.google.com/maps?q=${latitude},${longitude}`,
			);
		});
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
				<Appbar.Content title="Task Locations" />
			</Appbar.Header>

			{tasksWithLocation.length === 0 ? (
				<Surface style={styles.empty}>
					<Text variant="headlineSmall" style={styles.emptyText}>
						No tasks with locations
					</Text>
					<Text variant="bodyMedium" style={styles.emptySubtext}>
						Select a predefined location when creating a task to see
						it on the map
					</Text>
				</Surface>
			) : (
				<List.Section style={styles.list}>
					<Text variant="titleMedium" style={styles.listTitle}>
						Tasks with locations ({tasksWithLocation.length})
					</Text>
					{tasksWithLocation.map((task) => (
						<Card key={task.id} style={styles.card}>
							<Card.Content>
								<List.Item
									title={task.title}
									description={task.location.address}
									left={() => (
										<List.Icon
											icon="map-marker"
											color={theme.colors.primary}
										/>
									)}
								/>
								<Button
									mode="contained"
									onPress={() => openMapForTask(task)}
									icon="map"
									style={styles.mapButton}
								>
									Open on Map
								</Button>
								<Button
									mode="text"
									onPress={() =>
										router.push(`/task-detail/${task.id}`)
									}
									icon="eye"
									style={styles.detailsButton}
								>
									View Task Details
								</Button>
							</Card.Content>
						</Card>
					))}
				</List.Section>
			)}
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	empty: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 32,
	},
	emptyText: {
		marginBottom: 8,
		textAlign: "center",
	},
	emptySubtext: {
		opacity: 0.6,
		textAlign: "center",
	},
	list: {
		flex: 1,
		padding: 16,
	},
	listTitle: {
		marginBottom: 16,
		fontWeight: "bold",
	},
	card: {
		marginBottom: 12,
	},
	mapButton: {
		marginTop: 8,
		marginLeft: 40,
	},
	detailsButton: {
		marginTop: 4,
		marginLeft: 40,
		alignSelf: "flex-start",
	},
});
