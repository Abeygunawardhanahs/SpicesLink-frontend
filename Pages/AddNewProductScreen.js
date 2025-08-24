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
  Image,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../Pages/ProductContext';

const AddNewProductScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { addProduct, products, loading, currentUser } = useProducts();

  useEffect(() => {
    console.log('=== ADD PRODUCT SCREEN ===');
    console.log('Current User:', currentUser);
  }, [currentUser]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access the media library is required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateForm = () => {
    if (!productName.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name');
      return false;
    }

    // check duplicates for same user
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
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newProduct = {
        name: productName.trim(),
        image: image || null,
        userId: currentUser._id,
      };
      await addProduct(newProduct);

      Alert.alert('Success', 'Product added successfully!', [
        {
          text: 'Add Another',
          onPress: () => {
            setProductName('');
            setImage(null);
          },
        },
        { text: 'View Products', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
      <LinearGradient colors={['#4E2A14', '#6B3820']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Picker (optional) */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Product Image (Optional)</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage} disabled={isLoading}>
            {image ? (
              <Image source={{ uri: image }} style={styles.productImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-a-photo" size={40} color="#8B7355" />
                <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Product Name */}
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
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.addButton, isLoading && styles.disabledButton]} onPress={handleAddProduct} disabled={isLoading}>
            <LinearGradient colors={isLoading ? ['#999', '#666'] : ['#4E2A14', '#6B3820']} style={styles.buttonGradient}>
              <View style={styles.buttonContent}>
                <MaterialIcons name={isLoading ? 'hourglass-empty' : 'add-circle'} size={20} color="#FFF" />
                <Text style={styles.buttonText}>{isLoading ? 'Adding...' : 'Add Product'}</Text>
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
  imageSection: { paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4E2A14', marginBottom: 15 },
  imageContainer: { alignItems: 'center' },
  productImage: { width: 150, height: 150, borderRadius: 12, backgroundColor: '#f0f0f0' },
  imagePlaceholder: { width: 150, height: 150, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  imagePlaceholderText: { color: '#8B7355', fontSize: 14, marginTop: 8 },
  formSection: { paddingVertical: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#4E2A14', marginBottom: 8 },
  input: { borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, backgroundColor: '#FEFEFE', color: '#2C2C2C' },
  buttonContainer: { paddingVertical: 30, paddingBottom: 50 },
  addButton: { borderRadius: 12, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 },
  disabledButton: { elevation: 2, shadowOpacity: 0.1 },
  buttonGradient: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginLeft: 8 },
});

export default AddNewProductScreen;
