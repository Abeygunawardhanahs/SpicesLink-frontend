// AddNewProductScreen.js
import React, { useState } from 'react';
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

  const { addProduct } = useProducts();

  const categories = ['Spices', 'Herbs', 'Seeds', 'Powders', 'Whole Spices', 'Blends', 'Other'];

  const pickImage = async () => {
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

const handleAddProduct = async () => {
  if (!productName.trim()) {
    Alert.alert('Error', 'Please enter a product name');
    return;
  }

  setIsLoading(true);

  const newProduct = {
    name: productName.trim(),
    description: description.trim(),
    price: price.trim(),
    category,
    image: image ? { uri: image } : null,
  };

  try {
    await addProduct(newProduct);
    Alert.alert('Success 🎉', 'Product added successfully!', [
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
      { text: 'View Products', onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to add product. Please try again.');
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
      <LinearGradient colors={['#4E2A14', '#6B3820', '#8B4513']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Picker */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Product Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1200.00"
              value={price}
              onChangeText={setPrice}
              placeholderTextColor="#B8A082"
              keyboardType="numeric"
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
