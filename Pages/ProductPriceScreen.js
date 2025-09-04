import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Image,
  Modal,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = 'http://192.168.0.100:5000';

const ProductPriceScreen = ({ route, navigation }) => {
  const { product, productId, productName } = route.params;
  
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddPriceModal, setShowAddPriceModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const [newPricePer100g, setNewPricePer100g] = useState('');
  const [weeklyQuantity, setWeeklyQuantity] = useState('');
  const [updatePricePer100g, setUpdatePricePer100g] = useState('');
  const [updateWeeklyQuantity, setUpdateWeeklyQuantity] = useState('');
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [currentPriceItem, setCurrentPriceItem] = useState(null);

  // Fetch price history for this product
  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/prices`);
      if (response.ok) {
        const data = await response.json();
        setPriceHistory(data.prices || []);
      } else {
        console.error('Failed to fetch price history');
        setPriceHistory([]);
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
      setPriceHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh price history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPriceHistory();
    }, [productId])
  );

  useEffect(() => {
    fetchPriceHistory();
  }, [productId]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPriceHistory();
    setIsRefreshing(false);
  }, []);

  const handleAddPrice = async () => {
    const pricePer100g = parseFloat(newPricePer100g.trim()) || 0;
    const weeklyQty = parseFloat(weeklyQuantity.trim()) || 0;

    setIsAddingPrice(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pricePer100g: pricePer100g,
          weeklyQuantity: weeklyQty,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Price added successfully!');
        setNewPricePer100g('');
        setWeeklyQuantity('');
        setShowAddPriceModal(false);
        await fetchPriceHistory();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to add price');
      }
    } catch (error) {
      console.error('Error adding price:', error);
      Alert.alert('Error', 'Failed to add price. Please try again.');
    } finally {
      setIsAddingPrice(false);
    }
  };

  const handleUpdatePrice = async () => {
    const pricePer100g = parseFloat(updatePricePer100g.trim()) || 0;
    const weeklyQty = parseFloat(updateWeeklyQuantity.trim()) || 0;

    if (!currentPriceItem) return;

    setIsUpdatingPrice(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/prices/${currentPriceItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pricePer100g: pricePer100g,
          weeklyQuantity: weeklyQty,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Price updated successfully!');
        setUpdatePricePer100g('');
        setUpdateWeeklyQuantity('');
        setShowUpdatePriceModal(false);
        setCurrentPriceItem(null);
        await fetchPriceHistory();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      Alert.alert('Error', 'Failed to update price. Please try again.');
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  // Navigate to price details page
  const handlePriceItemClick = (priceItem) => {
    navigation.navigate('PriceDetailsScreen', {
      priceItem: priceItem,
      productName: productName,
      productId: productId,
    });
  };

  // Open update modal with latest price data
  const handleUpdateClick = () => {
    const latestPrice = getCurrentPrice();
    if (latestPrice) {
      setCurrentPriceItem(latestPrice);
      setUpdatePricePer100g(latestPrice.pricePer100g?.toString() || '');
      setUpdateWeeklyQuantity(latestPrice.weeklyQuantity?.toString() || '');
      setShowUpdatePriceModal(true);
    } else {
      Alert.alert('No Price Data', 'Please add a price first before updating.');
    }
  };

  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return `${dayName} ${day}-${month + 1}-${year}`;
  };

  const getCurrentPrice = () => {
    if (priceHistory.length === 0) return null;
    return priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const renderPriceItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        style={styles.priceItemCard}
        onPress={() => handlePriceItemClick(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#F4E4BC', '#E8D5A3']}
          style={styles.priceItemGradient}
        >
          <Text style={styles.priceItemText}>
            {formatDateDisplay(item.date)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="trending-up" size={80} color="#8B7355" />
      <Text style={styles.emptyStateTitle}>No Price History</Text>
      <Text style={styles.emptyStateText}>
        Start tracking prices for {productName} by adding your first price entry.
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => setShowAddPriceModal(true)}
      >
        <Text style={styles.emptyStateButtonText}>Add First Price</Text>
      </TouchableOpacity>
    </View>
  );

  const getProductImageSource = () => {
    if (typeof product?.image === 'string' && product.image.startsWith('/uploads')) {
      return { uri: `${API_BASE_URL}${product.image}` };
    } else if (typeof product?.image === 'string' && product.image.startsWith('http')) {
      return { uri: product.image };
    } else if (typeof product?.image === 'number') {
      return product.image;
    } else {
      return require('../assets/images/cinnaman.jpg');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
        <LinearGradient colors={['#4E2A14', '#6B3820']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{productName}</Text>
          <View style={styles.refreshButton} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={60} color="#8B7355" />
          <Text style={styles.loadingText}>Loading price history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2C1810" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#4E2A14', '#6B3820']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {productName}
        </Text>
        <TouchableOpacity onPress={() => setShowAddPriceModal(true)} style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Product Header with Image */}
      <View style={styles.productHeader}>
        <Image source={getProductImageSource()} style={styles.productHeaderImage} />
        <Text style={styles.productHeaderName}>{productName}</Text>
      </View>

      {/* Quantity Page Label */}
      <View style={styles.quantityPageLabel}>
        <Text style={styles.quantityPageText}>Quantity page</Text>
      </View>

      {/* Price History List */}
      {priceHistory.length > 0 ? (
        <View style={styles.listSection}>
          <FlatList
            data={priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date))}
            renderItem={renderPriceItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#4E2A14']}
                tintColor="#4E2A14"
              />
            }
          />
          
          {/* Update Button */}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateClick}>
            <LinearGradient
              colors={['#4E2A14', '#6B3820']}
              style={styles.updateButtonGradient}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        renderEmptyState()
      )}

      {/* Add Price Modal */}
      <Modal
        visible={showAddPriceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Price</Text>
              <TouchableOpacity
                onPress={() => setShowAddPriceModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalProductName}>{productName}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price per 100g (Rs.)</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Lkr 0.00"
                value={newPricePer100g}
                onChangeText={setNewPricePer100g}
                keyboardType="decimal-pad"
                editable={!isAddingPrice}
                placeholderTextColor="#B8A082"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weekly Quantity Requirement (Kg)</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                value={weeklyQuantity}
                onChangeText={setWeeklyQuantity}
                keyboardType="decimal-pad"
                editable={!isAddingPrice}
                placeholderTextColor="#B8A082"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddPriceModal(false)}
                disabled={isAddingPrice}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, isAddingPrice && styles.disabledButton]}
                onPress={handleAddPrice}
                disabled={isAddingPrice}
              >
                <LinearGradient
                  colors={isAddingPrice ? ['#999', '#666'] : ['#4E2A14', '#6B3820']}
                  style={styles.saveButtonGradient}
                >
                  <MaterialIcons 
                    name={isAddingPrice ? "hourglass-empty" : "save"} 
                    size={20} 
                    color="#FFF" 
                  />
                  <Text style={styles.saveButtonText}>
                    {isAddingPrice ? 'Adding...' : 'Add Price'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Price Modal */}
      <Modal
        visible={showUpdatePriceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUpdatePriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Price</Text>
              <TouchableOpacity
                onPress={() => setShowUpdatePriceModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalProductName}>{productName}</Text>
            {currentPriceItem && (
              <Text style={styles.modalDateText}>
                Date: {formatDateDisplay(currentPriceItem.date)}
              </Text>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price per 100g (Rs.)</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Lkr 0.00"
                value={updatePricePer100g}
                onChangeText={setUpdatePricePer100g}
                keyboardType="decimal-pad"
                editable={!isUpdatingPrice}
                placeholderTextColor="#B8A082"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weekly Quantity Requirement (Kg)</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                value={updateWeeklyQuantity}
                onChangeText={setUpdateWeeklyQuantity}
                keyboardType="decimal-pad"
                editable={!isUpdatingPrice}
                placeholderTextColor="#B8A082"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowUpdatePriceModal(false)}
                disabled={isUpdatingPrice}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, isUpdatingPrice && styles.disabledButton]}
                onPress={handleUpdatePrice}
                disabled={isUpdatingPrice}
              >
                <LinearGradient
                  colors={isUpdatingPrice ? ['#999', '#666'] : ['#4E2A14', '#6B3820']}
                  style={styles.saveButtonGradient}
                >
                  <MaterialIcons 
                    name={isUpdatingPrice ? "hourglass-empty" : "edit"} 
                    size={20} 
                    color="#FFF" 
                  />
                  <Text style={styles.saveButtonText}>
                    {isUpdatingPrice ? 'Updating...' : 'Update Price'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },        
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  productHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  productHeaderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  productHeaderName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E2A14',
    textAlign: 'center',
  },
  quantityPageLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  quantityPageText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '500',
  },
  listSection: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  priceItemCard: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceItemGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  priceItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E2A14',
    textAlign: 'center',
  },
  updateButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  updateButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E2A14',
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#4E2A14',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E2A14',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 10,
  },
  modalDateText: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E2A14',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FEFEFE',
    color: '#2C2C2C',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#4E2A14',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4E2A14',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ProductPriceScreen;