import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();
const API_BASE_URL = 'http://192.168.0.100:5000/api/products'; // Adjust IP/Port if needed

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setAuthToken(token);
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        await fetchProducts(token, parsedUser._id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const setUser = async (user) => {
    setCurrentUser(user);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const setToken = async (token) => {
    setAuthToken(token);
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setAuthToken(null);
      setCurrentUser(null);
      setProducts([]);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const fetchProducts = async (token = authToken, buyerId = currentUser?._id) => {
    if (!token || !buyerId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/products/buyer/${buyerId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        console.error('Failed to fetch products:', response.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const addProduct = async (product) => {
    if (!authToken || !currentUser) throw new Error('Authentication required');
    console.log(currentUser._id)


    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          buyerId: currentUser._id,
        })
      });

      if (!response.ok) {
        console.error('Failed to add product:', response.status);
        throw new Error(`Failed to add product: ${response.status}`);
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Add product error:', error);
    }
  };

  const deleteProduct = async (productId) => {
    if (!authToken) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setProducts(prev => prev.filter(product => product._id !== productId));
      } else {
        console.error('Failed to delete product:', response.status);
      }
    } catch (error) {
      console.error('Delete product error:', error);
    }
  };

  const updateProduct = async (productId, updates) => {
    if (!authToken) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        console.error('Failed to update product:', response.status);
        return;
      }

      const updatedProduct = await response.json();
      setProducts(prev =>
        prev.map(product =>
          product._id === productId ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Update product error:', error);
    }
  };

  const initializeProductsFromRegistration = (productList, userId) => {
    const initialProducts = productList.map(name => ({
      id: `${userId}-${name.trim()}-${Date.now()}`,
      name: name.trim(),
      image: require('../assets/images/cinnaman.jpg'), // Default image
      description: 'Set a description for this product.',
      price: '0.00',
    }));

    setProducts(initialProducts);
  };

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
    initializeProductsFromRegistration,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
