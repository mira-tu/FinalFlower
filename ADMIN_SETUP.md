# React Native as Admin of React Web App

## 🎯 Overview

The React Native app is now configured as the **admin/master** that controls and pushes data to the React web app. The web app listens for updates from the mobile admin.

## ✅ What's Been Created

### 1. **Admin Sync Service** (React Native)
- **Location**: `react-native-app/src/utils/adminSync.js`
- **Purpose**: Push data from React Native to web app
- **Features**:
  - Push all data or specific keys
  - Auto-push on interval
  - Push individual entities (products, orders, etc.)
  - Delete entities and push updates

### 2. **Web Sync Listener** (React Web)
- **Location**: `src/utils/webSyncListener.js`
- **Purpose**: Listen for and apply updates from React Native admin
- **Features**:
  - Poll for updates from admin
  - Auto-apply updates to localStorage
  - Event callbacks for component updates
  - Cross-tab sync support

### 3. **Admin Control Panel** (React Native)
- **Location**: `react-native-app/src/components/AdminControlPanel.js`
- **Purpose**: UI to control data pushing to web app
- **Features**:
  - Push all data button
  - Push specific data (products, orders)
  - Auto-push toggle
  - Sync status display

### 4. **Admin Sync Status** (React Web)
- **Location**: `src/components/AdminSyncStatus.jsx`
- **Purpose**: Show sync status and receive updates
- **Features**:
  - Connection status indicator
  - Last update time
  - Update count
  - Manual pull button

## 🚀 Quick Setup

### Step 1: Add Admin Control Panel to React Native App

In `react-native-app/src/screens/AdminDashboard.js`:

```javascript
import AdminControlPanel from '../components/AdminControlPanel';

// Add a new tab or add to existing tabs
const AdminControlTab = () => {
  return (
    <AdminControlPanel apiEndpoint="https://your-api.com/api" />
  );
};
```

### Step 2: Add Sync Status to React Web App

In `src/App.jsx` or your main component:

```javascript
import AdminSyncStatus from './components/AdminSyncStatus';

function App() {
  return (
    <>
      {/* Your existing app */}
      <AdminSyncStatus apiEndpoint="https://your-api.com/api" />
    </>
  );
}
```

### Step 3: Create Backend API Endpoints

You need to create these endpoints:

```javascript
// POST /api/admin/push - Receive data from React Native
app.post('/api/admin/push', (req, res) => {
  const { source, data, timestamp } = req.body;
  
  // Save data to database or cache
  // Store with timestamp for sync tracking
  
  res.json({ 
    success: true, 
    timestamp: new Date().toISOString() 
  });
});

// GET /api/admin/pull?since=timestamp - Get updates for web app
app.get('/api/admin/pull', (req, res) => {
  const since = req.query.since;
  
  // Get data updated since timestamp
  const updates = getUpdatesSince(since);
  
  if (Object.keys(updates).length === 0) {
    return res.status(304).send(); // No updates
  }
  
  res.json({
    data: updates,
    timestamp: new Date().toISOString(),
  });
});
```

## 📱 Usage

### From React Native (Admin):

1. **Push All Data**:
```javascript
import adminSyncService from './utils/adminSync';

// Push everything
await adminSyncService.pushAllToWeb();
```

2. **Push Specific Data**:
```javascript
// Push just products
await adminSyncService.pushKeyToWeb('catalogueProducts', products);

// Push just orders
await adminSyncService.pushKeyToWeb('orders', orders);
```

3. **Push Individual Entity**:
```javascript
// Add/update a product
await adminSyncService.pushEntity('product', {
  id: 'prod-1',
  name: 'Rose Bouquet',
  price: 500,
  // ...
});

// Delete a product
await adminSyncService.deleteEntity('product', 'prod-1');
```

4. **Enable Auto-Push**:
```javascript
// Auto-push every 5 seconds
adminSyncService.startAutoPush(5000);
```

### From React Web (Listener):

1. **Start Listening**:
```javascript
import webSyncListener from './utils/webSyncListener';

webSyncListener.init('https://your-api.com/api', 5000);
webSyncListener.startListening();
```

2. **Listen for Updates**:
```javascript
// Register callback
webSyncListener.onUpdate((updates) => {
  console.log('Received updates:', updates);
  // Refresh your UI
  loadData();
});
```

3. **Manual Pull**:
```javascript
// Manually check for updates
await webSyncListener.pullFromAdmin();
```

## 🔄 Data Flow

```
React Native (Admin)
    ↓
  [Make Changes]
    ↓
  [Push to API]
    ↓
Backend API
    ↓
  [Store Data]
    ↓
React Web (Listener)
    ↓
  [Poll API]
    ↓
  [Receive Updates]
    ↓
  [Apply to localStorage]
    ↓
  [Update UI]
```

## 🎨 UI Components

### Admin Control Panel (React Native)

Add to your AdminDashboard tabs:

```javascript
case 'admin-control':
  return <AdminControlPanel apiEndpoint="https://your-api.com/api" />;
```

### Sync Status (React Web)

Add to your main App component - it will show as a floating widget in the bottom-right corner.

## ⚙️ Configuration

### React Native App:

```javascript
// In App.js or AdminDashboard
import adminSyncService from './utils/adminSync';

// Initialize
adminSyncService.init('https://your-api.com/api');

// Optional: Enable auto-push
adminSyncService.startAutoPush(5000); // Every 5 seconds
```

### React Web App:

```javascript
// In App.jsx
import webSyncListener from './utils/webSyncListener';

useEffect(() => {
  webSyncListener.init('https://your-api.com/api', 5000);
  webSyncListener.startListening();
  
  // Listen for updates
  const unsubscribe = webSyncListener.onUpdate((updates) => {
    // Handle updates
    console.log('Updates received:', updates);
  });
  
  return () => {
    webSyncListener.stopListening();
    unsubscribe();
  };
}, []);
```

## 📊 Sync Keys

These data keys are synced:

- `currentUser` - Current user
- `catalogueProducts` - Products
- `orders` - Orders
- `requests` - Requests
- `stock` - Stock inventory
- `notifications` - Notifications
- `messages` - Messages
- `employees` - Employees
- `aboutData` - About page
- `contactData` - Contact page

## 🔧 Backend API Requirements

Your backend needs:

1. **POST /api/admin/push** - Receive data from React Native
2. **GET /api/admin/pull?since=timestamp** - Send updates to React Web

### Example Implementation (Express.js):

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let syncData = {};
let lastUpdate = null;

// Receive data from React Native admin
app.post('/api/admin/push', (req, res) => {
  const { data, timestamp } = req.body;
  syncData = { ...syncData, ...data };
  lastUpdate = timestamp || new Date().toISOString();
  res.json({ success: true, timestamp: lastUpdate });
});

// Send updates to React Web
app.get('/api/admin/pull', (req, res) => {
  const since = req.query.since;
  
  if (since && since === lastUpdate) {
    return res.status(304).send(); // No updates
  }
  
  res.json({
    data: syncData,
    timestamp: lastUpdate,
  });
});
```

## 🎯 Next Steps

1. ✅ Admin sync service created
2. ✅ Web sync listener created
3. ✅ UI components created
4. ⏳ Create backend API endpoints
5. ⏳ Add AdminControlPanel to React Native dashboard
6. ⏳ Add AdminSyncStatus to React web app
7. ⏳ Test data flow

## 💡 Tips

- **Development**: Use a simple in-memory store for testing
- **Production**: Use a database with proper timestamps
- **Offline**: React Native can queue pushes, web will sync when online
- **Conflict Resolution**: Last write wins (or implement versioning)

## 🐛 Troubleshooting

**Updates not appearing in web app?**
- Check API endpoint is correct
- Verify backend is receiving pushes
- Check web app is polling correctly
- Review browser console for errors

**Auto-push not working?**
- Verify adminSyncService is initialized
- Check API endpoint is accessible
- Review network requests in React Native debugger

**Web app not receiving updates?**
- Verify webSyncListener is started
- Check API endpoint is correct
- Verify backend is returning data
- Check browser console for errors

