import React ,{useEffect, useState} from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Helper functions for responsive design
const isTablet = width >= 768;
const isLargePhone = width >= 414;
const isSmallPhone = width < 375;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallPhone) return small;
  if (isLargePhone || isTablet) return large;
  return medium;
};


const getResponsiveWidth = (percentage) => {
  const maxWidth = isTablet ? 600 : width;
  return Math.min(width * percentage, maxWidth * percentage);
};

const BuyerDashboard = ({ navigation }) => {
  const [products, setProducts] = useState([]);

    useEffect(() => {
    fetch('http://192.168.0.100:5000/api/products')  // Replace with real IP
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.log('Fetch error:', error));
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/images/download.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          onPress={() => navigation.reset({
  index: 0,
  routes: [{ name: 'BuyerLogin' }]
})}
        >
          <MaterialIcons 
            name="arrow-back" 
            size={getResponsiveSize(22, 24, 28)} 
            color="#fff" 
          />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Buyer Dashboard</Text>
        <View style={styles.spacer} />
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.header}>Shop Name</Text>

          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('ProductsScreen')}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name="inventory" 
                size={getResponsiveSize(24, 28, 32)} 
                color="#4B1E0F" 
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('SuppliersList')}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name="people" 
                size={getResponsiveSize(24, 28, 32)} 
                color="#4B1E0F" 
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>Suppliers</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name="notifications" 
                size={getResponsiveSize(24, 28, 32)} 
                color="#4B1E0F" 
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name="storage" 
                size={getResponsiveSize(24, 28, 32)} 
                color="#4B1E0F" 
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>Stocks</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.profileCard}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name="person" 
              size={getResponsiveSize(24, 28, 32)} 
              color="#4B1E0F" 
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>My Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    paddingTop: getResponsiveSize(
      height * 0.12, 
      height * 0.11, 
      height * 0.10
    ),
    paddingBottom: getResponsiveSize(
      height * 0.05, 
      height * 0.04, 
      height * 0.03
    ),
    paddingHorizontal: getResponsiveSize(16, 20, 24),
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: isTablet ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    fontSize: getResponsiveSize(
      width * 0.055, 
      width * 0.06, 
      isTablet ? 28 : width * 0.065
    ),
    fontWeight: 'bold',
    backgroundColor: '#d4a373',
    paddingVertical: getResponsiveSize(12, 14, 16),
    paddingHorizontal: getResponsiveSize(20, 24, 28),
    borderRadius: getResponsiveSize(8, 10, 12),
    marginBottom: getResponsiveSize(20, 24, 28),
    color: '#000',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: getResponsiveSize(12, 16, 20),
    marginBottom: getResponsiveSize(20, 24, 28),
    width: '100%',
  },
  card: {
    width: getResponsiveSize(
      (width - 60) / 2,  // For small phones, account for padding and gap
      (width - 80) / 2,  // For medium phones
      isTablet ? 140 : (width - 100) / 2  // For tablets and large phones
    ),
    minWidth: getResponsiveSize(120, 140, 160),
    height: getResponsiveSize(
      height * 0.11, 
      height * 0.12, 
      height * 0.13
    ),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getResponsiveSize(12, 14, 16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileCard: {
    width: getResponsiveSize(
      width * 0.7, 
      width * 0.6, 
      isTablet ? 200 : width * 0.5
    ),
    height: getResponsiveSize(
      height * 0.09, 
      height * 0.1, 
      height * 0.11
    ),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getResponsiveSize(12, 14, 16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardText: {
    fontSize: getResponsiveSize(
      width * 0.038, 
      width * 0.042, 
      isTablet ? 16 : width * 0.045
    ),
    fontWeight: '600',
    color: '#2c2c2c',
    textAlign: 'center',
    marginTop: 4,
  },
  cardIcon: {
    marginBottom: 4,
  },
  topBar: {
    width: '100%',
    paddingVertical: getResponsiveSize(
      Platform.OS === 'ios' ? height * 0.015 : height * 0.02,
      Platform.OS === 'ios' ? height * 0.018 : height * 0.022,
      Platform.OS === 'ios' ? height * 0.02 : height * 0.025
    ),
    paddingHorizontal: getResponsiveSize(16, 20, 24),
    paddingTop: getResponsiveSize(
      Platform.OS === 'ios' ? 50 : 30,
      Platform.OS === 'ios' ? 55 : 35,
      Platform.OS === 'ios' ? 60 : 40
    ),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4B1E0F',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topBarTitle: {
    fontSize: getResponsiveSize(
      width * 0.045, 
      width * 0.05, 
      isTablet ? 22 : width * 0.052
    ),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  spacer: {
    width: getResponsiveSize(26, 28, 32),
  },
});

export default BuyerDashboard;