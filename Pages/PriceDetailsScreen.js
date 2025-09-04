import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const PriceDetailsScreen = ({ route, navigation }) => {
  const { priceItem, productName, productId } = route.params;

  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return {
      fullDate: `${dayName}, ${day} ${month} ${year}`,
      time: `${displayHours}:${displayMinutes} ${ampm}`
    };
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    return isNaN(numAmount) ? 'Rs. 0.00' : `Rs. ${numAmount.toFixed(2)}`;
  };

  const formatQuantity = (quantity) => {
    const numQuantity = parseFloat(quantity);
    return isNaN(numQuantity) ? '0 kg' : `${numQuantity} kg`;
  };

  const dateInfo = formatDateDisplay(priceItem.date);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#4E2A14', '#6B3820']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Price Details
        </Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Product Info Header */}
        <View style={styles.productInfoCard}>
          <LinearGradient
            colors={['#F4E4BC', '#E8D5A3']}
            style={styles.productInfoGradient}
          >
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.priceEntryLabel}>Price Entry Details</Text>
          </LinearGradient>
        </View>

        {/* Date and Time Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="schedule" size={24} color="#4E2A14" />
            <Text style={styles.cardHeaderText}>Date & Time</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.dateText}>{dateInfo.fullDate}</Text>
            <Text style={styles.timeText}>{dateInfo.time}</Text>
          </View>
        </View>

        {/* Price Information Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="attach-money" size={24} color="#4E2A14" />
            <Text style={styles.cardHeaderText}>Pricing Information</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price per 100g:</Text>
              <Text style={styles.priceValue}>{formatCurrency(priceItem.pricePer100g)}</Text>
            </View>
          </View>
        </View>

        {/* Quantity Information Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="scale" size={24} color="#4E2A14" />
            <Text style={styles.cardHeaderText}>Quantity Requirements</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Weekly Quantity:</Text>
              <Text style={styles.quantityValue}>{formatQuantity(priceItem.weeklyQuantity)}</Text>
            </View>
          </View>
        </View>

        {/* Additional Information Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="info" size={24} color="#4E2A14" />
            <Text style={styles.cardHeaderText}>Additional Information</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reason:</Text>
              <Text style={styles.infoValue}>{priceItem.reason || 'Manual price update'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Entry ID:</Text>
              <Text style={styles.infoValue}>{priceItem._id}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('PriceUpdate', {
              priceItem: priceItem,
              productName: productName,
              productId: productId,
            })}
          >
            <LinearGradient
              colors={['#4E2A14', '#6B3820']}
              style={styles.editButtonGradient}
            >
              <MaterialIcons name="edit" size={20} color="#FFF" />
              <Text style={styles.editButtonText}>Edit This Entry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  productInfoCard: {
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfoGradient: {
    padding: 20,
    alignItems: 'center',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E2A14',
    marginBottom: 5,
  },
  priceEntryLabel: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  detailCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E2A14',
    marginLeft: 10,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#8B7355',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: '#4E2A14',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E2A14',
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default PriceDetailsScreen;