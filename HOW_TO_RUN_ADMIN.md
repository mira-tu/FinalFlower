# How to Run the Admin Dashboard

## 🎯 Quick Start

### Option 1: React Web Admin (Easiest)

1. **Open Terminal** and navigate to project:
   ```bash
   cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4"
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - The terminal will show a URL like: `http://localhost:5173`
   - Open that URL in your browser

4. **Access Admin Dashboard**:
   - Go to: `http://localhost:5173/admin/dashboard`
   - Or login first at: `http://localhost:5173/login`

### Option 2: React Native Admin (Mobile)

1. **Open Terminal** and navigate to React Native app:
   ```bash
   cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4/react-native-app"
   ```

2. **Start Expo**:
   ```bash
   npm start
   ```

3. **Choose how to run**:
   - **On your phone**: Scan QR code with Expo Go app
   - **iOS Simulator** (Mac only): Press `i`
   - **Android Emulator**: Press `a` (make sure emulator is running)
   - **Web Browser**: Press `w`

4. **Login**:
   - Email: Any email (e.g., `admin@test.com`)
   - Password: Any password
   - Click "Login"

## 📋 Step-by-Step Instructions

### React Web Admin Dashboard

#### Step 1: Install Dependencies (if needed)
```bash
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4"
npm install
```

#### Step 2: Start Server
```bash
npm run dev
```

#### Step 3: Access Admin
- Browser will open automatically, or
- Go to: `http://localhost:5173/admin/dashboard`
- If redirected to login, check `src/pages/Login.jsx` for credentials

#### Step 4: Use Admin Dashboard
- Manage products in Catalogue tab
- View orders in Orders tab
- Manage stock in Stock tab
- All features available!

### React Native Admin Dashboard

#### Step 1: Install Dependencies (if needed)
```bash
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4/react-native-app"
npm install
```

#### Step 2: Start Expo
```bash
npm start
```

#### Step 3: Run on Device/Simulator

**Option A: On Your Phone (Recommended)**
1. Install "Expo Go" app from App Store/Play Store
2. Scan the QR code shown in terminal
3. App opens on your phone

**Option B: iOS Simulator (Mac only)**
1. Press `i` in terminal
2. iOS Simulator opens automatically
3. App loads in simulator

**Option C: Android Emulator**
1. Start Android Studio emulator first
2. Press `a` in terminal
3. App loads in emulator

**Option D: Web Browser**
1. Press `w` in terminal
2. App opens in browser

#### Step 4: Login
- Enter any email: `admin@test.com`
- Enter any password: `password`
- Tap "Login"

#### Step 5: Use Admin Dashboard
- Swipe or tap tabs to navigate
- "Admin Control" tab lets you push data to web app
- All admin features available!

## 🔑 Login Information

### React Web App
- Check `src/pages/Login.jsx` for login logic
- May need to create account via Signup page first
- Or check if there's a default admin account

### React Native App
- **Email**: Any email works (e.g., `admin@test.com`)
- **Password**: Any password works
- Automatically logs you in as admin

## 🎨 Admin Features

### Both Apps Have:
- ✅ Catalogue Management (add/edit/delete products)
- ✅ Orders Management (view/manage orders)
- ✅ Stock Management (wrappers, ribbons, flowers)
- ✅ Notifications
- ✅ About/Contact page management
- ✅ Sales Overview
- ✅ Employee Management

### React Native Only:
- ✅ Admin Control Panel (push data to web)
- ✅ Mobile-optimized UI
- ✅ Bottom tab navigation

### React Web Only:
- ✅ Sync Status Widget (shows updates from mobile)
- ✅ Desktop-optimized UI
- ✅ Sidebar navigation

## 🚀 Running Both Simultaneously

You can run both apps at the same time:

**Terminal 1** (React Web):
```bash
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4"
npm run dev
```

**Terminal 2** (React Native):
```bash
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4/react-native-app"
npm start
```

## 🔄 Testing Admin Control (React Native → Web)

1. **In React Native**:
   - Add a product in Catalogue tab
   - Go to "Admin Control" tab
   - Tap "Push Products"

2. **In React Web**:
   - Check sync status widget (bottom-right)
   - Product should appear (may need refresh)

## 🐛 Troubleshooting

### Web App Won't Start
```bash
# Check if port is in use
lsof -ti:5173 | xargs kill -9

# Reinstall dependencies
npm install

# Try again
npm run dev
```

### React Native Won't Start
```bash
# Clear cache
npx expo start --clear

# Reinstall dependencies
npm install

# Try again
npm start
```

### Can't Access Admin Dashboard
- Make sure you're logged in
- Check URL: `/admin/dashboard`
- Check browser console for errors
- Verify route exists in `src/App.jsx`

### Expo QR Code Not Working
- Make sure phone and computer are on same WiFi
- Try using tunnel: `npx expo start --tunnel`
- Or use web option: Press `w`

## 📱 Quick Commands Reference

```bash
# React Web
cd "/Users/rhimandninomfernandez/Downloads/FlowerForgeOfficial-main 4"
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# React Native
cd react-native-app
npm start            # Start Expo
npm run ios          # Start iOS directly
npm run android      # Start Android directly
npm run web          # Start web version
```

## ✅ Success Indicators

### Web App Running:
- Terminal shows: `Local: http://localhost:5173`
- Browser opens automatically
- You can navigate to admin dashboard

### React Native Running:
- Terminal shows QR code
- Options: `[i] iOS | [a] Android | [w] Web`
- Expo Go app can scan QR code
- Or simulator/emulator opens

## 💡 Pro Tips

1. **Keep both terminals open** to see logs
2. **Use React Native on phone** for best mobile experience
3. **Use Web for desktop** admin tasks
4. **Test sync** by making changes in mobile and checking web
5. **Check sync status widget** in web app to see connection

## 🎯 Next Steps After Running

1. ✅ Both apps are running
2. ✅ Login to both
3. ✅ Explore admin features
4. ✅ Test Admin Control Panel (React Native)
5. ✅ Verify sync status (React Web)

Enjoy your admin dashboards! 🎉

