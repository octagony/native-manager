import { MD3LightTheme } from "react-native-paper";

export interface IThemeContext {
	isDarkTheme: boolean;
	toggleTheme: () => void;
	theme: typeof MD3LightTheme;
}
