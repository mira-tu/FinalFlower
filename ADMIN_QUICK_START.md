# React Native as Admin - Quick Start Guide

## ✅ What's Set Up

The React Native app is now the **admin/master** that controls the React web app. Here's what's ready:

### React Native (Admin):
- ✅ Admin Sync Service - Pushes data to web
- ✅ Admin Control Panel - UI to control syncing
- ✅ Integrated into AdminDashboard

### React Web (Listener):
- ✅ Web Sync Listener - Receives updates from admin
- ✅ Admin Sync Status - Shows sync status
- ✅ Wrapped in App.jsx to listen automatically

## 🚀 How It Works

```
React Native (Admin)
    ↓ Makes changes (add product, update order, etc.)
    ↓ Pushes to API
Backend API
    ↓ Stores data
    ↓
React Web (Listener)
    ↓ Polls API for updates
    ↓ Receives updates
    ↓ Applies to localStorage
    ↓ Updates UI automatically
```

## 📱 Using the Admin Control Panel

1. **Open React Native App**
2. **Go to Admin Dashboard**
3. **Tap "Admin Control" tab** (new tab with gear icon)
4. **Use controls**:
   - **Auto-Push**: Toggle to automatically push every 5 seconds
   - **Push All Data**: Manually push everything
   - **Push Products**: Push just products
   - **Push Orders**: Push just orders

## 🌐 Web App Auto-Update

The web app automatically:
- ✅ Listens for updates every 5 seconds
- ✅ Shows sync status in bottom-right corner
- ✅ Applies updates to localStorage
- ✅ Triggers UI updates via events

## 🔧 Configuration

### React Native App:

The Admin Control Panel is already added. Just set your API endpoint:

```javascript
// In react-native-app/src/screens/AdminDashboard.js
// The API endpoint is set here:
const API_ENDPOINT = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com/api';
```

### React Web App:

Already configured! The API endpoint is set in `App.jsx`:

```javascript
// In src/App.jsx
const API_ENDPOINT = import.meta.env.VITE_API_URL || 'https://your-api.com/api';
```

Set environment variable:
```bash
# .env file
VITE_API_URL=https://your-api.com/api
```

## 🎯 Backend API Required

You need to create these endpoints:

### 1. POST /api/admin/push
Receives data from React Native admin:

```javascript
app.post('/api/admin/push', (req, res) => {
  const { data, timestamp } = req.body;
  // Save data to database
  // Return success
  res.json({ success: true, timestamp: new Date().toISOString() });
});
```

### 2. GET /api/admin/pull?since=timestamp
Sends updates to React Web:

```javascript
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

## 🧪 Testing Without Backend

For testing without a backend, you can:

1. **Use Export/Import**:
   - Export data from React Native
   - Import into React Web manually

2. **Use localStorage directly** (development only):
   - Both apps can share localStorage if on same domain
   - Not recommended for production

## 📝 Example: Adding a Product

1. **In React Native Admin**:
   - Go to Catalogue tab
   - Add a new product
   - Go to Admin Control tab
   - Tap "Push Products"

2. **In React Web**:
   - Wait a few seconds (or tap "Check for Updates")
   - Product appears automatically!

## 🎨 UI Features

### React Native:
- **Admin Control Panel** with:
  - Auto-push toggle
  - Push all button
  - Push specific data buttons
  - Sync status display
  - Last sync time

### React Web:
- **Sync Status Widget** (bottom-right):
  - Connection indicator (green = connected)
  - Status message
  - Last update time
  - Update count
  - Manual check button

## 🔄 Auto-Push Feature

Enable auto-push in React Native:
1. Open Admin Control tab
2. Toggle "Auto-Push"
3. Changes are automatically pushed every 5 seconds!

## 💡 Tips

- **Development**: Use a simple Express.js server for testing
- **Production**: Use a proper database with timestamps
- **Offline**: React Native queues pushes, web syncs when online
- **Performance**: Adjust poll intervals (default: 5 seconds)

## 🐛 Troubleshooting

**Updates not appearing?**
- Check API endpoint is correct
- Verify backend is running
- Check browser console for errors
- Verify React Native is pushing successfully

**Auto-push not working?**
- Check API endpoint in Admin Control Panel
- Verify network connectivity
- Check React Native console for errors

**Web not receiving updates?**
- Check API endpoint in App.jsx
- Verify backend is returning data
- Check browser network tab
- Verify sync status widget shows "Listening"

## 📚 Full Documentation

See `ADMIN_SETUP.md` for complete documentation.

