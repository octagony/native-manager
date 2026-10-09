import Toast, { ToastType } from "react-native-toast-message";

export const showToast = (title: string, type: ToastType, message?: string) => {
	Toast.show({
		type: type,
		text1: title,
		text2: message,
		position: "top",
		topOffset: 60,
	});
};
