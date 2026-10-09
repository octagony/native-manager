import { IThemeContext } from "@/interfaces/ITheme.interface";
import { THEME_KEY } from "@/utils/constants";
import { appDarkTheme, appLightTheme } from "@/utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, ReactNode, useEffect } from "react";

export const ThemeContext = createContext<IThemeContext>({
	isDarkTheme: false,
	toggleTheme: () => {},
	theme: appLightTheme,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	useEffect(() => {
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem(THEME_KEY);
			if (savedTheme !== null) {
				setIsDarkTheme(savedTheme === "dark");
			}
		} catch (error) {
			console.error("Error loading theme:", error);
		}
	};

	const toggleTheme = async () => {
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		try {
			await AsyncStorage.setItem(THEME_KEY, newTheme ? "dark" : "light");
		} catch (error) {
			console.error("Error saving theme:", error);
		}
	};

	const theme = isDarkTheme ? appDarkTheme : appLightTheme;

	return (
		<ThemeContext.Provider value={{ theme, isDarkTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
