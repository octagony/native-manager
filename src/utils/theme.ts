import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const appLightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: "#6366F1",
		onPrimary: "#FFFFFF",
		primaryContainer: "#E0E7FF",
		onPrimaryContainer: "#3730A3",

		secondary: "#10B981",
		onSecondary: "#FFFFFF",
		secondaryContainer: "#D1FAE5",
		onSecondaryContainer: "#065F46",

		tertiary: "#F59E0B",
		onTertiary: "#FFFFFF",
		tertiaryContainer: "#FEF3C7",
		onTertiaryContainer: "#92400E",

		error: "#EF4444",
		onError: "#FFFFFF",
		errorContainer: "#FEE2E2",
		onErrorContainer: "#991B1B",

		background: "#F9FAFB",
		onBackground: "#111827",
		surface: "#FFFFFF",
		onSurface: "#111827",
		surfaceVariant: "#F3F4F6",
		onSurfaceVariant: "#6B7280",
		outline: "#D1D5DB",
	},
};

export const appDarkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: "#818CF8",
		onPrimary: "#2e2a52",
		primaryContainer: "#4338CA",
		onPrimaryContainer: "#E0E7FF",

		secondary: "#34D399",
		onSecondary: "#064E3B",
		secondaryContainer: "#059669",
		onSecondaryContainer: "#D1FAE5",

		tertiary: "#FBBF24",
		onTertiary: "#78350F",
		tertiaryContainer: "#D97706",
		onTertiaryContainer: "#FEF3C7",

		error: "#F87171",
		onError: "#7F1D1D",
		errorContainer: "#DC2626",
		onErrorContainer: "#FEE2E2",

		background: "#0f0f0f",
		onBackground: "#F9FAFB",
		surface: "#0f0f0f",
		onSurface: "#F9FAFB",
		surfaceVariant: "#374151",
		onSurfaceVariant: "#9CA3AF",
		outline: "#4B5563",
	},
};
