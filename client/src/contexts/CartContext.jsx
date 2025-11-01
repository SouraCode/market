import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load local cart when not authenticated
      const savedLocalCart = localStorage.getItem('localCart');
      if (savedLocalCart) {
        setLocalCart(JSON.parse(savedLocalCart));
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    console.log('addToCart called:', { productId, quantity, isAuthenticated, user });
    
    // Always use local cart for now to avoid server errors
    if (true) { // Force local cart for debugging
      // Add to local cart for non-authenticated users
      try {
        console.log('Adding to local cart...');
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        console.log('Product fetched:', product);
        
        const existingItem = localCart.find(item => item.productId === productId);
        let updatedLocalCart;
        
        if (existingItem) {
          updatedLocalCart = localCart.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedLocalCart = [...localCart, {
            productId,
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              unit: product.unit
            },
            quantity
          }];
        }
        
        console.log('Updated local cart:', updatedLocalCart);
        setLocalCart(updatedLocalCart);
        localStorage.setItem('localCart', JSON.stringify(updatedLocalCart));
        console.log('Local cart saved to localStorage');
        toast.success('Item added to cart! (Login to save permanently)');
      } catch (error) {
        console.error('Failed to add to local cart:', error);
        toast.error(`Failed to add item to cart: ${error.message}`);
      }
      return;
    }

    try {
      console.log('Adding to server cart:', { productId, quantity });
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity
      });
      console.log('Server cart response:', response.data);
      setCart(response.data);
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Server cart error:', error);
      toast.error(`Failed to add item to cart: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      console.log('Updating local cart item:', { itemId, quantity });
      
      // For local cart, itemId is actually productId
      const updatedLocalCart = localCart.map(item => {
        if (item.productId === itemId) {
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove items with 0 quantity
      
      setLocalCart(updatedLocalCart);
      localStorage.setItem('localCart', JSON.stringify(updatedLocalCart));
      console.log('Local cart updated:', updatedLocalCart);
    } catch (error) {
      console.error('Failed to update local cart item:', error);
      toast.error('Failed to update cart item');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      console.log('Removing from local cart:', { itemId });
      
      // For local cart, itemId is actually productId
      const updatedLocalCart = localCart.filter(item => item.productId !== itemId);
      
      setLocalCart(updatedLocalCart);
      localStorage.setItem('localCart', JSON.stringify(updatedLocalCart));
      console.log('Item removed from local cart:', updatedLocalCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from local cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      console.log('Clearing local cart');
      
      setLocalCart([]);
      localStorage.removeItem('localCart');
      console.log('Local cart cleared');
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear local cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartItemCount = () => {
    // Always use local cart for now to avoid server errors
    const count = localCart.reduce((total, item) => total + item.quantity, 0);
    console.log('Local cart count:', count, 'localCart:', localCart);
    return count;
  };

  const value = {
    cart,
    localCart,
    cartLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
