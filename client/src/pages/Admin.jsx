import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Bell, Package, CheckCircle, Clock, Truck, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, isAuthenticated, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/notifications'),
        axios.get('/api/admin/orders')
      ]);
      setNotifications(notifRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    try {
      await axios.delete('/api/admin/notifications');
      setNotifications([]);
      toast.success('Notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`/api/admin/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
      toast.success('Order deleted');
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const deleteAllOrders = async () => {
    if (!window.confirm('Are you sure you want to delete ALL orders? This cannot be undone.')) return;
    try {
      await axios.delete('/api/admin/orders');
      setOrders([]);
      toast.success('All orders have been deleted');
    } catch (error) {
      toast.error('Failed to delete orders');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage notifications and orders</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center gap-2`}
            >
              <Bell className="w-5 h-5" />
              Notifications
              {notifications.length > 0 && (
                <span className="bg-green-100 text-green-800 py-0.5 px-2.5 rounded-full text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center gap-2`}
            >
              <Package className="w-5 h-5" />
              Orders
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${notif.type === 'login' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {notif.type === 'login' ? <User className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{notif.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">All Orders</h2>
                {orders.length > 0 && (
                  <button
                    onClick={deleteAllOrders}
                    className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All Orders
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-y border-gray-200">
                        <th className="p-4 font-medium text-gray-600">Order ID</th>
                        <th className="p-4 font-medium text-gray-600">Customer</th>
                        <th className="p-4 font-medium text-gray-600">Date</th>
                        <th className="p-4 font-medium text-gray-600">Total</th>
                        <th className="p-4 font-medium text-gray-600">Status</th>
                        <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-100 h-16">
                          <td className="p-4 text-sm font-mono text-gray-600">
                            {order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="p-4 text-sm">
                            <div className="font-medium text-gray-800">
                              {order.user?.name || 'Unknown'}
                            </div>
                            <div className="text-gray-500">
                              {order.user?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-800">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className={`text-sm rounded-full px-3 py-1 font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
