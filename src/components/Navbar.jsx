import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-black sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black uppercase tracking-tighter flex items-center">
            Patterns Store
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="SEARCH PATTERNS..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-black focus:outline-none focus:bg-black focus:text-white placeholder-gray-400 transition-all uppercase text-xs tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </form>

          {/* Icons/Links */}
          <div className="flex items-center space-x-6">
            <Link to="/products" className="hidden sm:block text-xs font-bold uppercase tracking-widest hover:line-through">
              Shop
            </Link>
            
            <Link to="/cart" className="relative text-black">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/dashboard" className="flex items-center">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm uppercase transition-transform hover:scale-110">
                  {user?.email[0]}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-black text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-4 relative">
          <input
            type="text"
            placeholder="SEARCH..."
            className="w-full pl-10 pr-4 py-2 border border-black focus:outline-none uppercase text-xs tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-black py-8 px-4 space-y-6">
          <Link to="/products" className="block text-xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
            Collection
          </Link>
          <Link to="/categories/Mobiles" className="block text-xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
            Mobiles
          </Link>
          <Link to="/categories/Laptops" className="block text-xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
            Laptops
          </Link>
          {user && (
            <Link to="/dashboard" className="block text-xl font-black uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
              My Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
