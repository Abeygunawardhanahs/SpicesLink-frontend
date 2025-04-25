import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const BuyerLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
         source={require("../assets/images/BuyerLogin.jpg")} // Add your background image to assets folder
         style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Spices-Link</Text>
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
            Sign in
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.9)",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
  },
  subtitle: {
    fontSize: 14,
    marginVertical: 10,
    color: "#5a3e2b",
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
