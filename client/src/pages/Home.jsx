import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products?featured=true&limit=8'),
        axios.get('/api/products/categories/list')
      ]);
      
      setFeaturedProducts(productsRes.data.products);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Free Delivery",
      description: "Free delivery on orders over $50"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure Payment",
      description: "100% secure payment processing"
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-green-600" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <Star className="h-8 w-8 text-green-600" />,
      title: "Quality Guarantee",
      description: "Fresh products guaranteed"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh Groceries
              <span className="block text-green-200">Delivered to Your Door</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Shop the freshest produce, dairy, meat, and more from local farmers and trusted suppliers. 
              Fast delivery, great prices, and quality you can trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=fruits"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                Browse Fruits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find everything you need organized by category
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group"
              >
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 group-hover:scale-105 transform transition-transform">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 font-bold text-lg">
                      {category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked fresh products from our best suppliers
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-3"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get the latest deals, new products, and seasonal offers delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
