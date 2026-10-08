import { ITaskCardComponentProps } from "@/interfaces/ITask.interface";
import { StyleSheet } from "react-native";
import { Card, Title, Paragraph, Chip } from "react-native-paper";

export const TaskCard = ({ task, onPress }: ITaskCardComponentProps) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "New":
				return "#2196F3";
			case "In Progress":
				return "#FF9800";
			case "Completed":
				return "#4CAF50";
			case "Cancelled":
				return "#F44336";
			default:
				return "#9E9E9E";
		}
	};

	return (
		<Card style={styles.card} onPress={onPress}>
			<Card.Content>
				<Card.Title
					title={task.title}
					style={styles.title}
					titleNumberOfLines={1}
				/>

				<Card.Content style={styles.description}>
					{task.description}
				</Card.Content>

				<Chip
					icon="calendar"
					style={styles.chip}
					textStyle={styles.chipText}
				>
					{new Date(task.dueDate).toLocaleDateString()}
				</Chip>

				<Chip
					icon="map-marker"
					style={styles.chip}
					textStyle={styles.chipText}
				>
					{task.location.address}
				</Chip>
			</Card.Content>

			<Card.Actions>
				<Chip
					style={[
						styles.statusChip,
						{ backgroundColor: getStatusColor(task.status) },
					]}
					textStyle={styles.statusChipText}
				>
					{task.status}
				</Chip>
			</Card.Actions>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 16,
		marginBottom: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	description: {
		fontSize: 14,
		opacity: 0.7,
		marginBottom: 12,
	},
	chip: {
		marginRight: 8,
		marginBottom: 8,
	},
	chipText: {
		fontSize: 12,
	},
	statusChip: {
		marginLeft: "auto",
	},
	statusChipText: {
		color: "#FFFFFF",
		fontWeight: "bold",
	},
});
