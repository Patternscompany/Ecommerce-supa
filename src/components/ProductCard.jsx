import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} ADDED`, {
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

  return (
    <div className="bg-white group border border-black overflow-hidden relative">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50 border-b border-black">
        <img
          src={product.image_url || 'https://via.placeholder.com/300?text=Product'}
          alt={product.name}
          className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
           <div className="bg-white border border-black p-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <Eye className="w-5 h-5 text-black" />
           </div>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-tighter">
            LIMITED
          </span>
        )}
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
              {product.category}
            </p>
            <h3 className="font-black text-lg text-black uppercase tracking-tighter line-clamp-1">
              {product.name}
            </h3>
          </div>
          <span className="font-black text-black">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-white text-black border border-black hover:bg-black hover:text-white'
          }`}
        >
          {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
