// AddBankDetails.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const AddBankDetails = ({ navigation, route }) => {
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  const { supplierData } = route.params;

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOk = async () => {
    if (!bankName || !branchName || !accountName || !accountNumber) {
      Alert.alert('Error', 'Please fill in all bank details');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.101:5000/api/supplier/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...supplierData,
          bankDetails: {
            bankName,
            branchName,
            accountName,
            accountNumber
          }
        }),
      });

      if (response.ok) {
        navigation.navigate('SuccessPage');
      } else {
        Alert.alert('Error', 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <LinearGradient
      colors={['#cc9966', '#8B4513']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#5c3d2e" />
          </TouchableOpacity>
        </View>


        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Spices-Link</Text>
            <View style={styles.logoUnderline} />
          </View>
          <Text style={styles.welcomeText}>Bank Details</Text>
          <Text style={styles.subtitle}>Secure payment information</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            {/* Bank Information Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏦 Bank Information</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bank Name</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'bankName' && styles.inputContainerFocused
              ]}>
                <MaterialIcons name="account-balance" size={20} color="#cc9966" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Select your bank"
                  placeholderTextColor="#999"
                  value={bankName}
                  onChangeText={setBankName}
                  onFocus={() => setFocusedInput('bankName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Branch Name</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'branchName' && styles.inputContainerFocused
              ]}>
                <MaterialIcons name="location-on" size={20} color="#cc9966" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter branch name"
                  placeholderTextColor="#999"
                  value={branchName}
                  onChangeText={setBranchName}
                  onFocus={() => setFocusedInput('branchName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Account Information Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💳 Account Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Holder Name</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'accountName' && styles.inputContainerFocused
              ]}>
                <FontAwesome name="user" size={20} color="#cc9966" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name as per bank"
                  placeholderTextColor="#999"
                  value={accountName}
                  onChangeText={setAccountName}
                  onFocus={() => setFocusedInput('accountName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'accountNumber' && styles.inputContainerFocused
              ]}>
                <FontAwesome name="credit-card" size={20} color="#cc9966" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter account number"
                  placeholderTextColor="#999"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="numeric"
                  onFocus={() => setFocusedInput('accountNumber')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleOk}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#5c3d2e', '#4a2c20']}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmText}>Complete Registration</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
      container: {
      flex: 1,
      backgroundColor: '#cc9966',
      padding: 20,
    },
      scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
      headerSection: {
      alignItems: 'center',
      marginBottom: 30,
    },      
      logoContainer: {
      alignItems: 'center',
      marginBottom: 10,
      },
      logo: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#5c3d2e',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',            
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
    },      
      logoUnderline: {
      width: 100,
      height: 4,
      backgroundColor: '#4a2c20',
      borderRadius: 2,
      marginTop: 5,
      },
      welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#5c3d2e',
      marginBottom: 5,
    },
      subtitle: {
      fontSize: 16,
      color: '#4a2c20',
      marginBottom: 20,
      },
      formContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
      formCard: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,           
      },    
      sectionHeader: {
      marginBottom: 15,
    },
      sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
            
      color: '#5c3d2e',
      marginBottom: 5,
    },
      inputGroup: {
      marginBottom: 15,
    },
      inputLabel: {
      fontSize: 16,
      color: '#4a2c20', 
      marginBottom: 5,
    },
      inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,  
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: '#f9f9f9',
    },
      inputContainerFocused: {
      borderColor: '#5c3d2e',
      borderWidth: 1.5,
      backgroundColor: '#fff',
      },    
      inputIcon: {
      marginRight: 10,
    },                  
      input: {
      flex: 1,
      fontSize: 16,     
      color: '#333',
    },
      actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      },
      cancelButton: {

      backgroundColor: '#f0d4c3',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      marginRight: 10,
      },    
      cancelText: {
      color: '#4a2c20',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
      confirmButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      overflow: 'hidden',
    },            
      confirmButtonGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      },    
      confirmText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
});
export default AddBankDetails ;