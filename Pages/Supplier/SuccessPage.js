import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// SuccessPage.js
const SuccessPage = ({ navigation }) => {
  const handleContinue = () => {
    navigation.navigate('SupplierLogin');
  };

  return (
    <LinearGradient
      colors={['#cc9966', '#8B4513']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.successContainer}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <View style={styles.successRipple} />
          </View>
          
          <Text style={styles.successTitle}>Registration Successful!</Text>
          <Text style={styles.successMessage}>
            Welcome to Spices-Link family! Your supplier account has been created successfully.
          </Text>
          
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5c3d2e', '#4a2c20']}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueText}>Continue to Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,} ,
successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 350,
  },
  successIcon: {
    position: 'relative',
    marginBottom: 30,
  },
  checkmarkContainer: {
    backgroundColor: '#4CAF50',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  successRipple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    top: -20,
    left: -20,
  },
  checkmark: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5c3d2e',
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  continueButton: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default SuccessPage ;
      

