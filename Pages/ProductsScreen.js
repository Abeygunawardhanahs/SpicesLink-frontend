import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../Pages/ProductContext';

const ProductsScreen = ({ navigation }) => {
  const { products } = useProducts(); // 🔥 use products from context

  const handleProductPress = (product) => {
    if (product.name.includes('Cinnamon')) {
      navigation.navigate('CinamanScreen');
    } else if (product.name.includes('Turmeric')) {
      navigation.navigate('TurmericDetailScreen');
    } else if (product.name.includes('Pepper')) {
      navigation.navigate('PepperDetailScreen');
    } else {
      navigation.navigate('DefaultProductScreen', { product }); // fallback
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.card}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Products</Text>
        <View style={styles.topBarIcons}>
          <TouchableOpacity>
            <FontAwesome name="bell" size={22} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Background Image Section */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/welcomeRight.jpg')} style={styles.headerImage} />
        <View style={styles.overlay}>
          <Text style={styles.imageTitle}>PRODUCTS</Text>
        </View>
      </View>

      {/* Add New Product Link */}
      <TouchableOpacity onPress={() => navigation.navigate('AddNewProductScreen')}>
        <Text style={styles.addNewProductLink}>Add New Product</Text>
      </TouchableOpacity>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ProductsScreen;

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
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    marginLeft: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  addNewProductLink: {
    color: '#5C1D0E',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'right',
    marginRight: 20,
    textDecorationLine: 'underline',
  },
  listContainer: { padding: 10 },
  card: {
    backgroundColor: '#fce7c4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 15 
  },
  itemText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#5C1D0E' 
  },
});
