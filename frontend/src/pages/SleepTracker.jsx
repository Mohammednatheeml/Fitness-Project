import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InfoModal from '../components/InfoModal';
import { Moon, Sun, Timer, Zap, Info, Clock, Play, Square, Activity, Bell } from 'lucide-react';
import { getSleepAdvice, getBmiStatus, getStatusLabel } from '../utils/dailyContent';

const SleepTracker = () => {
  const [profile, setProfile] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isSleeping, setIsSleeping] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState('00:00:00');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

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

    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isSleeping) {
      interval = setInterval(() => {
        const diff = new Date() - startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setDuration(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSleeping, startTime]);

  const toggleSleep = () => {
    if (!isSleeping) {
      setStartTime(new Date());
      setIsSleeping(true);
    } else {
      setIsSleeping(false);
      setModalTitle("Recovery Protocol Synchronized");
      const bmiStatus = getBmiStatus(profile?.bmi || 0);
      setModalContent(`Sleep duration of ${duration} has been logged. Your ${bmiStatus.toUpperCase()} protocol requires another 5.5 hours for full neural recalibration.`);
      setIsModalOpen(true);
    }
  };

  const advice = profile ? getSleepAdvice(getBmiStatus(profile.bmi || 0)) : 'INITIALIZING...';
  const bmiStatusLabel = profile ? getStatusLabel(getBmiStatus(profile.bmi || 0)) : 'SYNCHRONIZING...';

  return (
    <div className="space-y-8 pb-20">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
        content={modalContent}
      />

      <header className="mb-14 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="font-display text-5xl font-bold neon-text-gradient bg-clip-text text-transparent inline-block uppercase tracking-tighter">Neural Recovery</h1>
           <p className="text-on-surface-variant font-body text-lg mt-2 font-medium opacity-70">Station Status: <span className="text-white">{isSleeping ? 'Dark Mode Active' : 'System Operational'}</span></p>
        </div>
        <div className="px-6 py-3 bg-surface-high/30 border border-outline-variant/10 rounded-2xl flex items-center gap-4">
           <Moon size={20} className={isSleeping ? 'text-primary animate-pulse' : 'text-zinc-600'} />
           <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Biometric Diagnostic</p>
              <p className="text-xs font-bold text-white uppercase tracking-widest">{bmiStatusLabel}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        <GlassCard className="col-span-12 lg:col-span-7 p-12 bg-gradient-to-br from-surface-low to-transparent border border-outline-variant/10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock size={240} className="text-primary" />
           </div>
           
           <div className="relative z-10 space-y-12">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Current Station Time</p>
                    <h2 className="font-display text-7xl font-bold text-white tabular-nums tracking-tighter">{time}</h2>
                 </div>
                 <div className="p-4 bg-surface-high/50 rounded-2xl border border-outline-variant/10">
                    <Bell size={24} className="text-zinc-500" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-10 border-y border-outline-variant/5">
                 <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Duration Active</p>
                    <p className="font-display text-5xl font-bold text-primary tabular-nums tracking-tight">{duration}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Target Window</p>
                    <p className="font-display text-5xl font-bold text-zinc-700 tabular-nums tracking-tight">08:00:00</p>
                 </div>
              </div>

              <div className="flex gap-6 pt-4">
                 <button 
                   onClick={toggleSleep}
                   className={`flex-1 h-20 rounded-[30px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] ${
                     isSleeping ? 'bg-red-500 text-white shadow-glow shadow-red-500' : 'bg-primary text-background shadow-glow shadow-primary'
                   }`}
                 >
                    {isSleeping ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    {isSleeping ? 'INITIALIZE AWAKE' : 'ENTER SLEEP MODE'}
                 </button>
                 <button 
                   onClick={() => {
                     setModalTitle("Ideal Awake Protocol");
                     setModalContent("Based on your biometric status, our research indicates that waking at the end of a 90-minute cycle is optimal for cognitive flux. Your next window opens at 06:30.");
                     setIsModalOpen(true);
                   }}
                   className="p-6 bg-surface-high/50 text-white rounded-[30px] hover:bg-white/10 transition-all border border-outline-variant/10 flex items-center justify-center"
                 >
                    <Info size={28} />
                 </button>
              </div>
           </div>
        </GlassCard>

        <div className="col-span-12 lg:col-span-5 space-y-8">
            <GlassCard className="p-10 border border-secondary/20 bg-secondary/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 text-secondary/5 group-hover:scale-110 transition-transform"><Zap size={140} /></div>
               <h3 className="font-display text-xs font-black text-secondary uppercase tracking-[0.4em] mb-10">Diagnostic Instruction</h3>
               
               <div className="p-8 bg-surface-high/50 rounded-3xl border border-outline-variant/10 mb-8 hover:border-secondary/40 transition-all">
                  <p className="text-xl font-body text-white leading-relaxed font-medium italic opacity-90">
                     "{advice}"
                  </p>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Neural Flux', val: '64%', color: 'bg-primary' },
                    { label: 'Metabolic Repair', val: '88%', color: 'bg-secondary' },
                    { label: 'Hormonal Sync', val: '42%', color: 'bg-amber-400' }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          <span>{stat.label}</span>
                          <span className="text-white">{stat.val}</span>
                       </div>
                       <div className="h-1.5 bg-surface-high rounded-full overflow-hidden">
                          <div className={`h-full ${stat.color} shadow-glow`} style={{ width: stat.val }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <div className="p-10 bg-surface-high/20 rounded-[50px] border border-outline-variant/15 flex flex-col items-center group">
                 <Activity size={32} className="text-primary/40 mb-6 group-hover:text-primary transition-colors animate-pulse" />
                 <p className="text-sm text-on-surface-variant font-body italic leading-relaxed text-center group-hover:text-white transition-colors">
                    "Deep sleep is the primary driver of lipid oxidation. For your {getBmiStatus(profile?.bmi)} range, lack of sleep will directly inhibit metabolic progress."
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
