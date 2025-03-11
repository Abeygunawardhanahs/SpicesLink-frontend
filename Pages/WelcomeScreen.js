import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  // Auto-navigate to UserRollSelect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('UserRollSelect'); // Replace to avoid going back to WelcomeScreen
    }, 5000); // 5-second delay

    return () => clearTimeout(timer); // Clear timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>SpicesLink</Text>
      </View>

      {/* Bottom Images */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/welcomeLeft.jpg')} 
          style={styles.leftImage}
          resizeMode='cover'
        />
        <Image 
          source={require('../assets/images/welcomeRight.jpg')} 
          style={styles.rightImage}
          resizeMode='cover'
        />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4A373',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContainer: {
    marginTop: height * 0.2,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#5A3E2B',
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#5A3E2B',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0.01,
    marginTop: '5%',
  },
  imageContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  leftImage: {
    width: width * 0.5,
    height: height * 0.3,
  },
  rightImage: {
    width: width * 0.5,
    height: height * 0.3,
  },
});

export default WelcomeScreen;
