// RegistrationScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Animated, KeyboardAvoidingView,
  Platform, StatusBar, ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
// import { useProducts } from '../../ProductContext'; // Removed product context usage

// --- API Configuration ---
const API_URL = 'http://192.168.0.101:5000/api/users/register/buyer';

// --- UPDATED: Fields to be rendered with FloatingLabelInput ---
const TEXT_INPUT_FIELDS = [
  { name: 'shopName', icon: 'storefront', iconType: 'material', placeholder: 'e.g., Green Spices Mart', label: 'Shop Name', autoCapitalize: 'words' },
  { name: 'shopOwnerName', icon: 'person', iconType: 'material', placeholder: 'e.g., John Perera', label: 'Owner Name', autoCapitalize: 'words' },
  { name: 'shopLocation', icon: 'map', iconType: 'material', placeholder: 'e.g., 123 Main St, Colombo', label: 'Shop Address', autoCapitalize: 'words' },
  { name: 'contactNumber', icon: 'phone', iconType: 'material', placeholder: 'e.g., 0771234567', label: 'Contact Number', keyboardType: 'phone-pad' },
  { name: 'emailAddress', icon: 'email', iconType: 'material', placeholder: 'e.g., you@example.com', label: 'Email Address', keyboardType: 'email-address' },
  { name: 'password', icon: 'lock', iconType: 'material', placeholder: 'Your secure password', label: 'Password', secure: true },
  { name: 'confirmPassword', icon: 'lock-outline', iconType: 'material', placeholder: 'Confirm your password', label: 'Confirm Password', secure: true }
];

// --- UPDATED: Validation Schema ---
const validationSchema = Yup.object().shape({
  shopName: Yup.string().required('Shop name is required'),
  shopOwnerName: Yup.string().required('Owner name is required'),
  shopLocation: Yup.string().required('Shop address is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be at least 10 digits')
    .required('Contact number is required'),
  // Removed products validation
  emailAddress: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include uppercase, lowercase, and a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

// --- FloatingLabelInput Component ---
const FloatingLabelInput = ({ label, icon, iconType, value, onChangeText, onBlur, error, touched, secure, placeholder, keyboardType, autoCapitalize }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, { toValue: isFocused || value !== '' ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [isFocused, value]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => { setIsFocused(false); onBlur(); };

  const labelStyle = {
    position: 'absolute',
    left: 50,
    top: animatedIsFocused.interpolate({ inputRange: [0, 1], outputRange: [18, -10] }),
    fontSize: animatedIsFocused.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
    color: animatedIsFocused.interpolate({ inputRange: [0, 1], outputRange: ['#A0522D', '#CD853F'] }),
    backgroundColor: '#FFF',
    paddingHorizontal: 4,
    zIndex: 1
  };
  const IconComponent = MaterialIcons;

  return (
    <View style={styles.inputWrapper}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View style={[styles.inputContainer, isFocused && styles.focusedInput, error && touched && styles.errorInput]}>
        <IconComponent name={icon} size={22} color={isFocused ? '#CD853F' : '#A0522D'} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor="#D2B48C"
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          secureTextEntry={secure && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#A0522D" />
          </TouchableOpacity>
        )}
      </View>
      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// --- RegistrationScreen Component ---
const RegistrationScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isLoading, setIsLoading] = useState(false);
  // Removed product context
  // const { initializeProductsFromRegistration, setUser } = useProducts();
  const setUser = () => {}; // Placeholder to avoid errors if setUser called

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async (values, { resetForm }) => {
    setIsLoading(true);

    // Format data for the backend
    const submissionData = {
      shopName: values.shopName.trim(),
      shopOwnerName: values.shopOwnerName.trim(),
      contactNumber: values.contactNumber.trim(),
      emailAddress: values.emailAddress.trim(),
      password: values.password,
      shopLocation: values.shopLocation.trim(),
      // Removed products field
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();

      if (response.ok) {
        const userId = data.userId || Date.now().toString();

        setUser({
          id: userId,
          shopName: values.shopName,
          shopOwnerName: values.shopOwnerName,
          emailAddress: values.emailAddress,
        });

        // Removed product initialization call

        if (Platform.OS === 'web') {
          alert('Registration Successful! You will now be taken to the sign-in page.');
          resetForm();
          navigation.navigate('BuyerLogin');
        } else {
          Alert.alert(
            'Registration Successful!',
            'Your account has been created. Please proceed to sign in.',
            [{ text: 'Continue to Sign In', onPress: () => { resetForm(); navigation.navigate('BuyerLogin'); } }]
          );
        }
      } else {
        Alert.alert('Registration Failed', data.message || 'An unknown error occurred. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor="#6B4F4B" barStyle="light-content" />
      <LinearGradient colors={['#FDFCFB', '#F5EFE6']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#4A3731" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create an Account</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Formik
              initialValues={{
                shopName: '',
                shopOwnerName: '',
                contactNumber: '',
                emailAddress: '',
                password: '',
                confirmPassword: '',
                shopLocation: '',
                // Removed products initial value
              }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  {TEXT_INPUT_FIELDS.map(field => (
                    <FloatingLabelInput
                      key={field.name}
                      {...field}
                      value={values[field.name]}
                      onChangeText={handleChange(field.name)}
                      onBlur={handleBlur(field.name)}
                      error={errors[field.name]}
                      touched={touched[field.name]}
                    />
                  ))}

                  <TouchableOpacity style={styles.registerButton} onPress={handleSubmit} disabled={isLoading}>
                    <LinearGradient colors={['#D2691E', '#A0522D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Create Account</Text>
                          <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('BuyerLogin')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

// --- Styles (removed product-related styles) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingBottom: 15
  },
  backButton: { padding: 10 },
  headerTitle: { flex: 1, color: '#4A3731', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  headerRight: { width: 42 },
  formContainer: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 30 },
  inputWrapper: { marginBottom: 28 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 58,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#D2B48C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  focusedInput: { borderColor: '#CD853F', elevation: 6, shadowColor: '#CD853F' },
  errorInput: { borderColor: '#D32F2F', elevation: 6, shadowColor: '#D32F2F' },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  passwordToggle: { padding: 5 },
  errorText: { color: '#D32F2F', fontSize: 12, fontWeight: '600', marginTop: 6, marginLeft: 5 },
  registerButton: {
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#A0522D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10
  },
  buttonGradient: { paddingVertical: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#EAEAEA' },
  footerText: { fontSize: 15, color: '#666' },
  loginLink: { color: '#D2691E', fontWeight: 'bold', fontSize: 15 },
});

export default RegistrationScreen;
