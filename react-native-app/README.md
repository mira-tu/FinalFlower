# FlowerForge Admin Dashboard - React Native

## 🚀 Quick Start

The React Native app is now set up and ready to run!

### Running the App

1. **Make sure you're in the react-native-app directory:**
   ```bash
   cd react-native-app
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Run on your device/simulator:**
   - Press `i` for iOS simulator (Mac only)
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone
   - Press `w` to open in web browser

### Login

- **Email:** Any email address
- **Password:** Any password
- The app will automatically log you in as an admin user

### Features

✅ Catalogue Management
✅ Orders Management  
✅ Stock Management
✅ Notifications
✅ About Page Management
✅ Contact Page Management
✅ Sales Overview
✅ Employee Management

## 📱 Testing Options

### Option 1: Expo Go App (Easiest)
1. Install Expo Go on your phone (iOS App Store or Google Play)
2. Scan the QR code shown in the terminal
3. The app will load on your phone

### Option 2: iOS Simulator (Mac only)
1. Make sure Xcode is installed
2. Press `i` in the Expo terminal
3. The iOS simulator will open

### Option 3: Android Emulator
1. Make sure Android Studio is installed and an emulator is running
2. Press `a` in the Expo terminal
3. The app will load in the emulator

### Option 4: Web Browser
1. Press `w` in the Expo terminal
2. The app will open in your default browser

## 🛠️ Troubleshooting

### If the server isn't running:
```bash
cd react-native-app
npm start
```

### If you see errors about missing dependencies:
```bash
npm install
```

### To clear cache:
```bash
npx expo start --clear
```

## 📁 Project Structure

```
react-native-app/
├── App.js                 # Main app entry with navigation
├── src/
│   └── screens/
│       ├── AdminDashboard.js  # Main admin dashboard
│       └── LoginScreen.js    # Login screen
├── package.json
└── app.json
```

## 🎨 Customization

All styles are in the `StyleSheet` at the bottom of `AdminDashboard.js`. The main color is `#ec4899` (pink).

## 📝 Notes

- Data is stored locally using AsyncStorage
- The app works offline
- All features from the web version are available

