import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Appbar, MD3Theme, Surface, Text, useTheme } from "react-native-paper";

export function NotFoundTask() {
	const router = useRouter();
	const theme = useTheme() as MD3Theme;

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
				<Appbar.Content title="Task Not Found" />
			</Appbar.Header>
			<View style={styles.notFound}>
				<Text variant="headlineSmall">Task not found</Text>
			</View>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	notFound: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
