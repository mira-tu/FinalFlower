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
  Switch,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AdminControlPanel from '../components/AdminControlPanel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;
const IS_SMALL_MOBILE = SCREEN_WIDTH < 400;

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('catalogue');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (!userJson) {
        navigation.navigate('Login');
        return;
      }
      const currentUser = JSON.parse(userJson);
      setUserRole(currentUser.role || 'employee');
    } catch (error) {
      console.error('Error checking user:', error);
      navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'catalogue', label: 'Catalogue', icon: 'pagelines', roles: ['employee', 'admin'] },
    { id: 'orders', label: 'Orders', icon: 'shopping-cart', roles: ['employee', 'admin'] },
    { id: 'stock', label: 'Stock', icon: 'cube', roles: ['employee', 'admin'] },
    { id: 'notifications', label: 'Notifications', icon: 'bell', roles: ['employee', 'admin'] },
    { id: 'messaging', label: 'Messaging', icon: 'comments', roles: ['employee', 'admin'] },
    { id: 'admin-control', label: 'Admin Control', icon: 'cog', roles: ['admin'] },
    { id: 'about', label: 'About', icon: 'info-circle', roles: ['admin'] },
    { id: 'contact', label: 'Contact', icon: 'phone', roles: ['admin'] },
    { id: 'sales', label: 'Sales', icon: 'credit-card', roles: ['admin'] },
    { id: 'employees', label: 'Employees', icon: 'users', roles: ['admin'] },
  ];

  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole));

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.navigate('Login');
          },
        },
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
      case 'admin-control':
        return <AdminControlTab />;
      case 'about':
        return <AboutTab />;
      case 'contact':
        return <ContactTab />;
      case 'sales':
        return <SalesTab />;
      case 'employees':
        return <EmployeesTab />;
      default:
        return null;
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ec4899" />
      {/* Mobile Header with Dropdown */}
      {IS_MOBILE && (
        <>
          <View style={styles.mobileHeader}>
            <TouchableOpacity
              style={styles.burgerButton}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <FontAwesome name="bars" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.mobileHeaderTitleContainer}>
              <Text style={styles.mobileHeaderTitle}>Joccery's Flower Shop</Text>
              <Text style={styles.mobileHeaderSubtitle}>Admin Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.burgerButton} onPress={handleLogout}>
              <FontAwesome name="sign-out" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {dropdownOpen && (
            <>
              <TouchableOpacity
                style={styles.dropdownOverlay}
                activeOpacity={1}
                onPress={() => setDropdownOpen(false)}
              />
              <View style={styles.dropdownMenu}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownHeaderText}>Menu</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setDropdownOpen(false)}
                  >
                    <FontAwesome name="times" size={20} color="#1a1a1a" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {visibleTabs.map(tab => (
                    <TouchableOpacity
                      key={tab.id}
                      style={[
                        styles.dropdownItem,
                        activeTab === tab.id && styles.dropdownItemActive,
                      ]}
                      onPress={() => handleTabChange(tab.id)}
                    >
                      <FontAwesome
                        name={tab.icon}
                        size={18}
                        color={activeTab === tab.id ? '#ec4899' : '#1a1a1a'}
                        style={styles.dropdownIcon}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          activeTab === tab.id && styles.dropdownItemTextActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.dropdownItem, styles.dropdownItemLogout]}
                    onPress={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <FontAwesome name="sign-out" size={18} color="#dc3545" style={styles.dropdownIcon} />
                    <Text style={[styles.dropdownItemText, styles.dropdownItemTextLogout]}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </>
          )}
        </>
      )}

      {/* Desktop Sidebar */}
      {!IS_MOBILE && (
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Joccery's Flower Shop</Text>
            <Text style={styles.sidebarSubtitle}>Admin Dashboard</Text>
        </View>
        <ScrollView style={styles.navContainer}>
          {visibleTabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.navLink,
                activeTab === tab.id && styles.navLinkActive,
              ]}
                onPress={() => handleTabChange(tab.id)}
            >
                <FontAwesome
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#fff' : '#c2c7d0'}
                style={styles.navIcon}
              />
              <Text
                style={[
                  styles.navLinkText,
                  activeTab === tab.id && styles.navLinkTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="#c2c7d0" style={styles.navIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Mobile Bottom Tab Bar */}
      {IS_MOBILE && (
        <View style={styles.bottomTabBar}>
          {visibleTabs.slice(0, 5).map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.bottomTab,
                activeTab === tab.id && styles.bottomTabActive,
              ]}
              onPress={() => handleTabChange(tab.id)}
            >
              <FontAwesome
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#ec4899' : '#6c757d'}
              />
              <Text
                style={[
                  styles.bottomTabText,
                  activeTab === tab.id && styles.bottomTabTextActive,
                ]}
              >
                {tab.label.length > 8 ? tab.label.substring(0, 7) + '..' : tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Catalogue Tab Component
const CatalogueTab = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    image: null,
  });

  const categories = ['Sympathy', 'Graduation', 'All Souls Day', 'Valentines', 'Get Well Soon', 'Mothers Day'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const loadProducts = async () => {
    try {
      const saved = await AsyncStorage.getItem('catalogueProducts');
      const loadedProducts = saved ? JSON.parse(saved) : [];
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        image: formData.image || 'https://via.placeholder.com/300',
        createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saved = await AsyncStorage.getItem('catalogueProducts');
      const savedProducts = saved ? JSON.parse(saved) : [];
      
      let updated;
      if (editingProduct) {
        updated = savedProducts.map(p => p.id === editingProduct.id ? productData : p);
      } else {
        updated = [...savedProducts, productData];
      }

      await AsyncStorage.setItem('catalogueProducts', JSON.stringify(updated));
      await loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      image: product.image,
    });
    setShowModal(true);
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
              const saved = await AsyncStorage.getItem('catalogueProducts');
              const savedProducts = saved ? JSON.parse(saved) : [];
              const updated = savedProducts.filter(p => p.id !== productId);
              await AsyncStorage.setItem('catalogueProducts', JSON.stringify(updated));
              await loadProducts();
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      quantity: '',
      category: '',
      image: null,
    });
  };

  const renderProduct = ({ item }) => {
    if (IS_MOBILE) {
      return (
        <View style={styles.productCard}>
          <Image source={{ uri: item.image }} style={styles.productCardImage} />
          <View style={styles.productCardContent}>
            <Text style={styles.productCardName}>{item.name}</Text>
            <Text style={styles.productCardCategory}>{item.category}</Text>
            <View style={styles.productCardRow}>
              <Text style={styles.productCardPrice}>₱{item.price.toLocaleString()}</Text>
              <Text style={styles.productCardQuantity}>Qty: {item.quantity}</Text>
            </View>
            <View style={styles.productCardActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton, styles.mobileActionButton]}
                onPress={() => handleEdit(item)}
              >
                <FontAwesome name="edit" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton, styles.mobileActionButton]}
                onPress={() => handleDelete(item.id)}
              >
                <FontAwesome name="trash" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    
    return (
    <View style={styles.tableRow}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{item.name}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{item.category}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>₱{item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{item.quantity}</Text>
      </View>
      <View style={styles.tableCell}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
            <FontAwesome name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
            <FontAwesome name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <FontAwesome name="pagelines" size={IS_MOBILE ? 24 : 20} color="#ec4899" style={styles.tabTitleIcon} />
        <Text style={styles.tabTitle}>Catalogue Management</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'All' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory('All')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'All' && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {selectedCategory === 'All' 
              ? 'No products found. Add your first product!' 
              : `No products found in "${selectedCategory}" category.`}
          </Text>
        </View>
      ) : !IS_MOBILE && (
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Image</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Category</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText}>Qty</Text>
          <Text style={styles.tableHeaderText}>Actions</Text>
        </View>
      )}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {selectedCategory === 'All' 
                ? 'No products found. Add your first product!' 
                : `No products found in "${selectedCategory}" category.`}
            </Text>
          </View>
        }
      />

      <Modal
        visible={showModal}
        animationType={IS_MOBILE ? "slide" : "fade"}
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter product name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.quantity}
                  onChangeText={(value) => handleInputChange('quantity', value)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView style={styles.categoryContainer}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        formData.category === cat && styles.categoryOptionActive,
                      ]}
                      onPress={() => handleInputChange('category', cat)}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          formData.category === cat && styles.categoryOptionTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Product Image</Text>
                <View style={styles.imageUploadContainer}>
                  {formData.image ? (
                    <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleInputChange('image', null)}
                      >
                        <FontAwesome name="times" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.imageUploadButton}
                      onPress={async () => {
                        try {
                          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                          if (status !== 'granted') {
                            Alert.alert('Permission needed', 'Please grant camera roll permissions');
                            return;
                          }

                          const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                          });

                          if (!result.canceled && result.assets[0]) {
                            handleInputChange('image', result.assets[0].uri);
                          }
                        } catch (error) {
                          Alert.alert('Error', 'Failed to pick image: ' + error.message);
                        }
                      }}
                    >
                      <FontAwesome name="camera" size={32} color="#ec4899" />
                      <Text style={styles.imageUploadText}>Tap to Upload Photo</Text>
                      <Text style={styles.imageUploadSubtext}>or take a picture</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={async () => {
                    try {
                      const { status } = await ImagePicker.requestCameraPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permission needed', 'Please grant camera permissions');
                        return;
                      }

                      const result = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                      });

                      if (!result.canceled && result.assets[0]) {
                        handleInputChange('image', result.assets[0].uri);
                      }
                    } catch (error) {
                      Alert.alert('Error', 'Failed to take picture: ' + error.message);
                    }
                  }}
                >
                  <FontAwesome name="camera" size={18} color="#ec4899" />
                  <Text style={styles.cameraButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {editingProduct ? 'Update' : 'Add'} Product
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Orders Tab Component
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentType, setPaymentType] = useState('cash_on_delivery');
  const [receiptPhoto, setReceiptPhoto] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      const savedRequests = await AsyncStorage.getItem('requests');
      let orders = savedOrders ? JSON.parse(savedOrders) : [];
      let requests = savedRequests ? JSON.parse(savedRequests) : [];
      
      // Add example orders if none exist
      if (orders.length === 0 && requests.length === 0) {
        const exampleOrders = [
          {
            id: 'ORD-001',
            date: new Date().toISOString(),
            type: 'regular',
            status: 'completed',
            paymentStatus: 'paid',
            paymentType: 'gcash',
            deliveryType: 'delivery',
            address: '123 Main Street, Quezon City, Metro Manila',
            total: 2500,
            customerName: 'Maria Santos',
            items: [
              { name: 'Red Rose Bouquet', quantity: 1, price: 1500 },
              { name: 'Greeting Card', quantity: 1, price: 1000 },
            ],
          },
          {
            id: 'ORD-002',
            date: new Date(Date.now() - 86400000).toISOString(),
            type: 'customized',
            status: 'pending',
            paymentStatus: 'pending',
            deliveryType: 'pickup',
            address: null,
            total: 3500,
            customerName: 'John Dela Cruz',
            items: [
              { name: 'Custom Flower Arrangement', quantity: 1, price: 3500 },
            ],
          },
          {
            id: 'ORD-003',
            date: new Date(Date.now() - 172800000).toISOString(),
            type: 'booking',
            status: 'processing',
            paymentStatus: 'paid',
            paymentType: 'cash_on_delivery',
            deliveryType: 'delivery',
            address: '456 Oak Avenue, Makati City, Metro Manila',
            total: 5000,
            customerName: 'Sarah Garcia',
            items: [
              { name: 'Wedding Event Decoration', quantity: 1, price: 5000 },
            ],
          },
        ];
        
        const exampleRequests = [
          {
            id: 'REQ-001',
            requestDate: new Date(Date.now() - 259200000).toISOString(),
            type: 'special_order',
            status: 'completed',
            price: 4200,
            customerName: 'Michael Tan',
            description: 'Special anniversary arrangement with white roses',
          },
        ];
        
        await AsyncStorage.setItem('orders', JSON.stringify(exampleOrders));
        await AsyncStorage.setItem('requests', JSON.stringify(exampleRequests));
        orders = exampleOrders;
        requests = exampleRequests;
      }
      
      setOrders([...orders, ...requests]);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      const savedRequests = await AsyncStorage.getItem('requests');
      let orders = savedOrders ? JSON.parse(savedOrders) : [];
      let requests = savedRequests ? JSON.parse(savedRequests) : [];
      
      // Update in orders
      orders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      // Update in requests
      requests = requests.map(request => 
        request.id === orderId ? { ...request, status: newStatus } : request
      );
      
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      await AsyncStorage.setItem('requests', JSON.stringify(requests));
      loadOrders();
      setShowStatusModal(false);
      setSelectedOrder(null);
      Alert.alert('Success', 'Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleConfirmPayment = (order) => {
    setSelectedOrder(order);
    setPaymentType('cash_on_delivery');
    setReceiptPhoto(null);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedOrder) return;

    // Validate GCash requires receipt photo
    if (paymentType === 'gcash' && !receiptPhoto) {
      Alert.alert('Error', 'Please upload GCash receipt photo');
      return;
    }

    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      const savedRequests = await AsyncStorage.getItem('requests');
      let orders = savedOrders ? JSON.parse(savedOrders) : [];
      let requests = savedRequests ? JSON.parse(savedRequests) : [];
      
      const paymentData = {
        paymentStatus: 'paid',
        paymentType: paymentType,
        paymentDate: new Date().toISOString(),
        ...(paymentType === 'gcash' && receiptPhoto && { receiptPhoto: receiptPhoto }),
      };
      
      // Update in orders
      orders = orders.map(order => 
        order.id === selectedOrder.id ? { ...order, ...paymentData } : order
      );
      
      // Update in requests
      requests = requests.map(request => 
        request.id === selectedOrder.id ? { ...request, ...paymentData } : request
      );
      
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      await AsyncStorage.setItem('requests', JSON.stringify(requests));
      loadOrders();
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setReceiptPhoto(null);
      Alert.alert('Success', 'Payment confirmed successfully');
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'Failed to confirm payment');
    }
  };

  const renderOrder = ({ item }) => {
    const orderDate = new Date(item.date || item.requestDate);
    const deliveryType = item.deliveryType || 'pickup';
    const paymentStatus = item.paymentStatus || 'pending';
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>
            {orderDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        
        <Text style={styles.orderCustomerName}>{item.customerName}</Text>
        
        <Text style={styles.orderType}>
          {item.type === 'booking' && 'Event Booking'}
          {item.type === 'special_order' && 'Special Order'}
          {item.type === 'customized' && 'Customized'}
          {!item.type && 'Regular Order'}
        </Text>
        
        <View style={styles.orderDeliveryInfo}>
          <View style={styles.deliveryTypeBadge}>
            <FontAwesome 
              name={deliveryType === 'delivery' ? 'truck' : 'hand-paper-o'} 
              size={14} 
              color="#ec4899" 
            />
            <Text style={styles.deliveryTypeText}>
              {deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
            </Text>
          </View>
          {deliveryType === 'delivery' && item.address && (
            <View style={styles.addressContainer}>
              <FontAwesome name="map-marker" size={12} color="#6c757d" />
              <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.orderStatusRow}>
          <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <View style={[styles.paymentBadge, paymentStatus === 'paid' ? styles.paymentPaid : styles.paymentPending]}>
            <FontAwesome 
              name={paymentStatus === 'paid' ? 'check-circle' : 'clock-o'} 
              size={12} 
              color="#fff" 
            />
            <Text style={styles.paymentText}>{paymentStatus === 'paid' ? 'Paid' : 'Pending'}</Text>
          </View>
          <Text style={styles.orderTotal}>₱{(item.total || item.price || 0).toLocaleString()}</Text>
        </View>
        
        {paymentStatus === 'paid' && item.paymentType && (
          <View style={styles.paymentTypeContainer}>
            <FontAwesome 
              name={item.paymentType === 'gcash' ? 'mobile' : 'money'} 
              size={12} 
              color="#6c757d" 
            />
            <Text style={styles.paymentTypeText}>
              {item.paymentType === 'gcash' ? 'GCash' : 'Cash on Delivery'}
            </Text>
            {item.paymentType === 'gcash' && item.receiptPhoto && (
              <TouchableOpacity
                style={styles.receiptButton}
                onPress={() => {
                  setSelectedReceipt(item.receiptPhoto);
                  setShowReceiptModal(true);
                }}
              >
                <FontAwesome name="image" size={12} color="#ec4899" />
                <Text style={styles.receiptButtonText}>View Receipt</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={[styles.orderActionButton, styles.statusButton]}
            onPress={() => {
              setSelectedOrder(item);
              setShowStatusModal(true);
            }}
          >
            <FontAwesome name="edit" size={14} color="#4e73df" />
            <Text style={styles.orderActionButtonText}>Change Status</Text>
          </TouchableOpacity>
          {paymentStatus !== 'paid' && (
            <TouchableOpacity
              style={[styles.orderActionButton, styles.paymentButton]}
              onPress={() => handleConfirmPayment(item)}
            >
              <FontAwesome name="money" size={14} color="#1cc88a" />
              <Text style={styles.orderActionButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
      <Text style={styles.tabTitle}>Orders Management</Text>
      </View>
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      {/* Status Change Modal */}
      <Modal
        visible={showStatusModal}
        animationType={IS_MOBILE ? "slide" : "fade"}
        transparent={true}
        onRequestClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Order Status</Text>
              <TouchableOpacity onPress={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
              }}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedOrder && (
                <>
                  <Text style={styles.label}>Order #{selectedOrder.id}</Text>
                  <Text style={styles.label}>Current Status: {selectedOrder.status}</Text>
                  <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Select New Status:</Text>
                  <View style={styles.statusOptionsContainer}>
                    {['pending', 'processing', 'completed','claimed', 'ready for pickup', 'out for delivery', 'cancelled'].map(status => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusOption,
                          selectedOrder.status === status && styles.statusOptionActive,
                        ]}
                        onPress={() => handleStatusChange(selectedOrder.id, status)}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            selectedOrder.status === status && styles.statusOptionTextActive,
                          ]}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showPaymentModal}
        animationType={IS_MOBILE ? "slide" : "fade"}
        transparent={true}
        onRequestClose={() => {
          setShowPaymentModal(false);
          setSelectedOrder(null);
          setReceiptPhoto(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Payment</Text>
              <TouchableOpacity onPress={() => {
                setShowPaymentModal(false);
                setSelectedOrder(null);
                setReceiptPhoto(null);
              }}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedOrder && (
                <>
                  <Text style={styles.label}>Order #{selectedOrder.id}</Text>
                  <Text style={styles.label}>Amount: ₱{(selectedOrder.total || selectedOrder.price || 0).toLocaleString()}</Text>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Payment Type *</Text>
                    <View style={styles.paymentTypeOptions}>
                      <TouchableOpacity
                        style={[
                          styles.paymentTypeOption,
                          paymentType === 'cash_on_delivery' && styles.paymentTypeOptionActive,
                        ]}
                        onPress={() => {
                          setPaymentType('cash_on_delivery');
                          setReceiptPhoto(null);
                        }}
                      >
                        <FontAwesome 
                          name="money" 
                          size={20} 
                          color={paymentType === 'cash_on_delivery' ? '#fff' : '#6c757d'} 
                        />
                        <Text
                          style={[
                            styles.paymentTypeOptionText,
                            paymentType === 'cash_on_delivery' && styles.paymentTypeOptionTextActive,
                          ]}
                        >
                          Cash on Delivery
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.paymentTypeOption,
                          paymentType === 'gcash' && styles.paymentTypeOptionActive,
                        ]}
                        onPress={() => setPaymentType('gcash')}
                      >
                        <FontAwesome 
                          name="mobile" 
                          size={20} 
                          color={paymentType === 'gcash' ? '#fff' : '#6c757d'} 
                        />
                        <Text
                          style={[
                            styles.paymentTypeOptionText,
                            paymentType === 'gcash' && styles.paymentTypeOptionTextActive,
                          ]}
                        >
                          GCash
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {paymentType === 'gcash' && (
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>GCash Receipt Photo *</Text>
                      <View style={styles.imageUploadContainer}>
                        {receiptPhoto ? (
                          <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: receiptPhoto }} style={styles.imagePreview} />
                            <TouchableOpacity
                              style={styles.removeImageButton}
                              onPress={() => setReceiptPhoto(null)}
                            >
                              <FontAwesome name="times" size={16} color="#fff" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.imageUploadButton}
                            onPress={async () => {
                              try {
                                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                if (status !== 'granted') {
                                  Alert.alert('Permission needed', 'Please grant camera roll permissions');
                                  return;
                                }

                                const result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 0.8,
                                });

                                if (!result.canceled && result.assets[0]) {
                                  setReceiptPhoto(result.assets[0].uri);
                                }
                              } catch (error) {
                                Alert.alert('Error', 'Failed to pick image: ' + error.message);
                              }
                            }}
                          >
                            <FontAwesome name="camera" size={32} color="#ec4899" />
                            <Text style={styles.imageUploadText}>Upload Receipt Photo</Text>
                            <Text style={styles.imageUploadSubtext}>Tap to select from gallery</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={async () => {
                          try {
                            const { status } = await ImagePicker.requestCameraPermissionsAsync();
                            if (status !== 'granted') {
                              Alert.alert('Permission needed', 'Please grant camera permissions');
                              return;
                            }

                            const result = await ImagePicker.launchCameraAsync({
                              allowsEditing: true,
                              aspect: [4, 3],
                              quality: 0.8,
                            });

                            if (!result.canceled && result.assets[0]) {
                              setReceiptPhoto(result.assets[0].uri);
                            }
                          } catch (error) {
                            Alert.alert('Error', 'Failed to take picture: ' + error.message);
                          }
                        }}
                      >
                        <FontAwesome name="camera" size={18} color="#ec4899" />
                        <Text style={styles.cameraButtonText}>Take Photo</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                  setReceiptPhoto(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitPayment}
              >
                <Text style={styles.submitButtonText}>Confirm Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Receipt Photo View Modal */}
      <Modal
        visible={showReceiptModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowReceiptModal(false);
          setSelectedReceipt(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.receiptModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>GCash Receipt</Text>
              <TouchableOpacity onPress={() => {
                setShowReceiptModal(false);
                setSelectedReceipt(null);
              }}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {selectedReceipt && (
              <Image source={{ uri: selectedReceipt }} style={styles.receiptImage} resizeMode="contain" />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Stock Tab Component
const StockTab = () => {
  const [stock, setStock] = useState({
    wrappers: [],
    ribbons: [],
    flowers: [],
  });
  const [activeCategory, setActiveCategory] = useState('wrappers');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    available: true,
    image: null,
  });

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const saved = await AsyncStorage.getItem('stock');
      setStock(saved ? JSON.parse(saved) : { wrappers: [], ribbons: [], flowers: [] });
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const itemData = {
        id: editingItem ? editingItem.id : `${activeCategory}-${Date.now()}`,
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        available: formData.available,
        image: formData.image || 'https://via.placeholder.com/300',
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saved = await AsyncStorage.getItem('stock');
      const savedStock = saved ? JSON.parse(saved) : { wrappers: [], ribbons: [], flowers: [] };
      const categoryItems = savedStock[activeCategory] || [];

      let updated;
      if (editingItem) {
        updated = categoryItems.map(item => item.id === editingItem.id ? itemData : item);
      } else {
        updated = [...categoryItems, itemData];
      }

      savedStock[activeCategory] = updated;
      await AsyncStorage.setItem('stock', JSON.stringify(savedStock));
      loadStock();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving stock item:', error);
      Alert.alert('Error', 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      available: item.available,
      image: item.image,
    });
    setShowModal(true);
  };

  const handleDelete = (itemId) => {
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
              const saved = await AsyncStorage.getItem('stock');
              const savedStock = saved ? JSON.parse(saved) : { wrappers: [], ribbons: [], flowers: [] };
              savedStock[activeCategory] = savedStock[activeCategory].filter(item => item.id !== itemId);
              await AsyncStorage.setItem('stock', JSON.stringify(savedStock));
              loadStock();
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      available: true,
      image: null,
    });
  };

  const currentItems = stock[activeCategory] || [];

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <FontAwesome name="cube" size={IS_MOBILE ? 24 : 20} color="#ec4899" style={styles.tabTitleIcon} />
        <Text style={styles.tabTitle}>Stock Management</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add {activeCategory.slice(0, -1)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeCategory === 'wrappers' && styles.tabButtonActive]}
            onPress={() => setActiveCategory('wrappers')}
          >
            <FontAwesome 
              name="gift" 
              size={IS_MOBILE ? 18 : 16} 
              color={activeCategory === 'wrappers' ? '#fff' : '#6c757d'} 
              style={styles.tabButtonIcon}
            />
            <Text style={[styles.tabButtonText, activeCategory === 'wrappers' && styles.tabButtonTextActive]}>
              Wrappers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeCategory === 'ribbons' && styles.tabButtonActive]}
            onPress={() => setActiveCategory('ribbons')}
          >
            <FontAwesome 
              name="star" 
              size={IS_MOBILE ? 18 : 16} 
              color={activeCategory === 'ribbons' ? '#fff' : '#6c757d'} 
              style={styles.tabButtonIcon}
            />
            <Text style={[styles.tabButtonText, activeCategory === 'ribbons' && styles.tabButtonTextActive]}>
              Ribbons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeCategory === 'flowers' && styles.tabButtonActive]}
            onPress={() => setActiveCategory('flowers')}
          >
            <FontAwesome 
              name="pagelines" 
              size={IS_MOBILE ? 18 : 16} 
              color={activeCategory === 'flowers' ? '#fff' : '#6c757d'} 
              style={styles.tabButtonIcon}
            />
            <Text style={[styles.tabButtonText, activeCategory === 'flowers' && styles.tabButtonTextActive]}>
              Flowers
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No {activeCategory} found. Add your first item!</Text>
        </View>
      ) : (
        <FlatList
          data={currentItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.stockCard}>
              <Image source={{ uri: item.image }} style={styles.stockImage} />
              <View style={styles.stockInfo}>
                <Text style={styles.stockName}>{item.name}</Text>
                <Text style={styles.stockPrice}>₱{item.price.toLocaleString()}</Text>
                <View style={styles.stockActions}>
                  <Switch
                    value={item.available}
                    onValueChange={async () => {
                      const saved = await AsyncStorage.getItem('stock');
                      const savedStock = saved ? JSON.parse(saved) : { wrappers: [], ribbons: [], flowers: [] };
                      savedStock[activeCategory] = savedStock[activeCategory].map(i =>
                        i.id === item.id ? { ...i, available: !i.available } : i
                      );
                      await AsyncStorage.setItem('stock', JSON.stringify(savedStock));
                      loadStock();
                    }}
                  />
                  <Text style={styles.availableText}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </Text>
                </View>
              </View>
              <View style={styles.stockItemActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(item)}
                >
                  <FontAwesome name="edit" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <FontAwesome name="trash" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={showModal}
        animationType={IS_MOBILE ? "slide" : "fade"}
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit' : 'Add'} {activeCategory.slice(0, -1)}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Available</Text>
                  <Switch
                    value={formData.available}
                    onValueChange={(value) => handleInputChange('available', value)}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Item Image</Text>
                <View style={styles.imageUploadContainer}>
                  {formData.image ? (
                    <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleInputChange('image', null)}
                      >
                        <FontAwesome name="times" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.imageUploadButton}
                      onPress={async () => {
                        try {
                          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                          if (status !== 'granted') {
                            Alert.alert('Permission needed', 'Please grant camera roll permissions');
                            return;
                          }

                          const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                          });

                          if (!result.canceled && result.assets[0]) {
                            handleInputChange('image', result.assets[0].uri);
                          }
                        } catch (error) {
                          Alert.alert('Error', 'Failed to pick image: ' + error.message);
                        }
                      }}
                    >
                      <FontAwesome name="camera" size={32} color="#ec4899" />
                      <Text style={styles.imageUploadText}>Tap to Upload Photo</Text>
                      <Text style={styles.imageUploadSubtext}>or take a picture</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={async () => {
                    try {
                      const { status } = await ImagePicker.requestCameraPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permission needed', 'Please grant camera permissions');
                        return;
                      }

                      const result = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                      });

                      if (!result.canceled && result.assets[0]) {
                        handleInputChange('image', result.assets[0].uri);
                      }
                    } catch (error) {
                      Alert.alert('Error', 'Failed to take picture: ' + error.message);
                    }
                  }}
                >
                  <FontAwesome name="camera" size={18} color="#ec4899" />
                  <Text style={styles.cameraButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>{editingItem ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Notifications Tab
const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      let notifications = saved ? JSON.parse(saved) : [];
      
      // Add example notifications if none exist
      if (notifications.length === 0) {
        const exampleNotifications = [
          {
            id: 'notif-001',
            title: 'New Order Received',
            message: 'Order #ORD-001 has been placed by Maria Santos. Total: ₱2,500',
            icon: 'bell',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/my-orders',
          },
          {
            id: 'notif-002',
            title: 'Payment Confirmed',
            message: 'Payment for Order #ORD-001 has been confirmed. Amount: ₱2,500',
            icon: 'bell',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            link: '/my-orders',
          },
          {
            id: 'notif-003',
            title: 'Order Status Updated',
            message: 'Order #ORD-003 status has been updated to Processing',
            icon: 'bell',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: false,
            link: '/my-orders',
          },
          {
            id: 'notif-004',
            title: 'Special Request Received',
            message: 'New special order request from Michael Tan. Please review.',
            icon: 'bell',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            read: false,
            link: '/my-orders',
          },
        ];
        
        await AsyncStorage.setItem('notifications', JSON.stringify(exampleNotifications));
        notifications = exampleNotifications;
      }
      
      setNotifications(notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const notification = {
        id: `notif-${Date.now()}`,
        title: formData.title,
        message: formData.message,
        icon: 'bell',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/my-orders',
      };

      const saved = await AsyncStorage.getItem('notifications');
      const savedNotifications = saved ? JSON.parse(saved) : [];
      await AsyncStorage.setItem('notifications', JSON.stringify([notification, ...savedNotifications]));
      loadNotifications();
      setShowModal(false);
      setFormData({ title: '', message: '' });
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const saved = await AsyncStorage.getItem('notifications');
              const savedNotifications = saved ? JSON.parse(saved) : [];
              const updated = savedNotifications.filter(n => n.id !== notificationId);
              await AsyncStorage.setItem('notifications', JSON.stringify(updated));
              loadNotifications();
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      </View>
      <TouchableOpacity
        style={styles.notificationDeleteButton}
        onPress={() => handleDeleteNotification(item.id)}
      >
        <FontAwesome name="trash" size={18} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Notifications</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Send Notification</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No notifications found</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Notification</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(value) => handleInputChange('title', value)}
                  placeholder="Enter title"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.message}
                  onChangeText={(value) => handleInputChange('message', value)}
                  placeholder="Enter message"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSendNotification}
              >
                <Text style={styles.submitButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Messaging Tab
const MessagingTab = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const saved = await AsyncStorage.getItem('messages');
      let conversations = saved ? JSON.parse(saved) : [];
      
      // Add example conversations if none exist
      if (conversations.length === 0) {
        const exampleConversations = [
          {
            id: 'conv-001',
            customerName: 'Maria Santos',
            customerEmail: 'maria.santos@email.com',
            lastMessage: 'Thank you for the beautiful flowers! They arrived on time.',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 2,
            messages: [
              {
                id: 'msg-001',
                sender: 'customer',
                senderName: 'Maria Santos',
                text: 'Hello, I would like to order a bouquet for my mother\'s birthday.',
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
              },
              {
                id: 'msg-002',
                sender: 'admin',
                senderName: 'Admin',
                text: 'Hello Maria! We\'d be happy to help. What type of flowers would you like?',
                timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
              },
              {
                id: 'msg-003',
                sender: 'customer',
                senderName: 'Maria Santos',
                text: 'I would like red roses, please. Can you deliver tomorrow?',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
              },
              {
                id: 'msg-004',
                sender: 'admin',
                senderName: 'Admin',
                text: 'Yes, we can deliver tomorrow. The red rose bouquet is ₱1,500. Is that okay?',
                timestamp: new Date(Date.now() - 86400000 + 1800000).toISOString(),
              },
              {
                id: 'msg-005',
                sender: 'customer',
                senderName: 'Maria Santos',
                text: 'Perfect! Please proceed with the order.',
                timestamp: new Date(Date.now() - 43200000).toISOString(),
              },
              {
                id: 'msg-006',
                sender: 'admin',
                senderName: 'Admin',
                text: 'Great! Your order has been confirmed. We\'ll deliver tomorrow between 2-4 PM.',
                timestamp: new Date(Date.now() - 36000000).toISOString(),
              },
              {
                id: 'msg-007',
                sender: 'customer',
                senderName: 'Maria Santos',
                text: 'Thank you for the beautiful flowers! They arrived on time.',
                timestamp: new Date().toISOString(),
              },
            ],
          },
          {
            id: 'conv-002',
            customerName: 'John Dela Cruz',
            customerEmail: 'john.delacruz@email.com',
            lastMessage: 'Can I customize the arrangement?',
            lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
            unreadCount: 1,
            messages: [
              {
                id: 'msg-008',
                sender: 'customer',
                senderName: 'John Dela Cruz',
                text: 'Hi, I need flowers for a wedding event. Do you do event decorations?',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
              },
              {
                id: 'msg-009',
                sender: 'admin',
                senderName: 'Admin',
                text: 'Yes, we do! We offer full event decoration services. When is your event?',
                timestamp: new Date(Date.now() - 172800000 + 7200000).toISOString(),
              },
              {
                id: 'msg-010',
                sender: 'customer',
                senderName: 'John Dela Cruz',
                text: 'It\'s on December 15th. Can I customize the arrangement?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
              },
            ],
          },
          {
            id: 'conv-003',
            customerName: 'Sarah Garcia',
            customerEmail: 'sarah.garcia@email.com',
            lastMessage: 'What colors do you have available?',
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
            unreadCount: 0,
            messages: [
              {
                id: 'msg-011',
                sender: 'customer',
                senderName: 'Sarah Garcia',
                text: 'Hello! I\'m looking for sympathy flowers.',
                timestamp: new Date(Date.now() - 259200000).toISOString(),
              },
              {
                id: 'msg-012',
                sender: 'admin',
                senderName: 'Admin',
                text: 'We have several sympathy arrangements available. Would you like to see our options?',
                timestamp: new Date(Date.now() - 259200000 + 10800000).toISOString(),
              },
              {
                id: 'msg-013',
                sender: 'customer',
                senderName: 'Sarah Garcia',
                text: 'What colors do you have available?',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
              },
            ],
          },
        ];
        
        await AsyncStorage.setItem('messages', JSON.stringify(exampleConversations));
        conversations = exampleConversations;
      }
      
      setConversations(conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender: 'admin',
        senderName: 'Admin',
        text: messageText.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage.text,
            lastMessageTime: newMessage.timestamp,
            unreadCount: 0,
          };
        }
        return conv;
      });

      await AsyncStorage.setItem('messages', JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id));
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderConversation = ({ item }) => {
    const lastMessageTime = new Date(item.lastMessageTime);
    const timeAgo = lastMessageTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => setSelectedConversation(item)}
      >
        <View style={styles.conversationAvatar}>
          <FontAwesome name="user" size={24} color="#ec4899" />
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>{item.customerName}</Text>
            <Text style={styles.conversationTime}>{timeAgo}</Text>
          </View>
          <Text style={styles.conversationPreview} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }) => {
    const isAdmin = item.sender === 'admin';
    return (
      <View
        style={[
          styles.messageBubble,
          isAdmin ? styles.messageBubbleAdmin : styles.messageBubbleCustomer,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isAdmin ? styles.messageTextAdmin : styles.messageTextCustomer,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isAdmin ? styles.messageTimeAdmin : styles.messageTimeCustomer,
          ]}
        >
          {new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (selectedConversation) {
  return (
    <View style={styles.tabContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedConversation(null)}
          >
            <FontAwesome name="arrow-left" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{selectedConversation.customerName}</Text>
            <Text style={styles.chatHeaderEmail}>{selectedConversation.customerEmail}</Text>
          </View>
        </View>

        <FlatList
          data={selectedConversation.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesListContent}
          inverted={false}
        />

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <FontAwesome name="paper-plane" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
      <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No conversations found</Text>
      </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
};

// About Tab
const AboutTab = () => {
  const [aboutData, setAboutData] = useState({
    story: '',
    promise: '',
    ownerQuote: '',
  });

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const saved = await AsyncStorage.getItem('aboutData');
      if (saved) {
        setAboutData(JSON.parse(saved));
      } else {
        setAboutData({
          story: "Jocery's Flower Shop was born from a love for flowers...",
          promise: "We built our shop on the foundation of those relationships...",
          ownerQuote: "Flowers have always been my passion...",
        });
      }
    } catch (error) {
      console.error('Error loading about data:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setAboutData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('aboutData', JSON.stringify(aboutData));
      Alert.alert('Success', 'About page updated successfully!');
    } catch (error) {
      console.error('Error saving about data:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabTitle}>About Page Management</Text>
      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Our Story</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={aboutData.story}
            onChangeText={(value) => handleInputChange('story', value)}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Our Promise</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={aboutData.promise}
            onChangeText={(value) => handleInputChange('promise', value)}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Owner Quote</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={aboutData.ownerQuote}
            onChangeText={(value) => handleInputChange('ownerQuote', value)}
            multiline
            numberOfLines={5}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Contact Tab
const ContactTab = () => {
  const [contactData, setContactData] = useState({
    address: '',
    phone: '',
    email: '',
    mapUrl: '',
  });

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const saved = await AsyncStorage.getItem('contactData');
      if (saved) {
        setContactData(JSON.parse(saved));
      } else {
        setContactData({
          address: 'Zamboanga City, Philippines',
          phone: '+63 756 347 901',
          email: 'JoceryFlowerShop@gmail.com',
          mapUrl: '',
        });
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('contactData', JSON.stringify(contactData));
      Alert.alert('Success', 'Contact page updated successfully!');
    } catch (error) {
      console.error('Error saving contact data:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Contact Page Management</Text>
      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={contactData.address}
            onChangeText={(value) => handleInputChange('address', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={contactData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={contactData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Map URL</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={contactData.mapUrl}
            onChangeText={(value) => handleInputChange('mapUrl', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Sales Tab
const SalesTab = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    calculateSales();
  }, []);

  const calculateSales = async () => {
    try {
      const ordersJson = await AsyncStorage.getItem('orders');
      const requestsJson = await AsyncStorage.getItem('requests');
      const orders = ordersJson ? JSON.parse(ordersJson) : [];
      const requests = requestsJson ? JSON.parse(requestsJson) : [];
      const allOrders = [...orders, ...requests];

      const completed = allOrders.filter(o => o.status === 'completed' || o.paymentStatus === 'paid');
      const pending = allOrders.filter(o => o.status === 'pending');
      const revenue = completed.reduce((sum, o) => sum + (o.total || o.price || 0), 0);

      setSalesData({
        totalRevenue: revenue,
        totalOrders: allOrders.length,
        completedOrders: completed.length,
        pendingOrders: pending.length,
      });
    } catch (error) {
      console.error('Error calculating sales:', error);
    }
  };

  const StatCard = ({ icon, value, label, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <FontAwesome name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <View style={styles.tabTitleContainer}>
          <FontAwesome name="credit-card" size={IS_MOBILE ? 24 : 20} color="#ec4899" style={styles.tabTitleIcon} />
      <Text style={styles.tabTitle}>Sales Overview</Text>
        </View>
      </View>
      <ScrollView style={styles.salesContainer}>
        <StatCard
          icon="dollar-sign"
          value={`₱${salesData.totalRevenue.toLocaleString()}`}
          label="Total Revenue"
          color="#ec4899"
        />
        <StatCard
          icon="shopping-cart"
          value={salesData.totalOrders.toString()}
          label="Total Orders"
          color="#4e73df"
        />
        <StatCard
          icon="check-circle"
          value={salesData.completedOrders.toString()}
          label="Completed"
          color="#1cc88a"
        />
        <StatCard
          icon="clock-o"
          value={salesData.pendingOrders.toString()}
          label="Pending"
          color="#f6c23e"
        />
      </ScrollView>
    </View>
  );
};

// Admin Control Tab
const AdminControlTab = () => {
  // You can set your API endpoint here or via environment variable
  const API_ENDPOINT = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com/api';
  
  return <AdminControlPanel apiEndpoint={API_ENDPOINT} />;
};

// Employees Tab
const EmployeesTab = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const saved = await AsyncStorage.getItem('employees');
      setEmployees(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const employee = {
        id: `emp-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      const saved = await AsyncStorage.getItem('employees');
      const savedEmployees = saved ? JSON.parse(saved) : [];
      await AsyncStorage.setItem('employees', JSON.stringify([...savedEmployees, employee]));
      loadEmployees();
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', 'Failed to add employee');
    }
  };

  const handleDelete = (employeeId) => {
    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const saved = await AsyncStorage.getItem('employees');
              const savedEmployees = saved ? JSON.parse(saved) : [];
              const updated = savedEmployees.filter(emp => emp.id !== employeeId);
              await AsyncStorage.setItem('employees', JSON.stringify(updated));
              loadEmployees();
            } catch (error) {
              console.error('Error deleting employee:', error);
              Alert.alert('Error', 'Failed to delete employee');
            }
          },
        },
      ]
    );
  };

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeEmail}>{item.email}</Text>
        <View style={[styles.roleBadge, item.role === 'admin' && styles.roleBadgeAdmin]}>
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(item.id)}
      >
        <FontAwesome name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Employee Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      {employees.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No employees found</Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Employee</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesome name="times" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Enter password"
                  secureTextEntry
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Role *</Text>
                <View style={styles.typeContainer}>
                  {['employee', 'admin'].map(role => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.typeOption,
                        formData.role === role && styles.typeOptionActive,
                      ]}
                      onPress={() => handleInputChange('role', role)}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.role === role && styles.typeOptionTextActive,
                        ]}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Add Employee</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: IS_MOBILE ? 'column' : 'row',
    backgroundColor: '#f4f6f9',
    width: '100%',
    height: '100%',
  },
  sidebar: {
    width: IS_MOBILE ? undefined : 260,
    backgroundColor: '#343a40',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: 20,
    backgroundColor: '#ec4899',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  sidebarSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  navContainer: {
    flex: 1,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: IS_MOBILE ? 16 : 12,
    paddingLeft: IS_MOBILE ? 20 : 25,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    minHeight: IS_MOBILE ? 56 : undefined,
  },
  navLinkActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: '#ec4899',
  },
  navIcon: {
    width: 25,
    marginRight: 10,
  },
  navLinkText: {
    color: '#c2c7d0',
    fontSize: 14,
  },
  navLinkTextActive: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 25,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutText: {
    color: '#c2c7d0',
    fontSize: 14,
  },
  content: {
    flex: 1,
    width: '100%',
    padding: IS_MOBILE ? 12 : 20,
    paddingBottom: IS_MOBILE ? 100 : 20,
    paddingTop: IS_MOBILE ? 0 : 20,
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
  tabContainer: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: IS_MOBILE ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: IS_MOBILE ? 'flex-start' : 'center',
    marginBottom: IS_MOBILE ? 16 : 20,
    gap: IS_MOBILE ? 12 : 0,
  },
  tabTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  tabTitleIcon: {
    marginRight: 0,
  },
  tabTitle: {
    fontSize: IS_MOBILE ? 20 : 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ec4899',
    padding: IS_MOBILE ? 12 : 10,
    paddingHorizontal: IS_MOBILE ? 20 : 16,
    borderRadius: 8,
    gap: 8,
    minHeight: IS_MOBILE ? 44 : undefined,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fc',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e3e6f0',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 12,
    color: '#1a1a1a',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
  },
  tableCellText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  actionButton: {
    padding: IS_MOBILE ? 10 : 8,
    borderRadius: 5,
    marginHorizontal: IS_MOBILE ? 6 : 4,
    minWidth: IS_MOBILE ? 44 : undefined,
    minHeight: IS_MOBILE ? 44 : undefined,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4e73df',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: IS_MOBILE ? 'flex-end' : 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: IS_MOBILE ? 20 : 10,
    borderTopLeftRadius: IS_MOBILE ? 20 : 10,
    borderTopRightRadius: IS_MOBILE ? 20 : 10,
    borderBottomLeftRadius: IS_MOBILE ? 0 : 10,
    borderBottomRightRadius: IS_MOBILE ? 0 : 10,
    width: IS_MOBILE ? '100%' : '90%',
    maxWidth: IS_MOBILE ? '100%' : 600,
    maxHeight: IS_MOBILE ? '95%' : '90%',
    ...(IS_MOBILE && { 
      height: '95%',
      marginTop: 'auto',
    }),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: IS_MOBILE ? 16 : 20,
    paddingTop: IS_MOBILE ? 20 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
    ...Platform.select({
      ios: {
        paddingTop: IS_MOBILE ? 30 : 20,
      },
    }),
  },
  modalTitle: {
    fontSize: IS_MOBILE ? 20 : 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  modalBody: {
    padding: IS_MOBILE ? 16 : 20,
    flex: 1,
  },
  modalFooter: {
    flexDirection: IS_MOBILE ? 'column' : 'row',
    justifyContent: 'flex-end',
    padding: IS_MOBILE ? 16 : 20,
    paddingBottom: IS_MOBILE ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: '#e3e6f0',
    gap: IS_MOBILE ? 12 : 10,
    ...Platform.select({
      ios: {
        paddingBottom: IS_MOBILE ? 40 : 20,
      },
    }),
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e3e6f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButton: {
    padding: IS_MOBILE ? 16 : 12,
    paddingHorizontal: IS_MOBILE ? 20 : 24,
    borderRadius: 8,
    minHeight: IS_MOBILE ? 50 : undefined,
    justifyContent: 'center',
    alignItems: 'center',
    flex: IS_MOBILE ? 1 : 0,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ec4899',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e6f0',
    backgroundColor: '#fff',
  },
  categoryOptionActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  categoryOptionTextActive: {
    color: '#fff',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imageUploadContainer: {
    marginBottom: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc3545',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#ec4899',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    minHeight: 200,
  },
  imageUploadText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#ec4899',
  },
  imageUploadSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#6c757d',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ec4899',
    gap: 8,
  },
  cameraButtonText: {
    color: '#ec4899',
    fontWeight: '600',
    fontSize: 14,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  filterScroll: {
    maxHeight: 50,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e3e6f0',
  },
  filterChipActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e3e6f0',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: IS_MOBILE ? 12 : 10,
    paddingHorizontal: IS_MOBILE ? 16 : 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -2,
    gap: 8,
    minHeight: IS_MOBILE ? 50 : undefined,
  },
  tabButtonActive: {
    borderBottomColor: '#ec4899',
  },
  tabButtonIcon: {
    marginRight: 0,
  },
  tabButtonText: {
    fontSize: IS_MOBILE ? 14 : 14,
    color: '#6c757d',
  },
  tabButtonTextActive: {
    color: '#ec4899',
    fontWeight: '600',
  },
  stockCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stockImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stockPrice: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  stockActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availableText: {
    fontSize: 12,
    color: '#6c757d',
  },
  stockItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  orderDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  orderCustomerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  orderType: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  orderDeliveryInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
  },
  deliveryTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    marginBottom: 8,
  },
  deliveryTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ec4899',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 16,
  },
  orderStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f6c23e',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  paymentPaid: {
    backgroundColor: '#1cc88a',
  },
  paymentPending: {
    backgroundColor: '#f6c23e',
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e3e6f0',
  },
  paymentTypeText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    marginLeft: 'auto',
  },
  receiptButtonText: {
    fontSize: 11,
    color: '#ec4899',
    fontWeight: '600',
  },
  paymentTypeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  paymentTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e3e6f0',
    backgroundColor: '#fff',
    minHeight: 60,
  },
  paymentTypeOptionActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  paymentTypeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  paymentTypeOptionTextActive: {
    color: '#fff',
  },
  receiptModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: IS_MOBILE ? '95%' : '80%',
    maxWidth: 600,
    maxHeight: IS_MOBILE ? '90%' : '85%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  receiptImage: {
    width: '100%',
    height: IS_MOBILE ? SCREEN_HEIGHT * 0.6 : 500,
    backgroundColor: '#f0f0f0',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  orderActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 40,
  },
  statusButton: {
    backgroundColor: '#e7f1ff',
  },
  paymentButton: {
    backgroundColor: '#d4edda',
  },
  orderActionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statusOption: {
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e6f0',
    backgroundColor: '#fff',
    minWidth: 100,
  },
  statusOptionActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  statusOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statuspending: {
    backgroundColor: '#ffeeba',
  },
  statusprocessing: {
    backgroundColor: '#cfe2ff',
  },
  statusready: {
    backgroundColor: '#d1e7dd',
  },
  statuscompleted: {
    backgroundColor: '#d1e7dd',
  },
  statuscancelled: {
    backgroundColor: '#f8d7da',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  notificationDeleteButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fee',
  },
  // Messaging styles
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  conversationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  conversationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  conversationPreview: {
    fontSize: 14,
    color: '#6c757d',
  },
  unreadBadge: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  chatHeaderEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  messagesListContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  messageBubbleAdmin: {
    backgroundColor: '#ec4899',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageBubbleCustomer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextAdmin: {
    color: '#fff',
  },
  messageTextCustomer: {
    color: '#1a1a1a',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  messageTimeAdmin: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messageTimeCustomer: {
    color: '#9ca3af',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e3e6f0',
    alignItems: 'flex-end',
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
    }),
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e3e6f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    marginRight: 8,
    backgroundColor: '#f8f9fc',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#c2c7d0',
  },
  formContainer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#ec4899',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e6f0',
    backgroundColor: '#fff',
  },
  typeOptionActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  typeOptionTextActive: {
    color: '#fff',
  },
  salesContainer: {
    flex: 1,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  employeeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  employeeEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    padding: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#4e73df',
  },
  roleBadgeAdmin: {
    backgroundColor: '#dc3545',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  // Mobile-specific styles
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 12,
      },
    }),
    zIndex: 100,
  },
  burgerButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  mobileHeaderTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  mobileHeaderTitle: {
    fontSize: IS_MOBILE ? 16 : 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  mobileHeaderSubtitle: {
    fontSize: IS_MOBILE ? 11 : 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
    backgroundColor: '#f8f9fc',
  },
  dropdownHeaderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownScroll: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  dropdownItemLogout: {
    borderTopWidth: 2,
    borderTopColor: '#e3e6f0',
    marginTop: 8,
  },
  dropdownIcon: {
    width: 24,
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  dropdownItemTextActive: {
    color: '#ec4899',
    fontWeight: '600',
  },
  dropdownItemTextLogout: {
    color: '#dc3545',
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e3e6f0',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 60,
  },
  bottomTabActive: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  bottomTabText: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 4,
    fontWeight: '500',
  },
  bottomTabTextActive: {
    color: '#ec4899',
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  productCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  productCardContent: {
    flex: 1,
  },
  productCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  productCardCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  productCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productCardPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ec4899',
  },
  productCardQuantity: {
    fontSize: 14,
    color: '#6c757d',
  },
  productCardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  mobileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

const styles = getStyles();

export default AdminDashboard;

