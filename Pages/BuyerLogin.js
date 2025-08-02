import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  Dimensions, Animated, KeyboardAvoidingView, Platform,
  StatusBar, Alert, ActivityIndicator, ScrollView
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const BuyerLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animation setup
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // 1. Check if fields are empty before sending to server
    if (!email || !password) {
      Alert.alert('Incomplete Fields', 'Please enter both your email and password.');
      return; // Stop the function here
    }

    setIsLoading(true); // Show loading indicator on button

    try {
      // 2. Send login details to the server
      const response = await fetch('http://192.168.0.100:5000/api/users/login/buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      // 3. CHECK THE SERVER RESPONSE
      if (response.ok && data.success) {
        // --- SUCCESS CASE ---
        // If login is successful, store user data
        await AsyncStorage.setItem('userToken', data.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));

        // Show a success message and then NAVIGATE to the dashboard
        Alert.alert('Login Successful!', 'Welcome back.', [
          { text: 'Continue', onPress: () => navigation.navigate('BuyerDashboard') }
        ]);

      } else {
        // --- FAILURE CASE ---
        // If login fails (wrong password, user not found, etc.), show an error alert
        // The user WILL NOT be navigated anywhere. They stay on the login screen.
        Alert.alert('Login Failed', data.message || 'Invalid email or password.');
      }
    } catch (error) {
      // --- NETWORK ERROR CASE ---
      // If the phone can't connect to the server, show a network error.
      // The user WILL NOT be navigated anywhere.
      console.error('Login error:', error);
      Alert.alert('Network Error', 'Please check your connection and try again.');
    } finally {
      // 4. Stop the loading indicator regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar backgroundColor="#4B1E0F" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/BuyerLogin.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.formContainer, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your details to log in</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={22} color="#8B4513" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email Address"
              placeholderTextColor="#A0522D"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={22} color="#8B4513" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Password"
              placeholderTextColor="#A0522D"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* This button triggers the handleLogin function which contains all the logic */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <Text style={styles.buttonText}>Log In</Text>
            }
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            {/* --- SIGN UP NAVIGATION --- */}
            {/* This button navigates the user directly to the Registration screen */}
            <TouchableOpacity onPress={() => navigation.navigate("RegistrationScreen")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0", // A light cream background to complement the theme
  },
  imageContainer: {
    width: width,
    height: 280, // Increased height for more impact
    backgroundColor: '#4B1E0F',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better text contrast
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 50,
    left: 15,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 25,
    paddingTop: 30,
    marginTop: -40, // Pulls the form up over the image
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B1E0F", // Darker brown from your palette
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#5a3e2b", // Softer brown
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    width: "100%",
    height: 55,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F5DEB3",
    elevation: 2,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#5a3e2b",
  },
  loginButton: {
    backgroundColor: "#4B1E0F",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    elevation: 3,
    shadowColor: '#4B1E0F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    paddingBottom: 20,
  },
  signUpText: {
    fontSize: 15,
    color: "#5a3e2b",
  },
  signUpLink: {
    fontWeight: "bold",
    color: "#8B4513",
    fontSize: 15,
  },
});

export default BuyerLogin;