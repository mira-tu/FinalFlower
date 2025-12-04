# Quick Start: Linking React Web & React Native Apps

## ✅ What's Ready

I've created a complete linking system for your React web and React Native apps:

### 1. **Shared Storage Utilities** ✅
- `src/utils/storage.js` (Web)
- `react-native-app/src/utils/storage.js` (Mobile)
- Same API for both platforms!

### 2. **Sync Service** ✅
- `src/utils/syncService.js` (Web)
- `react-native-app/src/utils/syncService.js` (Mobile)
- Sync via API or manual export/import

### 3. **Data Export/Import** ✅
- `src/utils/dataExport.js` (Web)
- `react-native-app/src/utils/dataExport.js` (Mobile)
- Export/import JSON files

### 4. **Sync UI Components** ✅
- `src/components/SyncButton.jsx` (Web)
- `react-native-app/src/components/SyncButton.js` (Mobile)

## 🚀 Quick Usage

### Option 1: Use Shared Storage (Recommended)

**Replace localStorage/AsyncStorage calls:**

```javascript
// OLD (Web)
const products = JSON.parse(localStorage.getItem('catalogueProducts') || '[]');

// NEW (Web)
import { StorageHelpers } from '../utils/storage';
const products = await StorageHelpers.getArray('catalogueProducts', []);
```

```javascript
// OLD (React Native)
const productsJson = await AsyncStorage.getItem('catalogueProducts');
const products = productsJson ? JSON.parse(productsJson) : [];

// NEW (React Native)
import { StorageHelpers } from '../utils/storage';
const products = await StorageHelpers.getArray('catalogueProducts', []);
```

### Option 2: Add Sync Button to Admin Dashboard

**Web App** (`src/pages/AdminDashboard.jsx`):
```jsx
import SyncButton from '../components/SyncButton';

// Add in your component:
<SyncButton apiEndpoint="https://your-api.com/api" />
```

**React Native App** (`react-native-app/src/screens/AdminDashboard.js`):
```jsx
import SyncButton from '../components/SyncButton';

// Add in your component:
<SyncButton apiEndpoint="https://your-api.com/api" />
```

### Option 3: Manual Export/Import

**Export from Web:**
1. Click "Export Data" button
2. Download JSON file
3. Share file to mobile device

**Import to Mobile:**
1. Click "Import Data" button
2. Select the JSON file
3. Data is imported!

## 📦 Install Dependencies

### React Native App:
```bash
cd react-native-app
npx expo install expo-document-picker expo-file-system expo-sharing
```

### Web App (for QR code):
```bash
npm install qrcode
```

## 🔄 Sync Methods

### Method 1: API Sync (Real-time)
```javascript
import syncService from './utils/syncService';
import storage from './utils/storage';

// Initialize
syncService.init('https://your-api.com/api', 30000);
syncService.startAutoSync(storage);
```

### Method 2: Manual Export/Import (No Backend)
- Export data from web app
- Import into mobile app (or vice versa)
- Works offline!

### Method 3: QR Code (Quick Share)
- Generate QR code in web app
- Scan with mobile app
- Instant sync!

## 📝 Next Steps

1. **Update AdminDashboard components** to use `StorageHelpers`
2. **Add SyncButton** to both dashboards
3. **Create backend API** (optional, for real-time sync)
4. **Test data sync** between apps

## 📚 Full Documentation

See `LINKING_GUIDE.md` for complete documentation.

## 💡 Tips

- **Development**: Use export/import for quick testing
- **Production**: Use API sync for real-time updates
- **Offline**: Both apps work offline, sync when online

