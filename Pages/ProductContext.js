import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();
const API_BASE_URL = 'http://192.168.0.101:5000/api'; // Make sure this IP is correct for your network

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Load user data and token from storage when the app starts
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Using 'userToken' as this is what your login screen likely saves
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setAuthToken(token);
        setCurrentUser(JSON.parse(userData));
        await fetchProducts(token); // Fetch products from server for logged-in user
      }
    } catch (error) {
      console.error('Error loading user data from storage:', error);
    }
  };

  const setUser = async (user) => {
    setCurrentUser(user);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data to storage:', error);
    }
  };

  const setToken = async (token) => {
    setAuthToken(token);
    try {
      // Use 'userToken' to be consistent
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving token to storage:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setAuthToken(null);
      setCurrentUser(null);
      setProducts([]); // Clear products on logout
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Fetch all products for the logged-in user from the backend
  const fetchProducts = async (token = authToken) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products:', response.status);
      }
    } catch (error) {
      console.error('Network error fetching products:', error);
    }
  };

  // // --- THIS IS THE KEY UPDATED FUNCTION ---
  // // Creates temporary client-side products immediately after registration for instant UI feedback.
const initializeProductsFromRegistration = (productList, userId) => {
  const initialProducts = productList.map(name => {
  //     // Find the corresponding local image from the map, or use the default one.
  //     // We convert the name to lowercase to make the mapping case-insensitive.
  //     const image = productImageMap[name.toLowerCase().trim()] || defaultProductImage;
      
      return {
        // Create a temporary, client-side unique ID.
        // The MongoDB '_id' will be added when it's saved to the server later.
        id: `${userId}-${name.trim()}-${Date.now()}`,
        name: name.trim(),
        image: image, // The image is a local 'require()' resource, which results in a number.
        description: 'Set a description for this product.',
        price: '0.00',
      };
    });

    // Update the global state with these new products so they appear on the ProductsScreen.
    setProducts(initialProducts);
  };

  // Add a new product to the backend
  const addProduct = async (product) => {
    // (This function remains as you provided it)
    if (!authToken) throw new Error('Authentication required');
    // ... your existing addProduct logic
  };

  // Delete a product from the backend
  const deleteProduct = async (productId) => {
    // (This function remains as you provided it)
    if (!authToken) throw new Error('Authentication required');
    // ... your existing deleteProduct logic
  };

  // Update a product on the backend
  const updateProduct = async (productId, updates) => {
    // (This function remains as you provided it)
    if (!authToken) throw new Error('Authentication required');
    // ... your existing updateProduct logic
  };

  // Login a user
  const login = async (credentials) => {
    // (This function remains as you provided it)
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, { /* ... */ });
      // ... your existing login logic
    } catch (error) {
      // ...
    }
  };


  // This value object makes all states and functions available to components
  const value = {
    products,
    currentUser,
    authToken,
    setUser,
    setToken,
    clearUserData,
    addProduct,
    deleteProduct,
    updateProduct,
    fetchProducts,
    login,
    initializeProductsFromRegistration, // <-- Export the updated function
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to easily use the context in other components
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};