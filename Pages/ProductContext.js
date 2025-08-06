import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ProductContext = createContext();

// Environment-based API configuration
const isWeb = Platform.OS === 'web';
const API_BASE_URL = isWeb 
  ? 'http://localhost:5000/api'
  : 'http://192.168.0.100:5000/api';

console.log('API_BASE_URL:', API_BASE_URL);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setAuthToken(token);
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        console.log('Loaded user data:', parsedUser);
        await fetchProducts(token, parsedUser._id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUser = async (user) => {
    setCurrentUser(user);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      console.log('User data saved:', user);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const setToken = async (token) => {
    setAuthToken(token);
    try {
      await AsyncStorage.setItem('userToken', token);
      console.log('Token saved');
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
      console.log('User data cleared');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const fetchProducts = async (token = authToken, buyerId = currentUser?._id) => {
    if (!token || !buyerId) {
      console.log('Missing token or buyerId for fetching products');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching products for buyer:', buyerId);
      
      const response = await fetch(`${API_BASE_URL}/products/buyer/${buyerId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Fetch products response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch products:', response.status, errorText);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    if (!authToken || !currentUser) {
      throw new Error('Authentication required');
    }

    // Get userId from product data or fallback to currentUser
    const userId = product.userId || currentUser._id || currentUser.id;
    
    console.log('Adding product for user:', userId);
    console.log('Product data:', product);
    console.log('Current user ID:', currentUser._id || currentUser.id);

    if (!userId) {
      throw new Error('User ID is missing from both product data and current user');
    }

    try {
      setLoading(true);
      
      const requestData = {
        name: product.name,
        description: product.description || '',
        price: product.price || '0',
        category: product.category || 'Uncategorized',
        image: product.image || null,
        userId: userId,
      };

      console.log('Request data:', requestData);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Add product response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        console.error('Server error response:', responseText);
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Product added successfully:', result);
      
      // Add the new product to the local state
      if (result.product) {
        setProducts(prev => [...prev, result.product]);
      }
      
      return { success: true, data: result.product };
    } catch (error) {
      console.error('Add product error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!authToken) throw new Error('Authentication required');

    try {
      setLoading(true);
      console.log('Deleting product:', productId);

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Delete product response status:', response.status);

      if (response.ok) {
        setProducts(prev => prev.filter(product => product._id !== productId));
        console.log('Product deleted successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to delete product:', response.status, errorText);
        throw new Error(`Failed to delete product: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updates) => {
    if (!authToken) throw new Error('Authentication required');

    try {
      setLoading(true);
      console.log('Updating product:', productId, 'with:', updates);

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      console.log('Update product response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update product:', response.status, errorText);
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const updatedProduct = await response.json();
      console.log('Product updated successfully:', updatedProduct);
      
      setProducts(prev =>
        prev.map(product =>
          product._id === productId ? updatedProduct : product
        )
      );
      
      return updatedProduct;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    } finally {
      setLoading(false);
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

    console.log('Initialized products from registration:', initialProducts);
    setProducts(initialProducts);
  };

  const refreshProducts = async () => {
    if (currentUser && authToken) {
      await fetchProducts();
    }
  };

  const value = {
    products,
    currentUser,
    authToken,
    loading,
    setUser,
    setToken,
    clearUserData,
    addProduct,
    deleteProduct,
    updateProduct,
    fetchProducts,
    refreshProducts,
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