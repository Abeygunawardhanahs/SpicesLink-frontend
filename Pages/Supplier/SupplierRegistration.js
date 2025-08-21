// SupplierRegistration.js
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

const { width, height } = Dimensions.get('window');

const SupplierRegistration = ({ navigation }) => {
      const [fullName, setFullName] = useState('');
      const [contactNumber, setContactNumber] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [focusedInput, setFocusedInput] = useState(null);
      
      // Password visibility states
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      const handleRegister = async () => {
            if (!fullName || !contactNumber || !email || !password || !confirmPassword) {
                  Alert.alert('Error', 'Please fill in all fields');
                  return;
            }

            if (password !== confirmPassword) {
                  Alert.alert('Error', 'Passwords do not match');
                  return;
            }

            try {
                  const response = await fetch('http://192.168.0.100:5000/api/suppliers/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullName, contactNumber, email, password })
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
            <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                  <LinearGradient
                        colors={['#cc9966', '#8B4513']}
                        style={styles.container}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                  >
                        <ScrollView
                              contentContainerStyle={styles.scrollContent}
                              showsVerticalScrollIndicator={false}
                        >
                              <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#5c3d2e" />
          </TouchableOpacity>
        </View>


                              {/* Header Section */}
                              <View style={styles.headerSection}>
                                    <View style={styles.logoContainer}>
                                          <Text style={styles.logo}>Spices-Link</Text>
                                          <View style={styles.logoUnderline} />
                                    </View>
                                    <Text style={styles.welcomeText}>Join as Supplier</Text>
                                    <Text style={styles.subtitle}>Let's help you create amazing experiences</Text>
                              </View>

                              {/* Form Section */}
                              <View style={styles.formContainer}>
                                    <View style={styles.formCard}>
                                          {/* Full Name Input */}
                                          <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Full Name</Text>
                                                <View style={[
                                                      styles.inputContainer,
                                                      focusedInput === 'fullName' && styles.inputContainerFocused
                                                ]}>
                                                      <FontAwesome name="user" size={20} color="#cc9966" style={styles.inputIcon} />
                                                      <TextInput
                                                            style={styles.input}
                                                            placeholder="Enter your full name"
                                                            placeholderTextColor="#999"
                                                            value={fullName}
                                                            onChangeText={setFullName}
                                                            onFocus={() => setFocusedInput('fullName')}
                                                            onBlur={() => setFocusedInput(null)}
                                                      />
                                                </View>
                                          </View>

                                          {/* Contact Number Input */}
                                          <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Contact Number</Text>
                                                <View style={[
                                                      styles.inputContainer,
                                                      focusedInput === 'contact' && styles.inputContainerFocused
                                                ]}>
                                                      <FontAwesome name="phone" size={20} color="#cc9966" style={styles.inputIcon} />
                                                      <TextInput
                                                            style={styles.input}
                                                            placeholder="Enter your contact number"
                                                            placeholderTextColor="#999"
                                                            value={contactNumber}
                                                            onChangeText={setContactNumber}
                                                            keyboardType="phone-pad"
                                                            onFocus={() => setFocusedInput('contact')}
                                                            onBlur={() => setFocusedInput(null)}
                                                      />
                                                </View>
                                          </View>

                                          {/* Email Input */}
                                          <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Email Address</Text>
                                                <View style={[
                                                      styles.inputContainer,
                                                      focusedInput === 'email' && styles.inputContainerFocused
                                                ]}>
                                                      <FontAwesome name="envelope" size={20} color="#cc9966" style={styles.inputIcon} />
                                                      <TextInput
                                                            style={styles.input}
                                                            placeholder="Enter your email address"
                                                            placeholderTextColor="#999"
                                                            value={email}
                                                            onChangeText={setEmail}
                                                            keyboardType="email-address"
                                                            autoCapitalize="none"
                                                            onFocus={() => setFocusedInput('email')}
                                                            onBlur={() => setFocusedInput(null)}
                                                      />
                                                </View>
                                          </View>

                                          {/* Password Input */}
                                          <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Password</Text>
                                                <View style={[
                                                      styles.inputContainer,
                                                      focusedInput === 'password' && styles.inputContainerFocused
                                                ]}>
                                                      <FontAwesome name="lock" size={20} color="#cc9966" style={styles.inputIcon} />
                                                      <TextInput
                                                            style={styles.input}
                                                            placeholder="Create a strong password"
                                                            placeholderTextColor="#999"
                                                            value={password}
                                                            onChangeText={setPassword}
                                                            secureTextEntry={!showPassword}
                                                            onFocus={() => setFocusedInput('password')}
                                                            onBlur={() => setFocusedInput(null)}
                                                      />
                                                      <TouchableOpacity
                                                            onPress={() => setShowPassword(!showPassword)}
                                                            style={styles.eyeIcon}
                                                      >
                                                            <FontAwesome 
                                                                  name={showPassword ? "eye" : "eye-slash"} 
                                                                  size={20} 
                                                                  color="#cc9966" 
                                                            />
                                                      </TouchableOpacity>
                                                </View>
                                          </View>

                                          {/* Confirm Password Input */}
                                          <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                                <View style={[
                                                      styles.inputContainer,
                                                      focusedInput === 'confirmPassword' && styles.inputContainerFocused
                                                ]}>
                                                      <FontAwesome name="lock" size={20} color="#cc9966" style={styles.inputIcon} />
                                                      <TextInput
                                                            style={styles.input}
                                                            placeholder="Confirm your password"
                                                            placeholderTextColor="#999"
                                                            value={confirmPassword}
                                                            onChangeText={setConfirmPassword}
                                                            secureTextEntry={!showConfirmPassword}
                                                            onFocus={() => setFocusedInput('confirmPassword')}
                                                            onBlur={() => setFocusedInput(null)}
                                                      />
                                                      <TouchableOpacity
                                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            style={styles.eyeIcon}
                                                      >
                                                            <FontAwesome 
                                                                  name={showConfirmPassword ? "eye" : "eye-slash"} 
                                                                  size={20} 
                                                                  color="#cc9966" 
                                                            />
                                                      </TouchableOpacity>
                                                </View>
                                          </View>

                                          {/* Register Button */}
                                          <TouchableOpacity
                                                style={styles.registerButton}
                                                onPress={handleRegister}
                                                activeOpacity={0.8}
                                          >
                                                <LinearGradient
                                                      colors={['#5c3d2e', '#4a2c20']}
                                                      style={styles.buttonGradient}
                                                      start={{ x: 0, y: 0 }}
                                                      end={{ x: 1, y: 0 }}
                                                >
                                                      <Text style={styles.registerText}>Register Now</Text>
                                                </LinearGradient>
                                          </TouchableOpacity>

                                          {/* Bank Details Button (Optional) */}
                                          <TouchableOpacity
                                                style={styles.bankDetailsButton}
                                                onPress={() => navigation.navigate('AddBankDetails', { supplierData: { fullName, contactNumber, email, password } })}
                                                activeOpacity={0.8}
                                          >
                                                <View style={styles.bankDetailsContent}>
                                                      <MaterialIcons name="account-balance" size={24} color="#cc9966" />
                                                      <View style={styles.bankDetailsText}>
                                                            <Text style={styles.bankDetailsTitle}>Add Bank Details</Text>
                                                            <Text style={styles.bankDetailsSubtitle}>Optional - Add later for payments</Text>
                                                      </View>
                                                      <FontAwesome name="chevron-right" size={16} color="#cc9966" />
                                                </View>
                                          </TouchableOpacity>
                                          <View style={styles.loginSection}>
                                                <Text style={styles.loginPrompt}>Already have an account?</Text>
                                                <TouchableOpacity onPress={() => navigation.navigate('SupplierLogin')}>
                                                      <Text style={styles.loginLink}>Sign In</Text>
                                                </TouchableOpacity>
                                          </View>
                                    </View>
                              </View>
                        </ScrollView>
                  </LinearGradient>
            </KeyboardAvoidingView>
      );
};

const styles = StyleSheet.create({
      container: {
            flex: 1,
      },
      scrollContent: {
            flexGrow: 1,
            paddingBottom: 20,
      },

      // Header Styles
      headerSection: {
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
            paddingBottom: 30,
            paddingHorizontal: 20,
            alignItems: 'center',
      },
      logoContainer: {
            alignItems: 'center',
            marginBottom: 20,
      },
      logo: {
            fontSize: 36,
            fontWeight: 'bold',
            color: '#5c3d2e',
            textShadowColor: 'rgba(255, 255, 255, 0.3)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
      },
      logoUnderline: {
            width: 60,
            height: 3,
            backgroundColor: '#5c3d2e',
            marginTop: 5,
            borderRadius: 2,
      },
      welcomeText: {
            fontSize: 24,
            fontWeight: '600',
            color: '#5c3d2e',
            marginBottom: 8,
      },
      subtitle: {
            fontSize: 16,
            color: '#5c3d2e',
            textAlign: 'center',
            opacity: 0.8,
      },

      // Form Styles
      formContainer: {
            flex: 1,
            paddingHorizontal: 20,
      },
      formCard: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 20,
            padding: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
      },
      inputGroup: {
            marginBottom: 20,
      },
      inputLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: '#5c3d2e',
            marginBottom: 8,
      },
      inputContainer: {
            backgroundColor: '#f8f8f8',
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
      },
      inputContainerFocused: {
            borderColor: '#cc9966',
            backgroundColor: '#fff',
      },
      inputIcon: {
            marginRight: 12,
      },
      input: {
            flex: 1,
            paddingVertical: 16,
            fontSize: 16,
            color: '#333',
      },
      eyeIcon: {
            padding: 5,
            marginLeft: 8,
      },

      // Button Styles
      registerButton: {
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 15,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
      },
      buttonGradient: {
            paddingVertical: 16,
            alignItems: 'center',
      },
      registerText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
      },

      // Login Section
      loginSection: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
      },
      loginPrompt: {
            color: '#666',
            fontSize: 16,
      },
      loginLink: {
            color: '#5c3d2e',
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 5,
      },

      // Bank Details Optional Button
      bankDetailsButton: {
            backgroundColor: 'rgba(204, 153, 102, 0.1)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#cc9966',
            padding: 16,
            marginBottom: 20,
      },
      bankDetailsContent: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      bankDetailsText: {
            flex: 1,
            marginLeft: 12,
      },
      bankDetailsTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#5c3d2e',
            marginBottom: 2,
      },
      bankDetailsSubtitle: {
            fontSize: 14,
            color: '#666',
      },
});

export { SupplierRegistration };