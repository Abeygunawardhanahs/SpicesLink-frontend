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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const AddBankDetails = ({ navigation, route }) => {
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const { userId } = route.params || {}; // ✅ get userId from navigation params

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    if (!bankName || !branchName || !accountName || !accountNumber) {
      Alert.alert('Error', 'Please fill in all bank details');
      return;
    }

    try {
      const response = await fetch(`http://192.168.0.101:5000/api/buyers/${userId}/bank-details`, {
        method: 'PUT', // ✅ use PUT instead of POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankName,
          branch: branchName, // ✅ match backend field
          accountName,
          accountNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Bank details saved successfully');
        navigation.navigate('SuccessPage');
      } else {
        Alert.alert('Error', data.message || 'Failed to save bank details');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <LinearGradient
      colors={['#fff8f0', '#f39344ff']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <View style={styles.backButtonContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={26} color="#4a2c20" />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.logo}>Spices-Link</Text>
            <View style={styles.logoUnderline} />
            <Text style={styles.title}>Bank Details</Text>
            <Text style={styles.subtitle}>Add your secure payment information</Text>
          </View>

          {/* Centered Form Container */}
          <View style={styles.centeredContainer}>
            <View style={styles.formCard}>
              {/* Bank Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'bankName' && styles.inputContainerFocused
                ]}>
                  <MaterialIcons name="account-balance" size={20} color="#8B5E3C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your bank"
                    placeholderTextColor="#aaa"
                    value={bankName}
                    onChangeText={setBankName}
                    onFocus={() => setFocusedInput('bankName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Branch */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Branch Name</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'branchName' && styles.inputContainerFocused
                ]}>
                  <MaterialIcons name="location-on" size={20} color="#8B5E3C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter branch"
                    placeholderTextColor="#aaa"
                    value={branchName}
                    onChangeText={setBranchName}
                    onFocus={() => setFocusedInput('branchName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Account Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Holder Name</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'accountName' && styles.inputContainerFocused
                ]}>
                  <FontAwesome name="user" size={20} color="#8B5E3C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full name as per bank"
                    placeholderTextColor="#aaa"
                    value={accountName}
                    onChangeText={setAccountName}
                    onFocus={() => setFocusedInput('accountName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Account Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'accountNumber' && styles.inputContainerFocused
                ]}>
                  <FontAwesome name="credit-card" size={20} color="#8B5E3C" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter account number"
                    placeholderTextColor="#aaa"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                    onFocus={() => setFocusedInput('accountNumber')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#8B5E3C', '#4A2C20']}
                    style={styles.submitGradient}
                  >
                    <Text style={styles.submitText}>Submit</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Keep content starting from top
  },
  backButtonContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 30,
    backgroundColor: '#f5e6d8',
    elevation: 3,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A2C20',
  },
  logoUnderline: {
    width: 100,
    height: 3,
    backgroundColor: '#8B5E3C',
    marginVertical: 6,
    borderRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A2C20',
  },
  subtitle: {
    fontSize: 14,
    color: '#5c3d2e',
    marginTop: 4,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A2C20',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  inputContainerFocused: {
    borderColor: '#8B5E3C',
    borderWidth: 1.5,
    backgroundColor: '#fff',
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1d5c6',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A2C20',
  },
  submitButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  submitGradient: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AddBankDetails;