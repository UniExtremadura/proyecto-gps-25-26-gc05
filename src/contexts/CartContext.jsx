import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el componente "Proveedor"
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Añadir al carrito (Blindado)
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Convertimos IDs a String para comparar con seguridad
      const existingItem = prevCart.find((item) => String(item.id) === String(product.id));

      if (existingItem) {
        return prevCart.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Aseguramos que quantity sea un número (1)
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Actualizar cantidad (Blindado)
  const updateQuantity = (id, delta) => {
    console.log(`🔄 Intentando actualizar ID: ${id}, Delta: ${delta}`);
    
    setCart(prev => prev.map(item => {
        // Comparamos IDs como texto para evitar errores de tipo (1 vs "1")
        if (String(item.id) === String(id)) {
            // Aseguramos que sea número antes de sumar
            const currentQty = parseInt(item.quantity) || 0;
            const newQty = Math.max(1, currentQty + delta);
            
            console.log(`   ✅ Cantidad cambiada: ${currentQty} -> ${newQty}`);
            return { ...item, quantity: newQty };
        }
        return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(productId)));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 3. Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};