import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { ITaskAttachment } from "@/interfaces/ITask.interface";

export const pickImage = async (): Promise<ITaskAttachment | null> => {
	try {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permissionResult.granted) {
			// TODO: CHANGE WARN TO UI WARN
			console.warn("Permission to access media library was denied");
			return null;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.8,
		});

		if (result.canceled || !result.assets || result.assets.length === 0) {
			return null;
		}

		const asset = result.assets[0];
		const originalUri = asset.uri;
		const fileName = `${Date.now()}-${asset.fileName || "image.jpg"}`;

		const sourceFile = new File(originalUri);
		const targetPath = Paths.document;
		const targetFile = new File(targetPath, fileName);

		await sourceFile.copy(targetFile);

		return {
			id: Date.now().toString(),
			uri: targetFile.uri,
			name: asset.fileName || "image.jpg",
			type: "image",
		};
	} catch (error) {
		console.error("Error picking image:", error);
		return null;
	}
};

export const deleteAttachment = async (uri: string): Promise<void> => {
	try {
		const file = new File(uri);
		const exists = file.exists;

		if (exists) {
			file.delete();
		}
	} catch (error) {
		console.error("Error deleting attachment:", error);
	}
};
