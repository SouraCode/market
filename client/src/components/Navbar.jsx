import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-800">GroceryMart</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/products"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Products
            </Link>
            {/* Info dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                Info
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/return-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Return Policy</Link>
                <Link to="/refund-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Refund Policy</Link>
                <Link to="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Privacy Policy</Link>
                <Link to="/disclaimer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Disclaimer</Link>
                <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact</Link>
              </div>
            </div>
            
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>

              <Link
                to="/products"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {getCartItemCount() > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>

              <Link
                to="/return-policy"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Return Policy
              </Link>
              <Link
                to="/refund-policy"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Refund Policy
              </Link>
              <Link
                to="/privacy-policy"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy Policy
              </Link>
              <Link
                to="/disclaimer"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Disclaimer
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
