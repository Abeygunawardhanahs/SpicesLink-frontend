import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SuppliersList({ navigation }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const data = [
        { id: '1', name: 'Supplier A', rating: 3.2, email: 'supplier.a@gmail.com', phone: '0702031499' },
        { id: '2', name: 'Supplier B', rating: 4.5, email: 'supplier.b@gmail.com', phone: '0771234567' },
      ];
      setSuppliers(data);
    };
    fetchSuppliers();
  }, []);

  // ✅ This is the key function
  const updateRating = (id, newRating) => {
    setSuppliers(prev =>
      prev.map(s =>
        s.id === id ? { ...s, rating: newRating } : s
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SupplierDetails', {
        supplier: item,
        updateRating // ✅ pass it here
      })}
    >
      <Icon name="person" size={24} color="#5C2E0F" />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.rating}>{item.rating.toFixed(1)}★</Text>
    </TouchableOpacity>
  );

  return (
    



    <ImageBackground
      source={require('../../../assets/images/welcomeRight.jpg')}
      style={styles.container}
    >
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.headerText}>Suppliers</Text>
         <Icon name="notifications" size={24} color="#fff" />
      </View>
      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#5C2E0F',
    padding: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f5d7a1',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    color: '#5C2E0F',
  },
  rating: {
    fontSize: 14,
    color: '#5C2E0F',
  },
});
