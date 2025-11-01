import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
// Razorpay checkout script loader
const loadRazorpayScript = () => new Promise((resolve) => {
  const existing = document.getElementById('razorpay-sdk');
  if (existing) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.id = 'razorpay-sdk';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const Checkout = () => {
  const { cart, clearCart, localCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'United States'
    },
    paymentMethod: 'credit_card'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // If user is not authenticated but has items in local cart, force login first
    if (!isAuthenticated && localCart && localCart.length > 0) {
      setLoading(false);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const orderData = {
        ...formData,
        total: cart.total + cart.total * 0.08 // Including tax
      };

      const response = await axios.post('/api/orders/create', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Demo UPI flow: create UPI URI and open it (for testing); then confirm
  const handleUPIPay = async () => {
    setLoading(true);
    try {
      // Create order on server first (requires auth) - in this demo we assume order is created via /api/orders/create previously
      // For demo: create order and then request UPI payload
      const createRes = await axios.post('/api/orders/create', { ...formData, total: cart.total + cart.total * 0.08 });
      const orderId = createRes.data._id;

      const res = await axios.post('/api/payments/upi/create', { orderId });
      const { upiUri } = res.data;

      // Try to open deep link (mobile) or open in new tab
      window.open(upiUri, '_blank');

      // In a real flow the bank/UPI app would callback/notify; here we provide a confirm button to mark paid (demo)
      toast.success('UPI payment initiated. Click Confirm Payment once you complete payment in your UPI app.');

      // Store the orderId temporarily so user can confirm
      sessionStorage.setItem('pendingOrderId', orderId);
    } catch (error) {
      console.error('UPI create error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate UPI payment');
    } finally {
      setLoading(false);
    }
  };

  const handleUPIConfirm = async () => {
    const orderId = sessionStorage.getItem('pendingOrderId');
    if (!orderId) return toast.error('No pending UPI payment found');
    setLoading(true);
    try {
      const res = await axios.post('/api/payments/upi/confirm', { orderId });
      toast.success('UPI payment confirmed');
      clearCart();
      sessionStorage.removeItem('pendingOrderId');
      navigate(`/orders/${res.data.order._id}`);
    } catch (error) {
      console.error('UPI confirm error:', error);
      toast.error('Failed to confirm UPI payment');
    } finally {
      setLoading(false);
    }
  };

  // Razorpay flow (client): create an app order, ask server to create razorpay order, open checkout
  const handleRazorpay = async () => {
    setLoading(true);
    try {
      // 1) create app order on server (requires auth)
      const createRes = await axios.post('/api/orders/create', { ...formData, total: cart.total + cart.total * 0.08 });
      const orderId = createRes.data._id;

      // 2) request razorpay order from server
      const rRes = await axios.post('/api/payments/razorpay/create-order', { orderId });
      const { rOrder } = rRes.data;

      // 3) load razorpay script
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error('Failed to load Razorpay SDK');

      const options = {
        key: process.env.REACT_APP_RP_KEY_ID || '', // optional, used if embedded during build
        amount: rOrder.amount,
        currency: rOrder.currency,
        name: 'Grocery Market',
        description: `Order ${orderId}`,
        order_id: rOrder.id,
        handler: async function (response) {
          // Verify payment on server
          try {
            const verifyRes = await axios.post('/api/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            });
            toast.success('Payment successful');
            clearCart();
            navigate(`/orders/${verifyRes.data.order._id}`);
          } catch (err) {
            toast.error('Payment verification failed');
            console.error(err);
          }
        }
      };

      // eslint-disable-next-line no-undef
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      toast.error(error.response?.data?.message || 'Razorpay payment failed');
    } finally {
      setLoading(false);
    }
  };

  // On mount, if user is not authenticated but has items in localCart, redirect to login
  useEffect(() => {
    if (!isAuthenticated && localCart && localCart.length > 0) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, []); // run once on mount

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to your cart before checkout
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-600">
          Complete your order in just a few steps
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Truck className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="shippingAddress.street"
                  value={formData.shippingAddress.street}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="shippingAddress.city"
                  value={formData.shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="New York"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="shippingAddress.state"
                  value={formData.shippingAddress.state}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="NY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="shippingAddress.zipCode"
                  value={formData.shippingAddress.zipCode}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="10001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="shippingAddress.country"
                  value={formData.shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="credit_card"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="credit_card" className="text-gray-700">
                  Credit Card
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="debit_card"
                  name="paymentMethod"
                  value="debit_card"
                  checked={formData.paymentMethod === 'debit_card'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="debit_card" className="text-gray-700">
                  Debit Card
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="paypal" className="text-gray-700">
                  PayPal
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="cash_on_delivery"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="cash_on_delivery" className="text-gray-700">
                  Cash on Delivery
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="upi" className="text-gray-700">
                  UPI (Paytm / Google Pay / PhonePe)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="braintree"
                  name="paymentMethod"
                  value="braintree"
                  checked={formData.paymentMethod === 'braintree'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="braintree" className="text-gray-700">
                  Card (Braintree)
                </label>
              </div>
            </div>

            {formData.paymentMethod !== 'cash_on_delivery' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> This is a demo application. No actual payment will be processed.
                  Your order will be marked as paid automatically.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-green-600 font-bold text-sm">
                        {item.product.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(cart.total * 0.08)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>{formatPrice(cart.total + cart.total * 0.08)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Place Order</span>
                </>
              )}
              </button>

              {/* UPI quick actions (demo) */}
              {formData.paymentMethod === 'upi' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleUPIPay}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Pay with UPI
                  </button>
                  <button
                    type="button"
                    onClick={handleUPIConfirm}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Confirm UPI Payment
                  </button>
                </div>
              )}

              {/* Braintree placeholder UI */}
              {formData.paymentMethod === 'braintree' && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    To use Braintree card payments you must configure Braintree keys in the server (.env) and integrate the Braintree JS SDK (Drop-in or Hosted Fields) on the client. The server provides endpoints to request a client token and submit a nonce to complete the transaction.
                  </p>
                </div>
              )}
              {(formData.paymentMethod === 'braintree' || formData.paymentMethod === 'credit_card') && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleRazorpay}
                    disabled={loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Pay with Razorpay
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
