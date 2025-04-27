import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';


const products = [
  { name: 'Cinnamon - Kurundu', image: require('../assets/images/cinnaman.jpg') },
  { name: 'Turmeric - Kaha', image: require('../assets/images/turmeric.jpeg') },
  { name: 'Pepper - Gammiris', image: require('../assets/images/pepper.jpg') }, // fixed here
  { name: 'Garcinia - Goraka', image: require('../assets/images/goraka.jpeg') },
  { name: 'Coffee - Koopi', image: require('../assets/images/Koopi.jpg') },
];


const ProductsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/welcomeRight.jpg')} style={styles.headerImage} />
        <Text style={styles.headerTitle}>PRODUCTS</Text>
        <TouchableOpacity onPress={() => {/* Handle add new product */}}>
          <Text style={styles.addProduct}>Add New Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dca85d' },
  header: { alignItems: 'center', padding: 10 },
  headerImage: { width: '100%', height: 150, resizeMode: 'cover' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginTop: -30, color: '#fff' },
  addProduct: { color: '#000', marginTop: 10, fontWeight: 'bold' },
  listContainer: { padding: 10 },
  card: {
    backgroundColor: '#fce7c4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
  },
  itemImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  itemText: { fontSize: 16 },
});
