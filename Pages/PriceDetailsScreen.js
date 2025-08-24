import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const PriceDetailsScreen = ({ route, navigation }) => {
  const { priceItem, productName, productId } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return `${dayName} ${day}-${month + 1}-${year}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#4E2A14', '#6B3820']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Price Details</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Product Name */}
        <View style={styles.productNameCard}>
          <Text style={styles.productName}>{productName}</Text>
        </View>

        {/* Date Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="calendar-today" size={24} color="#4E2A14" />
            <Text style={styles.cardTitle}>Date</Text>
          </View>
          <Text style={styles.cardValue}>{formatDateDisplay(priceItem.date)}</Text>
          <Text style={styles.cardSubValue}>{formatDate(priceItem.date)}</Text>
        </View>

        {/* Price Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="attach-money" size={24} color="#4E2A14" />
            <Text style={styles.cardTitle}>Price</Text>
          </View>
          <Text style={styles.cardValue}>Rs. {priceItem.price.toFixed(2)}</Text>
        </View>

        {/* Price per 100g Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="scale" size={24} color="#4E2A14" />
            <Text style={styles.cardTitle}>Price per 100g</Text>
          </View>
          <Text style={styles.cardValue}>
            Rs. {priceItem.pricePer100g ? priceItem.pricePer100g.toFixed(2) : '0.00'}
          </Text>
        </View>

        {/* Weekly Quantity Requirement Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="fitness-center" size={24} color="#4E2A14" />
            <Text style={styles.cardTitle}>Weekly Quantity Requirement</Text>
          </View>
          <Text style={styles.cardValue}>
            {priceItem.weeklyQuantity ? `${priceItem.weeklyQuantity} g` : '0 g'}
          </Text>
        </View>
      </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  productNameCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E2A14',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E2A14',
    marginLeft: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 5,
  },
  cardSubValue: {
    fontSize: 14,
    color: '#8B7355',
  },
});

export default PriceDetailsScreen;