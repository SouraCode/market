import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    setQuantity(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-green-600">Products</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <span className="text-green-600 font-bold text-6xl">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              {product.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">4.5 (128 reviews)</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                Stock: {product.stock} {product.unit}
              </span>
            </div>
          </div>

          <div className="text-3xl font-bold text-green-600">
            {formatPrice(product.price)}
            <span className="text-lg text-gray-500 font-normal ml-2">
              per {product.unit}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Fresh and high quality
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Direct from trusted suppliers
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Fast delivery available
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                30-day return policy
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
