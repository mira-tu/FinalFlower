# React Native Admin Dashboard Setup

This document explains how to use the React Native version of the Admin Dashboard.

## File Location

The React Native version is located at: `src/pages/AdminDashboard.native.jsx`

## Installation

### 1. Install React Native Dependencies

If you're setting up a new React Native project, install the required dependencies:

```bash
npm install @react-native-async-storage/async-storage react-native-vector-icons @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens
```

### 2. iOS Setup (if using iOS)

For iOS, you need to install pods:

```bash
cd ios && pod install && cd ..
```

### 3. Link Native Modules

For React Native 0.60+, auto-linking should handle most dependencies. However, for `react-native-vector-icons`, you may need to:

**iOS:**
- Add to `ios/Podfile`: `pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'`
- Run `pod install`

**Android:**
- Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Usage

### Import the Component

```javascript
import AdminDashboard from './src/pages/AdminDashboard.native';

// In your navigation setup
<Stack.Screen name="AdminDashboard" component={AdminDashboard} />
```

### Navigation Setup

Make sure you have React Navigation set up in your app:

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from './src/pages/AdminDashboard.native';
import Login from './src/pages/Login'; // Your login screen

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Key Differences from Web Version

1. **Storage**: Uses `AsyncStorage` instead of `localStorage`
2. **Navigation**: Uses React Navigation instead of React Router
3. **Icons**: Uses `react-native-vector-icons` instead of FontAwesome CSS
4. **Components**: 
   - `div` → `View`
   - `button` → `TouchableOpacity`
   - `input` → `TextInput`
   - `table` → `FlatList` with custom rendering
   - `img` → `Image`
5. **Styling**: Uses `StyleSheet` instead of CSS classes
6. **Modals**: Uses React Native `Modal` component
7. **Alerts**: Uses `Alert.alert()` instead of `window.confirm()`

## Features Implemented

✅ Catalogue Management
✅ Orders Management (simplified)
✅ Stock Management
✅ Notifications
✅ About Page Management
✅ Contact Page Management
✅ Sales Overview
✅ Employee Management

## Notes

- The Messaging tab is simplified in this version. Full chat implementation would require additional real-time messaging setup.
- Image uploads currently use URL input. For file uploads, you'd need to integrate `react-native-image-picker` or similar.
- The component assumes you have a Login screen that sets `currentUser` in AsyncStorage.

## Customization

You can customize the colors and styles by modifying the `styles` object at the bottom of the file. The main color (`#ec4899`) can be changed throughout the component.

## Troubleshooting

1. **Icons not showing**: Make sure `react-native-vector-icons` is properly linked for your platform.
2. **AsyncStorage errors**: Ensure `@react-native-async-storage/async-storage` is installed and linked.
3. **Navigation errors**: Make sure React Navigation is properly set up with all required peer dependencies.

