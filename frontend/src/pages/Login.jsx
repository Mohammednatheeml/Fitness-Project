import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NeonButton from '../components/NeonButton';
import { Mail, Lock, User, ArrowRight, Activity } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      
      // Update global auth/profile state in App
      if (onLoginSuccess) await onLoginSuccess();
      
      // Navigate to dashboard (App's PrivateRoute will handle redirection to /profile if incomplete)
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication Failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Visual Side (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-low overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/login-bg.png"
            alt="Kinetic Fitness" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/20" />
        </div>
        
        <div className="relative z-10 p-12 max-w-lg">
           <Activity className="text-primary mb-6 animate-pulse" size={48} />
           <h2 className="font-display text-6xl font-bold text-white leading-tight mb-6">
              YOUR BIOLOGY, <br />
              <span className="neon-text-gradient">REIMAGINED.</span>
           </h2>
           <p className="text-on-surface-variant font-body text-xl leading-relaxed opacity-80">
              Elite performance tracking driven by metabolic intelligence and dynamic glassmorphism.
           </p>
           <div className="mt-12 flex gap-8">
              <div className="text-center">
                 <p className="text-3xl font-display font-bold text-white">2.4k</p>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Daily Users</p>
              </div>
              <div className="text-center border-l border-outline-variant/30 pl-8">
                 <p className="text-3xl font-display font-bold text-white">98%</p>
                 <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Goal Success</p>
              </div>
           </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        
        <div className="w-full max-w-md z-10">
          <div className="mb-10 lg:hidden">
             <h1 className="font-display text-3xl font-bold neon-text-gradient text-center">KINETIC</h1>
          </div>

          <div className="mb-12">
            <h3 className="font-display text-4xl font-bold text-white mb-3">
               {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-on-surface-variant font-body">
               {isLogin ? 'Log in to access your elite metrics' : 'Initialize your physiological journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full bg-transparent border-b border-outline-variant/30 pl-8 py-3 text-white focus:outline-none focus:border-primary transition-all font-body placeholder:text-zinc-700"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    required
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-focus-within:w-full transition-all duration-500" />
                </div>
              )}
              
              <div className="relative group">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-outline-variant/30 pl-8 py-3 text-white focus:outline-none focus:border-primary transition-all font-body placeholder:text-zinc-700"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-focus-within:w-full transition-all duration-500" />
              </div>

              <div className="relative group">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-outline-variant/30 pl-8 py-3 text-white focus:outline-none focus:border-primary transition-all font-body placeholder:text-zinc-700"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>
            
            <div className="pt-4">
               <NeonButton type="submit" className="w-full h-14 text-lg flex items-center justify-center gap-3">
                 <span>{isLogin ? 'INITIALIZE ENGINE' : 'CREATE PROFILE'}</span>
                 <ArrowRight size={20} />
               </NeonButton>
            </div>
          </form>

          <footer className="mt-10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-on-surface-variant hover:text-white transition-colors font-body text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <span>{isLogin ? "NEW SUBJECT?" : "EXSTING SUBJECT?"}</span>
              <span className="text-secondary font-bold uppercase tracking-widest underline underline-offset-4 decoration-secondary/30 hover:decoration-secondary">
                 {isLogin ? "Join Lab" : "Log In"}
              </span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;