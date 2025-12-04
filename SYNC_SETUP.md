# Linking React Web and React Native Apps

This guide explains how the React web app and React Native app are linked to share data.

## Shared Storage Utility

Both apps now use a unified storage interface that works across platforms:

- **Web**: Uses `localStorage`
- **React Native**: Uses `AsyncStorage`

### Usage

```javascript
import storage, { StorageHelpers } from './utils/storage';

// Get item
const user = await StorageHelpers.getJSON('currentUser');

// Set item
await StorageHelpers.setJSON('currentUser', { id: 1, name: 'Admin' });

// Array operations
await StorageHelpers.addToArray('orders', newOrder);
await StorageHelpers.removeFromArray('orders', item => item.id !== orderId);
await StorageHelpers.updateArrayItem('orders', orderId, { status: 'completed' });
```

## Sync Service

The sync service allows data synchronization between web and mobile apps via an API.

### Setup

1. **Create a backend API endpoint** (optional - for cloud sync):

```javascript
// Example: Express.js endpoint
app.post('/api/sync', async (req, res) => {
  // Save synced data to database
  const { currentUser, catalogueProducts, orders, ... } = req.body;
  // ... save to database
  res.json({ success: true });
});

app.get('/api/sync', async (req, res) => {
  // Retrieve synced data from database
  const data = await getSyncedData();
  res.json(data);
});
```

2. **Initialize sync in your app**:

```javascript
import syncService from './utils/syncService';
import storage from './utils/storage';

// Initialize with your API endpoint
syncService.init('https://your-api.com/api', 30000); // Sync every 30 seconds

// Start automatic syncing
syncService.startAutoSync(storage);
```

### Manual Sync

```javascript
// Sync data to server
await syncService.manualSync(storage);

// Sync data from server
const syncedData = await syncService.syncFromServer();
if (syncedData) {
  await syncService.applySyncedData(storage, syncedData);
}
```

## Shared Data Keys

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

## Local-Only Sync (No Backend)

If you don't have a backend API, you can still share data by:

1. **Export/Import Data**:
   - Export data from web app as JSON
   - Import into React Native app (or vice versa)

2. **QR Code Sync**:
   - Generate QR code with data in web app
   - Scan QR code in React Native app to import data

3. **File Sharing**:
   - Export data to file in web app
   - Share file to mobile app
   - Import file in React Native app

## Implementation Status

✅ **Storage Utility**: Created and ready to use
✅ **Sync Service**: Created (requires backend API for full sync)
⏳ **Backend API**: You need to create this
⏳ **Update Components**: Need to update both apps to use shared storage

## Next Steps

1. Update AdminDashboard components to use shared storage utility
2. Create backend API endpoints (optional)
3. Add sync UI/buttons in both apps
4. Test data synchronization

## Example: Updating AdminDashboard to use Shared Storage

```javascript
// Before (Web)
const products = JSON.parse(localStorage.getItem('catalogueProducts') || '[]');

// After (Web)
import storage, { StorageHelpers } from '../utils/storage';
const products = await StorageHelpers.getArray('catalogueProducts', []);

// Before (React Native)
const productsJson = await AsyncStorage.getItem('catalogueProducts');
const products = productsJson ? JSON.parse(productsJson) : [];

// After (React Native)
import storage, { StorageHelpers } from '../utils/storage';
const products = await StorageHelpers.getArray('catalogueProducts', []);
```

This makes the code identical across both platforms!

