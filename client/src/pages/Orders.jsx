import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, Truck, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h1>
        <p className="text-gray-600">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-800">
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-green-600 font-bold text-sm">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                  <div className="text-gray-600">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Payment Method</h4>
                  <div className="text-gray-600 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </div>
                  <div className="text-gray-600">
                    Status: <span className={`font-medium ${
                      order.paymentStatus === 'paid' ? 'text-green-600' : 
                      order.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
