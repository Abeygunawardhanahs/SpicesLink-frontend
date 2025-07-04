import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // For icons

// Dummy data (no hardcoding inside JSX)
const categories = [
  { id: '1', title: 'Alba', navigateTo: 'AlbaPriceList' },
  { id: '2', title: 'C5', navigateTo: 'C5Screen' },
  { id: '3', title: 'H1', navigateTo: 'H1Screen' },
  { id: '4', title: 'M4', navigateTo: 'M4Screen' },
  { id: '5', title: 'M5', navigateTo: 'M5Screen' },
  { id: '6', title: 'Powder', navigateTo: 'PowderScreen' },
];

const CinamanScreen = () => {
  const navigation = useNavigation();

  const handlePress = (navigateTo) => {
    navigation.navigate(navigateTo);
  };

  return (
    <ImageBackground
      source={require('../assets/images/kurudu.jpg')}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Cinnamon</Text>
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.buttonContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.button} onPress={() => handlePress(item.navigateTo)}>
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  topBar: {
    marginTop: 50, // for status bar space
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.4)', // semi-transparent
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center', // center the button grid nicely
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    width: width * 0.4, // 40% of screen width
    aspectRatio: 1, // make square buttons
    margin: 10,
    backgroundColor: 'rgba(255, 165, 0, 0.7)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CinamanScreen;
