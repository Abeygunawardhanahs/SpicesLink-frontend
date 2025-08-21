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

const ProductShops = ({ route, navigation }) => {
  const { product } = route.params; // Get the selected product from navigation params
  const [searchText, setSearchText] = useState('');

  // Sample shops data - in real app, this would come from API based on product
  const shops = [
    { 
      id: 1, 
      name: 'Green Valley Organic Store', 
      location: 'Colombo 03',
      rating: 4.5,
      distance: '2.3 km',
      price: 'Rs. 450/kg',
      availability: 'In Stock'
    },
    { 
      id: 2, 
      name: 'Spice Garden Market', 
      location: 'Kandy',
      rating: 4.8,
      distance: '45.2 km',
      price: 'Rs. 420/kg',
      availability: 'In Stock'
    },
    { 
      id: 3, 
      name: 'Ceylon Spice Hub', 
      location: 'Galle',
      rating: 4.3,
      distance: '78.5 km',
      price: 'Rs. 480/kg',
      availability: 'Limited Stock'
    },
    { 
      id: 4, 
      name: 'Natural Farm Products', 
      location: 'Negombo',
      rating: 4.6,
      distance: '15.7 km',
      price: 'Rs. 465/kg',
      availability: 'In Stock'
    },
    { 
      id: 5, 
      name: 'Traditional Spice Corner', 
      location: 'Matara',
      rating: 4.2,
      distance: '92.1 km',
      price: 'Rs. 435/kg',
      availability: 'Out of Stock'
    },
  ];

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchText.toLowerCase()) ||
    shop.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'In Stock':
        return '#4CAF50';
      case 'Limited Stock':
        return '#FF9800';
      case 'Out of Stock':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesome key={`full-${index}`} name="star" size={14} color="#FFD700" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <FontAwesome name="star-half-full" size={14} color="#FFD700" />
        )}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesome key={`empty-${index}`} name="star-o" size={14} color="#FFD700" />
        ))}
        <Text style={styles.ratingText}>({rating})</Text>
      </View>
    );
  };

  const renderShopItem = (shop) => (
    <TouchableOpacity
      key={shop.id}
      style={styles.shopItem}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to shop details or handle shop selection
        console.log('Selected shop:', shop.name);
        // You can navigate to shop details page here
        // navigation.navigate('ShopDetails', { shop, product });
      }}
    >
      <LinearGradient
        colors={['rgba(204, 153, 102, 0.9)', 'rgba(204, 153, 102, 0.7)']}
        style={styles.shopGradient}
      >
        <View style={styles.shopContent}>
          <View style={styles.shopHeader}>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={16} color="#5c3d2e" />
                <Text style={styles.shopLocation}>{shop.location}</Text>
                <Text style={styles.distance}>• {shop.distance}</Text>
              </View>
              {renderStarRating(shop.rating)}
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{shop.price}</Text>
              <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(shop.availability) }]}>
                <Text style={styles.availabilityText}>{shop.availability}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/download.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{product.name}</Text>
            <Text style={styles.headerSubtitle}>Available Shops</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <MaterialIcons name="filter-list" size={28} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#cc9966" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search shops or locations"
              placeholderTextColor="#cc9966"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredShops.length} shops found for {product.name}
          </Text>
        </View>

        {/* Shops List */}
        <ScrollView 
          style={styles.shopsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.shopsContent}
        >
          {filteredShops.map(shop => renderShopItem(shop))}
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
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
  resultsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  resultsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  shopsContainer: {
    flex: 1,
  },
  shopsContent: {
    paddingBottom: 20,
  },
  shopItem: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  shopGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  shopContent: {
    flex: 1,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shopInfo: {
    flex: 1,
    marginRight: 15,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5c3d2e',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopLocation: {
    fontSize: 14,
    color: '#5c3d2e',
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: '#5c3d2e',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#5c3d2e',
    marginLeft: 5,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c3d2e',
    marginBottom: 8,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProductShops;