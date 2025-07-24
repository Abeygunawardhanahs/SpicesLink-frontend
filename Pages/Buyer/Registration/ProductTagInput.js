import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProductTagInput = ({ onProductsChange }) => {
  const [text, setText] = useState('');
  const [products, setProducts] = useState([]);

  const addProduct = () => {
    const newProduct = text.trim();
    if (newProduct && !products.includes(newProduct)) {
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      onProductsChange(updatedProducts); // Update parent state
      setText('');
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  return (
    <View style={styles.wrapper}>
        <Text style={styles.label}>Products</Text>
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagArea}>
                {products.map((product, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{product}</Text>
                        <TouchableOpacity onPress={() => removeProduct(index)}>
                            <MaterialIcons name="cancel" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Cinnamon"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={addProduct} // Add product on submit
                />
                <TouchableOpacity style={styles.addButton} onPress={addProduct}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: { marginBottom: 28 },
    label: { color: '#CD853F', fontWeight: '600', marginBottom: 10, marginLeft: 5 },
    container: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#EAEAEA' },
    tagArea: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 5 },
    tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#A0522D', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, marginRight: 5, marginBottom: 5 },
    tagText: { color: '#FFF', marginRight: 5 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 5 },
    input: { flex: 1, height: 40, fontSize: 16 },
    addButton: { backgroundColor: '#D2691E', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
    addButtonText: { color: 'white', fontWeight: 'bold' },
});

export default ProductTagInput;