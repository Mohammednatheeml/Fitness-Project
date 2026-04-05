import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InfoModal from '../components/InfoModal';
import { Moon, Sun, Timer, Zap, Info, Clock, Play, Square, Activity, Bell, Battery, CheckCircle2, ShieldCheck, ChevronRight, Trash2, Sliders } from 'lucide-react';
import { getSleepAdvice, getBmiStatus, getStatusLabel } from '../utils/dailyContent';

const SleepTracker = () => {
  const [profile, setProfile] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isSleeping, setIsSleeping] = useState(localStorage.getItem('isSleeping') === 'true');
  const [startTime, setStartTime] = useState(localStorage.getItem('sleepStartTime') ? new Date(localStorage.getItem('sleepStartTime')) : null);
  const [duration, setDuration] = useState('00:00:00');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [history, setHistory] = useState([]);
  const [readiness, setReadiness] = useState(85);
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Environmental Calibration (< 19°C)", checked: false },
    { id: 2, label: "Neural Silence (No Screens)", checked: false },
    { id: 3, label: "Magnesium/Glycine Sync", checked: false },
    { id: 4, label: "Zero-Light Protocol", checked: false }
  ]);

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
    fetchHistory();
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchHistory = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.get('http://localhost:5000/sleep/history', config);
      setHistory(res.data);
      
      // Dynamic Readiness Logic based on last sleep
      if (res.data.length > 0) {
        const last = res.data[0];
        let score = Math.min(100, Math.round((last.duration_minutes / 480) * 100)); // 8h = 100
        setReadiness(score);
      }
    } catch (error) {
      console.error('Error fetching history', error);
    }
  };

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

  const toggleSleep = async () => {
    if (!isSleeping) {
      const now = new Date();
      setStartTime(now);
      setIsSleeping(true);
      localStorage.setItem('isSleeping', 'true');
      localStorage.setItem('sleepStartTime', now.toISOString());
    } else {
      const endTime = new Date();
      const diffMs = endTime - startTime;
      const minutes = Math.floor(diffMs / 60000);
      
      setIsSleeping(false);
      localStorage.removeItem('isSleeping');
      localStorage.removeItem('sleepStartTime');
      
      // Persistence Logic
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        await axios.post('http://localhost:5000/sleep', {
          start_time: startTime.toISOString().replace('T', ' ').slice(0, 19),
          end_time: endTime.toISOString().replace('T', ' ').slice(0, 19),
          duration_minutes: minutes,
          quality_score: readiness
        }, config);
        
        setModalTitle("Recovery Protocol Synchronized");
        const bmiStatus = getBmiStatus(profile?.bmi || 0);
        setModalContent(`Neural recalibration complete. Session Duration: ${Math.floor(minutes/60)}h ${minutes%60}m. Your protocol status: ${minutes >= 420 ? 'OPTIMIZED' : 'INHIBITED'}.`);
        setIsModalOpen(true);
      } catch (err) {
        alert("Failed to sync protocol data.");
      }
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Remove this protocol entry?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`http://localhost:5000/sleep/${id}`, config);
      fetchHistory();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const toggleCheck = (id) => {
    setChecklist(checklist.map(c => c.id === id ? {...c, checked: !c.checked} : c));
  };

  const bmiStatusLabel = profile ? getStatusLabel(getBmiStatus(profile.bmi || 0)) : 'SYNCHRONIZING...';

  return (
    <div className="space-y-8 pb-20">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
        content={modalContent}
      />
      <header className="mb-14 relative flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
           <h1 className="font-display text-5xl font-bold text-white tracking-tight uppercase">Neural Recovery</h1>
           <p className="text-on-surface-variant font-body text-lg mt-2 font-medium opacity-70 italic">Status: <span className="text-primary">{isSleeping ? 'REGENERATIVE STASIS ACTIVE' : 'SYSTEM OPERATIONAL'}</span></p>
        </div>
        <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-surface-high/30 border border-outline-variant/10 rounded-2xl flex items-center gap-4">
               <Moon size={20} className={isSleeping ? 'text-primary animate-pulse' : 'text-zinc-600'} />
               <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Biometric Diagnostic</p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">{bmiStatusLabel}</p>
               </div>
            </div>
            <div className={`p-4 rounded-2xl border transition-all duration-500 ${isSleeping ? 'bg-red-500/10 border-red-500/30' : 'bg-primary/10 border-primary/30'}`}>
               <Battery size={24} className={isSleeping ? 'text-red-500 animate-pulse' : 'text-primary'} />
            </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start px-4">
        {/* Main Interface - Now centered and prioritized */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 space-y-8">
            <GlassCard className="p-12 bg-gradient-to-br from-surface-low to-transparent border border-outline-variant/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Clock size={240} className="text-primary" />
               </div>
               
               <div className="relative z-10 space-y-12">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Current Station Time</p>
                        <h2 className="font-display text-7xl font-bold text-white tabular-nums tracking-tighter">{time}</h2>
                     </div>
                     <div className="flex gap-3">
                        <div className="p-4 bg-surface-high/50 rounded-2xl border border-outline-variant/10">
                           <Bell size={24} className={isSleeping ? 'text-primary animate-pulse' : 'text-zinc-500'} />
                        </div>
                        <div className="p-4 bg-surface-high/50 rounded-2xl border border-outline-variant/10">
                           <ShieldCheck size={24} className="text-zinc-500" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-outline-variant/5">
                     <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Duration Active</p>
                        <p className="font-display text-6xl font-bold text-primary tabular-nums tracking-tight">{duration}</p>
                     </div>
                     <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Neural Cycles (90m)</p>
                        <div className="flex gap-2">
                           {[1,2,3,4,5,6].map(i => (
                              <div 
                                key={i} 
                                className={`h-8 flex-1 rounded-md border border-white/5 transition-all duration-1000 ${
                                  (parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1])) >= i * 90 
                                  ? 'bg-secondary shadow-glow' : 'bg-surface-high/50'
                                }`}
                              />
                           ))}
                        </div>
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
                        {isSleeping ? 'INITIALIZE AWAKE' : 'ENTER REGENERATIVE STASIS'}
                     </button>
                     <button 
                       onClick={() => {
                         setModalTitle("Recovery Protocol Strategy");
                         setModalContent("By leveraging localStorage, your recovery duration continues to track even if you navigate to the Bio-Scanner or Training Matrix. Your neural cycles remain locked in.");
                         setIsModalOpen(true);
                       }}
                       className="p-6 bg-surface-high/50 text-white rounded-[30px] hover:bg-white/10 transition-all border border-outline-variant/10 flex items-center justify-center"
                     >
                        <Info size={28} />
                     </button>
                  </div>
               </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                  <h3 className="font-display text-xs font-black text-primary uppercase tracking-[0.4em] mb-8">Neural Readiness</h3>
                  <div className="flex flex-col items-center">
                     <div className="w-40 h-40 relative">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="45" fill="none" stroke="#1f1f26" strokeWidth="8" />
                           <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              stroke="#df8eff" 
                              strokeWidth="8" 
                              strokeDasharray="283" 
                              strokeDashoffset={283 - (283 * readiness) / 100}
                              strokeLinecap="round"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="font-display text-3xl font-bold text-white tracking-widest">{readiness}%</span>
                        </div>
                     </div>
                     <p className="mt-6 text-[10px] text-zinc-500 font-medium leading-relaxed italic text-center px-4">
                        "Your CNS is {readiness}% recovered. The protocol targets 100% recalibration."
                     </p>
                  </div>
               </GlassCard>

               <GlassCard className="p-8 bg-gradient-to-r from-secondary/5 via-primary/5 to-transparent border border-outline-variant/10 flex flex-col justify-center gap-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-secondary/20 rounded-xl border border-secondary/20">
                        <Zap className="text-secondary" size={20} />
                     </div>
                     <div>
                        <h4 className="font-display font-black text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Benefit</h4>
                        <p className="text-xs text-secondary font-bold">LIPID OXIDATION MAXIMIZED</p>
                     </div>
                  </div>
                  <p className="text-[11px] text-white opacity-60 leading-relaxed italic">
                     {profile?.weight > 90 ? "Sleep increases metabolic flux and muscle retention." : "Growth Hormone peaks in Stage 3 neural recalibration."}
                  </p>
               </GlassCard>
            </div>
        </div>
      </div>

    </div>
  );
};

export default SleepTracker;
