import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../supabase/supabaseClient';
import { ArrowRight, Smartphone, Laptop, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setFeaturedProducts(data);
      }
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Mobiles', icon: <Smartphone className="w-8 h-8" />, color: 'border-black text-black' },
    { name: 'Laptops', icon: <Laptop className="w-8 h-8" />, color: 'border-black text-black' },
    { name: 'Accessories', icon: <Headphones className="w-8 h-8" />, color: 'border-black text-black' },
  ];

  return (
    <div className="pb-16">
      <Hero />

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Collections</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group bg-white p-12 border border-black hover:bg-black hover:text-white transition-all flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className={`p-6 border-2 mb-6 group-hover:border-white transition-colors ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{cat.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400 mb-6">Archive 2026</p>
              <div className="flex items-center font-black text-[10px] uppercase tracking-[0.2em]">
                <span>Discover</span>
                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-24 border-t border-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Featured</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mt-2">Curated Selection / 001</p>
            </div>
            <Link to="/products" className="text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center hover:line-through">
              <span>View All</span>
              <ArrowRight className="w-3 h-3 ml-2" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-black">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Inventory Empty</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-black p-12 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
              Stay in the Loop.
            </h2>
            <p className="text-gray-400 mb-12 text-sm font-bold uppercase tracking-widest">
              Exclusive drops, technical deep-dives, and early access.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 border border-white p-1">
              <input
                type="email"
                placeholder="ENTER EMAIL"
                className="flex-grow px-6 py-4 bg-black focus:outline-none text-white font-bold text-xs tracking-[0.3em]"
              />
              <button className="bg-white text-black px-10 py-4 font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
