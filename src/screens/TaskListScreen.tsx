import { useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import {
	Surface,
	Appbar,
	FAB,
	Menu,
	IconButton,
	useTheme,
	MD3Theme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useTaskStore } from "../store/taskStore";
import { TaskCard } from "../components/TaskCard";
import { useThemeContext } from "../hooks/useThemeContext";
import { TTasksSortOption } from "@/interfaces/ITask.interface";
import { sortTasks } from "@/utils/helpers";
import { EmptyState } from "@/components/EmptyState";
import { CANDIDATE_CODE } from "@/utils/constants";

export default function TaskListScreen() {
	const router = useRouter();
	const tasks = useTaskStore((state) => state.tasks);
	const { isDarkTheme, toggleTheme } = useThemeContext();
	const [sortBy, setSortBy] = useState<TTasksSortOption>("dueDate");
	const [menuVisible, setMenuVisible] = useState(false);
	const sortedTasks = sortTasks(tasks, sortBy);
	const theme = useTheme() as MD3Theme;
	const syncWithServer = useTaskStore((state) => state.syncWithServer);
	const loadFromServer = useTaskStore((state) => state.loadFromServer);

	return (
		<Surface
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
			]}
			elevation={0}
		>
			<Appbar.Header>
				<Appbar.Content title="My Tasks" />
				<Appbar.Action icon="cloud-download" onPress={loadFromServer} />
				<Appbar.Action icon="cloud-upload" onPress={syncWithServer} />
				<Menu
					visible={menuVisible}
					onDismiss={() => setMenuVisible(false)}
					anchor={
						<IconButton
							icon="sort"
							onPress={() => setMenuVisible(true)}
						/>
					}
				>
					<Menu.Item
						onPress={() => {
							setSortBy("dueDate");
							setMenuVisible(false);
						}}
						title="Due Date"
						leadingIcon="calendar"
					/>
					<Menu.Item
						onPress={() => {
							setSortBy("dateAdded");
							setMenuVisible(false);
						}}
						title="Date Added"
						leadingIcon="clock"
					/>
					<Menu.Item
						onPress={() => {
							setSortBy("status");
							setMenuVisible(false);
						}}
						title="Status"
						leadingIcon="label"
					/>
				</Menu>
				<Appbar.Action
					icon={
						isDarkTheme
							? "white-balance-sunny"
							: "moon-waning-crescent"
					}
					onPress={toggleTheme}
				/>
			</Appbar.Header>

			<FlatList
				data={sortedTasks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TaskCard
						task={item}
						onPress={() => {
							router.push(`/task-detail/${item.id}`);
						}}
					/>
				)}
				ListEmptyComponent={<EmptyState />}
				contentContainerStyle={styles.listContent}
			/>

			<View style={styles.footer}>
				<Text style={styles.footerText}>
					Candidate Code: {CANDIDATE_CODE}
				</Text>
			</View>

			<FAB
				icon="map"
				style={[styles.fab, styles.fabMap]}
				onPress={() => router.push("/map")}
			/>

			<FAB
				icon="plus"
				style={styles.fab}
				onPress={() => {
					router.push("/create-task");
				}}
			/>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listContent: {
		paddingTop: 16,
		paddingBottom: 100,
	},
	fab: {
		position: "absolute",
		margin: 16,
		right: 0,
		bottom: 0,
	},
	fabMap: {
		bottom: 80,
	},
	footer: {
		paddingVertical: 24,
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "rgba(128, 128, 128, 0.2)",
		marginTop: 16,
	},
	footerText: {
		color: "#6B7280",
		opacity: 0.5,
		fontWeight: "500",
	},
});
