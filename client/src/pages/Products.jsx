import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, Grid, List, Search } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: 'newest',
    page: parseInt(searchParams.get('page')) || 1
  });
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', '12');

      console.log('Fetching products with params:', params.toString());
      const response = await axios.get(`/api/products?${params}`);
      console.log('Products response:', response.data);
      
      setProducts(response.data.products);
      setPagination({
        totalPages: response.data.totalPages,
        currentPage: parseInt(response.data.currentPage),
        total: response.data.total
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      page: 1
    });
    setSearchParams({});
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            i === pagination.currentPage
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
        <p className="text-gray-600">
          {pagination.total ? `${pagination.total} products found` : 'No products found'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <Filter className="h-5 w-5 text-gray-500" />
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full btn-secondary text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
