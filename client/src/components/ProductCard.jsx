import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log('ProductCard: Add button clicked for product:', product._id);
    addToCart(product._id, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="card p-4 group">
      <div className="relative mb-4">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-green-600 font-bold text-2xl">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              /{product.unit}
            </span>
          </div>
          
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.5</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            Stock: {product.stock} {product.unit}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
