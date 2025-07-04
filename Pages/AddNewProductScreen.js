import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useProducts } from '../Pages/ProductContext'; // import your context
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddNewProductScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const { addProduct } = useProducts();

  const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos.');
        return;
      }
    
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    
      if (!result.cancelled) {
        setProductImage(result.assets[0].uri); // if using expo-image-picker v14+
        // setProductImage(result.uri); // if using older expo-image-picker v13 or less
      }
    };
    

//   const pickImage = async () => {
//     // Ask for permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Required', 'Please grant media library permissions to pick an image.');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setProductImage(result.assets[0].uri);
//     }
//   };

//  

const handleAddProduct = () => {
      if (productName.trim() === '') {
        Alert.alert('Error', 'Please enter a product name.');
        return;
      }
    
      addProduct(productName.trim(), productImage);
      setProductName('');
      setProductImage(null);
      navigation.goBack();
    };
    

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Add New Product</Text>
        <View style={{ width: 24 }} /> {/* Empty space for balance */}
      </View>

      {/* Input Section */}
      <View style={styles.form}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={productName}
          onChangeText={setProductName}
        />

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.addButtonText}>Pick Product Image</Text>
        </TouchableOpacity>

        {productImage && (
          <Image source={{ uri: productImage }} style={styles.previewImage} />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddNewProductScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dca85d' },

  topBar: {
    height: 60,
    backgroundColor: '#5C1D0E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  form: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: '#5C1D0E',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: '#5C1D0E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#5C1D0E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
