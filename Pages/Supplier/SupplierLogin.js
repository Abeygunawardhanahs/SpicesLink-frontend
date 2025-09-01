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
// SupplierLogin.js
const SupplierLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/suppliers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        navigation.navigate('SupplierDashboard', { supplier: data });
      } else {
        Alert.alert('Error', 'Invalid credentials');
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
          <Text style={styles.welcomeText}>Supplier Login</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in to continue</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
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

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'password' && styles.inputContainerFocused
              ]}>
                <FontAwesome name="lock" size={20} color="#cc9966" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5c3d2e', '#4a2c20']}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginSection}>
              <Text style={styles.loginPrompt}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SupplierRegistration')}>
                <Text style={styles.loginLink}>Sign Up</Text>
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
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  headerSection: {
      alignItems: 'center',
      marginBottom: 40,
  },
  logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
  },
  logo: {         
      fontSize: 36,
      fontWeight: 'bold',
      color: '#5c3d2e',
  },  
      logoUnderline: {
      width: 100,
      height: 4,
      backgroundColor: '#cc9966',         
      marginTop: 10,
      borderRadius: 2,
      },
      welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#5c3d2e',
      marginBottom: 10,
            
      },    
      subtitle: {
      fontSize: 16,
      color: '#4a2c20',
      textAlign: 'center',
      marginBottom: 20,
      },
  formContainer: {
    width: '100%',
      maxWidth: 400,
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
  },
      formCard: {
      marginBottom: 20,
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 20,
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
      color: '#4a2c20',
      marginBottom: 5,
      },
      inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#cc9966',
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 50,
      backgroundColor: 'white',
  },
      inputContainerFocused: {
      borderColor: '#5c3d2e',
      borderWidth: 2,
  },
      inputIcon: {
      marginRight: 10,
  },
  input: {  
      flex: 1,
      fontSize: 16,
      color: '#4a2c20',
      paddingVertical: 0,
      paddingHorizontal: 5,
  },
      loginButton: {
      marginTop: 20,
      borderRadius: 10,
      overflow: 'hidden',
      },
      buttonGradient: {
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 10, 
      },
      loginButtonText: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
      },
      loginSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      },
      loginPrompt: {
      fontSize: 16,
      color: '#4a2c20',
      marginRight: 5,
      },    
      loginLink: {
      fontSize: 16,
      color: '#5c3d2e',
      fontWeight: 'bold',
      },
});
export default SupplierLogin ;