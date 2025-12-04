// Sync Button Component for React Native App
// Allows users to sync data with web app

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import DataExport from '../utils/dataExport';
import syncService from '../utils/syncService';
import storage from '../utils/storage';

const SyncButton = ({ apiEndpoint }) => {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const handleManualSync = async () => {
    if (!apiEndpoint) {
      Alert.alert('Error', 'API endpoint not configured');
      return;
    }

    setSyncing(true);
    
    try {
      await syncService.manualSync(storage);
      Alert.alert('Success', 'Data synced successfully!');
    } catch (error) {
      Alert.alert('Error', 'Sync failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    setSyncing(true);
    try {
      const result = await DataExport.exportToFile('flowerforge-data.json');
      if (result.success) {
        Alert.alert('Success', 'Data exported! You can now share the file.');
      } else {
        Alert.alert('Error', 'Export failed: ' + result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Export failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSyncing(true);
        const importResult = await DataExport.importFromFile(result.uri);
        
        if (importResult.success) {
          Alert.alert('Success', 'Data imported successfully!', [
            { text: 'OK', onPress: () => {
              // Reload app or refresh data
              setMessage('Data imported! Please refresh.');
            }},
          ]);
        } else {
          Alert.alert('Error', 'Import failed: ' + importResult.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Import failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      {apiEndpoint && (
        <TouchableOpacity
          style={[styles.button, styles.syncButton]}
          onPress={handleManualSync}
          disabled={syncing}
        >
          {syncing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sync with Web</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.exportButton]}
        onPress={handleExport}
        disabled={syncing}
      >
        <Text style={styles.buttonText}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.importButton]}
        onPress={handleImport}
        disabled={syncing}
      >
        <Text style={styles.buttonText}>Import Data</Text>
      </TouchableOpacity>

      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 10,
  },
  button: {
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: '#ec4899',
  },
  exportButton: {
    backgroundColor: '#4e73df',
  },
  importButton: {
    backgroundColor: '#1cc88a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  message: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#d1e7dd',
    color: '#0f5132',
    borderRadius: 5,
    fontSize: 12,
  },
});

export default SyncButton;

