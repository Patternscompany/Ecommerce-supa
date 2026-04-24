import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Clock, CheckCircle, CreditCard, User, Mail, Calendar, Plus, Users, LayoutDashboard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'admin-products', 'admin-users'
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Admin Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: 'Mobiles', description: '', image_url: '', stock: ''
  });

  // Admin Data State
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setLoading(true);

      // Check if user is Admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      console.log('User Profile:', profile);
      if (profileError) console.error('Profile Fetch Error:', profileError);

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else if (!profile) {
        console.warn('No profile found for this user. Did you run the SQL script?');
        toast.error('Profile not found. Please run the SQL setup script.');
      }

      // Fetch User Orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select(`*, order_items (*, products (*))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOrders(userOrders || []);
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  // Admin: Fetch All Users
  const fetchAllUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setAllUsers(data || []);
    setActiveTab('admin-users');
  };

  // Admin: Fetch Specific User Orders
  const fetchUserOrders = async (userId) => {
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*, products (*))`)
      .eq('user_id', userId);
    setSelectedUserOrders(data || []);
  };

  // Admin: Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([newProduct]);
    if (error) {
      toast.error('FAILED TO ADD PRODUCT');
    } else {
      toast.success('PRODUCT ADDED TO ARCHIVE');
      setNewProduct({ name: '', price: '', category: 'Mobiles', description: '', image_url: '', stock: '' });
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4">
          <div className="border border-black p-10 sticky top-24">
            <div className="w-20 h-20 bg-black text-white flex items-center justify-center mb-8 mx-auto">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-center mb-2 truncate">
              {user?.email?.split('@')[0]}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-10">
              {isAdmin ? 'ADMINISTRATOR' : 'CLIENT ARCHIVE'}
            </p>

            <nav className="space-y-4">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-4 text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'orders' ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'}`}
              >
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-4" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="w-3 h-3" />
              </button>

              {isAdmin && (
                <>
                  <div className="pt-6 pb-2 px-4 border-t border-gray-100 mt-6">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">ADMIN PANEL</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('admin-products')}
                    className={`w-full flex items-center justify-between p-4 text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'admin-products' ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'}`}
                  >
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 mr-4" />
                      <span>Add Product</span>
                    </div>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={fetchAllUsers}
                    className={`w-full flex items-center justify-between p-4 text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'admin-users' ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'}`}
                  >
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-4" />
                      <span>User Control</span>
                    </div>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:w-3/4">
          {/* USER ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-12">
              <h1 className="text-5xl font-black uppercase tracking-tighter">My Archive</h1>
              {orders.length === 0 ? (
                <div className="border border-black p-20 text-center">
                  <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No transaction history found</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADMIN: ADD PRODUCT TAB */}
          {activeTab === 'admin-products' && (
            <div className="space-y-12">
              <h1 className="text-5xl font-black uppercase tracking-tighter">Add to Collection</h1>
              <form onSubmit={handleAddProduct} className="bg-white border border-black p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product Name</label>
                    <input 
                      required className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Price (INR)</label>
                    <input 
                      required type="number" className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                    <select 
                      className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option>Mobiles</option><option>Laptops</option><option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Stock Units</label>
                    <input 
                      required type="number" className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                  <textarea 
                    required className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                    value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image URL (Unsplash/Direct)</label>
                  <input 
                    required className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                    value={newProduct.image_url} onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                  />
                </div>
                <button type="submit" className="bg-black text-white w-full py-5 font-black uppercase text-xs tracking-widest hover:bg-gray-800">
                  Register Pattern
                </button>
              </form>
            </div>
          )}

          {/* ADMIN: USER CONTROL TAB */}
          {activeTab === 'admin-users' && (
            <div className="space-y-12">
              <h1 className="text-5xl font-black uppercase tracking-tighter">User Logistics</h1>
              <div className="border border-black divide-y divide-black">
                {allUsers.map((u) => (
                  <div key={u.id} className="p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black">
                          {u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tighter">{u.email}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => fetchUserOrders(u.id)}
                        className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
                      >
                        Check History
                      </button>
                    </div>
                    {/* Nested User Orders */}
                    {selectedUserOrders && selectedUserOrders[0]?.user_id === u.id && (
                      <div className="mt-8 pt-8 border-t border-dashed border-gray-300 space-y-6">
                        {selectedUserOrders.length === 0 ? (
                          <p className="text-center text-[10px] font-black text-gray-400 uppercase">NO TRANSACTION HISTORY</p>
                        ) : (
                          selectedUserOrders.map(o => <OrderCard key={o.id} order={o} minimal />)
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const OrderCard = ({ order, minimal = false }) => (
  <div className="border border-black overflow-hidden bg-white">
    <div className="bg-black text-white p-6 flex justify-between items-center">
      <div className="flex gap-10">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1 opacity-50">DATE</p>
          <p className="text-xs font-black tracking-tighter">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1 opacity-50">VALUE</p>
          <p className="text-xs font-black tracking-tighter">₹{order.total.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white text-black px-4 py-1 text-[8px] font-black uppercase tracking-widest">
        {order.status}
      </div>
    </div>
    <div className="p-8 space-y-6">
      {order.order_items?.map((item) => (
        <div key={item.id} className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-50 border border-black overflow-hidden flex-shrink-0">
            <img src={item.products?.image_url} alt="" className="w-full h-full object-cover grayscale" />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-tighter">{item.products?.name}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">QTY: {item.quantity} / UNIT: ₹{item.price.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;
