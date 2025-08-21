import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import WelcomeScreen from './Pages/WelcomeScreen';
import UserRollSelect from './Pages/UserRollSelect';
import RegistrationScreen from './Pages/Buyer/Registration/RegistrationScreen';
import BuyerLogin from './Pages/BuyerLogin';
import BuyerDashboard from './Pages/BuyerDashboard';
import ProductsScreen from './Pages/ProductsScreen';
import { ProductProvider } from './Pages/ProductContext';
import AddNewProductScreen from './Pages/AddNewProductScreen';
import CinamanScreen from './Pages/CinamanScreen';
import AlbaPriceList from './Pages/Buyer/Cinnamon/Alba/AlbaPriceList';
import AlbaPriceUpdate from './Pages/Buyer/Cinnamon/Alba/AlbaPriceUpdate';
import SuppliersList from './Pages/Buyer/Suppliers/SuppliersList';
import SupplierDetails from './Pages/Buyer/Suppliers/SupplierDetails';
import ClovesPriceList from './Pages/Buyer/Products/Cloves/ClovesPriceList';
import ClovesPriceUpdate from './Pages/Buyer/Products/Cloves/ClovesPriceUpdate';
import { SupplierRegistration } from './Pages/Supplier/SupplierRegistration';
import AddBankDetails from './Pages/Supplier/AddBankDetails';
import SupplierLogin from './Pages/Supplier/SupplierLogin';
import SuccessPage from './Pages/Supplier/SuccessPage';
import SupplierDashboard from './Pages/Supplier/SupplierDashboard';
import Products from './Pages/Supplier/Products';
import ProductShops from './Pages/Supplier/ProductShop';



const Stack = createStackNavigator();

function App() {
  return (
    <ProductProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="UserRollSelect" component={UserRollSelect} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="BuyerLogin" component={BuyerLogin}/>
        <Stack.Screen name="BuyerDashboard" component={BuyerDashboard}/>
        <Stack.Screen name="ProductsScreen" component={ProductsScreen}/>
        <Stack.Screen name="AddNewProductScreen" component={AddNewProductScreen}/>
        <Stack.Screen name="CinamanScreen" component={CinamanScreen}/>
        <Stack.Screen name="AlbaPriceList" component={AlbaPriceList}/>
        <Stack.Screen name="AlbaPriceUpdate" component={AlbaPriceUpdate}/>
        <Stack.Screen name="ClovesPriceList" component={ClovesPriceList}/>
        <Stack.Screen name='ClovesPriceUpdate' component={ClovesPriceUpdate} />
        <Stack.Screen name="SuppliersList" component={SuppliersList}/>
        <Stack.Screen name="SupplierDetails" component={SupplierDetails} />  
        <Stack.Screen name="Supplier" component={SupplierRegistration}/>
        <Stack.Screen name="AddBankDetails" component={AddBankDetails} />
        <Stack.Screen name="SupplierLogin" component={SupplierLogin} />
        <Stack.Screen name="SuccessPage" component={SuccessPage} />
        <Stack.Screen name="SupplierDashboard" component={SupplierDashboard} />
        <Stack.Screen name="Products" component={Products}/>
        <Stack.Screen name="ProductShops" component={ProductShops} />  

       
        
      </Stack.Navigator>
    </NavigationContainer>
    </ProductProvider>
        
  );
}

// Register the app
registerRootComponent(App);

export default App;
