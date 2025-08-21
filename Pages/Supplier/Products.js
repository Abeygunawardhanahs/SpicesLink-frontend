import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Products = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const products = [
    { id: 1, name: 'Cinnamon - Kurundu', icon: 'leaf' },
    { id: 2, name: 'Turmeric - Kaha', icon: 'circle' },
    { id: 3, name: 'Pepper - Gammiris', icon: 'circle' },
    { id: 4, name: 'Berries - Goraka', icon: 'circle' },
    { id: 5, name: 'Coffee - Sisep', icon: 'coffee' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderProductItem = (product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productItem}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to ProductShops page with the selected product
        navigation.navigate('ProductShops', { product });
      }}
    >
      <LinearGradient
        colors={['rgba(204, 153, 102, 0.9)', 'rgba(204, 153, 102, 0.7)']}
        style={styles.productGradient}
      >
        <View style={styles.productContent}>
          <View style={styles.productIcon}>
            <FontAwesome 
              name={product.icon} 
              size={24} 
              color="#5c3d2e" 
            />
          </View>
          <Text style={styles.productText}>{product.name}</Text>
          <MaterialIcons name="chevron-right" size={24} color="#5c3d2e" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/download.jpg')} // Same background as dashboard
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Products</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <MaterialIcons name="notifications" size={28} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={28} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#cc9966" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search product"
              placeholderTextColor="#cc9966"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Products List */}
        <ScrollView 
          style={styles.productsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContent}
        >
          {filteredProducts.map(product => renderProductItem(product))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
  searchContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92, 61, 46, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#cc9966',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  productsContainer: {
    flex: 1,
  },
  productsContent: {
    paddingBottom: 20,
  },
  productItem: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  productGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  productContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#5c3d2e',
  },
});

export default Products;