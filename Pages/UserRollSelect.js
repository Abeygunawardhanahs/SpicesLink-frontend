import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const UserRollSelect = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#ee800298', '#f39344ff']}
      style={styles.container} // Apply the container styles to LinearGradient
    >
      {/* Title */}
      <Text style={styles.title}>Spices-Link</Text>

      {/* Image */}
      <Image
        source={require('../assets/images/userRollPage.jpg')} // Add your spices image in the assets folder
        style={styles.image}
      />

      {/* Supplier Button */}
      <TouchableOpacity 
        style={styles.supplierButton} 
        onPress={() => navigation.navigate('Supplier')} // Replace with actual Supplier screen if needed
      >
        <Text style={styles.supplierText}>Supplier</Text>
      </TouchableOpacity>

      {/* Buyer Button */}
      <TouchableOpacity 
        style={styles.buyerButton} 
        onPress={() => navigation.navigate('Registration')} // Navigate to Registration
      >
        <Text style={styles.buyerText}>Buyer</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5c3d2e', // Dark brown text
    marginBottom: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0.01,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 50,
  },
  supplierButton: {
    backgroundColor: '#4a2c20', // Dark brown
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 25,
    width: '80%',
    alignItems: 'center',
  },
  supplierText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyerButton: {
    backgroundColor: '#f0d4c3', // Light brown
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  buyerText: {
    color: '#4a2c20', // Dark brown
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserRollSelect;