# Linking React Web and React Native Apps - Complete Guide

## ✅ What's Been Set Up

### 1. Shared Storage Utility
- **Location**: `src/utils/storage.js` (Web) and `react-native-app/src/utils/storage.js` (Mobile)
- **Purpose**: Unified storage interface that works on both platforms
- **Features**: 
  - Same API for both platforms
  - Helper functions for JSON, arrays, etc.
  - Automatic platform detection

### 2. Sync Service
- **Location**: `src/utils/syncService.js` (Web) and `react-native-app/src/utils/syncService.js` (Mobile)
- **Purpose**: Sync data between apps via API
- **Features**:
  - Automatic periodic sync
  - Manual sync
  - Server-to-client sync

### 3. Data Export/Import
- **Location**: `src/utils/dataExport.js` (Web) and `react-native-app/src/utils/dataExport.js` (Mobile)
- **Purpose**: Export/import data for manual sharing
- **Features**:
  - Export to JSON file
  - Import from JSON file
  - QR code support (for quick sharing)

## 🔄 How Data Sync Works

### Option 1: API-Based Sync (Recommended for Production)

1. **Create Backend API**:
```javascript
// Example Express.js endpoints
app.post('/api/sync', (req, res) => {
  // Save data to database
  const { currentUser, catalogueProducts, ... } = req.body;
  // ... save logic
  res.json({ success: true });
});

app.get('/api/sync', (req, res) => {
  // Retrieve data from database
  // ... fetch logic
  res.json(data);
});
```

2. **Initialize in Both Apps**:
```javascript
import syncService from './utils/syncService';
import storage from './utils/storage';

// Initialize sync
syncService.init('https://your-api.com/api', 30000);

// Start auto-sync
syncService.startAutoSync(storage);
```

### Option 2: Manual Export/Import (No Backend Required)

**From Web App**:
```javascript
import DataExport from './utils/dataExport';

// Export data
await DataExport.exportToFile('flowerforge-data.json');
// User downloads file
```

**To React Native App**:
```javascript
import DataExport from './utils/dataExport';
import * as DocumentPicker from 'expo-document-picker';

// Pick file
const result = await DocumentPicker.getDocumentAsync();
if (result.type === 'success') {
  await DataExport.importFromFile(result.uri);
}
```

### Option 3: QR Code Sync (Quick Sharing)

**From Web App**:
```javascript
import DataExport from './utils/dataExport';
import QRCode from 'qrcode'; // npm install qrcode

const qrData = await DataExport.exportToQRCode();
const qrImage = await QRCode.toDataURL(qrData);
// Display QR code
```

**To React Native App**:
```javascript
import DataExport from './utils/dataExport';
import { BarCodeScanner } from 'expo-barcode-scanner';

// Scan QR code
const { data } = await BarCodeScanner.scanAsync();
await DataExport.importFromQRCode(data);
```

## 📝 Shared Data Keys

Both apps sync these data keys:

- `currentUser` - Current logged-in user
- `catalogueProducts` - Product catalogue
- `orders` - Customer orders
- `requests` - Special requests/bookings
- `stock` - Inventory stock
- `notifications` - Notifications
- `messages` - Chat messages
- `employees` - Employee data
- `aboutData` - About page content
- `contactData` - Contact page content

## 🚀 Quick Start

### Step 1: Update Components to Use Shared Storage

**Before (Web)**:
```javascript
const products = JSON.parse(localStorage.getItem('catalogueProducts') || '[]');
localStorage.setItem('catalogueProducts', JSON.stringify(products));
```

**After (Web)**:
```javascript
import storage, { StorageHelpers } from '../utils/storage';

const products = await StorageHelpers.getArray('catalogueProducts', []);
await StorageHelpers.setArray('catalogueProducts', products);
```

**Before (React Native)**:
```javascript
const productsJson = await AsyncStorage.getItem('catalogueProducts');
const products = productsJson ? JSON.parse(productsJson) : [];
await AsyncStorage.setItem('catalogueProducts', JSON.stringify(products));
```

**After (React Native)**:
```javascript
import storage, { StorageHelpers } from '../utils/storage';

const products = await StorageHelpers.getArray('catalogueProducts', []);
await StorageHelpers.setArray('catalogueProducts', products);
```

### Step 2: Add Sync UI (Optional)

Add sync buttons to both apps:

**Web App**:
```jsx
<button onClick={async () => {
  await syncService.manualSync(storage);
  alert('Data synced!');
}}>
  Sync Data
</button>
```

**React Native App**:
```jsx
<TouchableOpacity onPress={async () => {
  await syncService.manualSync(storage);
  Alert.alert('Success', 'Data synced!');
}}>
  <Text>Sync Data</Text>
</TouchableOpacity>
```

## 🔧 Installation (For QR Code & File Sharing)

### Web App:
```bash
npm install qrcode
```

### React Native App:
```bash
npx expo install expo-file-system expo-sharing expo-document-picker expo-barcode-scanner
```

## 📱 Testing the Link

1. **Create data in web app** (e.g., add a product)
2. **Export data** from web app
3. **Import data** into React Native app
4. **Verify** data appears in mobile app

Or with API sync:
1. **Create data in web app**
2. **Wait for auto-sync** (or trigger manual sync)
3. **Open React Native app**
4. **Data should sync automatically**

## 🎯 Next Steps

1. ✅ Storage utilities created
2. ✅ Sync service created
3. ✅ Export/import utilities created
4. ⏳ Update AdminDashboard components to use shared storage
5. ⏳ Add sync UI components
6. ⏳ Create backend API (if using API sync)
7. ⏳ Test data synchronization

## 💡 Tips

- **For Development**: Use export/import for quick testing
- **For Production**: Use API-based sync for real-time updates
- **For Offline**: Both apps work offline, sync when online
- **Data Conflicts**: Last write wins (or implement conflict resolution)

## 🐛 Troubleshooting

**Data not syncing?**
- Check if sync service is initialized
- Verify API endpoint is correct
- Check network connectivity
- Review console for errors

**Import not working?**
- Verify JSON format is valid
- Check file permissions (React Native)
- Ensure all required keys are present

**Storage errors?**
- Check platform detection
- Verify AsyncStorage is installed (React Native)
- Check localStorage availability (Web)

