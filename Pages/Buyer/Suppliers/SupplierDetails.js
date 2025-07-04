import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SupplierDetails({ route, navigation }) {
  const { supplier, updateRating } = route.params;
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating === 0) {
      Alert.alert('Validation', 'Please select a rating before submitting.');
      return;
    }

    const newAvg = ((supplier.rating + selectedRating) / 2).toFixed(1);
    updateRating(supplier.id, parseFloat(newAvg)); // Update parent state (e.g., in SuppliersList)
    setSubmitted(true);
    Alert.alert('Thank You!', `You rated ${supplier.name} ${selectedRating} ★`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{supplier.name}</Text>
        <Icon name="notifications" size={24} color="#fff" />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Icon name="account-circle" size={80} color="#5C2E0F" />
        <Text style={styles.ratingBox}>Current Rating: {supplier.rating.toFixed(1)} ★</Text>
        <Text style={styles.name}>{supplier.name}</Text>
        <Text>{supplier.email}</Text>
        <Text>{supplier.phone}</Text>
      </View>

      {/* Rating Section */}
      <Text style={styles.rateLabel}>Your Rating</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setSelectedRating(star)}
            disabled={submitted}
          >
            <Icon
              name={star <= selectedRating ? 'star' : 'star-border'}
              size={34}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.okBtn} onPress={handleSubmit} disabled={submitted}>
          <Text style={styles.btnText}>{submitted ? 'Rated' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f6f3' },
  header: {
    backgroundColor: '#5C2E0F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 18 },
  profileCard: {
    backgroundColor: '#fbe9d7',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  ratingBox: {
    marginTop: 5,
    fontSize: 14,
    color: '#5C2E0F',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C2E0F',
  },
  rateLabel: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#555',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  cancelBtn: {
    backgroundColor: '#a58a7f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  okBtn: {
    backgroundColor: '#5C2E0F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  btnText: { color: '#fff', fontSize: 16 },
});
