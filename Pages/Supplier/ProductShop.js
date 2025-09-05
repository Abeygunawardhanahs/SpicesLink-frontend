import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ProductShops = ({ route, navigation }) => {
  const { productName } = route.params;
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching shops for product:', productName);

        // Use correct endpoint: /api/products/shops/:productName
        const response = await fetch(`http://192.168.0.100:5000/api/products/shops/${encodeURIComponent(productName)}`);
        const data = await response.json();
        console.log('Response:', data);

        if (response.ok && data.success) {
          const enhancedShops = data.shops.map(shop => ({
            ...shop,
            price: shop.price || 'Price on request',
            weeklyQuantity: shop.weeklyQuantity || 'Contact for quantity',
            availability: shop.availability || 'In Stock',
          }));
          setShops(enhancedShops);
        } else {
          setShops([]);
          setError(data.message || 'No shops found for this product');
        }
      } catch (err) {
        console.error("Error fetching shops:", err);
        setError('Failed to load shops. Please try again.');
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchShops();
    }
  }, [productName]);

  const handleRefresh = () => {
    if (productName) {
      setLoading(true);
      setError(null);
      setShops([]);

      const fetchShops = async () => {
        try {
          setLoading(true);
          setError(null);

          console.log('Refreshing shops for product:', productName);

          // Use correct endpoint: /api/products/shops/:productName
          const response = await fetch(`http://192.168.0.100:5000/api/products/${encodeURIComponent(productName)}`);
          const data = await response.json();
          console.log('Refresh Response:', data);

          if (response.ok && data.success) {
            const enhancedShops = data.shops.map(shop => ({
              ...shop,
              price: shop.price || 'Price on request',
              weeklyQuantity: shop.weeklyQuantity || 'Contact for quantity',
              availability: shop.availability || 'In Stock',
            }));
            setShops(enhancedShops);
          } else {
            setShops([]);
            setError(data.message || 'No shops found for this product');
          }
        } catch (err) {
          console.error("Error refreshing shops:", err);
          setError('Failed to load shops. Please try again.');
          setShops([]);
        } finally {
          setLoading(false);
        }
      };

      fetchShops();
    }
  };

  // Updated handleShopPress to navigate to shop details screen
  const handleShopPress = (shop) => {
    navigation.navigate('ShopDetails', {
      shop: shop,
      productName: productName
    });
  };

  const renderShop = ({ item }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => handleShopPress(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(252, 231, 196, 0.9)']}
        style={styles.cardGradient}
      >
        <View style={styles.shopHeader}>
          <View style={styles.shopIcon}>
            <MaterialIcons name="store" size={24} color="#5c3d2e" />
          </View>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{item.shopName}</Text>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color="#cc9966" />
              <Text style={styles.locationText}>{item.shopLocation}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the card press
              Alert.alert(
                'Contact Shop',
                `Call ${item.shopName}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Call', 
                    onPress: () => console.log('Calling:', item.contactNumber)
                  }
                ]
              );
            }}
          >
            <MaterialIcons name="phone" size={20} color="#5c3d2e" />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.shopDetails}> */}
          {/* <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color="#8B7355" />
            <Text style={styles.detailText}>{item.contactNumber}</Text>
          </View> */}
          
          {/* <View style={styles.priceQuantityRow}> */}
            {/* <View style={styles.priceInfo}>
              <MaterialIcons name="attach-money" size={16} color="#4CAF50" />
              <Text style={styles.priceText}>{item.price}</Text>
            </View> */}
            {/* <View style={styles.quantityInfo}>
              <MaterialIcons name="inventory" size={16} color="#2196F3" />
              <Text style={styles.quantityText}>{item.weeklyQuantity}</Text>
            </View> */}
          {/* </View> */}

          {/* <View style={styles.availabilityRow}>
            <MaterialIcons 
              name="circle" 
              size={12} 
              color={item.availability === "In Stock" ? "#4CAF50" : "#F44336"} 
            />
            <Text style={[
              styles.availabilityText,
              { color: item.availability === "In Stock" ? "#4CAF50" : "#F44336" }
            ]}>
              {item.availability}
            </Text>
          </View> */}
          
          {/* Added tap to view details indicator */}
          <View style={styles.viewDetailsRow}>
            <Text style={styles.viewDetailsText}>Tap to view details</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#cc9966" />
          </View>
        {/* </View> */}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/images/download.jpg')}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shops - {productName}</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#cc9966" />
            <Text style={styles.loadingText}>Finding shops...</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/download.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shops - {productName}</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <MaterialIcons name="refresh" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {shops.length > 0 ? (
          <FlatList
            data={shops}
            keyExtractor={(item) => item.shopId?.toString() || Math.random().toString()}
            renderItem={renderShop}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : !loading && !error ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="store-mall-directory" size={80} color="#cc9966" />
            <Text style={styles.emptyTitle}>No Shops Found</Text>
            <Text style={styles.emptySubtitle}>
              No shops are currently selling {productName}
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 28,
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  shopCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  shopIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(204, 153, 102, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c3d2e',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 4,
  },
  contactButton: {
    padding: 10,
    backgroundColor: 'rgba(92, 61, 46, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cc9966',
  },
  shopDetails: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(204, 153, 102, 0.3)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#5c3d2e',
    marginLeft: 8,
    fontWeight: '500',
  },
  priceQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priceText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  quantityText: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '500',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  availabilityText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(204, 153, 102, 0.2)',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#cc9966',
    marginRight: 5,
    fontStyle: 'italic',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#cc9966',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductShops;