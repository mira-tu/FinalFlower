// Admin Control Panel - React Native Admin Dashboard
// This component provides controls to push data to the web app

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import adminSyncService from '../utils/adminSync';
import storage, { StorageHelpers } from '../utils/storage';
import DataExport from '../utils/dataExport';

const AdminControlPanel = ({ apiEndpoint }) => {
  const [syncing, setSyncing] = useState(false);
  const [autoPushEnabled, setAutoPushEnabled] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatus, setSyncStatus] = useState('Ready');

  useEffect(() => {
    // Initialize even without API endpoint (will use localStorage fallback)
    if (apiEndpoint && !apiEndpoint.includes('your-api.com')) {
      adminSyncService.init(apiEndpoint);
      setSyncStatus('API sync ready');
    } else {
      // No API configured, will use localStorage fallback
      adminSyncService.init(null);
      setSyncStatus('Local sync ready (no API)');
    }
  }, [apiEndpoint]);

  const handlePushAll = async () => {
    setSyncing(true);
    setSyncStatus('Pushing all data...');
    
    try {
      const result = await adminSyncService.pushAllToWeb();
      if (result.success) {
        setLastSyncTime(new Date().toLocaleTimeString());
        if (result.method === 'localStorage') {
          setSyncStatus('Data ready for sync!');
          Alert.alert(
            'Data Ready',
            'Data is ready to sync. Since no API is configured, use the Export feature to share data with the web app, or set up a backend API.',
            [
              { text: 'OK' },
              { 
                text: 'Export Now', 
                onPress: async () => {
                  try {
                    const DataExport = require('../utils/dataExport').default;
                    await DataExport.exportToFile('flowerforge-sync.json');
                  } catch (e) {
                    Alert.alert('Error', 'Export feature not available');
                  }
                }
              }
            ]
          );
        } else {
          setSyncStatus('All data pushed successfully!');
          Alert.alert('Success', 'All data has been pushed to the web app');
        }
      } else {
        setSyncStatus('Push failed: ' + result.message);
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      setSyncStatus('Error: ' + error.message);
      Alert.alert('Error', error.message);
    } finally {
      setSyncing(false);
    }
  };

  const handlePushProducts = async () => {
    setSyncing(true);
    setSyncStatus('Pushing products...');
    
    try {
      const products = await StorageHelpers.getArray('catalogueProducts', []);
      const result = await adminSyncService.pushKeyToWeb('catalogueProducts', products);
      if (result.success) {
        setLastSyncTime(new Date().toLocaleTimeString());
        setSyncStatus('Products pushed successfully!');
        Alert.alert('Success', 'Products have been pushed to the web app');
      } else {
        setSyncStatus('Push failed');
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      setSyncStatus('Error: ' + error.message);
      Alert.alert('Error', error.message);
    } finally {
      setSyncing(false);
    }
  };

  const handlePushOrders = async () => {
    setSyncing(true);
    setSyncStatus('Pushing orders...');
    
    try {
      const orders = await StorageHelpers.getArray('orders', []);
      const result = await adminSyncService.pushKeyToWeb('orders', orders);
      if (result.success) {
        setLastSyncTime(new Date().toLocaleTimeString());
        setSyncStatus('Orders pushed successfully!');
        Alert.alert('Success', 'Orders have been pushed to the web app');
      } else {
        setSyncStatus('Push failed');
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      setSyncStatus('Error: ' + error.message);
      Alert.alert('Error', error.message);
    } finally {
      setSyncing(false);
    }
  };

  const toggleAutoPush = (value) => {
    setAutoPushEnabled(value);
    if (value) {
      adminSyncService.startAutoPush(5000);
      setSyncStatus('Auto-push enabled');
    } else {
      setSyncStatus('Auto-push disabled');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="cog" size={24} color="#ec4899" />
        <Text style={styles.title}>Admin Control Panel</Text>
        <Text style={styles.subtitle}>Push data to Web App</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Auto-Push (Every 5s)</Text>
          <Switch
            value={autoPushEnabled}
            onValueChange={toggleAutoPush}
            trackColor={{ false: '#767577', true: '#ec4899' }}
            thumbColor={autoPushEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Push</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handlePushAll}
          disabled={syncing}
        >
          {syncing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.buttonText}>Push All Data</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handlePushProducts}
          disabled={syncing}
        >
          <FontAwesome name="box" size={18} color="#fff" />
          <Text style={styles.buttonText}>Push Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handlePushOrders}
          disabled={syncing}
        >
          <FontAwesome name="shopping-cart" size={18} color="#fff" />
          <Text style={styles.buttonText}>Push Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>{syncStatus}</Text>
        {lastSyncTime && (
          <Text style={styles.timeText}>Last sync: {lastSyncTime}</Text>
        )}
      </View>

      {(!apiEndpoint || apiEndpoint.includes('your-api.com')) && (
        <View style={styles.warning}>
          <FontAwesome name="info-circle" size={20} color="#4e73df" />
          <Text style={styles.warningText}>
            No API endpoint configured.{'\n'}
            Use Export/Import to sync data with web app, or set up a backend API.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.exportButton, { marginTop: 12 }]}
            onPress={async () => {
              try {
                const result = await DataExport.exportToFile('flowerforge-sync.json');
                if (result.success) {
                  Alert.alert('Success', 'Data exported! Share this file with the web app.');
                }
              } catch (error) {
                Alert.alert('Error', 'Export failed: ' + error.message);
              }
            }}
          >
            <FontAwesome name="download" size={16} color="#fff" />
            <Text style={styles.buttonText}>Export Data for Web</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#ec4899',
  },
  secondaryButton: {
    backgroundColor: '#4e73df',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
  },
});

export default AdminControlPanel;

