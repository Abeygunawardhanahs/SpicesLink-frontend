import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useProducts } from '../Pages/ProductContext';

const API_BASE_URL = 'http://192.168.0.100:5000'; // Remove /api from here

const ProductsScreen = ({ navigation }) => {
  const {
    products,
    deleteProduct,
    currentUser,
    forceRefreshProducts,
    loading,
    isInitialized
  } = useProducts();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh products when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('=== ProductsScreen FOCUS ===');
      console.log('Products count on focus:', products.length);
      console.log('Is initialized:', isInitialized);
      console.log('Current user ID:', currentUser?._id);
      
      if (isInitialized && currentUser?._id) {
        console.log('Refreshing products on focus...');
        forceRefreshProducts();
      }
    }, [isInitialized, currentUser?._id])
  );

  // Initial load when component mounts
  useEffect(() => {
    console.log('=== ProductsScreen MOUNT ===');
    console.log('Products count on mount:', products.length);
    console.log('Is initialized:', isInitialized);
    console.log('Current user:', currentUser?.shopName || currentUser?.name);
    console.log('Current user ID:', currentUser?._id);

    // Load products if we have user data but no products
    if (isInitialized && currentUser?._id && products.length === 0) {
      console.log('Loading products for user...');
      forceRefreshProducts();
    }
  }, [isInitialized, currentUser?._id]);

  const handleProductPress = (product) => {
    const productName = product.name.toLowerCase();
    if (productName.includes('cinnamon')) {
      navigation.navigate('CinamanScreen');
    } else if (productName.includes('turmeric')) {
      navigation.navigate('TurmericDetailScreen');
    } else if (productName.includes('pepper')) {
      navigation.navigate('PepperDetailScreen');
    } else {
      navigation.navigate('DefaultProductScreen', { product });
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Only allow deletion for products that exist on the server (have _id)
    if (!productId) {
      Alert.alert("Cannot Delete", "This product is not yet saved to the server.");
      return;
    }
    
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await deleteProduct(productId);
            Alert.alert('Success', 'Product deleted successfully');
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'Failed to delete product. Please try again.');
          }
        }
      }
    ]);
  };

  const onRefresh = useCallback(async () => {
    if (!currentUser?._id) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    try {
      setIsRefreshing(true);
      console.log('Manual refresh triggered for user:', currentUser._id);
      const refreshedProducts = await forceRefreshProducts();
      console.log('Manual refresh completed, products count:', refreshedProducts?.length || 0);
    } catch (error) {
      console.error('Error refreshing products:', error);
      Alert.alert('Error', 'Failed to refresh products. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [forceRefreshProducts, currentUser?._id]);

  const renderItem = ({ item }) => {
    let imageSource;

    // Handle different image types
    if (typeof item.image === 'string' && item.image.startsWith('/uploads')) {
      // Case 1: Image from the backend (e.g., '/uploads/image.jpg')
      imageSource = { uri: `${API_BASE_URL}${item.image}` };
    } else if (typeof item.image === 'string' && item.image.startsWith('http')) {
      // Case 2: Full URL image
      imageSource = { uri: item.image };
    } else if (typeof item.image === 'number') {
      // Case 3: Local image from registration (the result of require())
      imageSource = item.image;
    } else {
      // Fallback for any other case
      imageSource = require('../assets/images/cinnaman.jpg');
    }

    return (
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <View style={styles.card}>
          <Image source={imageSource} style={styles.itemImage} />
          <View style={styles.productInfo}>
            <Text style={styles.itemText}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.itemDescription}>{item.description}</Text>
            ) : null}
            {item.price ? (
              <Text style={styles.itemPrice}>Price: Rs. {item.price}</Text>
            ) : null}
            {item.category ? (
              <Text style={styles.itemCategory}>Category: {item.category}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(item._id)}
          >
            <MaterialIcons name="delete" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    // Show different message based on loading and initialization state
    if (!isInitialized || (loading && products.length === 0)) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="hourglass-empty" size={80} color="#8B7355" />
          <Text style={styles.emptyStateTitle}>Loading Products...</Text>
          <Text style={styles.emptyStateText}>Please wait while we fetch your products.</Text>
        </View>
      );
    }

    if (!currentUser) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="person-off" size={80} color="#8B7355" />
          <Text style={styles.emptyStateTitle}>Not Logged In</Text>
          <Text style={styles.emptyStateText}>Please log in to view your products.</Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.emptyStateButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <MaterialIcons name="inventory-2" size={80} color="#8B7355" />
        <Text style={styles.emptyStateTitle}>No Products Yet</Text>
        <Text style={styles.emptyStateText}>Start building your catalog by adding your first product.</Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('AddNewProductScreen')}
        >
          <Text style={styles.emptyStateButtonText}>Add Your First Product</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Show loading state if not initialized
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>My Products</Text>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={60} color="#8B7355" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Products</Text>
        <TouchableOpacity onPress={onRefresh} disabled={isRefreshing}>
          <MaterialIcons 
            name={isRefreshing ? "hourglass-empty" : "refresh"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/welcomeRight.jpg')} style={styles.headerImage} />
        <View style={styles.overlay}>
          <Text style={styles.imageTitle}>MY PRODUCTS</Text>
          <Text style={styles.imageSubtitle}>
            {currentUser ? `${currentUser.shopName || currentUser.name}'s Collection` : 'Product Collection'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.addNewProductButton}
          onPress={() => navigation.navigate('AddNewProductScreen')}
        >
          <MaterialIcons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addNewProductText}>Add New Product</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info - Remove in production */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Products: {products.length} | Loading: {loading.toString()} | Initialized: {isInitialized.toString()}
        </Text>
        <Text style={styles.debugText}>
          User: {currentUser?.shopName || currentUser?.name || 'None'} | ID: {currentUser?._id || 'No ID'}
        </Text>
        {products.length > 0 && (
          <Text style={styles.debugText}>
            Latest product: {products[products.length - 1]?.name} | ID: {products[products.length - 1]?._id}
          </Text>
        )}
      </View>

      {products && products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || item.id || `product-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || loading}
              onRefresh={onRefresh}
              colors={['#4E2A14']}
              tintColor="#4E2A14"
            />
          }
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dca85d' },
  topBar: { height: 60, backgroundColor: '#5C1D0E', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between', elevation: 4 },
  topBarTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imageContainer: { position: 'relative', width: '100%', height: 200 },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  imageTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  imageSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#8B4513', paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 14, color: '#fff', marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 10 },
  addNewProductButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4E2A14', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, flex: 2, justifyContent: 'center' },
  addNewProductText: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 8 },
  debugContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    marginHorizontal: 10,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'monospace',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 10,
  },
  listContainer: { padding: 15, paddingBottom: 100 },
  card: { backgroundColor: '#fce7c4', borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 12, elevation: 3 },
  itemImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#e0e0e0' },
  productInfo: { flex: 1 },
  itemText: { fontSize: 16, fontWeight: 'bold', color: '#5C1D0E', marginBottom: 4 },
  itemDescription: { fontSize: 14, color: '#8B7355', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#4E2A14', fontWeight: '600', marginBottom: 2 },
  itemCategory: { fontSize: 12, color: '#8B7355', fontStyle: 'italic' },
  deleteButton: { padding: 10, marginLeft: 10 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 24, fontWeight: 'bold', color: '#5C1D0E', marginTop: 20, marginBottom: 10 },
  emptyStateText: { fontSize: 16, color: '#8B7355', textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  emptyStateButton: { backgroundColor: '#5C1D0E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 },
  emptyStateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProductsScreen;