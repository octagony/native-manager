import { IThemeContext } from "@/interfaces/ITheme.interface";
import { createContext, useState, ReactNode } from "react";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const ThemeContext = createContext<IThemeContext>({
	isDarkTheme: false,
	toggleTheme: () => {},
	theme: MD3LightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	const toggleTheme = () => setIsDarkTheme((prev) => !prev);
	const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

	return (
		<ThemeContext.Provider value={{ isDarkTheme, toggleTheme, theme }}>
			{children}
		</ThemeContext.Provider>
	);
};
