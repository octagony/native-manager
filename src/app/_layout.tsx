import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { useThemeContext } from "@/hooks/useThemeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { THEME_STATE_DARK, THEME_STATE_LIGHT } from "@/utils/constants";

function RootLayoutContent() {
	const { theme, isDarkTheme } = useThemeContext();

	return (
		<PaperProvider theme={theme}>
			<StatusBar
				style={isDarkTheme ? THEME_STATE_LIGHT : THEME_STATE_DARK}
			/>
			<Stack screenOptions={{ headerShown: false }} />
		</PaperProvider>
	);
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<RootLayoutContent />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
