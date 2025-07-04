import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Cinnamon - Kurundu' },
    { id: 2, name: 'Turmeric - Kaha' },
    { id: 3, name: 'Pepper - Gammiris' },
  ]);

  const addProduct = (productName, productImage) => {
      const newProduct = { id: Date.now(), name: productName, image: productImage };
      setProducts(prev => [...prev, newProduct]);
    };
  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
