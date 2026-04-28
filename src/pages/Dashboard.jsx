import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, User, ChevronRight, Plus, Users, LogOut, Edit, Trash2, Save, X, Search, ShieldCheck, ShieldAlert, UserMinus, ChevronLeft } from 'lucide-react';
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

  // Inventory Management State
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [viewingUser, setViewingUser] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');

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

  const fetchInventory = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setInventory(data || []);
    setActiveTab('admin-inventory');
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleUpdateProduct = async () => {
    const { error } = await supabase
      .from('products')
      .update(editForm)
      .eq('id', editingId);

    if (error) {
      toast.error('UPDATE FAILED');
    } else {
      toast.success('PRODUCT UPDATED');
      setEditingId(null);
      fetchInventory();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('PERMANENTLY REMOVE FROM ARCHIVE?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('DELETE FAILED');
    } else {
      toast.success('PRODUCT REMOVED');
      fetchInventory();
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast.error('ROLE UPDATE FAILED');
    } else {
      toast.success(`USER PROMOTED TO ${newRole.toUpperCase()}`);
      if (viewingUser) setViewingUser({ ...viewingUser, role: newRole });
      fetchAllUsers();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('PERMANENTLY REMOVE USER PROFILE?')) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      toast.error('DELETE FAILED');
    } else {
      toast.success('USER PROFILE REMOVED');
      setViewingUser(null);
      fetchAllUsers();
    }
  };

  const openUserDetail = async (targetUser) => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*, products (*))`)
      .eq('user_id', targetUser.id)
      .order('created_at', { ascending: false });

    setViewingUser({ ...targetUser, orders: data || [] });
    setLoading(false);
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
      if (activeTab === 'admin-inventory') fetchInventory();
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
                    onClick={fetchInventory}
                    className={`w-full flex items-center justify-between p-4 text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'admin-inventory' ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'}`}
                  >
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-4" />
                      <span>Inventory</span>
                    </div>
                    <ChevronRight className="w-3 h-3" />
                  </button>
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
              <div className="flex justify-between items-end">
                <h1 className="text-5xl font-black uppercase tracking-tighter">Add to Collection</h1>
                <button
                  onClick={fetchInventory}
                  className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500"
                >
                  Back to Inventory
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="bg-white border border-black p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product Name</label>
                    <input
                      required className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Price (INR)</label>
                    <input
                      required type="number" className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                    <select
                      className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option>Mobiles</option><option>Laptops</option><option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Stock Units</label>
                    <input
                      required type="number" className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                      value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                  <textarea
                    required className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                    value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image URL</label>
                  <input
                    required className="w-full border border-black p-4 text-xs font-bold uppercase tracking-widest focus:bg-black focus:text-white outline-none"
                    value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  />
                </div>
                <button type="submit" className="bg-black text-white w-full py-5 font-black uppercase text-xs tracking-widest hover:bg-gray-800">
                  Register Pattern
                </button>
              </form>
            </div>
          )}

          {activeTab === 'admin-inventory' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <h1 className="text-5xl font-black uppercase tracking-tighter">Inventory</h1>
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="SEARCH COLLECTION..."
                      className="w-full border border-black p-3 pl-10 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-gray-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setActiveTab('admin-products')}
                    className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Pattern</span>
                  </button>
                </div>
              </div>

              <div className="border border-black bg-white overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white text-[10px] font-black uppercase tracking-widest">
                      <th className="p-6">Product</th>
                      <th className="p-6">Details</th>
                      <th className="p-6">Stock</th>
                      <th className="p-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {inventory.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-6 align-top">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 border border-black flex-shrink-0 overflow-hidden">
                              <img src={p.image_url} alt="" className="w-full h-full object-cover grayscale" />
                            </div>
                            <div className="space-y-1">
                              {editingId === p.id ? (
                                <input
                                  className="border border-black p-2 text-[10px] font-black uppercase w-full outline-none"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                              ) : (
                                <p className="font-black text-xs uppercase tracking-tighter">{p.name}</p>
                              )}
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 align-top max-w-xs">
                          {editingId === p.id ? (
                            <div className="space-y-4">
                              <div className="flex gap-2 items-center">
                                <span className="text-[9px] font-black text-gray-400">₹</span>
                                <input
                                  type="number"
                                  className="border border-black p-2 text-[10px] font-black uppercase w-24 outline-none"
                                  value={editForm.price}
                                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                />
                              </div>
                              <textarea
                                className="border border-black p-2 text-[9px] font-bold uppercase w-full h-20 outline-none"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="font-black text-xs tracking-tighter">₹{p.price.toLocaleString()}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase leading-relaxed line-clamp-2">{p.description}</p>
                            </div>
                          )}
                        </td>
                        <td className="p-6 align-top">
                          {editingId === p.id ? (
                            <input
                              type="number"
                              className="border border-black p-2 text-[10px] font-black uppercase w-20 outline-none"
                              value={editForm.stock}
                              onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                            />
                          ) : (
                            <div className="inline-flex items-center px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest">
                              {p.stock} Units
                            </div>
                          )}
                        </td>
                        <td className="p-6 align-top">
                          <div className="flex gap-3">
                            {editingId === p.id ? (
                              <>
                                <button
                                  onClick={handleUpdateProduct}
                                  className="p-2 bg-black text-white border border-black hover:bg-gray-800"
                                  title="Save Changes"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-2 border border-black hover:bg-gray-100"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(p)}
                                  className="p-2 border border-black hover:bg-black hover:text-white transition-all"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 border border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {inventory.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-20 text-center">
                          <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">THE ARCHIVE IS EMPTY</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admin-users' && (
            <div className="space-y-12">
              {!viewingUser ? (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <h1 className="text-5xl font-black uppercase tracking-tighter">User Logistics</h1>
                    <div className="relative w-full md:w-80">
                      <input
                        type="text"
                        placeholder="SEARCH USERS..."
                        className="w-full border border-black p-3 pl-10 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-gray-50"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="border border-black divide-y divide-black bg-white">
                    {allUsers.filter(u => u.email.toLowerCase().includes(userSearchQuery.toLowerCase())).map((u) => (
                      <div key={u.id} className="p-8 hover:bg-gray-50 transition-all group cursor-pointer" onClick={() => openUserDetail(u)}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                          <div className="flex items-center space-x-6">
                            <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-black text-xl">
                              {u.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="font-black text-sm uppercase tracking-tighter">{u.email}</p>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-black text-white' : 'border border-black text-black'}`}>
                                  {u.role}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {u.id.slice(0, 18)}...</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors">View Details</p>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setViewingUser(null)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Registry</span>
                    </button>
                    <div className="flex gap-4">
                      {viewingUser.role === 'client' ? (
                        <button
                          onClick={() => handleUpdateUserRole(viewingUser.id, 'admin')}
                          className="flex items-center gap-2 px-6 py-2 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Promote to Admin</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateUserRole(viewingUser.id, 'client')}
                          className="flex items-center gap-2 px-6 py-2 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Demote to Client</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(viewingUser.id)}
                        className="flex items-center gap-2 px-6 py-2 border border-red-500 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        <UserMinus className="w-4 h-4" />
                        <span>Delete Profile</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                      <div className="border border-black p-10 bg-white text-center">
                        <div className="w-24 h-24 bg-black text-white flex items-center justify-center mb-6 mx-auto text-4xl font-black uppercase">
                          {viewingUser.email[0]}
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 break-all">
                          {viewingUser.email.split('@')[0]}
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">{viewingUser.email}</p>

                        <div className="pt-8 border-t border-dashed border-gray-200 text-left space-y-4">
                          <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">ACCOUNT TYPE</p>
                            <p className="text-xs font-black uppercase tracking-tighter">{viewingUser.role}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">REGISTRATION ID</p>
                            <p className="text-[10px] font-bold uppercase tracking-tighter break-all">{viewingUser.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Transaction Archive</h3>
                      <div className="space-y-6">
                        {viewingUser.orders.length === 0 ? (
                          <div className="border border-dashed border-gray-300 p-20 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No transactions recorded for this signature</p>
                          </div>
                        ) : (
                          viewingUser.orders.map(o => <OrderCard key={o.id} order={o} />)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
    <div className="p-8 space-y-8">
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

      {(order.shipping_address || order.transaction_id) && (
        <div className="pt-8 border-t border-black grid grid-cols-1 md:grid-cols-2 gap-8">
          {order.shipping_address && (
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">SHIPPING ARCHIVE</p>
              <p className="text-[10px] font-bold uppercase leading-relaxed">{order.shipping_address}</p>
            </div>
          )}
          <div className="space-y-4">
            {order.payment_method && (
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">PAYMENT PROTOCOL</p>
                <p className="text-[10px] font-bold uppercase tracking-tighter">{order.payment_method}</p>
              </div>
            )}
            {order.transaction_id && (
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">TRANSACTION HASH</p>
                <p className="text-[10px] font-bold uppercase tracking-tighter break-all">{order.transaction_id}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;
