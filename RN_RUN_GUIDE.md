# How to Run the React Native Admin Dashboard

## Prerequisites

Before you start, make sure you have:
- Node.js (v16 or higher) installed
- For iOS: Xcode and CocoaPods installed (Mac only)
- For Android: Android Studio and Android SDK installed
- React Native CLI: `npm install -g react-native-cli`

## Option 1: Create a New React Native Project

### Step 1: Create a new React Native project

```bash
npx react-native init FlowerForgeAdmin --version 0.72.0
cd FlowerForgeAdmin
```

### Step 2: Install Required Dependencies

```bash
npm install @react-native-async-storage/async-storage react-native-vector-icons @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens
```

### Step 3: Copy the Admin Dashboard Component

Copy the React Native component to your new project:

```bash
# From your current directory
cp src/pages/AdminDashboard.native.jsx FlowerForgeAdmin/src/screens/AdminDashboard.jsx
```

### Step 4: iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

For iOS, you also need to configure `react-native-vector-icons`:

1. Open `ios/FlowerForgeAdmin.xcworkspace` in Xcode
2. In the project navigator, select your project
3. Go to "Build Phases" → "Copy Bundle Resources"
4. Click "+" and add fonts from `node_modules/react-native-vector-icons/Fonts/*.ttf`

Or add to `ios/Podfile`:
```ruby
pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
```

### Step 5: Android Setup

Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### Step 6: Create Navigation Setup

Create `src/navigation/AppNavigator.js`:

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../screens/AdminDashboard';
import LoginScreen from '../screens/LoginScreen'; // You'll need to create this

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
```

### Step 7: Create a Simple Login Screen

Create `src/screens/LoginScreen.js`:

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Simple login - you can enhance this
    if (email && password) {
      const user = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin', // or 'employee'
      };
      
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f6f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e3e6f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
```

### Step 8: Update App.js

Update `App.js`:

```javascript
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return <AppNavigator />;
}

export default App;
```

## Running the App

### For iOS (Mac only):

```bash
npm run ios
```

Or open Xcode and run from there:
```bash
open ios/FlowerForgeAdmin.xcworkspace
```

### For Android:

Make sure you have an Android emulator running or a device connected, then:

```bash
npm run android
```

### Start Metro Bundler:

In a separate terminal:
```bash
npm start
```

## Option 2: Quick Test with Expo (Easier Setup)

If you want a quicker setup, you can use Expo:

### Step 1: Install Expo CLI

```bash
npm install -g expo-cli
```

### Step 2: Create Expo Project

```bash
npx create-expo-app FlowerForgeAdmin
cd FlowerForgeAdmin
```

### Step 3: Install Dependencies

```bash
npm install @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens
npx expo install expo-font
```

For icons, you can use `@expo/vector-icons` instead:
```bash
npx expo install @expo/vector-icons
```

### Step 4: Update AdminDashboard.native.jsx

Replace `react-native-vector-icons` imports with:
```javascript
import { FontAwesome } from '@expo/vector-icons';
// Then use: <FontAwesome name="box" size={20} />
```

### Step 5: Run

```bash
npx expo start
```

Then scan the QR code with Expo Go app on your phone, or press `i` for iOS simulator, `a` for Android emulator.

## Troubleshooting

### Icons not showing:
- **iOS**: Make sure fonts are added to Xcode project
- **Android**: Make sure `fonts.gradle` is applied
- **Expo**: Use `@expo/vector-icons` instead

### AsyncStorage errors:
```bash
npm install @react-native-async-storage/async-storage
# For iOS: cd ios && pod install
```

### Navigation errors:
Make sure all peer dependencies are installed:
```bash
npm install react-native-screens react-native-safe-area-context
```

### Metro bundler cache issues:
```bash
npm start -- --reset-cache
```

### Android build errors:
```bash
cd android
./gradlew clean
cd ..
```

## Quick Start Commands Summary

```bash
# 1. Create project
npx react-native init FlowerForgeAdmin --version 0.72.0
cd FlowerForgeAdmin

# 2. Install dependencies
npm install @react-native-async-storage/async-storage react-native-vector-icons @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens

# 3. iOS setup (Mac only)
cd ios && pod install && cd ..

# 4. Copy your component files
# (Copy AdminDashboard.native.jsx and create LoginScreen.js)

# 5. Run
npm run ios    # for iOS
npm run android # for Android
```

## Need Help?

- Check React Native docs: https://reactnative.dev/docs/getting-started
- Check React Navigation docs: https://reactnavigation.org/docs/getting-started

