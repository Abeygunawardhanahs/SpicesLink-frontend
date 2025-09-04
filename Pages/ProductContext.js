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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  // Auto-fetch products when user or token changes
  useEffect(() => {
    if (currentUser && authToken && isInitialized) {
      const userIdToUse = currentUser._id || currentUser.id;
      if (userIdToUse) {
        console.log('Auto-fetching products for user ID:', userIdToUse);
        fetchProducts();
      } else {
        console.warn('User exists but no ID found:', Object.keys(currentUser));
      }
    }
  }, [currentUser, authToken, isInitialized]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('Loading user data from storage...');

      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setAuthToken(token);
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        console.log('Loaded user data:', parsedUser);

        // Fetch products immediately after loading user data
        const userIdToUse = parsedUser._id || parsedUser.id;
        if (userIdToUse) {
          await fetchProducts(token, userIdToUse);
        } else {
          console.warn('User loaded but no ID found:', Object.keys(parsedUser));
        }
      } else {
        console.log('No stored user data found');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
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
      setIsInitialized(false);
      console.log('User data cleared');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const fetchProducts = async (token = authToken, buyerId = currentUser?._id || currentUser?.id) => {
    if (!token || !buyerId) {
      console.log('Missing token or buyerId for fetching products', {
        token: !!token,
        buyerId,
        currentUser: currentUser ? Object.keys(currentUser) : null
      });
      return [];
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
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        return productsArray;
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch products:', response.status, errorText);

        // Only clear products if it's a 404 or similar client error
        // Don't clear on server errors (5xx) to keep existing products
        if (response.status >= 400 && response.status < 500) {
          setProducts([]);
        }
        return [];
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      // Don't clear products on network error, keep existing ones
      return products;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    if (!authToken || !currentUser) {
      throw new Error('Authentication required');
    }

    const userId = product.userId || currentUser._id || currentUser.id;
    const userType = currentUser.role || currentUser.type || currentUser.userType;


    try {
      setLoading(true);

      const requestData = {
        name: product.name,
        // description: product.description || '',
        // price: product.price || '0',
        // category: product.category || 'Uncategorized',
        // image: product.image || null,
        userId: userId,
        userType: userType || 'Buyer',
        userName: product.userName || currentUser.shopOwnerName || '',
        shopName: product.shopName || currentUser.shopName || '',
        location: product.location || currentUser.shopLocation || '',
      };

      console.log('Adding product with data:', requestData);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      console.log('Add product server response:', responseText);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      const result = JSON.parse(responseText);
      console.log('Product added successfully:', result.product);

      // Update local state immediately with the new product
      setProducts(prevProducts => [...prevProducts, result.product]);

      // Fetch fresh data from server to ensure consistency
      await fetchProducts();

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
        // Remove from local state immediately
        setProducts(prev => prev.filter(product => product._id !== productId));
        console.log('Product deleted successfully');

        // Refresh from server to ensure consistency
        setTimeout(() => {
          fetchProducts();
        }, 500);
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

      // Update local state immediately
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
      image: require('../assets/images/cinnaman.jpg'),
      description: 'Set a description for this product.',
      price: '0.00',
    }));

    console.log('Initialized products from registration:', initialProducts);
    setProducts(initialProducts);
  };

  const refreshProducts = async () => {
    console.log('Manual refresh products called');
    if (currentUser && authToken) {
      await fetchProducts();
    } else {
      console.log('Cannot refresh: missing user or token');
    }
  };

  const forceRefreshProducts = async () => {
    console.log('Force refresh products called');
    const userIdToUse = currentUser?._id || currentUser?.id;
    if (currentUser && authToken && userIdToUse) {
      console.log('Force refreshing for user:', userIdToUse);
      return await fetchProducts(authToken, userIdToUse);
    } else {
      console.log('Cannot refresh: missing user, token, or user ID', {
        hasUser: !!currentUser,
        hasToken: !!authToken,
        userId: userIdToUse
      });
    }
    return [];
  };

  const value = {
    products,
    currentUser,
    authToken,
    loading,
    isInitialized,
    setUser,
    setToken,
    clearUserData,
    addProduct,
    deleteProduct,
    updateProduct,
    fetchProducts,
    refreshProducts,
    forceRefreshProducts,
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