import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import QuickCalculator from '../components/QuickCalculator';
import { Flame, Trash2, Plus, Info, Activity, Zap, TrendingUp, ChevronRight, Search, Scan, X, Save, AlertCircle } from 'lucide-react';


const Calories = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ 
    total_calories: 0, 
    total_protein: 0, 
    total_carbs: 0, 
    total_fat: 0, 
    target_calories: 2000 
  });

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.get('http://localhost:5000/calories/today', config);
      setLogs(res.data.logs || []);
      setSummary(res.data.summary || { ...summary });
    } catch (error) {
      console.error('Error fetching calories data', error);
    }
  };

  const handleQuickLog = async (foodData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/calories', foodData, config);
      fetchTodayData();
    } catch (error) {
      console.error("Error logging food", error);
      alert("Failed to synchronize with metadata log.");
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Remove this entry from today's log?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`http://localhost:5000/calories/${id}`, config);
      fetchTodayData();
    } catch (error) {
      alert("Error deleting log.");
    }
  };

  const calProgress = summary.target_calories > 0 ? Math.min((summary.total_calories / summary.target_calories) * 100, 100) : 0;
  
  // Dynamic Macro Targets (Example: 30% Protein, 50% Carbs, 20% Fat)
  const macroTargets = {
    protein: (summary.target_calories * 0.3) / 4,
    carbs: (summary.target_calories * 0.5) / 4,
    fat: (summary.target_calories * 0.2) / 9
  };

  const getMacroProgress = (val, target) => Math.min((val / target) * 100, 100);

  return (
    <div className="space-y-8 pb-12 font-body max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <h1 className="font-display text-5xl font-bold text-white tracking-tight">Metabolic Hub</h1>
          <p className="text-on-surface-variant text-lg mt-2 font-medium opacity-70 italic">Protocol: Nutritional Saturation Monitoring</p>
        </div>
      </header>
      
      {/* METABOLIC OVERFLOW ALERT */}
      {summary.total_calories > summary.target_calories && (
        <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-[2.5rem] p-6 flex items-center gap-6 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.1)] group">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
              <AlertCircle size={32} />
           </div>
           <div className="flex-1">
              <h4 className="font-display font-black text-xs text-red-500 uppercase tracking-[0.4em] mb-1">HYPERCALORIC STATE DETECTED</h4>
              <p className="text-white text-lg font-medium italic opacity-90 leading-relaxed">
                 Metabolic overflow confirmed. Caloric intake has exceeded saturation targets. Immediate lipid mobilization protocols recommended (Cardio required).
              </p>
           </div>
           <div className="hidden md:block px-6 py-2 bg-red-500/20 border border-red-500/40 rounded-xl">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">+{(summary.total_calories - summary.target_calories)} KCAL OVERFLOW</span>
           </div>
        </div>
      )}

      {/* AI Nutrient Hub (Quick Calculator) */}
      <QuickCalculator onLog={handleQuickLog} />

      <div className="grid grid-cols-12 gap-8 items-stretch">

        {/* Progress Overview (Large Ring) */}
        <GlassCard className="col-span-12 lg:col-span-4 p-8 flex flex-col items-center min-h-[480px] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 transition-transform"><Flame size={140} /></div>
           <h3 className="font-display text-xl font-bold self-start text-white uppercase tracking-tight">Daily Saturation</h3>
           
           <div className="relative w-64 h-64 my-auto">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="#1f1f26" strokeWidth="8" />
               <circle 
                 cx="50" 
                 cy="50" 
                 r="45" 
                 fill="none" 
                 stroke={summary.total_calories > summary.target_calories ? '#f87171' : '#df8eff'} 
                 strokeWidth="10" 
                 strokeDasharray="283" 
                 strokeDashoffset={283 - (283 * calProgress) / 100}
                 strokeLinecap="round"
                 className="transition-all duration-1000 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className="font-display text-5xl font-bold text-white tracking-widest leading-none">{summary.total_calories}</span>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-4">Kcal / {summary.target_calories}</span>
             </div>
           </div>

           <div className="grid grid-cols-2 w-full pt-8 border-t border-outline-variant/10 text-center">
             <div>
               <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">State</p>
               <p className={`text-xl font-display font-bold uppercase ${summary.total_calories > summary.target_calories ? 'text-red-400' : 'text-primary'}`}>
                  {summary.total_calories > summary.target_calories ? 'Saturation' : 'Operating'}
               </p>
             </div>
             <div>
               <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
               <p className="text-xl font-display font-bold text-white uppercase">{((summary.total_calories / summary.target_calories) * 100).toFixed(0)}% Util</p>
             </div>
           </div>
        </GlassCard>

        {/* Timeline & Controls */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

            {/* Macro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Prot-Analysis', val: summary.total_protein, target: macroTargets.protein, color: 'primary' },
                  { label: 'Carb-Analysis', val: summary.total_carbs, target: macroTargets.carbs, color: 'secondary' },
                  { label: 'Lipid-Analysis', val: summary.total_fat, target: macroTargets.fat, color: 'tertiary' }
                ].map((m, i) => (
                  <GlassCard key={i} className="p-6">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{m.label}</span>
                        <div className={`text-${m.color} text-xs font-bold`}>{m.val.toFixed(1)} / {m.target.toFixed(0)}g</div>
                     </div>
                     <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${m.color} transition-all duration-1000 ease-out`} 
                          style={{ width: `${getMacroProgress(m.val, m.target)}%` }} 
                        />
                     </div>
                  </GlassCard>
                ))}
            </div>

            {/* Log History */}
            <GlassCard className="flex-1 p-8 pb-4 flex flex-col min-h-[300px]">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">Today's Protocol Activity</h3>
                  <Activity size={20} className="text-zinc-600" />
               </div>
               
               <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {logs.length > 0 ? logs.map((log, idx) => (
                    <div key={idx} className="group flex items-center gap-6 p-4 rounded-3xl bg-surface-high/20 border border-outline-variant/10 hover:border-primary/30 transition-all">
                       <div className="w-12 h-12 bg-surface-variant flex items-center justify-center rounded-2xl text-primary shrink-0 transition-transform group-hover:scale-105">
                          <Activity size={24} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-white uppercase tracking-tight truncate">{log.name}</h4>
                             <span className="text-[10px] font-black text-secondary tracking-widest">{log.calories} KCAL</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">
                             P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                          </p>
                       </div>
                       <button onClick={() => deleteLog(log.id)} className="p-3 text-zinc-600 hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  )) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 opacity-40 py-12">
                       <TrendingUp size={48} className="mb-4" />
                       <p className="text-sm font-black uppercase tracking-widest">No Protocol Activity Detected</p>
                    </div>
                  )}
               </div>
            </GlassCard>
        </div>
      </div>

      {/* Intelligence Insight */}
      <GlassCard className="p-8 bg-gradient-to-r from-secondary/5 via-primary/5 to-transparent border border-outline-variant/10 flex items-center gap-8 group">
         <div className="p-5 bg-surface-high/50 rounded-3xl border border-outline-variant/5">
            <Zap className="text-secondary" size={32} />
         </div>
         <div className="flex-1">
            <h4 className="font-display font-black text-xs text-secondary uppercase tracking-[0.4em] mb-2">Metabolic Intelligence</h4>
            <p className="text-lg text-white font-body opacity-90 leading-relaxed font-medium italic">
               {summary.total_calories > summary.target_calories 
                ? "Energy intake exceeds calibration targets. Recommend high-intensity cardiac load to oxidize surplus."
                : summary.total_protein < 100 
                  ? "Nitrogen levels potentially low. Prioritize protein-dense bio-fuel for next intake."
                  : "Nutritional homeostasis detected. Performance efficiency at 94%."}
            </p>
         </div>
         <ChevronRight className="text-zinc-700" size={32} />
      </GlassCard>
    </div>
  );
};

export default Calories;
