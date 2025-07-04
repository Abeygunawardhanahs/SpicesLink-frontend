import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://192.168.0.100:5000/api/users/register/buyer';

const FIELDS = [
  { name: 'shopName', icon: 'storefront', iconType: 'material', placeholder: 'Enter your shop name', label: 'Shop Name' },
  { name: 'shopOwnerName', icon: 'person', iconType: 'material', placeholder: 'Enter your full name', label: 'Owner Name' },
  { name: 'shopLocation', icon: 'location-on', iconType: 'material', placeholder: 'Enter your shop location', label: 'Shop Location' },
  { name: 'contactNumber', icon: 'phone', iconType: 'material', placeholder: 'Enter your contact number', label: 'Contact Number' },
  { name: 'products', icon: 'inventory', iconType: 'material', placeholder: 'Enter product names, one per line', label: 'Products', multiline: true },
  { name: 'emailAddress', icon: 'email', iconType: 'material', placeholder: 'Enter your email address', label: 'Email Address' },
  { name: 'password', icon: 'lock', iconType: 'material', placeholder: 'Enter your password', label: 'Password', secure: true },
  { name: 'confirmPassword', icon: 'lock-outline', iconType: 'material', placeholder: 'Confirm your password', label: 'Confirm Password', secure: true }
];

const validationSchema = Yup.object().shape({
  shopName: Yup.string().min(2, 'Too short').required('Shop name is required'),
  shopOwnerName: Yup.string().min(2, 'Too short').required('Owner name is required'),
  shopLocation: Yup.string().min(3, 'Too short').required('Shop location is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Only numbers allowed')
    .min(10, 'Must be at least 10 digits')
    .required('Contact number is required'),
  products: Yup.string()
    .test('is-not-empty', 'At least one product must be entered', (value) => value && value.trim().length > 0)
    .required('Products are required'),
  emailAddress: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const FloatingLabelInput = ({ 
  label, 
  icon, 
  iconType, 
  value, 
  onChangeText, 
  onBlur, 
  error, 
  touched, 
  secure, 
  multiline, 
  placeholder 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedIsFocused, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
    if (value === '') {
      Animated.timing(animatedIsFocused, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: 50,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#8B7355', '#D4A574'],
    }),
    backgroundColor: 'white',
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const IconComponent = iconType === 'material' ? MaterialIcons : Icon;

  return (
    <View style={styles.inputWrapper}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>
      <View style={[
        styles.modernInputContainer,
        isFocused && styles.focusedInput,
        error && touched && styles.errorInput
      ]}>
        <IconComponent 
          name={icon} 
          size={22} 
          color={isFocused ? '#D4A574' : '#8B7355'} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={[styles.modernInput, multiline && styles.multilineInput]}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor="#B8A082"
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          secureTextEntry={secure && !showPassword}
          autoCorrect={false}
          autoComplete="off"
          autoCapitalize="words"
          textContentType="none"
          multiline={multiline || false}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={22}
              color="#8B7355"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && touched && (
        <Animated.View style={styles.errorContainer}>
          <MaterialIcons name="error" size={16} color="#E74C3C" />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const RegistrationScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: values.shopName,
          shopOwnerName: values.shopOwnerName,
          shopLocation: values.shopLocation,
          contactNumber: values.contactNumber,
          products: values.products,
          emailAddress: values.emailAddress,
          password: values.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success! 🎉',
          'Your account has been created successfully. Welcome to SpicesLink!',
          [
            {
              text: 'Continue',
              onPress: () => {
                resetForm();
                navigation.navigate('BuyerLogin');
              }
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4E2A14', '#6B3820', '#8B4513']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.headerRight}>
          <MaterialIcons name="account-circle" size={24} color="#FFF" />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={false}
        overScrollMode="always"
        scrollEventThrottle={16}
      >
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#D4A574', '#B8860B', '#DAA520']}
              style={styles.logoCircle}
            >
              <MaterialIcons name="store" size={40} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>SpicesLink</Text>
          <Text style={styles.subtitle}>Join our marketplace and connect with spice lovers worldwide</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Formik
            initialValues={FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContent}>
                {FIELDS.map((field) => (
                  <FloatingLabelInput
                    key={field.name}
                    label={field.label}
                    icon={field.icon}
                    iconType={field.iconType}
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChangeText={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    error={errors[field.name]}
                    touched={touched[field.name]}
                    secure={field.secure}
                    multiline={field.multiline}
                  />
                ))}

                <TouchableOpacity 
                  style={[styles.registerButton, isLoading && styles.disabledButton]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={isLoading ? ['#999', '#666'] : ['#4E2A14', '#6B3820', '#8B4513']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <MaterialIcons name="hourglass-empty" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Creating Account...</Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Create Account</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.loginSection}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("BuyerLogin")}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  scrollView: {
    // flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // paddingBottom: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 20, // Adjust as needed
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4E2A14',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
  formContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  formContent: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
    width: '100%',
  },
  modernInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#FEFEFE',
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    minHeight: 56,
  },
  focusedInput: {
    borderColor: '#D4A574',
    backgroundColor: '#FFF',
    elevation: 4,
    shadowOpacity: 0.15,
  },
  errorInput: {
    borderColor: '#E74C3C',
  },
  inputIcon: {
    marginRight: 12,
  },
  modernInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
    paddingVertical: 8,
    minHeight: 40,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  passwordToggle: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 15,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 20,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  disabledButton: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    paddingVertical: 15,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 16,
    color: '#8B7355',
  },
  loginLink: {
    fontSize: 16,
    color: '#D4A574',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;