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
  Dimensions,
  SafeAreaView,
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
      const response = await fetch('http://localhost:5000/api/suppliers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, contactNumber, email, password }),
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={['#f39344ff', '#8B4513']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Floating orbs */}
          <View style={styles.floatingOrb1} />
          <View style={styles.floatingOrb2} />
          <View style={styles.floatingOrb3} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <View style={styles.backButtonInner}>
                  <MaterialIcons name="arrow-back" size={24} color="#5c3d2e" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Text style={styles.logo}>Spices</Text>
                  <Text style={styles.logoAccent}>Link</Text>
                </View>
                <View style={styles.modernUnderline} />
              </View>
              <Text style={styles.welcomeText}>Supplier Registration</Text>
              <Text style={styles.subtitle}>Join our premium spice marketplace</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.glassCard}>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View
                    style={[
                      styles.modernInputContainer,
                      focusedInput === 'fullName' && styles.inputContainerFocused,
                    ]}
                  >
                    <View style={styles.iconWrapper}>
                      <FontAwesome name="user" size={18} color="#cc9966" />
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Enter your full name"
                      placeholderTextColor="#64748B"
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => setFocusedInput('fullName')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Contact Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Contact Number</Text>
                  <View
                    style={[
                      styles.modernInputContainer,
                      focusedInput === 'contact' && styles.inputContainerFocused,
                    ]}
                  >
                    <View style={styles.iconWrapper}>
                      <FontAwesome name="phone" size={18} color="#cc9966" />
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Enter your contact number"
                      placeholderTextColor="#64748B"
                      value={contactNumber}
                      onChangeText={setContactNumber}
                      keyboardType="phone-pad"
                      onFocus={() => setFocusedInput('contact')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View
                    style={[
                      styles.modernInputContainer,
                      focusedInput === 'email' && styles.inputContainerFocused,
                    ]}
                  >
                    <View style={styles.iconWrapper}>
                      <FontAwesome name="envelope" size={18} color="#cc9966" />
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Enter your email address"
                      placeholderTextColor="#64748B"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View
                    style={[
                      styles.modernInputContainer,
                      focusedInput === 'password' && styles.inputContainerFocused,
                    ]}
                  >
                    <View style={styles.iconWrapper}>
                      <FontAwesome name="lock" size={18} color="#cc9966" />
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Create a strong password"
                      placeholderTextColor="#64748B"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIconModern}
                    >
                      <FontAwesome
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View
                    style={[
                      styles.modernInputContainer,
                      focusedInput === 'confirmPassword' && styles.inputContainerFocused,
                    ]}
                  >
                    <View style={styles.iconWrapper}>
                      <FontAwesome name="lock" size={18} color="#cc9966" />
                    </View>
                    <TextInput
                      style={styles.modernInput}
                      placeholder="Confirm your password"
                      placeholderTextColor="#64748B"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIconModern}
                    >
                      <FontAwesome
                        name={showConfirmPassword ? 'eye' : 'eye-slash'}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={styles.modernRegisterButton}
                  onPress={handleRegister}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#5c3d2e', '#4a2c20']}
                    style={styles.modernButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.modernRegisterText}>Create Account</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={20}
                      color="#FFFFFF"
                      style={styles.buttonArrow}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Bank Details */}
                <TouchableOpacity
                  style={styles.modernBankCard}
                  onPress={() =>
                    navigation.navigate('AddBankDetails', {
                      supplierData: { fullName, contactNumber, email, password },
                    })
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.bankCardContent}>
                    <View style={styles.bankIconContainer}>
                      <MaterialIcons name="account-balance" size={24} color="#87511bff" />
                    </View>
                    <View style={styles.bankTextContent}>
                      <Text style={styles.bankCardTitle}>Banking Details</Text>
                      <Text style={styles.bankCardSubtitle}>Set up payments • Optional</Text>
                    </View>
                    <View style={styles.chevronContainer}>
                      <FontAwesome name="chevron-right" size={14} color="#64748B" />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Login Section */}
                <View style={styles.modernLoginSection}>
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>
                  <View style={styles.loginPromptContainer}>
                    <Text style={styles.modernLoginPrompt}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SupplierLogin')}>
                      <Text style={styles.modernLoginLink}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Floating orbs
  floatingOrb1: {
    position: 'absolute',
    top: height * 0.1,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(92, 61, 46, 0.1)',
  },
  floatingOrb2: {
    position: 'absolute',
    top: height * 0.4,
    left: -60,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(204, 153, 102, 0.08)',
  },
  floatingOrb3: {
    position: 'absolute',
    bottom: height * 0.2,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 69, 19, 0.06)',
  },

  backButtonContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSection: {
    paddingHorizontal: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoWrapper: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: '800', color: '#5c3d2e' },
  logoAccent: { fontSize: 32, fontWeight: '800', color: '#f2ba1fff' },
  modernUnderline: { width: 40, height: 4, backgroundColor: '#cc9966', marginTop: 8 },
  welcomeText: { fontSize: 26, fontWeight: '700', color: '#5c3d2e', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#8B4513', textAlign: 'center' },

  formContainer: { flex: 1, paddingHorizontal: 20 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 20,
  },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#5c3d2e', marginBottom: 8 },
  modernInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: '#cc9966',
    backgroundColor: '#fff',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(204, 153, 102, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  modernInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  eyeIconModern: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  modernRegisterButton: { marginTop: 20, borderRadius: 16, overflow: 'hidden' },
  modernButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernRegisterText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  buttonArrow: { marginLeft: 8 },

  modernBankCard: {
    backgroundColor: 'rgba(204, 153, 102, 1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  bankCardContent: { flexDirection: 'row', alignItems: 'center' },
  bankIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 153, 102, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankTextContent: { flex: 1, marginLeft: 12 },
  bankCardTitle: { fontSize: 15, fontWeight: '600', color: '#5c3d2e' },
  bankCardSubtitle: { fontSize: 13, color: '#8B4513' },
  chevronContainer: { marginLeft: 8 },

  modernLoginSection: { marginTop: 12 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(204, 153, 102, 0.3)' },
  dividerText: { marginHorizontal: 10, color: '#8B4513' },
  loginPromptContainer: { flexDirection: 'row', justifyContent: 'center' },
  modernLoginPrompt: { color: '#8B4513' },
  modernLoginLink: { color: '#311806ff', fontWeight: '700', textDecorationLine: 'underline' },
});

export { SupplierRegistration };
