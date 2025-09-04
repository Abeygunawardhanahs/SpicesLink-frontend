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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ShopDetails = ({ route, navigation }) => {
  const { shop, productName } = route.params;
  const [detailedShopInfo, setDetailedShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch detailed shop information
    fetchDetailedShopInfo();
  }, []);

  const fetchDetailedShopInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // API call to get detailed shop info
      const response = await fetch(
        `http://192.168.0.100:5000/api/shops/${shop.shopId}/details?productName=${encodeURIComponent(productName)}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setDetailedShopInfo(data.shopDetails);
      } else {
        // If API doesn't exist yet, use the shop data we already have
        setDetailedShopInfo({
          ...shop,
          priceUpdatedDate: new Date().toLocaleDateString(),
          description: 'Quality products at competitive prices',
          rating: 4.2,
          reviews: 156,
          openingHours: '9:00 AM - 8:00 PM',
          deliveryAvailable: true,
          minimumOrder: 'Rs. 500',
          paymentMethods: ['Cash', 'Card', 'Mobile Payment'],
        });
      }
    } catch (err) {
      console.error('Error fetching detailed shop info:', err);
      // Fallback to basic shop data with some defaults
      setDetailedShopInfo({
        ...shop,
        priceUpdatedDate: new Date().toLocaleDateString(),
        description: 'Quality products at competitive prices',
        rating: 4.0,
        reviews: 0,
        openingHours: 'Contact for hours',
        deliveryAvailable: false,
        minimumOrder: 'Contact for details',
        paymentMethods: ['Cash'],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    Alert.alert(
      'Call Shop',
      `Call ${detailedShopInfo.shopName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${detailedShopInfo.contactNumber}`);
          },
        },
      ]
    );
  };

  const handleDirections = () => {
    Alert.alert(
      'Get Directions',
      'Open directions in maps app?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Maps',
          onPress: () => {
            const query = encodeURIComponent(detailedShopInfo.shopLocation);
            Linking.openURL(`https://maps.google.com/maps?q=${query}`);
          },
        },
      ]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MaterialIcons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialIcons
          key={`empty-${i}`}
          name="star-border"
          size={16}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

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
            <Text style={styles.headerTitle}>Shop Details</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#cc9966" />
            <Text style={styles.loadingText}>Loading shop details...</Text>
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
          <Text style={styles.headerTitle}>{detailedShopInfo?.shopName}</Text>
          <TouchableOpacity onPress={handleCall}>
            <MaterialIcons name="phone" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Shop Info Card */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 231, 196, 0.95)']}
            style={styles.mainCard}
          >
            <View style={styles.shopHeader}>
              <View style={styles.shopIcon}>
                <MaterialIcons name="store" size={40} color="#5c3d2e" />
              </View>
              <View style={styles.shopBasicInfo}>
                <Text style={styles.shopName}>{detailedShopInfo?.shopName}</Text>
                <View style={styles.ratingRow}>
                  <View style={styles.starsContainer}>
                    {renderStars(detailedShopInfo?.rating || 0)}
                  </View>
                  <Text style={styles.ratingText}>
                    {detailedShopInfo?.rating?.toFixed(1)} ({detailedShopInfo?.reviews} reviews)
                  </Text>
                </View>
                <Text style={styles.description}>{detailedShopInfo?.description}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Product Price Info */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 231, 196, 0.95)']}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Product Information</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{productName}</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                  <MaterialIcons name="attach-money" size={24} color="#4CAF50" />
                  <Text style={styles.priceValue}>{detailedShopInfo?.price}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                  <MaterialIcons
                    name="circle"
                    size={12}
                    color={detailedShopInfo?.availability === 'In Stock' ? '#4CAF50' : '#F44336'}
                  />
                  <Text
                    style={[
                      styles.availabilityText,
                      {
                        color:
                          detailedShopInfo?.availability === 'In Stock' ? '#4CAF50' : '#F44336',
                      },
                    ]}
                  >
                    {detailedShopInfo?.availability}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="inventory" size={16} color="#2196F3" />
                <Text style={styles.infoText}>Weekly Quantity: {detailedShopInfo?.weeklyQuantity}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="update" size={16} color="#FF9800" />
                <Text style={styles.infoText}>Price Updated: {detailedShopInfo?.priceUpdatedDate}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Contact Information */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 231, 196, 0.95)']}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
                <MaterialIcons name="phone" size={20} color="#4CAF50" />
                <Text style={styles.contactText}>{detailedShopInfo?.contactNumber}</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#cc9966" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactRow} onPress={handleDirections}>
                <MaterialIcons name="location-on" size={20} color="#F44336" />
                <Text style={styles.contactText}>{detailedShopInfo?.shopLocation}</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#cc9966" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Shop Details */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 231, 196, 0.95)']}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Shop Details</Text>
            <View style={styles.shopDetailsInfo}>
              <View style={styles.detailRow}>
                <MaterialIcons name="access-time" size={18} color="#2196F3" />
                <Text style={styles.detailLabel}>Opening Hours:</Text>
                <Text style={styles.detailValue}>{detailedShopInfo?.openingHours}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="local-shipping" size={18} color="#FF9800" />
                <Text style={styles.detailLabel}>Delivery:</Text>
                <Text style={styles.detailValue}>
                  {detailedShopInfo?.deliveryAvailable ? 'Available' : 'Not Available'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="shopping-cart" size={18} color="#9C27B0" />
                <Text style={styles.detailLabel}>Minimum Order:</Text>
                <Text style={styles.detailValue}>{detailedShopInfo?.minimumOrder}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="payment" size={18} color="#4CAF50" />
                <Text style={styles.detailLabel}>Payment Methods:</Text>
                <Text style={styles.detailValue}>
                  {detailedShopInfo?.paymentMethods?.join(', ')}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCall}>
              <MaterialIcons name="phone" size={24} color="#fff" />
              <Text style={styles.primaryButtonText}>Call Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDirections}>
              <MaterialIcons name="directions" size={24} color="#5c3d2e" />
              <Text style={styles.secondaryButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 28, height: 28 },
  content: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#fff', fontSize: 16 },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  shopHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  shopIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  shopBasicInfo: { flex: 1 },
  shopName: { fontSize: 20, fontWeight: 'bold', color: '#5c3d2e', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  starsContainer: { flexDirection: 'row', marginRight: 8 },
  ratingText: { fontSize: 14, color: '#777' },
  description: { fontSize: 14, color: '#555' },
});

export default ShopDetails;