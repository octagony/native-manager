import { StyleSheet } from "react-native";
import { Text, Surface, useTheme, MD3Theme } from "react-native-paper";

interface IEmptyStateProps {
	title?: string;
	description?: string;
}

export const EmptyState = ({
	title = "No tasks yet",
	description = "Tap the button below to create your first field task.",
}: IEmptyStateProps) => {
	const theme = useTheme() as MD3Theme;

	return (
		<Surface
			style={[
				styles.container,
				{ backgroundColor: theme.colors.surface },
			]}
			elevation={0}
		>
			<Text
				variant="headlineSmall"
				style={[styles.title, { color: theme.colors.onSurface }]}
			>
				{title}
			</Text>
			<Text
				variant="bodyMedium"
				style={[
					styles.description,
					{ color: theme.colors.onSurfaceVariant },
				]}
			>
				{description}
			</Text>
		</Surface>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 32,
	},
	title: {
		marginBottom: 16,
		textAlign: "center",
	},
	description: {
		textAlign: "center",
	},
});
