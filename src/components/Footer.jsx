import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Camera } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-12 mt-auto border-t border-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Patterns Store</h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-loose">
              Defining the aesthetics of technology. Minimalist electronics for the modern creator.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-gray-500">Navigation</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><a href="/" className="hover:line-through transition-all">Home</a></li>
              <li><a href="/products" className="hover:line-through transition-all">Products</a></li>
              <li><a href="/cart" className="hover:line-through transition-all">Cart</a></li>
              <li><a href="/dashboard" className="hover:line-through transition-all">Account</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-gray-500">Contact</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-white" />
                <span>Tokyo, JP / New York, US</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-white" />
                <span>+1 800 PATTERNS</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white" />
                <span>studio@patterns.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-gray-500">Join the Lab</h4>
            <div className="flex border border-white p-1">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-black text-white px-3 py-2 focus:outline-none w-full text-[10px] font-bold tracking-widest"
              />
              <button className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors text-[10px] font-black uppercase tracking-widest">
                Join
              </button>
            </div>
            <div className="flex space-x-6 mt-8">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-900 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Patterns Store. All rights reserved.
          </p>
          <div className="flex space-x-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
