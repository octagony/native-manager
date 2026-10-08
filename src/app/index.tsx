import { Appbar, Text, Button, Surface } from "react-native-paper";
import { useThemeContext } from "@/hooks/useThemeContext";
import { StyleSheet } from "react-native";

export default function Index() {
	const { isDarkTheme, toggleTheme } = useThemeContext();

	return (
		<Surface style={{ flex: 1 }} elevation={0}>
			<Appbar.Header>
				<Appbar.Content title="Tasker" />
				<Appbar.Action
					icon={
						isDarkTheme
							? "white-balance-sunny"
							: "moon-waning-crescent"
					}
					onPress={toggleTheme}
				/>
			</Appbar.Header>

			<Surface style={styles.surface} elevation={0}>
				<Text variant="headlineMedium" style={{ marginBottom: 20 }}>
					Welcome to FieldTasker
				</Text>

				<Text
					variant="bodyLarge"
					style={{
						marginBottom: 30,
						textAlign: "center",
						opacity: 0.7,
					}}
				>
					Candidate Code: SA-RN-1234
				</Text>

				<Button mode="contained" onPress={toggleTheme} icon="palette">
					Toggle {isDarkTheme ? "Light" : "Dark"} Theme
				</Button>
			</Surface>
		</Surface>
	);
}

const styles = StyleSheet.create({
	surface: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
});
