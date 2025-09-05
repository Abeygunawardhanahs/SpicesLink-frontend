import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PriceDetails = ({ route, navigation }) => {
  const { priceData, productName, shopInfo } = route.params;
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  const handleReservation = (response) => {
    if (response === 'yes') {
      navigation.navigate('ReservationForm', {
        priceData,
        productName,
        shopInfo,
      });
      Alert.alert(
        'Reservation Confirmed',
        `Your order for ${productName} has been reserved at ${shopInfo?.shopName}. They will contact you soon.`,
        [{ text: 'OK', onPress: () => setReservationConfirmed(true) }]
      );
    } else {
      navigation.navigate('ShopDetails', {
        shopInfo,
        productName,
        priceData,});


      Alert.alert(
        'Reservation Cancelled',
        'You can always reserve later if needed.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
            <Text style={styles.headerTitle}>{productName || 'Product name'}</Text>
            <TouchableOpacity style={styles.menuButton}>
              <MaterialIcons name="notifications" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <MaterialIcons name="more-vert" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Product Name Banner */}
            <View style={styles.productBanner}>
              <Text style={styles.productName}>{productName || 'Product name'}</Text>
            </View>

            {/* Price Details Card */}
            <View style={styles.priceDetailsCard}>
              <Text style={styles.cardTitle}>Price Details</Text>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>price per 100g:</Text>
                <Text style={styles.priceValue}>
                  Rs. {priceData?.pricePer100g || '120'}/100g
                </Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Date updated:</Text>
                <Text style={styles.dateValue}>
                  {priceData?.date ? formatDate(priceData.date) : '5/4/2025'}
                </Text>
              </View>
            </View>

            {/* Weekly Quantity Card */}
            <View style={styles.quantityCard}>
              <Text style={styles.quantityTitle}>Weekly Quantity requirement</Text>
              <Text style={styles.quantityValue}>
                {priceData?.weeklyQuantity || '50'} Kg
              </Text>
              
              <Text style={styles.reservationQuestion}>
                do you like to reserve the order ?
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.yesButton}
                  onPress={() => handleReservation('yes')}
                >
                  <Text style={styles.yesButtonText}>yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.noButton}
                  onPress={() => handleReservation('no')}
                >
                  <Text style={styles.noButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  safeArea: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  productBanner: {
    backgroundColor: 'rgba(218, 165, 32, 0.95)', // Golden color
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  priceDetailsCard: {
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: 'bold',
  },
  dateValue: {
    fontSize: 14,
    color: '#5D4037',
  },
  quantityCard: {
    backgroundColor: 'rgba(245, 245, 220, 0.95)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 12,
    textAlign: 'center',
  },
  quantityValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
  },
  reservationQuestion: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  yesButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  yesButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  noButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PriceDetails;