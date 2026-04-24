import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          duration: 6000,
          style: {
            borderRadius: '0px',
            background: '#000',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '1px solid #fff',
            padding: '16px'
          },
        }}
        containerStyle={{
          bottom: 40,
          right: 40,
          zIndex: 99999,
        }}
      />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
