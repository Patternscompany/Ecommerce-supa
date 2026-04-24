import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../supabase/supabaseClient';
import { Filter, Search } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryFilter, searchQuery]);

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const categories = ['All', 'Mobiles', 'Laptops', 'Accessories'];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-black mb-4">
            {searchQuery ? `SEARCH: "${searchQuery}"` : categoryFilter ? categoryFilter : 'COLLECTION'}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
            Total Items / {products.length}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="SEARCH CATALOGUE..."
              className="w-full pl-12 pr-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
              onChange={(e) => {
                if (e.target.value) {
                  searchParams.set('search', e.target.value);
                } else {
                  searchParams.delete('search');
                }
                setSearchParams(searchParams);
              }}
              value={searchQuery || ''}
            />
            <Search className="absolute left-4 top-4.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-12">
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="w-4 h-4 text-black" />
              <h3 className="font-black uppercase text-xs tracking-[0.2em]">Categories</h3>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                    (cat === 'All' && !categoryFilter) || categoryFilter === cat
                      ? 'bg-black text-white border-black'
                      : 'text-black border-transparent hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black p-8 text-white">
            <h4 className="font-black text-xs uppercase tracking-widest mb-4">Shipping</h4>
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider mb-6">
              Complimentary shipping on all orders over ₹5,000.
            </p>
            <div className="border-t border-gray-800 pt-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">2026 Archive</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <LoadingSpinner />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-black">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-2">No Results</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Refine your parameters</p>
              <button
                onClick={() => setSearchParams({})}
                className="bg-black text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
