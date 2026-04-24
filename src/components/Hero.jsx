import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative bg-white text-black border-b border-black overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <span className="inline-block border border-black px-4 py-1 mb-6 text-xs font-bold uppercase tracking-[0.3em]">
              NEW ARRIVALS 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.85] tracking-tighter uppercase">
              Bold <br />
              Patterns <br />
              Store.
            </h1>
            <p className="text-lg font-medium mb-12 max-w-md leading-relaxed text-gray-600 uppercase tracking-tight">
              Premium electronics reimagined through a monochromatic lens. Minimalist design, maximalist performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-black text-white px-10 py-5 font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all flex items-center justify-center space-x-3 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/categories/Laptops"
                className="border border-black text-black px-10 py-5 font-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all text-center"
              >
                Laptops
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="md:w-1/2 relative"
          >
            <div className="relative z-10 p-2 border-2 border-black">
               <img
                 src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=800&q=80"
                 alt="Minimal Tech"
                 className="grayscale contrast-125"
               />
            </div>
            
            {/* Floating Label */}
            <div className="absolute -bottom-10 -right-4 bg-black text-white p-6 hidden lg:block border-2 border-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-1">DESIGN CODE</p>
                <p className="text-2xl font-black uppercase tracking-tighter">PTRN-2026</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
