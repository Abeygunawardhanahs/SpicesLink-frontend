import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ReservationForm = ({ route, navigation }) => {
  const { priceData, productName, shopInfo } = route.params;
  
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    location: '',
    spiceName: productName || '',
    totalQuantity: '',
    qualityGrade: '',
    deliveryDate: '',
    paymentMethod: '',
    advancePayment: false,
    cashOnDelivery: false,
    accountNumber: '',
    bankName: '',
    branchHolderName: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      advancePayment: method === 'advance',
      cashOnDelivery: method === 'cod'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.totalQuantity.trim()) newErrors.totalQuantity = 'Quantity is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
    
    // Mobile number validation
    if (formData.mobileNo && !/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.mobileNo.trim())) {
      newErrors.mobileNo = 'Please enter a valid mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fix the errors in the form');
      return;
    }

    try {
      // Here you would send the data to your backend
      const reservationData = {
        ...formData,
        productName,
        shopInfo: shopInfo?.id || shopInfo,
        createdAt: new Date().toISOString()
      };

      // API call would go here
      // const response = await fetch('YOUR_API_ENDPOINT/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reservationData)
      // });

      Alert.alert(
        '✅ Reservation Submitted',
        `Your reservation for ${productName} has been sent successfully. You will be contacted soon.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PriceDetails', { priceData, productName, shopInfo })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit reservation. Please try again.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Continue Filling', style: 'cancel' },
        { 
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => navigation.navigate('PriceDetails', { priceData, productName, shopInfo })
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#8B4513', '#A0522D', '#CD853F']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Reservation Form</Text>
          <Text style={styles.headerSubtitle}>Fill in your details</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Bio Data Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={20} color="#8B4513" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <TextInput
                style={[styles.textInput, errors.mobileNo && styles.inputError]}
                value={formData.mobileNo}
                onChangeText={(value) => handleInputChange('mobileNo', value)}
                placeholder="Enter mobile number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
              {errors.mobileNo && <Text style={styles.errorText}>{errors.mobileNo}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location *</Text>
              <TextInput
                style={[styles.textInput, errors.location && styles.inputError]}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Enter your location"
                placeholderTextColor="#999"
              />
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>
          </View>

          {/* Spice Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="local-grocery-store" size={20} color="#8B4513" />
              <Text style={styles.sectionTitle}>Product Details</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product Name</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={formData.spiceName}
                editable={false}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Available Quantity (Kg) *</Text>
              <TextInput
                style={[styles.textInput, errors.totalQuantity && styles.inputError]}
                value={formData.totalQuantity}
                onChangeText={(value) => handleInputChange('totalQuantity', value)}
                placeholder="Enter quantity in Kg"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              {errors.totalQuantity && <Text style={styles.errorText}>{errors.totalQuantity}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quality / Grade</Text>
              <TextInput
                style={styles.textInput}
                value={formData.qualityGrade}
                onChangeText={(value) => handleInputChange('qualityGrade', value)}
                placeholder="Enter quality/grade (Optional)"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Reservation Terms Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="schedule" size={20} color="#8B4513" />
              <Text style={styles.sectionTitle}>Delivery & Payment</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Expected Delivery Date</Text>
              <TextInput
                style={styles.textInput}
                value={formData.deliveryDate}
                onChangeText={(value) => handleInputChange('deliveryDate', value)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#999"
              />
            </View>

            {/* Enhanced Payment Method Selection */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { marginBottom: 12 }]}>Payment Method *</Text>
              <View style={styles.paymentOptionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.paymentOption,
                    formData.paymentMethod === 'advance' && styles.paymentOptionSelected
                  ]}
                  onPress={() => handlePaymentMethodSelect('advance')}
                >
                  <MaterialIcons 
                    name={formData.paymentMethod === 'advance' ? "radio-button-checked" : "radio-button-unchecked"} 
                    size={20} 
                    color={formData.paymentMethod === 'advance' ? "#8B4513" : "#999"} 
                  />
                  <View style={styles.paymentOptionContent}>
                    <Text style={[
                      styles.paymentOptionTitle,
                      formData.paymentMethod === 'advance' && styles.paymentOptionTitleSelected
                    ]}>
                      Advance Payment
                    </Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Pay upfront for guaranteed delivery
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.paymentOption,
                    formData.paymentMethod === 'cod' && styles.paymentOptionSelected
                  ]}
                  onPress={() => handlePaymentMethodSelect('cod')}
                >
                  <MaterialIcons 
                    name={formData.paymentMethod === 'cod' ? "radio-button-checked" : "radio-button-unchecked"} 
                    size={20} 
                    color={formData.paymentMethod === 'cod' ? "#8B4513" : "#999"} 
                  />
                  <View style={styles.paymentOptionContent}>
                    <Text style={[
                      styles.paymentOptionTitle,
                      formData.paymentMethod === 'cod' && styles.paymentOptionTitleSelected
                    ]}>
                      Cash on Delivery
                    </Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Pay when you receive the product
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {errors.paymentMethod && <Text style={styles.errorText}>{errors.paymentMethod}</Text>}
            </View>
          </View>

          {/* Bank Details Section - Only show if advance payment is selected */}
          {formData.paymentMethod === 'advance' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="account-balance" size={20} color="#8B4513" />
                <Text style={styles.sectionTitle}>Bank Details</Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.accountNumber}
                  onChangeText={(value) => handleInputChange('accountNumber', value)}
                  placeholder="Enter account number"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.bankName}
                  onChangeText={(value) => handleInputChange('bankName', value)}
                  placeholder="Enter bank name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Holder Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.branchHolderName}
                  onChangeText={(value) => handleInputChange('branchHolderName', value)}
                  placeholder="Enter account holder name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          )}

          {/* Enhanced Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <MaterialIcons name="close" size={18} color="#8B4513" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <MaterialIcons name="check" size={18} color="#FFF" />
              <Text style={styles.submitButtonText}>Submit Reservation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#666',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  paymentOptionsContainer: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
  },
  paymentOptionSelected: {
    borderColor: '#8B4513',
    backgroundColor: '#FFF8DC',
  },
  paymentOptionContent: {
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  paymentOptionTitleSelected: {
    color: '#8B4513',
  },
  paymentOptionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingHorizontal: 4,
    gap: 16,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 1,
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  cancelButtonText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 1,
    elevation: 3,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default ReservationForm;