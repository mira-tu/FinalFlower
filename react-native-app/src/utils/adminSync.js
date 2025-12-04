// Admin Sync Service - React Native App is the Admin/Master
// This service pushes data from React Native (admin) to React Web App

import storage, { StorageHelpers } from './storage';

class AdminSyncService {
  constructor() {
    this.apiEndpoint = null;
    this.webhookUrl = null;
    this.syncEnabled = false;
    this.isAdmin = true; // React Native is always the admin
    this.syncKeys = [
      'currentUser',
      'catalogueProducts',
      'orders',
      'requests',
      'stock',
      'notifications',
      'messages',
      'employees',
      'aboutData',
      'contactData',
    ];
    this.lastSyncTimestamp = null;
  }

  // Initialize admin sync with API endpoint
  init(apiEndpoint, webhookUrl = null) {
    this.apiEndpoint = apiEndpoint;
    this.webhookUrl = webhookUrl;
    this.syncEnabled = true;
  }

  // Push data to web app via API or localStorage (fallback)
  async pushToWeb(data, forceAll = false) {
    // If no API endpoint, use localStorage fallback (for development/testing)
    if (!this.apiEndpoint || this.apiEndpoint.includes('your-api.com')) {
      return await this.pushToWebLocalStorage(data, forceAll);
    }

    if (!this.syncEnabled) {
      console.warn('Admin sync not initialized');
      return { success: false, message: 'Sync not initialized' };
    }

    try {
      const payload = {
        source: 'react-native-admin',
        timestamp: new Date().toISOString(),
        data: forceAll ? await this.getAllData() : data,
        lastSync: this.lastSyncTimestamp,
      };

      const response = await fetch(`${this.apiEndpoint}/admin/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.lastSyncTimestamp = new Date().toISOString();
      
      return { success: true, ...result };
    } catch (error) {
      console.error('Error pushing to web via API:', error);
      console.log('Falling back to localStorage sync...');
      // Fallback to localStorage if API fails
      return await this.pushToWebLocalStorage(data, forceAll);
    }
  }

  // Push to web app via localStorage (for development/testing without backend)
  // Note: This creates a JSON file that can be imported into web app
  async pushToWebLocalStorage(data, forceAll = false) {
    try {
      const dataToPush = forceAll ? await this.getAllData() : data;
      
      const syncPayload = {
        source: 'react-native-admin',
        timestamp: new Date().toISOString(),
        data: dataToPush,
        lastSync: this.lastSyncTimestamp,
      };

      // Store in AsyncStorage
      await StorageHelpers.setJSON('_admin_sync_pending', syncPayload);
      
      // Also store individual keys
      for (const [key, value] of Object.entries(dataToPush)) {
        if (this.syncKeys.includes(key)) {
          await StorageHelpers.setJSON(key, value);
        }
      }

      this.lastSyncTimestamp = new Date().toISOString();
      
      // Return success with instructions
      return { 
        success: true, 
        message: 'Data ready for sync. Use Export/Import feature to sync with web app.',
        method: 'localStorage',
        timestamp: this.lastSyncTimestamp,
        data: syncPayload
      };
    } catch (error) {
      console.error('Error pushing to localStorage:', error);
      return { success: false, message: error.message };
    }
  }

  // Push specific data key to web
  async pushKeyToWeb(key, value) {
    return await this.pushToWeb({ [key]: value });
  }

  // Push all data to web
  async pushAllToWeb() {
    const allData = await this.getAllData();
    return await this.pushToWeb(allData, true);
  }

  // Get all syncable data
  async getAllData() {
    const data = {};
    for (const key of this.syncKeys) {
      const value = await StorageHelpers.getJSON(key);
      if (value !== null) {
        data[key] = value;
      }
    }
    return data;
  }

  // Watch for changes and auto-push
  startAutoPush(interval = 5000) {
    if (!this.syncEnabled) {
      console.warn('Auto-push not started: sync not initialized');
      return;
    }

    // Push immediately
    this.pushAllToWeb();

    // Then push on interval
    setInterval(async () => {
      const changes = await this.getChangesSinceLastSync();
      if (Object.keys(changes).length > 0) {
        await this.pushToWeb(changes);
      }
    }, interval);
  }

  // Get changes since last sync
  async getChangesSinceLastSync() {
    const allData = await this.getAllData();
    const changes = {};

    // For now, return all data if no last sync
    // In production, you'd compare timestamps
    if (!this.lastSyncTimestamp) {
      return allData;
    }

    // Check each key for changes
    for (const [key, value] of Object.entries(allData)) {
      // Simple check - in production, use timestamps or hashes
      changes[key] = value;
    }

    return changes;
  }

  // Push specific entity (product, order, etc.)
  async pushEntity(type, entity) {
    const key = this.getKeyForType(type);
    if (!key) {
      return { success: false, message: 'Invalid entity type' };
    }

    const currentData = await StorageHelpers.getArray(key, []);
    const index = currentData.findIndex(item => item.id === entity.id);
    
    if (index !== -1) {
      currentData[index] = entity;
    } else {
      currentData.push(entity);
    }

    await StorageHelpers.setArray(key, currentData);
    return await this.pushKeyToWeb(key, currentData);
  }

  // Delete entity and push update
  async deleteEntity(type, entityId) {
    const key = this.getKeyForType(type);
    if (!key) {
      return { success: false, message: 'Invalid entity type' };
    }

    const currentData = await StorageHelpers.getArray(key, []);
    const updated = currentData.filter(item => item.id !== entityId);
    await StorageHelpers.setArray(key, updated);
    return await this.pushKeyToWeb(key, updated);
  }

  // Get key for entity type
  getKeyForType(type) {
    const typeMap = {
      product: 'catalogueProducts',
      order: 'orders',
      request: 'requests',
      stock: 'stock',
      notification: 'notifications',
      message: 'messages',
      employee: 'employees',
    };
    return typeMap[type] || null;
  }

  // Trigger webhook to notify web app
  async triggerWebhook(event, data) {
    if (!this.webhookUrl) return;

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          source: 'react-native-admin',
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error triggering webhook:', error);
    }
  }
}

// Export singleton instance
export const adminSyncService = new AdminSyncService();
export default adminSyncService;

