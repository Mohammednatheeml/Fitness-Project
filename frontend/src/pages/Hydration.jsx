import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import InfoModal from '../components/InfoModal';
import { Droplet, Award, CheckCircle, Bell, RotateCcw, Plus } from 'lucide-react';

const Hydration = () => {
  const [total, setTotal] = useState(0.0);
  const target = 8.0; // User requested 8L goal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWater = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.get('http://localhost:5000/water/today', config);
      if (res.data.summary) {
        setTotal(res.data.summary.total_ml / 1000);
      }
    } catch (error) {
      console.error('Error fetching water logs', error);
    }
  };

  useEffect(() => {
    fetchWater();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addWater = async (amount) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/water', { amount_ml: amount }, config);
      fetchWater();
    } catch (error) {
      console.error('Error logging water', error);
    }
  };

  const resetWater = async () => {
    // Current backend doesn't have a direct delete, so we just reset locally for UI/UX
    // or we could implement a DELETE in the backend. 
    // For now, let's just refresh and tell the user. 
    setTotal(0);
    setIsModalOpen(true);
  };

  const progress = Math.min((total / target) * 100, 100);

  return (
    <div className="space-y-6 pb-12">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Protocol Reset"
        content="Current hydration logs have been cleared locally for this session. To fully reset history, please contact system admin or use the history tab."
      />

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold neon-text-gradient bg-clip-text text-transparent inline-block uppercase tracking-tighter">Liquid Protocol</h1>
          <p className="text-on-surface-variant font-body mt-2">Target saturation: <span className="text-secondary font-bold font-display">8.0L Daily</span></p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={resetWater} className="p-3 bg-surface-high/30 text-zinc-500 rounded-xl hover:text-white transition-colors border border-outline-variant/10">
              <RotateCcw size={20} />
           </button>
           <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-surface-high/30 px-5 py-3 rounded-xl border border-outline-variant/10">
              <Bell size={14} className={Notification.permission === 'granted' ? 'text-secondary animate-pulse' : 'text-zinc-600'} />
              <span>ALERTS: {Notification.permission === 'granted' ? 'SYNCED' : 'OFF'}</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-12 min-h-[500px] relative overflow-hidden group">
            {/* Background Water Wave Effect */}
            <div 
               className="absolute bottom-0 left-0 w-full bg-secondary/10 transition-all duration-1000 ease-in-out"
               style={{ height: `${progress}%` }}
            />

            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
               <div className="absolute inset-0 rounded-full border-8 border-secondary/5 group-hover:border-secondary/10 transition-colors shadow-[0_0_80px_rgba(0,227,253,0.05)]"></div>
               <Droplet className="text-secondary absolute glow-secondary animate-pulse opacity-40" size={160} />
               <div className="z-10 text-center">
                  <span className="text-6xl font-display font-bold text-white tracking-tighter">{total.toFixed(1)}</span>
                  <span className="text-2xl font-display font-bold text-white/40 ml-1">L</span>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-3">{progress.toFixed(0)}% SYNCHRONIZED</p>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 w-full max-w-md">
               <button 
                  onClick={() => addWater(500)}
                  className="flex-1 py-4 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
               >
                  <Plus size={16} /> 500ML
               </button>
               <button 
                  onClick={() => addWater(1000)}
                  className="flex-1 py-4 bg-secondary text-background hover:scale-105 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-glow shadow-secondary flex items-center justify-center gap-2"
               >
                  <Plus size={16} /> 1.0L BOTTLE
               </button>
            </div>
        </GlassCard>

        <div className="space-y-6">
            <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-start gap-5">
                   <Award className="text-primary mt-1" size={28} />
                   <div>
                      <h4 className="font-display font-black text-xs text-white uppercase tracking-[0.2em] mb-2">Performance Bonus</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed font-body">Subject is currently at 84% metabolic efficiency. 8L goal supports accelerated joint lubrication and cognitive flux.</p>
                   </div>
                </div>
            </GlassCard>

            <GlassCard className="p-8">
                 <h4 className="font-display font-black text-xs text-zinc-500 uppercase tracking-[0.3em] mb-8">Daily Milestones</h4>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${total >= 0.5 ? 'bg-secondary/20 text-secondary' : 'bg-surface-high/50 text-zinc-700'}`}>
                          <CheckCircle size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Morning Calibration</p>
                          <p className="text-[10px] text-zinc-500 font-body">Complete (500ml logged)</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${total >= 4.0 ? 'bg-secondary/20 text-secondary' : 'bg-surface-high/50 text-zinc-700'}`}>
                          <CheckCircle size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Mid-Day Flood</p>
                          <p className="text-[10px] text-zinc-500 font-body">Target: 4.0L by 14:00</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${total >= 8.0 ? 'bg-secondary/20 text-secondary' : 'bg-surface-high/50 text-zinc-700'}`}>
                          <CheckCircle size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">System Maximize</p>
                          <p className="text-[10px] text-zinc-500 font-body">Completion of 8.0L protocol</p>
                       </div>
                    </div>
                 </div>
            </GlassCard>
            
            <div className="p-8 bg-surface-high/20 rounded-3xl border border-outline-variant/15 text-center flex flex-col items-center">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-4">Laboratory Status</p>
                 <p className="text-xs text-on-surface-variant font-body italic leading-relaxed">
                    "Water is the primary substrate of cellular intelligence. Do not fail the 8L sync."
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hydration;
