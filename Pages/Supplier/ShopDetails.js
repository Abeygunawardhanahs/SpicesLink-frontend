import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ShopDetails = ({ route, navigation }) => {
  const { shop, productName } = route.params;
  const [detailedShopInfo, setDetailedShopInfo] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedShopInfo();
    fetchPriceHistory();
  }, []);

  const fetchDetailedShopInfo = async () => {
    try {
      setLoading(true);

      if (!shop?.shopId) {
        console.warn('Shop ID missing, using default shop data');
        setDetailedShopInfo(getFallbackShopInfo());
        return;
      }

      const response = await fetch(
        `http://192.168.0.100:5000/api/products/shops/${shop.shopId}/details?productName=${encodeURIComponent(productName)}`
      );

      const data = await response.json();

      if (response.ok && data.success && data.shopDetails) {
        setDetailedShopInfo(data.shopDetails);
      } else {
        console.warn('API returned no data, falling back to default shop info', data.message);
        setDetailedShopInfo(getFallbackShopInfo());
      }
    } catch (err) {
      console.error('Error fetching detailed shop info:', err);
      setDetailedShopInfo(getFallbackShopInfo());
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      // Fetch price history from the product
      if (shop?.productId) {
        const response = await fetch(
          `http://192.168.0.100:5000/api/products/${shop.productId}/prices`
        );
        const data = await response.json();
        
        if (response.ok && data.success) {
          setPriceHistory(data.prices || []);
        }
      }
    } catch (err) {
      console.error('Error fetching price history:', err);
      // Set some sample data for demo
      setPriceHistory([
        { 
          date: '2025-04-05', 
          pricePer100g: '120', 
          weeklyQuantity: '50',
          priceUpdated: '2025-04-05T10:30:00Z',
          availability: 'In Stock'
        },
        { 
          date: '2025-03-05', 
          pricePer100g: '115', 
          weeklyQuantity: '45',
          priceUpdated: '2025-03-05T09:15:00Z',
          availability: 'In Stock'
        },
        { 
          date: '2025-02-05', 
          pricePer100g: '110', 
          weeklyQuantity: '40',
          priceUpdated: '2025-02-05T11:45:00Z',
          availability: 'Limited Stock'
        },
      ]);
    }
  };

  const getFallbackShopInfo = () => ({
    ...shop,
    description: 'Quality spices and fresh ingredients at competitive prices',
    shopName: shop.shopName || 'Samagi Store',
    price: shop.price || 'Rs. 120/100g',
    availability: shop.availability || 'In Stock',
    weeklyQuantity: shop.weeklyQuantity || '50 units/week',
    contactNumber: shop.contactNumber || '0702031499',
    shopLocation: shop.shopLocation || 'Kirinda, Matara',
    shopOwnerName: 'Mr. Perera',
    telephone: '0412234567',
    latitude: shop.latitude || 5.9485,
    longitude: shop.longitude || 80.5353,
  });

  const handleCall = () => {
    const phoneNumber = detailedShopInfo?.contactNumber || detailedShopInfo?.telephone;
    if (!phoneNumber) {
      Alert.alert('Error', 'Contact number not available');
      return;
    }

    Alert.alert(
      'Call Shop', 
      `Call ${detailedShopInfo.shopName}?\n${phoneNumber}`, 
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`)
              .catch(err => {
                console.error('Error making call:', err);
                Alert.alert('Error', 'Could not make the call');
              });
          }
        },
      ]
    );
  };

  const handleGetDirections = () => {
    const { shopLocation, latitude, longitude } = detailedShopInfo;
    
    Alert.alert(
      'Get Directions',
      `Open directions to ${shopLocation}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Google Maps',
          onPress: () => {
            let url;
            if (latitude && longitude) {
              // Use coordinates if available
              url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            } else {
              // Use address search
              url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopLocation)}`;
            }
            
            Linking.openURL(url)
              .catch(err => {
                console.error('Error opening maps:', err);
                Alert.alert('Error', 'Could not open Google Maps');
              });
          }
        },
        {
          text: 'Apple Maps',
          onPress: () => {
            let url;
            if (latitude && longitude) {
              url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
            } else {
              url = `http://maps.apple.com/?q=${encodeURIComponent(shopLocation)}`;
            }
            
            Linking.openURL(url)
              .catch(err => {
                console.error('Error opening Apple Maps:', err);
                // Fallback to Google Maps
                const fallbackUrl = latitude && longitude 
                  ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopLocation)}`;
                
                Linking.openURL(fallbackUrl);
              });
          }
        }
      ]
    );
  };

  const handlePriceDetails = (priceEntry) => {
    // Navigate to price details screen
    navigation.navigate('PriceDetails', {
      priceData: priceEntry,
      productName: productName,
      shopInfo: detailedShopInfo,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const InfoCard = ({ children, style }) => (
    <View style={[styles.infoCard, style]}>
      {children}
    </View>
  );

  if (loading) {
    return (
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} 
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading shop details...</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shop Details</Text>
            <TouchableOpacity style={styles.menuButton}>
              <MaterialIcons name="more-vert" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Shop Details Card */}
            <InfoCard style={styles.shopDetailsCard}>
              <Text style={styles.sectionTitle}>Shop Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shop name :</Text>
                <Text style={styles.detailValue}>{detailedShopInfo?.shopName}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location :</Text>
                <Text style={styles.detailValue}>{detailedShopInfo?.shopLocation}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tele :</Text>
                <Text style={styles.detailValue}>{detailedShopInfo?.contactNumber}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shop owner name :</Text>
                <Text style={styles.detailValue}>{detailedShopInfo?.shopOwnerName}</Text>
              </View>
            </InfoCard>

            {/* Price Updates Card */}
            <InfoCard style={styles.priceUpdatesCard}>
              <Text style={styles.sectionTitle}>Price Updates</Text>
              
              {priceHistory.length > 0 ? (
                priceHistory.slice(0, 3).map((priceEntry, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.priceUpdateItem}
                    onPress={() => handlePriceDetails(priceEntry)}
                  >
                    <View style={styles.priceUpdateHeader}>
                      <Text style={styles.priceUpdateDate}>
                        {formatDate(priceEntry.date)}
                      </Text>
                      <MaterialIcons name="chevron-right" size={20} color="#8B4513" />
                    </View>
                    <View style={styles.priceUpdateDetails}>
                      <Text style={styles.priceText}>Rs. {priceEntry.pricePer100g}/100g</Text>
                      <Text style={styles.quantityText}>{priceEntry.weeklyQuantity} units/week</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.priceUpdateItem}
                    onPress={() => handlePriceDetails({ 
                      date: '2025-04-05', 
                      pricePer100g: '120', 
                      weeklyQuantity: '50' 
                    })}
                  >
                    <View style={styles.priceUpdateHeader}>
                      <Text style={styles.priceUpdateDate}>4/5/2025</Text>
                      <MaterialIcons name="chevron-right" size={20} color="#8B4513" />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.priceUpdateItem}
                    onPress={() => handlePriceDetails({ 
                      date: '2025-03-05', 
                      pricePer100g: '115', 
                      weeklyQuantity: '45' 
                    })}
                  >
                    <View style={styles.priceUpdateHeader}>
                      <Text style={styles.priceUpdateDate}>3/5/2025</Text>
                      <MaterialIcons name="chevron-right" size={20} color="#8B4513" />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.priceUpdateItem}
                    onPress={() => handlePriceDetails({ 
                      date: '2025-02-05', 
                      pricePer100g: '110', 
                      weeklyQuantity: '40' 
                    })}
                  >
                    <View style={styles.priceUpdateHeader}>
                      <Text style={styles.priceUpdateDate}>2/5/2025</Text>
                      <MaterialIcons name="chevron-right" size={20} color="#8B4513" />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </InfoCard>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                <MaterialIcons name="phone" size={20} color="#FFF" />
                <Text style={styles.callButtonText}>Call Shop</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
                <MaterialIcons name="directions" size={20} color="#8B4513" />
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shopDetailsCard: {
    marginTop: 10,
  },
  priceUpdatesCard: {
    // Additional styling if needed
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#5D4037',
    flex: 1,
  },
  priceUpdateItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  priceUpdateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceUpdateDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  priceUpdateDetails: {
    marginTop: 4,
    alignItems: 'flex-start',
  },
  priceText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtonsContainer: {
    paddingVertical: 20,
    paddingBottom: 30,
  },
  callButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  directionsButton: {
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionsButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ShopDetails;