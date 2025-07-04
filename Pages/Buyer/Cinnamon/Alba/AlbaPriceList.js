import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { albaPrices as initialPrices } from './albaPrices'; // Adjust path if needed

export default function AlbaPriceList({ navigation }) {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    setPrices(initialPrices); // Load existing data
  }, []);

  // Handler to add new price
  const addNewPrice = (newItem) => {
    setPrices(prev => [newItem, ...prev]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alba</Text>
        <Icon name="notifications" size={24} color="#fff" />
      </View>

      {/* Image */}
      <Image source={require('../../../../assets/images/cinnaman.jpg')} style={styles.image} />
      <Text style={styles.title}>Alba</Text>

      {/* Price List */}
      <ScrollView style={styles.list}>
        {prices.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate('AlbaPriceUpdate', {
                latest: item,
                onAddNewPrice: addNewPrice,
                isViewOnly: true, // ✅ view mode for existing items
              })
            }
          >
            <Icon name="calendar-today" size={20} color="#5C2E0F" />
            <Text style={styles.cardText}>  {item.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add/Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() =>
          navigation.navigate('AlbaPriceUpdate', {
            latest: { date: '', quantity: '', price: '' }, // Empty for new entry
            onAddNewPrice: addNewPrice,
            isViewOnly: false, // ✅ editable mode for adding new
          })
        }
      >
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f6f3' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#5C2E0F',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: 'white', fontSize: 18 },
  image: { width: 200, height: 100, borderRadius: 100, alignSelf: 'center', marginTop: 15 },
  title: { textAlign: 'center', fontSize: 20, marginVertical: 10, color: '#5C2E0F' },
  list: { paddingHorizontal: 20, marginTop: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5d7a1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: { fontSize: 16, color: '#5C2E0F' },
  updateButton: {
    backgroundColor: '#5C2E0F',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  updateText: { color: 'white', fontSize: 16 },
});
