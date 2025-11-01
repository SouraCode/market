import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cart, localCart, updateCartItem, removeFromCart, clearCart, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  // Always use local cart for now to avoid server errors
  const currentCartItems = localCart;
  const currentCartTotal = localCart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  if (currentCartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to your cart to get started
          </p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {currentCartItems.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-green-600 font-bold text-lg">
                          {item.product.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.product.price)} per {item.product.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {item.product.stock} {item.product.unit}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Items are saved locally in your browser. 
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                  Login to save permanently
                </Link>
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({getCartItemCount()} items)</span>
                <span>{formatPrice(currentCartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(currentCartTotal * 0.08)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>{formatPrice(currentCartTotal + currentCartTotal * 0.08)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-4 text-center">
              <Link
                to="/products"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
