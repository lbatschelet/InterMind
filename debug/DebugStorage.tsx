import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../src/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Debug Storage Screen Component
 * 
 * A development-only utility screen for inspecting and manipulating AsyncStorage data.
 * Allows developers to:
 * - View all storage keys and their values
 * - Edit existing values
 * - Delete keys
 * - Clear all storage
 */
const DebugStorage = () => {
  const [storageItems, setStorageItems] = useState<{key: string, value: string}[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadStorageData();
  }, [refreshTrigger]);

  const loadStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      
      const items = result.map(([key, value]) => ({
        key,
        value: value || ''
      }));
      
      setStorageItems(items);
    } catch (error) {
      console.error('Failed to load storage data:', error);
      Alert.alert('Error', 'Failed to load storage data');
    }
  };

  const handleEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const saveEdit = async () => {
    if (!editingKey) return;
    
    try {
      await AsyncStorage.setItem(editingKey, editValue);
      setEditingKey(null);
      setEditValue('');
      refreshData();
    } catch (error) {
      console.error('Failed to save edit:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleDelete = async (key: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${key}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(key);
              refreshData();
            } catch (error) {
              console.error('Failed to delete item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Storage',
      'Are you sure you want to clear all storage? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              refreshData();
            } catch (error) {
              console.error('Failed to clear storage:', error);
              Alert.alert('Error', 'Failed to clear storage');
            }
          }
        }
      ]
    );
  };

  const handleAddNew = async () => {
    if (!newKey.trim()) {
      Alert.alert('Error', 'Key cannot be empty');
      return;
    }

    try {
      await AsyncStorage.setItem(newKey, newValue);
      setNewKey('');
      setNewValue('');
      refreshData();
    } catch (error) {
      console.error('Failed to add new item:', error);
      Alert.alert('Error', 'Failed to add new item');
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Debug Storage</Text>
        <Button onPress={refreshData} variant="outline" className="mr-2">
          Refresh
        </Button>
      </View>

      <View style={styles.addNewContainer}>
        <Text style={styles.sectionTitle}>Add New Item</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Key"
            value={newKey}
            onChangeText={setNewKey}
          />
          <TextInput
            style={styles.input}
            placeholder="Value"
            value={newValue}
            onChangeText={setNewValue}
            multiline
          />
          <Button onPress={handleAddNew}>Add</Button>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Button 
          onPress={handleClearAll}
          variant="destructive"
        >
          Clear All Storage
        </Button>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Storage Items ({storageItems.length})</Text>
        {storageItems.length === 0 ? (
          <Text style={styles.emptyText}>No items in storage</Text>
        ) : (
          storageItems.map(item => (
            <View key={item.key} style={styles.itemContainer}>
              <Text style={styles.keyText}>{item.key}</Text>
              
              {editingKey === item.key ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    multiline
                  />
                  <View style={styles.editActions}>
                    <Button onPress={saveEdit} className="mr-2">Save</Button>
                    <Button 
                      onPress={() => setEditingKey(null)} 
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{item.value}</Text>
                  <View style={styles.itemActions}>
                    <Button
                      onPress={() => handleEdit(item.key, item.value)}
                      variant="outline"
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onPress={() => handleDelete(item.key)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  valueContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addNewContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
});

export default DebugStorage; 