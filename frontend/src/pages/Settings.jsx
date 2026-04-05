import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InfoModal from '../components/InfoModal';
import { User, Lock, Eye, Bell, Globe, Trash2, LogOut, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('account');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        const res = await axios.get('http://localhost:5000/user/profile', config);
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showUnderConstruction = (title) => {
    setModalTitle(`${title} Security`);
    setModalContent(`The ${title} module is currently undergo-ing biometric validation. This feature will be synchronized in the next system update.`);
    setIsModalOpen(true);
  };

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Auth', icon: <Lock size={18} /> },
    { id: 'display', label: 'Display Sync', icon: <Eye size={18} /> },
    { id: 'notifications', label: 'Alert Protocol', icon: <Bell size={18} /> }
  ];

  return (
    <div className="space-y-8 pb-20">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
        content={modalContent}
      />

      <header className="mb-14">
        <h1 className="font-display text-4xl font-bold neon-text-gradient bg-clip-text text-transparent inline-block uppercase tracking-tighter">System Configuration</h1>
        <p className="text-on-surface-variant font-body mt-2">Personalizing your metabolic synchronization environment.</p>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
           {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_20px_rgba(0,227,253,0.1)]' 
                    : 'bg-surface-high/30 border-outline-variant/10 text-zinc-500 hover:bg-surface-high/50 hover:text-white'
                }`}
              >
                 {tab.icon}
                 <span className="font-display font-bold uppercase tracking-widest text-xs">{tab.label}</span>
                 {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />}
              </button>
           ))}
           
           <div className="pt-8 border-t border-outline-variant/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-display font-bold uppercase tracking-widest text-xs"
              >
                 <LogOut size={18} />
                 <span>Terminate Session</span>
              </button>
           </div>
        </div>

        {/* Content Area */}
        <GlassCard className="col-span-12 lg:col-span-8 p-10 min-h-[500px]">
           {activeTab === 'account' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex items-center gap-6 mb-10 pb-10 border-b border-outline-variant/10">
                    <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-primary to-secondary p-1">
                       <div className="w-full h-full bg-surface-low rounded-[26px] flex items-center justify-center text-white text-3xl font-display font-bold">
                          {profile?.username?.[0]?.toUpperCase() || 'U'}
                       </div>
                    </div>
                    <div>
                       <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase">{profile?.username}</h3>
                       <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{profile?.email}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/profile')}
                      className="ml-auto px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all"
                    >
                       Edit Profile
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Username Sync</label>
                       <div className="p-4 bg-surface-high/30 rounded-xl border border-outline-variant/10 text-white font-bold">{profile?.username}</div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Metabolic Goal</label>
                       <div className="p-4 bg-surface-high/30 rounded-xl border border-outline-variant/10 text-primary font-bold uppercase">{profile?.goal?.replace('_', ' ')}</div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-outline-variant/10">
                    <h4 className="font-display font-black text-xs text-zinc-500 uppercase tracking-[0.3em] mb-6">Security Measures</h4>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-5 bg-surface-high/20 rounded-2xl border border-outline-variant/5">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Globe size={18} /></div>
                             <span className="text-sm font-bold text-white uppercase tracking-tight">Public Visibility</span>
                          </div>
                          <div className="w-12 h-6 bg-surface-high rounded-full relative p-1 cursor-not-allowed opacity-50">
                             <div className="w-4 h-4 bg-zinc-600 rounded-full" />
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-5 bg-surface-high/20 rounded-2xl border border-outline-variant/5">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-primary/10 text-primary rounded-lg"><Bell size={18} /></div>
                             <span className="text-sm font-bold text-white uppercase tracking-tight">Email Notifications</span>
                          </div>
                          <div className="w-12 h-6 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                             <div className="w-4 h-4 bg-primary rounded-full ml-auto shadow-glow shadow-primary" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab !== 'account' && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in zoom-in-95 duration-300">
                 <div className="w-24 h-24 bg-surface-high/50 rounded-full flex items-center justify-center mb-8 border border-outline-variant/10">
                    <Lock size={40} className="text-zinc-700" />
                 </div>
                 <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight mb-4">{activeTab} Lockdown</h3>
                 <p className="text-on-surface-variant font-body text-sm max-w-sm leading-relaxed mb-8">
                    Your current credentials are being validated. Access to advanced {activeTab} parameters will be granted upon successful completion of your 14-day protocol streak.
                 </p>
                 <button 
                   onClick={() => showUnderConstruction(activeTab.toUpperCase())}
                   className="px-8 py-3 bg-white/5 border border-outline-variant/10 rounded-xl text-xs font-black text-white hover:bg-primary/20 hover:border-primary/30 transition-all uppercase tracking-[0.2em]"
                 >
                    Request Early Access
                 </button>
              </div>
           )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;
