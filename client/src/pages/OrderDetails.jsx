import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
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

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
        <button onClick={() => navigate('/orders')} className="btn-primary">
          Back to Orders
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'pending', name: 'Order Placed', icon: Clock },
    { id: 'processing', name: 'Processing', icon: Package },
    { id: 'shipped', name: 'Shipped', icon: Truck },
    { id: 'delivered', name: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Orders</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-4 md:mt-0 text-2xl font-bold text-green-600">
            {formatPrice(order.total)}
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Status</h2>
          
          {isCancelled ? (
            <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-lg">
              <XCircle className="h-6 w-6" />
              <span className="font-semibold text-lg">This order has been cancelled</span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
              ></div>
              
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`mt-3 text-sm font-medium ${
                        isCompleted ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {order.status === 'shipped' && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-start space-x-4">
              <Truck className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-800 font-semibold mb-1">Your order is on the way!</h4>
                <p className="text-blue-600 text-sm">
                  The admin has shipped your order. It will be delivered to your shipping address soon. 
                  Have your items ready to receive!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Shipping & Payment Details */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="mb-6">
              <h3 className="text-gray-800 font-semibold flex items-center mb-3">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                Shipping Address
              </h3>
              <div className="text-gray-600 text-sm ml-7 bg-gray-50 p-4 rounded-lg">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-semibold flex items-center mb-3">
                <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                Payment Information
              </h3>
              <div className="text-gray-600 text-sm ml-7 bg-gray-50 p-4 rounded-lg">
                <p className="capitalize mb-1">Method: <span className="font-medium text-gray-800">{order.paymentMethod.replace('_', ' ')}</span></p>
                <p>Status: <span className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 
                  order.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>{order.paymentStatus.toUpperCase()}</span></p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-green-600 font-bold">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product?._id}`} className="font-medium text-gray-800 truncate hover:text-green-600 transition">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-gray-800 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-800">Total</span>
                <span className="text-green-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
