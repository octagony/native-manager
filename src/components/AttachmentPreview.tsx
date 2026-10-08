import { IAttachmentPreviewComponentProps } from "@/interfaces/ITask.interface";
import { StyleSheet, Image, Pressable } from "react-native";
import { IconButton, useTheme, MD3Theme } from "react-native-paper";

export const AttachmentPreview = ({
	attachment,
	onRemove,
}: IAttachmentPreviewComponentProps) => {
	const theme = useTheme() as MD3Theme;

	return (
		<Pressable style={styles.container}>
			<Image
				source={{ uri: attachment.uri }}
				style={styles.image}
				resizeMode="cover"
			/>
			<IconButton
				icon="close-circle"
				size={24}
				iconColor={theme.colors.error}
				style={styles.removeButton}
				onPress={() => onRemove(attachment.id)}
			/>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "relative",
		width: 100,
		height: 100,
		marginRight: 8,
		marginBottom: 8,
		borderRadius: 8,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	removeButton: {
		position: "absolute",
		top: 0,
		right: 0,
		margin: 0,
	},
});
