import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import { toast } from 'react-hot-toast';
import { CreditCard, MapPin, Phone, User, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    city: '',
    zip: '',
  });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('AUTH REQUIRED');
      navigate('/login');
      return;
    }

    setLoading(true);

    const res = await loadRazorpay();

    if (!res) {
      toast.error('RAZORPAY LOAD FAILED');
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: cartTotal * 100,
      currency: 'INR',
      name: 'Patterns Store',
      description: 'SECURE TRANSACTION',
      image: 'https://via.placeholder.com/128',
      handler: async function (response) {
        try {
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
              {
                user_id: user.id,
                total: cartTotal,
                status: 'paid',
              },
            ])
            .select()
            .single();

          if (orderError) throw orderError;

          const orderItems = cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

          if (itemsError) throw itemsError;

          toast.success('TRANSACTION SUCCESSFUL', {
            style: { borderRadius: '0', background: '#000', color: '#fff' }
          });
          clearCart();
          setOrderPlaced(true);
        } catch (error) {
          console.error('Order saving error:', error);
          toast.error('DATA SAVE ERROR');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: formData.name,
        email: user.email,
        contact: formData.phone,
      },
      theme: {
        color: '#000000',
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 border border-black">
          <CheckCircle2 className="w-12 h-12 text-black" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-6">TRANSACTION COMPLETE</h2>
        <p className="text-gray-400 mb-12 max-w-md mx-auto text-xs font-bold uppercase tracking-widest leading-loose">
          Your order has been logged into the Patterns Archive. Processing initiated.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-black text-white px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-xl"
        >
          View My Archive
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center text-gray-400 hover:text-black mb-12 font-black uppercase text-[10px] tracking-[0.2em] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" />
        <span>Return to Bag</span>
      </button>

      <h1 className="text-6xl font-black text-black mb-16 uppercase tracking-tighter">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white p-12 border border-black">
            <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-12 flex items-center">
                <MapPin className="w-5 h-5 mr-4" />
                Shipping Logistics
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Legal Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="FULL NAME"
                      className="w-full pl-12 pr-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <User className="absolute left-4 top-4.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Mobile Contact</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+00 000 000 000"
                      className="w-full pl-12 pr-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <Phone className="absolute left-4 top-4.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Delivery Address</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="LOCATION DETAILS"
                  className="w-full px-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Urban Center</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="CITY"
                    className="w-full px-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    placeholder="000000"
                    className="w-full px-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-12 border-t border-black mt-12">
                <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-8 flex items-center">
                    <CreditCard className="w-5 h-5 mr-4" />
                    Secure Payment
                </h3>
                <div className="border border-black p-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-black p-3 text-white mr-6">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest">RAZORPAY SECURE</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">UPI / CARDS / NETBANKING</p>
                        </div>
                    </div>
                    <div className="bg-black rounded-full p-1 text-white">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-4 mt-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AUTHORIZING...</span>
                  </>
                ) : (
                  <span>Initiate Transaction / ₹{cartTotal.toLocaleString()}</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Mini Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-10 border border-black sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Inventory Summary</h3>
            <div className="space-y-6 mb-10">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500 truncate mr-6">{item.name} / x{item.quantity}</span>
                  <span className="text-black whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-black pt-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Total</span>
                <span className="text-2xl font-black tracking-tighter text-black">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
