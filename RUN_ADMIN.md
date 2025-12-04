# Running the Admin Dashboard

## 🚀 Both Apps Are Starting!

### React Web App
- **Status**: Starting development server
- **URL**: Will be shown in terminal (usually http://localhost:5173)
- **Admin Dashboard**: http://localhost:5173/admin/dashboard

### React Native App
- **Status**: Starting Expo development server
- **Options**:
  - Press `i` for iOS simulator
  - Press `a` for Android emulator
  - Scan QR code with Expo Go app on your phone
  - Press `w` for web browser

## 📱 Accessing Admin Dashboard

### React Web App:
1. Open browser to the URL shown in terminal
2. Navigate to `/admin/dashboard`
3. Login with any credentials (or check Login.jsx for requirements)

### React Native App:
1. Wait for Expo to start
2. Choose your platform (iOS/Android/Web)
3. Login screen will appear
4. Enter any email/password to login
5. Admin Dashboard will load

## 🔑 Login Credentials

### React Web App:
- Check `src/pages/Login.jsx` for login requirements
- Or create a user via Signup page first

### React Native App:
- **Email**: Any email (e.g., `admin@test.com`)
- **Password**: Any password
- Will automatically log you in as admin

## 🎯 Admin Features Available

### React Native (Master Admin):
- ✅ Catalogue Management
- ✅ Orders Management
- ✅ Stock Management
- ✅ Notifications
- ✅ Admin Control Panel (push data to web)
- ✅ About/Contact Management
- ✅ Sales Overview
- ✅ Employee Management

### React Web (Receives Updates):
- ✅ Admin Dashboard (receives updates from mobile)
- ✅ Sync Status Widget (bottom-right corner)
- ✅ Auto-updates when React Native pushes data

## 🔄 Testing the Admin Control

1. **In React Native**:
   - Open Admin Dashboard
   - Go to "Admin Control" tab
   - Add a product in Catalogue tab
   - Go back to Admin Control tab
   - Tap "Push Products"

2. **In React Web**:
   - Open Admin Dashboard
   - Check if product appears (may need to refresh)
   - Or check sync status widget

## 📊 Terminal Commands

### To stop servers:
- Press `Ctrl+C` in each terminal

### To restart:
```bash
# React Web
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4"
npm run dev

# React Native
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4/react-native-app"
npm start
```

## 🐛 Troubleshooting

**Web app not starting?**
- Check if port 5173 is available
- Check terminal for errors
- Try: `npm install` then `npm run dev`

**React Native not starting?**
- Check if Expo is installed: `npx expo --version`
- Try: `cd react-native-app && npm install && npm start`
- Clear cache: `npx expo start --clear`

**Can't see Admin Dashboard?**
- Make sure you're logged in
- Check URL is correct: `/admin/dashboard`
- Check browser console for errors

## 💡 Quick Tips

- **Web App**: Usually runs on http://localhost:5173
- **React Native**: Use Expo Go app on your phone for easiest testing
- **Both Apps**: Can run simultaneously
- **Sync**: Requires backend API (see ADMIN_SETUP.md)

