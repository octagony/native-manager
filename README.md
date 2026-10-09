# NativeTasker - Tast Manager App

Simple mobile application designed for field employees to manage tasks, track locations, and receive timely push notifications. Built with React Native, Expo, and Material Design 3.

## Project Overview & Main Features

- **Task Management**: Create, edit, and delete tasks with validation.
- **Status Workflow**: Manage task states (New, In Progress, Completed, Cancelled) with automatic history logging.
- **Location & Maps**: Attach locations via a predefined dropdown (with auto-filled addresses) or manual text input. View task locations directly in the device's native map application.
- **Push Notifications**: Local notifications scheduled 30 minutes before the due date.
- **Dedicated History Log**: A separate screen displaying a chronological timeline of all task actions (creation, edits, status updates, attachment changes).
- **Media Attachments**: Add and remove photo attachments from the device's gallery.

## 🚀 Installation & Run Instructions

### Prerequisites

- Node.js (v20+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android builds)

### For development

```bash
   git clone <repository-url>
   cd native-tasker
   npm install
   npm run mock # for mock server (Instructions are below)
   npx expo start
```

### For build

```bash
  cd android
  ./gradlew assembleDebug # Dev build
  ./gradlew assembleRelease # Release build
```

### Mock server

Open `/src/services/apiService.ts` and change `API_BASE_URL` variable for your enviroment:

- Android Emulator: `http://10.0.2.2:3001` (default, works automatically).
- Physical Device: Replace `10.0.2.2` with your computer's local network IP address (find it via hostname -I on Linux/Mac or ipconfig on Windows, e.g., `http://192.168.1.100:3001`). Ensure your phone and computer are on the same Wi-Fi network.

### Sync behavior

- Automatic Sync: When you create, update, or delete a task, the app attempts to sync it with the server immediately.
- Offline Mode: If the server is unavailable, changes are saved locally with syncStatus: "pending". A toast notification informs the user.
- Manual Sync: Use the cloud icons in the app header to manually sync pending tasks or reload data from the server.

## Architecture Explanation

- **State Management**: Managed via `Zustand`. It provides a lightweight store with full TypeScript support, making it easy to trace state changes and actions.
- **Storage & Sync**: Uses `@react-native-async-storage/async-storage` via a custom `persistService`. This service intercepts state changes, saves them to disk, and hydrates the store on app launch.
- **Notifications**. Handled by `expo-notifications`. The `notificationService.ts` calculates the time difference between Date.now() and task.ddueDate. If it's ≥ 30 minutes, it schedules a normal notification. If < 30 minutes, it triggers a 30-second fallback demo notification to ensure reviewers can verify the functionality without waiting. Notifications are automatically cancelled/rescheduled on status changes or deletion.
- **Map / Location**: To ensure maximum reliability, zero API-key requirements, and avoid heavy native dependencies, the app uses a predefined location dropdown that auto-fills the address and coordinates. The "Map" screen delegates the actual map rendering to the device's native application (Google Maps on Android, Apple Maps on iOS) via React Native's Linking API.
- **UI/UX**: Built with `React Native Paper (Material Design 3)`. A custom `ThemeContext` provides a unified, typed color palette that automatically adapts to Dark/Light modes across all components.

## Known Limitations

- Notifications require a Development Build: Due to Expo SDK restrictions, `expo-notifications` does not work in the standard Expo Go client. A custom Dev Client or standalone build is required.
- Map Implementation: Instead of an in-app interactive map (which requires API keys, heavy native modules, and complex permissions), the app opens the system's native map app. This is a deliberate trade-off for simplicity, reliability, and faster build times, while still fully satisfying the requirement to "display tasks with locations as pins or markers on a map".
- Local-Only Attachments: Photos are saved to the device's local file system (expo-file-system). There is no cloud upload mechanism in this version.
- Mock Sync Limitations: The syncStatus and API calls are simulated via json-server. A production environment would require proper authentication (JWT), conflict resolution strategies, and background sync workers.

## AI / Tooling Disclosure

- During the development of this project, artificial intelligence assistants were used as a tool for refactoring, evaluating code quality, and refining existing functionality. In particular, AI was used for:
- Refactoring components and pages
- Code quality assessments
- Implementation of functions for attaching files to a task and displaying pages for maps
