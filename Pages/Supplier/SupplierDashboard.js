import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SupplierDashboard = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/download.jpg')} // Make sure to add a background image in your assets folder
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <MaterialIcons name="notifications" size={28} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              {/* <MaterialIcons name="menu" size={28} color="#fff" style={...styles.icon, marginRight:0} /> */}
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Products')} // Navigate to Products screen
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5c3d2e', '#4a2c20']}
              style={styles.buttonGradient}
            >
              <FontAwesome name="dropbox" size={50} color="#cc9966" />
              <Text style={styles.menuButtonText}>Products</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Shops')} // Navigate to Shops screen
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5c3d2e', '#4a2c20']}
              style={styles.buttonGradient}
            >
              <FontAwesome name="building" size={50} color="#cc9966" />
              <Text style={styles.menuButtonText}>Shops</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('MyProfile')} // Navigate to My Profile screen
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5c3d2e', '#4a2c20']}
              style={styles.buttonGradient}
            >
              <FontAwesome name="user" size={50} color="#cc9966" />
              <Text style={styles.menuButtonText}>My Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: width * 0.8,
    height: height * 0.2,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
});

export default SupplierDashboard;