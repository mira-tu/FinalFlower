// AdminDashboard.js - Complete Version with Full UI + API Integration
// Restored all features from original design

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { productAPI, adminAPI, categoryAPI } from '../config/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('catalogue');
  const [menuVisible, setMenuVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (!currentUser) {
        navigation.navigate('Login');
        return;
      }

      const user = JSON.parse(currentUser);
      if (user.role !== 'admin' && user.role !== 'employee') {
        Alert.alert('Access Denied', 'You do not have permission to access this page');
        navigation.navigate('Login');
        return;
      }

      setUserRole(user.role);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      navigation.navigate('Login');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'catalogue':
        return <CatalogueTab />;
      case 'orders':
        return <OrdersTab />;
      case 'stock':
        return <StockTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'messaging':
        return <MessagingTab />;
      default:
        return <CatalogueTab />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Joccery's Flower Shop</Text>
          <Text style={styles.headerSubtitle}>Admin Dashboard</Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('catalogue')}
        >
          <Ionicons
            name="flower"
            size={24}
            color={activeTab === 'catalogue' ? '#ec4899' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'catalogue' && styles.navTextActive]}>
            Catalog..
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('orders')}
        >
          <Ionicons
            name="cart"
            size={24}
            color={activeTab === 'orders' ? '#ec4899' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'orders' && styles.navTextActive]}>
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('stock')}
        >
          <Ionicons
            name="cube"
            size={24}
            color={activeTab === 'stock' ? '#ec4899' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'stock' && styles.navTextActive]}>
            Stock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('notifications')}
        >
          <Ionicons
            name="notifications"
            size={24}
            color={activeTab === 'notifications' ? '#ec4899' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'notifications' && styles.navTextActive]}>
            Notific..
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('messaging')}
        >
          <Ionicons
            name="chatbubbles"
            size={24}
            color={activeTab === 'messaging' ? '#ec4899' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'messaging' && styles.navTextActive]}>
            Messagi..
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ==================== CATALOGUE TAB ====================
const CatalogueTab = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    stock_quantity: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll()
      ]);

      setProducts(productsRes.data.products || []);
      setCategories([{ id: 0, name: 'All' }, ...(categoriesRes.data.categories || [])]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0] });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0] });
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category_name === selectedCategory);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Please fill in Product Name and Price');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('stock_quantity', formData.stock_quantity || '0');
      data.append('description', formData.description || '');
      data.append('category_id', formData.category_id || '1');

      if (formData.image) {
        // If it's a new image object from picker
        if (formData.image.uri) {
          const filename = formData.image.uri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          data.append('image', {
            uri: formData.image.uri,
            name: filename,
            type: type,
          });
        }
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, data, config);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await productAPI.create(data, config);
        Alert.alert('Success', 'Product added successfully');
      }

      setModalVisible(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id?.toString() || '1',
      stock_quantity: product.stock_quantity?.toString() || '0',
      description: product.description || '',
      image: product.image_url ? { uri: product.image_url.startsWith('http') ? product.image_url : `http://192.168.111.94:5000${product.image_url}` } : null,
    });
    setModalVisible(true);
  };

  const handleDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productAPI.delete(productId);
              Alert.alert('Success', 'Product deleted');
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category_id: '',
      stock_quantity: '',
      description: '',
      image: null,
    });
    setEditingProduct(null);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {/* Image Section - Always visible (Image or Placeholder) */}
      <View style={styles.imageContainer}>
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url.startsWith('http') ? item.image_url : `http://192.168.111.94:5000${item.image_url}` }}
            style={styles.productImage}
          />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category_name || 'Uncategorized'}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₱{item.price}</Text>
          <Text style={styles.productStock}>Qty: {item.stock_quantity || 0}</Text>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>

      {/* Category Filter Container */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.name && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === cat.name && styles.categoryChipTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.inputLabel}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
              />

              <Text style={styles.inputLabel}>Quantity *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={formData.stock_quantity}
                onChangeText={(text) => setFormData({ ...formData, stock_quantity: text })}
              />

              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.filter(c => c.id !== 0).map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.modalCategoryChip,
                      formData.category_id == cat.id && styles.modalCategoryChipActive
                    ]}
                    onPress={() => setFormData({ ...formData, category_id: cat.id })}
                  >
                    <Text style={[
                      styles.modalCategoryChipText,
                      formData.category_id == cat.id && styles.modalCategoryChipTextActive
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Product Image</Text>
              <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
                {formData.image ? (
                  <Image source={{ uri: formData.image.uri }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.imageUploadPlaceholder}>
                    <Ionicons name="camera" size={40} color="#ec4899" />
                    <Text style={styles.imageUploadText}>Tap to Upload Photo</Text>
                    <Text style={styles.imageUploadSubtext}>or take a picture</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.takePhotoButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={20} color="#ec4899" />
                <Text style={styles.takePhotoText}>Take Photo</Text>
              </TouchableOpacity>

            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Saving...' : 'Add Product'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ==================== ORDERS TAB ====================
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      Alert.alert('Success', 'Order status updated');
      await loadOrders();
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'out_for_delivery': return '#FF9800';
      case 'processing': return '#2196F3';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const getPaymentColor = (status) => {
    return status === 'paid' ? '#4CAF50' : '#FF9800';
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.orderCustomer}>{item.customer_name || 'Customer'}</Text>

      <View style={styles.orderBadges}>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getPaymentColor(item.payment_status) }]}>
          <Text style={styles.badgeText}>{item.payment_status}</Text>
        </View>
      </View>

      <Text style={styles.orderTotal}>₱{item.total}</Text>

      <TouchableOpacity
        style={styles.changeStatusButton}
        onPress={() => {
          Alert.alert(
            'Change Status',
            'Select new status:',
            [
              { text: 'Processing', onPress: () => handleStatusChange(item.id, 'processing') },
              { text: 'Out for Delivery', onPress: () => handleStatusChange(item.id, 'out_for_delivery') },
              { text: 'Completed', onPress: () => handleStatusChange(item.id, 'completed') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
      >
        <Ionicons name="create-outline" size={16} color="#2196F3" />
        <Text style={styles.changeStatusText}>Change Status</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Orders Management</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found</Text>
        }
      />
    </View>
  );
};

// ==================== STOCK TAB ====================
// ==================== STOCK TAB ====================
const StockTab = () => {
  const [activeStockTab, setActiveStockTab] = useState('Ribbons');
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [stockFormData, setStockFormData] = useState({
    name: '',
    category: 'Ribbons',
    price: '',
    quantity: '',
    unit: '',
    reorder_level: '10',
    is_available: true
  });

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllStock();
      setStockItems(response.data.stock || []);
    } catch (error) {
      console.error('Error loading stock:', error);
      Alert.alert('Error', 'Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStock();
    setRefreshing(false);
  };

  const resetForm = () => {
    setStockFormData({
      name: '',
      category: activeStockTab,
      price: '',
      quantity: '',
      unit: '',
      reorder_level: '10',
      is_available: true
    });
    setEditingStock(null);
  };

  const handleEditStock = (item) => {
    setEditingStock(item);
    setStockFormData({
      name: item.name,
      category: item.category,
      price: item.price ? item.price.toString() : '',
      quantity: item.quantity ? item.quantity.toString() : '',
      unit: item.unit || '',
      reorder_level: item.reorder_level ? item.reorder_level.toString() : '10',
      is_available: Boolean(item.is_available)
    });
    setModalVisible(true);
  };

  const handleDeleteStock = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminAPI.deleteStock(id);
              Alert.alert('Success', 'Item deleted');
              loadStock();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const handleSaveStock = async () => {
    if (!stockFormData.name || !stockFormData.quantity) {
      Alert.alert('Error', 'Please fill in Name and Quantity');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...stockFormData,
        price: parseFloat(stockFormData.price) || 0,
        quantity: parseInt(stockFormData.quantity) || 0,
        reorder_level: parseInt(stockFormData.reorder_level) || 10,
      };

      if (editingStock) {
        await adminAPI.updateStock(editingStock.id, data);
        Alert.alert('Success', 'Item updated successfully');
      } else {
        await adminAPI.createStock(data);
        Alert.alert('Success', 'Item added successfully');
      }

      setModalVisible(false);
      resetForm();
      await loadStock();
    } catch (error) {
      console.error('Error saving stock:', error);
      Alert.alert('Error', 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stockItems.filter(item =>
    item.category === activeStockTab
  );

  const renderStockItem = ({ item }) => (
    <View style={styles.stockCard}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockName}>{item.name}</Text>
        <Text style={styles.stockPrice}>₱{item.price || '0'} / {item.unit || 'unit'}</Text>
        <Text style={styles.stockQuantity}>Qty: {item.quantity}</Text>
        <View style={styles.stockAvailability}>
          <View style={[styles.availabilityDot, { backgroundColor: item.is_available ? '#4CAF50' : '#f44336' }]} />
          <Text style={styles.stockAvailabilityText}>
            {item.is_available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>
      <View style={styles.stockActions}>
        <TouchableOpacity
          style={styles.editButtonSmall}
          onPress={() => handleEditStock(item)}
        >
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButtonSmall}
          onPress={() => handleDeleteStock(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing && !modalVisible) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add {activeStockTab.slice(0, -1)}</Text>
      </TouchableOpacity>

      {/* Stock Category Tabs */}
      <View style={styles.stockTabs}>
        {['Wrappers', 'Ribbons', 'Flowers'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.stockTab, activeStockTab === tab && styles.stockTabActive]}
            onPress={() => setActiveStockTab(tab)}
          >
            <Ionicons
              name={tab === 'Wrappers' ? 'gift' : tab === 'Ribbons' ? 'ribbon' : 'flower'}
              size={20}
              color={activeStockTab === tab ? '#ec4899' : '#666'}
            />
            <Text style={[styles.stockTabText, activeStockTab === tab && styles.stockTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredStock}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {activeStockTab.toLowerCase()} found</Text>
        }
      />

      {/* Add/Edit Stock Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingStock ? 'Edit Stock Item' : 'Add Stock Item'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                value={stockFormData.name}
                onChangeText={(text) => setStockFormData({ ...stockFormData, name: text })}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {['Wrappers', 'Ribbons', 'Flowers'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.modalCategoryChip,
                      stockFormData.category === cat && styles.modalCategoryChipActive
                    ]}
                    onPress={() => setStockFormData({ ...stockFormData, category: cat })}
                  >
                    <Text style={[
                      styles.modalCategoryChipText,
                      stockFormData.category === cat && styles.modalCategoryChipTextActive
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={stockFormData.price}
                    onChangeText={(text) => setStockFormData({ ...stockFormData, price: text })}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Quantity *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={stockFormData.quantity}
                    onChangeText={(text) => setStockFormData({ ...stockFormData, quantity: text })}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. meters"
                    value={stockFormData.unit}
                    onChangeText={(text) => setStockFormData({ ...stockFormData, unit: text })}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Reorder Level</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    keyboardType="numeric"
                    value={stockFormData.reorder_level}
                    onChangeText={(text) => setStockFormData({ ...stockFormData, reorder_level: text })}
                  />
                </View>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.inputLabel}>Available</Text>
                <TouchableOpacity
                  style={[styles.switch, stockFormData.is_available && styles.switchActive]}
                  onPress={() => setStockFormData({ ...stockFormData, is_available: !stockFormData.is_available })}
                >
                  <View style={[styles.switchKnob, stockFormData.is_available && styles.switchKnobActive]} />
                </TouchableOpacity>
              </View>

            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveStock}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Saving...' : 'Save Item'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ==================== NOTIFICATIONS TAB ====================
const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    user_id: ''
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllNotifications();
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      Alert.alert('Error', 'Title and Message are required');
      return;
    }

    setLoading(true);
    try {
      await adminAPI.sendNotification({
        ...formData,
        user_id: formData.user_id || null // If empty, send as system/null
      });
      Alert.alert('Success', 'Notification sent');
      setModalVisible(false);
      setFormData({ title: '', message: '', user_id: '' });
      loadNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminAPI.deleteNotification(id);
            loadNotifications();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete notification');
          }
        }
      }
    ]);
  };

  if (loading && !refreshing && !modalVisible) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Send Notification</Text>
      </TouchableOpacity>

      <Text style={styles.tabTitle}>System Notifications</Text>

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>
                {new Date(item.created_at).toLocaleDateString()} • {item.user_name || 'System Wide'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteIconButton}
              onPress={() => handleDeleteNotification(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications sent</Text>
        }
      />

      {/* Send Notification Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Notification</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Notification Title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Notification Message"
                multiline
                numberOfLines={4}
                value={formData.message}
                onChangeText={(text) => setFormData({ ...formData, message: text })}
              />

              <Text style={styles.inputLabel}>User ID (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Specific User ID (Leave empty for all)"
                keyboardType="numeric"
                value={formData.user_id}
                onChangeText={(text) => setFormData({ ...formData, user_id: text })}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSendNotification}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ==================== MESSAGING TAB ====================
const MessagingTab = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllMessages();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Messages</Text>

      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.conversationCard}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={24} color="#ec4899" />
            </View>
            <View style={styles.conversationContent}>
              <Text style={styles.conversationName}>{item.sender_name || 'Unknown User'}</Text>
              <Text style={styles.conversationMessage} numberOfLines={1}>
                {item.content}
              </Text>
            </View>
            <View style={styles.conversationMeta}>
              <Text style={styles.conversationDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
              {item.unread_count > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages yet</Text>
        }
      />
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    backgroundColor: '#ec4899',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingBottom: 25,
    height: 85,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#ec4899',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#ec4899',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
    color: '#333',
  },
  categoryScroll: {
    marginBottom: 20,
    maxHeight: 50, // Limit height so they don't grow too tall
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    height: 40, // Fixed height for consistency
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#ec4899',
  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Ensures image corners are rounded
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#999',
    marginTop: 5,
    fontSize: 12,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ec4899',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    paddingTop: 0, // Reduce top padding since info has bottom padding
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3b82f6', // Blue
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ef4444', // Red
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  orderCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  orderBadges: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  changeStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  changeStatusText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  stockTabs: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stockTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 5,
  },
  stockTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#ec4899',
  },
  stockTabText: {
    fontSize: 14,
    color: '#666',
  },
  stockTabTextActive: {
    color: '#ec4899',
    fontWeight: '600',
  },
  stockCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stockPrice: {
    fontSize: 14,
    color: '#ec4899',
    marginBottom: 5,
  },
  stockAvailability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockAvailabilityText: {
    fontSize: 12,
    color: '#666',
  },
  stockActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButtonSmall: {
    padding: 8,
  },
  deleteButtonSmall: {
    padding: 8,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteIconButton: {
    padding: 5,
  },
  conversationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffe0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  conversationDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#ec4899',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  modalCategoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  modalCategoryChipActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  modalCategoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  modalCategoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  imageUploadBox: {
    height: 200,
    borderWidth: 2,
    borderColor: '#ec4899',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f5',
    marginBottom: 15,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageUploadPlaceholder: {
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ec4899',
    marginTop: 10,
  },
  imageUploadSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  takePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ec4899',
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  takePhotoText: {
    color: '#ec4899',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#ec4899',
  },
});

export default AdminDashboard;
