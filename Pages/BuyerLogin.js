import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const BuyerLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const response = await fetch('http://192.168.1.100:5000/api/users/login/buyer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token and user data
      await AsyncStorage.setItem('userToken', data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
      
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('BuyerDashboard');
    } else {
      Alert.alert('Error', data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Error', 'Network error. Please try again.');
  }
};

// Replace your login button onPress:
<TouchableOpacity
  style={styles.button}
  onPress={handleLogin} // Changed from navigation.navigate
>
  <Text style={styles.buttonText}>Log in</Text>
</TouchableOpacity>

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Buyer Login</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for balancing */}
      </View>

      {/* Image */}
      <Image
        source={require("../assets/images/BuyerLogin.jpg")}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Login Form */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your email and password</Text>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#8B4513" />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email Address"
            placeholderTextColor="#8B4513"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#8B4513" />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            placeholderTextColor="#8B4513"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BuyerDashboard')}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate("Registration")}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 60,
    backgroundColor: "#4B1E0F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#8B4513",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color:"white",
  },
  image: {
    width: width,
    height: 200,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // slight shadow for Android
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginVertical: 10,
    color: "#5a3e2b",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8B4513",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginVertical: 8,
    backgroundColor: "#F5DEB3",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#5a3e2b",
  },
  button: {
    backgroundColor: "#4B1E0F",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 10,
    color: "#5a3e2b",
  },
  signUpLink: {
    fontWeight: "bold",
    color: "#8B4513",
  },
});

export default BuyerLogin;
