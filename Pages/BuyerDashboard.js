import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image ,useNavigation } from 'react-native';

const BuyerDashboard = ({navigation}) => {
  // const navigation = useNavigation();
  return (
    <ImageBackground source={require('../assets/images/swpices2.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.header}>Shop Name</Text>
        
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.card}
          onPress={() => navigation.navigate('ProductsScreen')} ><Text style={styles.cardText}>Products</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Suppliers</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Notifications</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Stocks</Text></TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.profileCard}>
          <Text style={styles.cardText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#d4a373',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color: '#000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: 120,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  profileCard: {
    width: 150,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BuyerDashboard;
