import { useState } from "react";
import {
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	View,
} from "react-native";
import {
	Appbar,
	TextInput,
	Button,
	Text,
	Surface,
	HelperText,
	useTheme,
	MD3Theme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useTaskStore } from "../store/taskStore";
import { DateTimeInput } from "../components/DateTimeInput";
import { AttachmentPreview } from "@/components/AttachmentPreview";
import { ITaskAttachment } from "@/interfaces/ITask.interface";
import { deleteAttachment, pickImage } from "@/services/attachmentService";

export default function CreateTaskScreen() {
	const router = useRouter();
	const addTask = useTaskStore((state) => state.addTask);
	const theme = useTheme() as MD3Theme;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [address, setAddress] = useState("");
	const [dueDate, setDueDate] = useState<Date | null>(null);
	const [attachments, setAttachments] = useState<ITaskAttachment[]>([]);

	const [errors, setErrors] = useState({
		title: "",
		description: "",
		address: "",
		dueDate: "",
	});

	const validate = (): boolean => {
		const newErrors = {
			title: "",
			description: "",
			address: "",
			dueDate: "",
		};

		let isValid = true;

		if (!title.trim()) {
			newErrors.title = "Title is required";
			isValid = false;
		}

		if (!description.trim()) {
			newErrors.description = "Description is required";
			isValid = false;
		}

		if (!address.trim()) {
			newErrors.address = "Location address is required";
			isValid = false;
		}

		if (!dueDate) {
			newErrors.dueDate = "Due date is required";
			isValid = false;
		} else if (dueDate.getTime() < Date.now()) {
			newErrors.dueDate = "Due date must be in the future";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleAddAttachment = async () => {
		const attachment = await pickImage();
		if (attachment) {
			setAttachments((prev) => [...prev, attachment]);
		}
	};

	const handleRemoveAttachment = async (id: string) => {
		const attachment = attachments.find((a) => a.id === id);
		if (attachment) {
			await deleteAttachment(attachment.uri);
			setAttachments((prev) => prev.filter((a) => a.id !== id));
		}
	};

	const handleSave = () => {
		if (!validate()) {
			return;
		}

		addTask({
			title: title.trim(),
			description: description.trim(),
			dueDate: dueDate!.getTime(),
			location: { address: address.trim() },
			attachments,
		});

		router.back();
	};

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
				<Appbar.Content title="Create Task" />
			</Appbar.Header>

			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<TextInput
						label="Task Title *"
						value={title}
						onChangeText={(text) => {
							setTitle(text);
							if (errors.title)
								setErrors({ ...errors, title: "" });
						}}
						mode="outlined"
						style={styles.input}
						error={!!errors.title}
						right={<TextInput.Icon icon="check" color="green" />}
					/>
					<HelperText type="error" visible={!!errors.title}>
						{errors.title}
					</HelperText>

					<TextInput
						label="Description *"
						value={description}
						onChangeText={(text) => {
							setDescription(text);
							if (errors.description)
								setErrors({ ...errors, description: "" });
						}}
						mode="outlined"
						multiline
						numberOfLines={4}
						style={styles.input}
						error={!!errors.description}
					/>
					<HelperText type="error" visible={!!errors.description}>
						{errors.description}
					</HelperText>

					<TextInput
						label="Location Address *"
						value={address}
						onChangeText={(text) => {
							setAddress(text);
							if (errors.address)
								setErrors({ ...errors, address: "" });
						}}
						mode="outlined"
						style={styles.input}
						error={!!errors.address}
						left={<TextInput.Icon icon="map-marker" />}
					/>
					<HelperText type="error" visible={!!errors.address}>
						{errors.address}
					</HelperText>

					<DateTimeInput
						label="Due Date & Time *"
						value={dueDate}
						onChange={(date) => {
							setDueDate(date);
							if (errors.dueDate)
								setErrors({ ...errors, dueDate: "" });
						}}
						error={errors.dueDate}
						minimumDate={new Date()}
					/>

					<View style={styles.attachmentsSection}>
						<Text
							variant="titleMedium"
							style={styles.attachmentsTitle}
						>
							Attachments
						</Text>

						{attachments.length > 0 && (
							<View style={styles.attachmentsGrid}>
								{attachments.map((attachment) => (
									<AttachmentPreview
										key={attachment.id}
										attachment={attachment}
										onRemove={handleRemoveAttachment}
									/>
								))}
							</View>
						)}

						<Button
							mode="outlined"
							onPress={handleAddAttachment}
							icon="image-plus"
							style={styles.addButton}
						>
							Add Photo
						</Button>
					</View>

					<Button
						mode="contained"
						onPress={handleSave}
						style={styles.saveButton}
						icon="content-save"
					>
						Save Task
					</Button>
				</ScrollView>
			</KeyboardAvoidingView>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingBottom: 40,
	},
	input: {
		marginBottom: 4,
	},
	hint: {
		marginTop: 16,
		marginBottom: 24,
		opacity: 0.6,
		textAlign: "center",
	},
	saveButton: {
		marginTop: 8,
	},
	attachmentsSection: {
		marginTop: 16,
		marginBottom: 24,
	},
	attachmentsTitle: {
		marginBottom: 12,
	},
	attachmentsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 12,
	},
	addButton: {
		alignSelf: "flex-start",
	},
});
