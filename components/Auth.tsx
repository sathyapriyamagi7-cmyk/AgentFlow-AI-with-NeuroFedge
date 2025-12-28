
import React, { useState } from 'react';
import { AuthState, User } from '../types';
import { Mail, Lock, User as UserIcon, Phone, ArrowLeft, Loader2, Key } from 'lucide-react';

interface AuthProps {
  onSuccess: (user: User) => void;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onClose }) => {
  const [authState, setAuthState] = useState<AuthState>({ view: 'login' });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: '',
    otp: ''
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (authState.view === 'login') {
      onSuccess({
        fullName: 'Demo User',
        email: formData.email || 'demo@example.com',
        mobile: '1234567890',
        isLoggedIn: true
      });
    } else if (authState.view === 'register') {
      setAuthState({ view: 'otp', tempUser: { fullName: formData.fullName, email: formData.email, mobile: formData.mobile } });
    } else if (authState.view === 'otp') {
      onSuccess({
        fullName: authState.tempUser?.fullName || 'New User',
        email: authState.tempUser?.email || 'new@example.com',
        mobile: authState.tempUser?.mobile || '1234567890',
        isLoggedIn: true
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">A</div>
            <div className="w-9"></div>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {authState.view === 'login' && 'Welcome Back'}
            {authState.view === 'register' && 'Create Account'}
            {authState.view === 'forgot' && 'Reset Password'}
            {authState.view === 'otp' && 'Verify Phone'}
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            {authState.view === 'login' && 'Sign in to access your agent history and projects.'}
            {authState.view === 'register' && 'Join AgentFlow AI and build with multi-agent intelligence.'}
            {authState.view === 'otp' && `We sent a code to ${formData.mobile || 'your phone'}.`}
          </p>

          <form onSubmit={handleAction} className="space-y-4">
            {authState.view === 'register' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            )}

            {(authState.view === 'login' || authState.view === 'register' || authState.view === 'forgot') && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            )}

            {authState.view === 'register' && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
            )}

            {(authState.view === 'login' || authState.view === 'register') && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            )}

            {authState.view === 'otp' && (
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none tracking-[0.5em] font-bold text-center focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.otp}
                  onChange={e => setFormData({...formData, otp: e.target.value})}
                />
              </div>
            )}

            {authState.view === 'login' && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setAuthState({ view: 'forgot' })}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {authState.view === 'login' && 'Sign In'}
              {authState.view === 'register' && 'Create Account'}
              {authState.view === 'forgot' && 'Send Reset Link'}
              {authState.view === 'otp' && 'Verify & Finish'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            {authState.view === 'login' ? (
              <p>Don't have an account? <button onClick={() => setAuthState({ view: 'register' })} className="text-indigo-400 font-bold hover:underline">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setAuthState({ view: 'login' })} className="text-indigo-400 font-bold hover:underline">Log In</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
