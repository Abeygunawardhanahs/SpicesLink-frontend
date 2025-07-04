import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ClovesPriceUpdate({ route, navigation }) {
  const { latest, onAddNewPrice, isViewOnly } = route.params;

  const [date, setDate] = useState(latest?.date || '');
  const [quantity, setQuantity] = useState(latest?.quantity || '');
  const [price, setPrice] = useState(latest?.price || '');

  const handleOk = () => {
    if (!date.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert('Incomplete Data', 'Please fill all fields before submitting.');
      return;
    }

    const newItem = { date, quantity, price };
    if (onAddNewPrice && typeof onAddNewPrice === 'function') {
      onAddNewPrice(newItem);
    }
    navigation.goBack();
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

      {/* Image & Label */}
      <Image source={require('../../../../assets/images/cinnaman.jpg')} style={styles.image} />
      <Text style={styles.albaText}>Cinnamon - Kurundu</Text>
      <View style={styles.label}>
        <Text style={styles.labelText}>ALBA</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="calendar-today" size={20} color="#5C2E0F" />
          <TextInput
            style={styles.input}
            placeholder="Please enter date here (e.g. 20-06-2025)"
            value={date}
            onChangeText={setDate}
            editable={!isViewOnly}
          />
        </View>
        <View style={styles.row}>
          <Icon name="scale" size={20} color="#5C2E0F" />
          <TextInput
            style={styles.input}
            placeholder="Please enter quantity here. (e.g. 1000kg)"
            value={quantity}
            onChangeText={setQuantity}
            editable={!isViewOnly}
          />
        </View>
        <View style={styles.row}>
          <Icon name="attach-money" size={20} color="#5C2E0F" />
          <TextInput
            style={styles.input}
            placeholder="Please enter the price here. (e.g. Rs.95 per 100g)"
            value={price}
            onChangeText={setPrice}
            editable={!isViewOnly}
          />
        </View>
      </View>

      {/* Buttons */}
      {!isViewOnly && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.okBtn} onPress={handleOk}>
            <Text style={styles.btnText}>Ok</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f6f3', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#5C2E0F',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: { color: 'white', fontSize: 18 },
  image: { width: 180, height: 100, borderRadius: 90, marginTop: 20 },
  albaText: { fontSize: 16, marginVertical: 8, color: '#5C2E0F' },
  label: {
    backgroundColor: '#fff6db',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  labelText: { fontSize: 18, color: '#5C2E0F' },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    marginLeft: 10,
    paddingVertical: 4,
    color: '#5C2E0F',
  },
  buttonRow: { flexDirection: 'row', gap: 20 },
  cancelBtn: {
    backgroundColor: '#5C2E0F',
    padding: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  okBtn: {
    backgroundColor: '#5C2E0F',
    padding: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  btnText: { color: 'white', fontSize: 16 },
});
