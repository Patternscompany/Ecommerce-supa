import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw, Minus, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ITEM(S) ADDED`, {
      style: {
        borderRadius: '0px',
        background: '#000',
        color: '#fff',
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '0.1em'
      }
    });
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">ITEM NOT FOUND</h2>
      <Link to="/products" className="text-black font-bold uppercase text-xs tracking-widest hover:line-through">Back to Collection</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-black mb-12 transition-colors group uppercase font-bold text-[10px] tracking-[0.2em]">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" />
        <span>Return to Shop</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <div className="bg-gray-50 p-12 border border-black overflow-hidden group">
            <img
              src={product.image_url || 'https://via.placeholder.com/600?text=Product'}
              alt={product.name}
              className="w-full h-auto object-contain grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-12">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-black text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center text-black">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 text-gray-300" />
                <span className="text-gray-400 text-[10px] ml-4 font-bold uppercase tracking-widest">Global Reviews / 42</span>
              </div>
            </div>
            <h1 className="text-6xl font-black text-black mb-6 uppercase tracking-tighter leading-none">{product.name}</h1>
            <p className="text-3xl font-black text-black mb-10 tracking-tighter">₹{product.price.toLocaleString()}</p>
            <div className="prose prose-sm border-t border-black pt-10">
                <p className="text-gray-600 leading-relaxed font-medium uppercase text-xs tracking-wide">{product.description}</p>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 mb-12">
              <div className="flex items-center border border-black p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-8 font-black text-black text-lg min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-grow bg-black text-white py-5 px-10 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'SOLD OUT' : 'ADD TO BAG'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-black">
              <div className="flex flex-col items-center p-6 border-b sm:border-b-0 sm:border-r border-black text-center">
                <ShieldCheck className="w-5 h-5 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">2YR WARRANTY</p>
              </div>
              <div className="flex flex-col items-center p-6 border-b sm:border-b-0 sm:border-r border-black text-center">
                <Truck className="w-5 h-5 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">FREE SHIPPING</p>
              </div>
              <div className="flex flex-col items-center p-6 text-center">
                <RefreshCcw className="w-5 h-5 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">14D RETURNS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
