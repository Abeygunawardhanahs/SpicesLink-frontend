// AddNewProductScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../Pages/ProductContext';

const AddNewProductScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  const { addProduct, products, currentUser } = useProducts();

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchUserDetails();
    } else {
      setFetchingUser(false);
    }
  }, [currentUser]);

  const fetchUserDetails = async () => {
    if (!currentUser || !currentUser._id) return;

    try {
      setFetchingUser(true);
      const response = await fetch(`http://localhost:5000/api/buyers/${currentUser._id}`);
      const data = await response.json();

      if (data.success) {
        setUserDetails(data.data.buyer || null);
      } else {
        console.error('Failed to fetch user details:', data.message);
        Alert.alert('Error', 'Failed to load your profile information.');
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Could not connect to server. Please check your connection.');
      setUserDetails(null);
    } finally {
      setFetchingUser(false);
    }
  };

  const validateForm = () => {
    if (!productName.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name');
      return false;
    }

    const duplicate = products.some(
      (p) => p.name.toLowerCase() === productName.trim().toLowerCase()
    );
    if (duplicate) {
      Alert.alert('Duplicate Product', 'This product already exists in your list.');
      return false;
    }

    if (!currentUser) {
      Alert.alert('Authentication Error', 'You must be logged in to add products');
      return false;
    }

    if (!userDetails || !userDetails.shopName || !userDetails.shopLocation) {
      Alert.alert('Profile Incomplete', 'Please complete your profile before adding products.');
      return false;
    }

    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newProduct = {
        name: productName.trim(),
        userId: currentUser._id,
        userName: userDetails.shopOwnerName,
        shopName: userDetails.shopName,
        location: userDetails.shopLocation,
        userType: userDetails.userType || 'Buyer',
      };

      console.log('Sending product data:', newProduct);
      await addProduct(newProduct);

      Alert.alert('Success', 'Product added successfully!', [
        {
          text: 'Add Another',
          onPress: () => setProductName(''),
        },
        { text: 'View Products', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Add product error:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />

      <LinearGradient colors={['#4E2A14', '#6B3820']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Product Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor="#B8A082"
              editable={!isLoading}
              maxLength={100}
            />
          </View>

          <View style={styles.userInfoSection}>
            <Text style={styles.userInfoTitle}>Your Information</Text>

            {fetchingUser ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4E2A14" />
                <Text style={styles.loadingText}>Loading your information...</Text>
              </View>
            ) : userDetails ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Shop Name:</Text>
                  <Text style={styles.infoValue}>{userDetails.shopName || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoValue}>{userDetails.shopLocation || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Owner Name:</Text>
                  <Text style={styles.infoValue}>{userDetails.shopOwnerName || 'Not set'}</Text>
                </View>
                {(!userDetails.shopName || !userDetails.shopLocation) && (
                  <View style={styles.warningBox}>
                    <MaterialIcons name="warning" size={16} color="#FFA000" />
                    <Text style={styles.warningText}>
                      Please complete your profile information before adding products.
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color="#D32F2F" />
                <Text style={styles.errorText}>Could not load your information.</Text>
                <TouchableOpacity onPress={fetchUserDetails} style={styles.retryButton}>
                  <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              isLoading && styles.disabledButton,
              (!userDetails || !userDetails.shopName || !userDetails.shopLocation) && styles.disabledButton,
            ]}
            onPress={handleAddProduct}
            disabled={isLoading || !userDetails || !userDetails.shopName || !userDetails.shopLocation}
          >
            <LinearGradient
              colors={
                isLoading || !userDetails || !userDetails.shopName || !userDetails.shopLocation
                  ? ['#999', '#666']
                  : ['#4E2A14', '#6B3820']
              }
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name={isLoading ? 'hourglass-empty' : 'add-circle'} size={20} color="#FFF" />
                <Text style={styles.buttonText}>
                  {isLoading
                    ? 'Adding...'
                    : !userDetails || !userDetails.shopName || !userDetails.shopLocation
                    ? 'Complete Profile First'
                    : 'Add Product'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFEFE' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'ios' ? 50 : 15 },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  headerRight: { width: 40 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  formSection: { paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4E2A14', marginBottom: 15 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#4E2A14', marginBottom: 8 },
  input: { borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, backgroundColor: '#FEFEFE', color: '#2C2C2C' },
  userInfoSection: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: '#E8E8E8' },
  userInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#4E2A14', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#4E2A14', fontWeight: 'bold', flex: 1, textAlign: 'right' },
  loadingContainer: { alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },
  errorContainer: { alignItems: 'center', padding: 10 },
  errorText: { marginTop: 8, color: '#D32F2F', fontSize: 14, textAlign: 'center' },
  retryButton: { marginTop: 10, padding: 8, backgroundColor: '#4E2A14', borderRadius: 6 },
  retryText: { color: 'white', fontSize: 14 },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', padding: 12, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#FFECB3' },
  warningText: { color: '#FFA000', fontSize: 12, marginLeft: 8, flex: 1 },
  buttonContainer: { paddingVertical: 30, paddingBottom: 50 },
  addButton: { borderRadius: 12, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 },
  disabledButton: { elevation: 2, shadowOpacity: 0.1 },
  buttonGradient: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginLeft: 8 },
});

export default AddNewProductScreen;
