import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updatePassword(password);
    if (error) {
      toast.error(error.message.toUpperCase(), {
        style: { borderRadius: '0', background: '#000', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
      });
    } else {
      toast.success('PASSWORD UPDATED', {
        style: { borderRadius: '0', background: '#000', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
      });
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full">
        <div className="border border-black p-12 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black mb-4">Reset.</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Configure New Security Cipher</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-black focus:bg-black focus:text-white outline-none transition-all text-xs font-bold tracking-widest uppercase"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-4.5 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center space-x-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
