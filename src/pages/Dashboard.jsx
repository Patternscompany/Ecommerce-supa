import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, User, ChevronRight, Plus, Users, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: 'Mobiles', description: '', image_url: '', stock: ''
  });

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setLoading(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role === 'admin') {
        setIsAdmin(true);
      }

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

  const fetchAllUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setAllUsers(data || []);
    setActiveTab('admin-users');
  };

  const fetchUserOrders = async (userId) => {
    // If clicking same user, toggle off
    if (selectedUserId === userId) {
      setSelectedUserId(null);
      setSelectedUserOrders([]);
      return;
    }

    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*, products (*))`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    setSelectedUserId(userId);
    setSelectedUserOrders(data || []);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([newProduct]);
    if (error) {
      console.error('Add Product Error:', error);
      toast.error(`FAILED: ${error.message.toUpperCase()}`);
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
          <div className="border border-black p-10 sticky top-24 bg-white">
            <div className="w-20 h-20 bg-black text-white flex items-center justify-center mb-8 mx-auto text-3xl font-black uppercase">
              {user?.email[0]}
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

              <button 
                onClick={signOut}
                className="w-full flex items-center justify-between p-4 text-[10px] font-black uppercase tracking-widest border border-transparent text-gray-400 hover:text-black hover:border-black transition-all mt-12"
              >
                <div className="flex items-center">
                  <LogOut className="w-4 h-4 mr-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:w-3/4">
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image URL</label>
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
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${selectedUserId === u.id ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-black hover:text-white'}`}
                      >
                        {selectedUserId === u.id ? 'Close History' : 'Check History'}
                      </button>
                    </div>
                    
                    {selectedUserId === u.id && (
                      <div className="mt-8 pt-8 border-t border-dashed border-gray-300 space-y-6">
                        {selectedUserOrders.length === 0 ? (
                          <div className="py-10 text-center border border-dashed border-gray-200">
                            <p className="text-[10px] font-black text-gray-400 uppercase">NO TRANSACTION HISTORY RECORDED</p>
                          </div>
                        ) : (
                          selectedUserOrders.map(o => <OrderCard key={o.id} order={o} />)
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

const OrderCard = ({ order }) => (
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
