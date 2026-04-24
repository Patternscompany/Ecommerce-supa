import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ChevronRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 border border-gray-100">
          <ShoppingBag className="w-12 h-12 text-gray-200" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-6">BAG IS EMPTY</h2>
        <p className="text-gray-400 mb-12 max-w-md mx-auto text-xs font-bold uppercase tracking-[0.2em] leading-loose">
          Your inventory is currently null. Explore the 2026 collection to add patterns.
        </p>
        <Link
          to="/products"
          className="bg-black text-white px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-xl inline-flex items-center space-x-3"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-12">
        <Link to="/" className="hover:text-black">Patterns</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black">Bag</span>
      </nav>

      <h1 className="text-6xl font-black text-black mb-16 uppercase tracking-tighter">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 border border-black flex flex-col sm:flex-row items-center gap-10 hover:bg-gray-50 transition-colors"
            >
              <div className="w-32 h-32 bg-gray-100 border border-black overflow-hidden flex-shrink-0">
                <img
                  src={item.image_url || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">{item.name}</h3>
                <p className="text-lg font-black text-black tracking-tighter">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center border border-black p-1 bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-black hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-black text-black text-sm min-w-[40px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-black hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-gray-400 hover:text-black transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-black p-10 text-white sticky top-24">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-10">Summary</h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Shipping</span>
                <span className="text-white">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Order Code</span>
                <span className="text-white">PTRN-AUTO</span>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Total Amount</span>
                <span className="text-4xl font-black tracking-tighter">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-white text-black py-6 font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center space-x-4"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="mt-10 pt-10 border-t border-gray-900 text-center">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">Encrypted Transactions Only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
