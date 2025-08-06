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
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Spices');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { addProduct, loading, currentUser, authToken } = useProducts();

  // Debug current user data
  useEffect(() => {
    console.log('=== ADD PRODUCT SCREEN DEBUG ===');
    console.log('Current User:', currentUser);
    console.log('Auth Token:', authToken ? 'Present' : 'Missing');
    console.log('User ID:', currentUser?._id);
    console.log('User Object Keys:', currentUser ? Object.keys(currentUser) : 'No user');
  }, [currentUser, authToken]);

  const categories = ['Spices', 'Herbs', 'Seeds', 'Powders', 'Whole Spices', 'Blends', 'Other'];

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
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateForm = () => {
    if (!productName.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name');
      return false;
    }

    if (price && isNaN(parseFloat(price))) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return false;
    }

    // Check if user is logged in
    if (!currentUser) {
      Alert.alert('Authentication Error', 'You must be logged in to add products');
      return false;
    }

    if (!currentUser._id && !currentUser.id) {
      Alert.alert('Authentication Error', 'User ID is missing. Please log in again.');
      return false;
    }

    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Get user ID - try both _id and id fields
    const userId = currentUser._id || currentUser.id;
    
    console.log('=== SUBMITTING PRODUCT ===');
    console.log('User ID being sent:', userId);
    console.log('Current User:', currentUser);

    const newProduct = {
      name: productName.trim(),
      description: description.trim(),
      price: price.trim() || '0',
      category,
      image: image || null,
      userId: userId, // Make sure this is included
    };

    console.log('Submitting product:', newProduct);

    try {
      const response = await addProduct(newProduct);
      console.log('Product added successfully:', response.data);
      
      Alert.alert('Success', 'Product added successfully!', [
        {
          text: 'Add Another',
          onPress: () => {
            setProductName('');
            setDescription('');
            setPrice('');
            setCategory('Spices');
            setImage(null);
          },
        },
        { 
          text: 'View Products', 
          onPress: () => navigation.goBack() 
        },
      ]);
    } catch (error) {
      console.error('Error adding product:', error);
      
      let errorMessage = 'Failed to add product. Please try again.';
      
      if (error.message.includes('User ID is required')) {
        errorMessage = 'Authentication error. Please logout and login again.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid product data. Please check all fields.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormLoading = isLoading || loading;

  // Show authentication error if no user
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={60} color="#E74C3C" />
          <Text style={styles.errorText}>You must be logged in to add products</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
      <LinearGradient colors={['#4E2A14', '#6B3820', '#8B4513']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Debug info (remove in production) */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>User: {currentUser?.shopName || currentUser?.name || 'Unknown'}</Text>
          <Text style={styles.debugText}>ID: {currentUser?._id || currentUser?.id || 'Missing'}</Text>
        </View>

        {/* Image Picker */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Product Image</Text>
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={pickImage}
            disabled={isFormLoading}
          >
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

        {/* Product Form */}
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
              editable={!isFormLoading}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#B8A082"
              editable={!isFormLoading}
              maxLength={500}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1200.00"
              value={price}
              onChangeText={setPrice}
              placeholderTextColor="#B8A082"
              keyboardType="numeric"
              editable={!isFormLoading}
            />
          </View>

          {/* Categories */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.selectedCategory,
                    ]}
                    onPress={() => setCategory(cat)}
                    disabled={isFormLoading}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat && styles.selectedCategoryText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.disabledButton]}
            onPress={handleAddProduct}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#999', '#666'] : ['#4E2A14', '#6B3820']}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons
                  name={isLoading ? 'hourglass-empty' : 'add-circle'}
                  size={20}
                  color="#FFF"
                />
                <Text style={styles.buttonText}>
                  {isLoading ? 'Adding...' : 'Add Product'}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: '#4E2A14',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: { width: 40 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  imageSection: { paddingVertical: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E2A14',
    marginBottom: 15,
  },
  imageContainer: { alignItems: 'center' },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#8B7355',
    fontSize: 14,
    marginTop: 8,
  },
  formSection: { paddingVertical: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E2A14',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FEFEFE',
    color: '#2C2C2C',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryContainer: { flexDirection: 'row', paddingVertical: 5 },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategory: {
    backgroundColor: '#4E2A14',
    borderColor: '#4E2A14',
  },
  categoryText: {
    color: '#8B7355',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: { color: '#FFF' },
  buttonContainer: { paddingVertical: 30, paddingBottom: 50 },
  addButton: {
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: { elevation: 2, shadowOpacity: 0.1 },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default AddNewProductScreen;