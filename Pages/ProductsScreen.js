import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../Pages/ProductContext';

const API_BASE_URL = 'http://192.168.0.100:5000/api/products'; // Base URL without /api

const ProductsScreen = ({ navigation }) => {
  const { products, deleteProduct, currentUser } = useProducts();

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

  const handleDeleteProduct = (productId) => {
    // Only allow deletion for products that exist on the server (have _id)
    if (!productId) {
      Alert.alert("Cannot Delete", "This product is not yet saved to the server.");
      return;
    }
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(productId) }
    ]);
  };

  const renderItem = ({ item }) => {
    let imageSource;

    // --- UPDATED IMAGE LOGIC ---
    // Check if the image property is a string (from server) or a number (local require)
    if (typeof item.image === 'string' && item.image.startsWith('/uploads')) {
      // Case 1: Image from the backend (e.g., '/uploads/image.jpg')
      imageSource = { uri: `${API_BASE_URL}${item.image}` };
    } else if (typeof item.image === 'number') {
      // Case 2: Local image from registration (the result of require())
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
            {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
            {item.price && <Text style={styles.itemPrice}>Price: {item.price}</Text>}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            // Use item._id from MongoDB, which might not exist on client-side items
            onPress={() => handleDeleteProduct(item._id)}
          >
            <MaterialIcons name="delete" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
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

      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/welcomeRight.jpg')} style={styles.headerImage} />
        <View style={styles.overlay}>
          <Text style={styles.imageTitle}>MY PRODUCTS</Text>
          <Text style={styles.imageSubtitle}>
            {currentUser ? `${currentUser.shopName}'s Collection` : 'Product Collection'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.addNewProductButton} onPress={() => navigation.navigate('AddNewProductScreen')}>
          <MaterialIcons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addNewProductText}>Add New Product</Text>
        </TouchableOpacity>
      </View>

      {products && products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          // --- UPDATED KEY EXTRACTOR ---
          // Handles both _id (from server) and id (from client)
          keyExtractor={(item) => (item._id || item.id).toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

// Styles (No changes needed, but included for completeness)
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
  listContainer: { padding: 15, paddingBottom: 100 },
  card: { backgroundColor: '#fce7c4', borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 12, elevation: 3 },
  itemImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#e0e0e0' },
  productInfo: { flex: 1 },
  itemText: { fontSize: 16, fontWeight: 'bold', color: '#5C1D0E', marginBottom: 4 },
  itemDescription: { fontSize: 14, color: '#8B7355', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#4E2A14', fontWeight: '600' },
  deleteButton: { padding: 10, marginLeft: 10 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 24, fontWeight: 'bold', color: '#5C1D0E', marginTop: 20, marginBottom: 10 },
  emptyStateText: { fontSize: 16, color: '#8B7355', textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  emptyStateButton: { backgroundColor: '#5C1D0E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 },
  emptyStateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProductsScreen;