import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import WelcomeScreen from './Pages/WelcomeScreen';
import UserRollSelect from './Pages/UserRollSelect';
import RegistrationScreen from './Pages/RegistrationScreen';
import BuyerLogin from './Pages/BuyerLogin';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="UserRollSelect" component={UserRollSelect} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="BuyerLogin" component={BuyerLogin}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Register the app
registerRootComponent(App);

export default App;
