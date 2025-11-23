import React, { createContext, useState, useContext } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el componente "Proveedor" que envolverá la app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Añadir producto al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      // ¿El producto ya está en el carrito?
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Si existe, aumentamos la cantidad (simulado)
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Si no existe, lo añadimos con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    console.log("Producto añadido:", product.title);
  };

  // Eliminar producto
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Hook personalizado para usar el carrito fácilmente
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};