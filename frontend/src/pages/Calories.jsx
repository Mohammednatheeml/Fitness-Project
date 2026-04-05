import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { Flame, Trash2, Plus, Info, Activity, Zap, TrendingUp, ChevronRight, Search, Scan, X, Save } from 'lucide-react';

const Calories = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ 
    total_calories: 0, 
    total_protein: 0, 
    total_carbs: 0, 
    total_fat: 0, 
    target_calories: 2000 
  });
  const [food, setFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', weight: 100 });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      // Scales values based on weight (default is 100g in DB)
      const multiplier = food.weight / 100;
      const scaledFood = {
        ...food,
        calories: Math.round(food.calories * multiplier),
        protein: (food.protein * multiplier).toFixed(1),
        carbs: (food.carbs * multiplier).toFixed(1),
        fat: (food.fat * multiplier).toFixed(1)
      };
      await axios.post('http://localhost:5000/calories', scaledFood, config);
      setFood({ name: '', calories: '', protein: '', carbs: '', fat: '', weight: 100 });
      setSearchTerm('');
      setIsAdding(false);
      fetchTodayData();
    } catch (error) {
      alert("Error logging food.");
    }
  };

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.get(`http://localhost:5000/calories/search?q=${val}`, config);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectFood = (selected) => {
    setFood({
      name: selected.name,
      calories: selected.calories,
      protein: selected.protein,
      carbs: selected.carbs,
      fat: selected.fat,
      weight: 100
    });
    setSearchResults([]);
    setSearchTerm(selected.name);
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
        <NeonButton onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
            {isAdding ? "CANCEL" : <><Plus size={20} /> LOG NUTRITION</>}
        </NeonButton>
      </header>

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
            {/* Input Panel (Conditional) */}
            {isAdding && (
              <GlassCard className="p-8 border-primary/30 animate-in zoom-in duration-300 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Scan size={80} className="text-secondary" />
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Bio-Scanner Search */}
                    <div className="space-y-4 relative">
                       <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                          <Search size={12} />
                          <span>Bio-Intelligence Search</span>
                       </label>
                       <div className="relative">
                          <input
                            type="text"
                            placeholder="Scan Bio-Database (e.g. Chicken, Salmon, Oats...)"
                            className={`glass-input !py-4 pl-12 pr-10 border-secondary/20 focus:border-secondary/50 ${isSearching ? 'animate-pulse' : ''}`}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40">
                             <Zap size={20} className={isSearching ? "animate-spin" : ""} />
                          </div>
                          {searchTerm && (
                            <button 
                              type="button" 
                              onClick={() => {setSearchTerm(''); setSearchResults([]);}}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                               <X size={16} />
                            </button>
                          )}
                       </div>

                       {/* Search Results Dropdown */}
                       {searchResults.length > 0 && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-high border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                             {searchResults.map((res, i) => (
                                <button
                                   key={i}
                                   type="button"
                                   className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left group"
                                   onClick={() => selectFood(res)}
                                >
                                   <div>
                                      <p className="text-white font-bold text-sm tracking-tight group-hover:text-secondary">{res.name}</p>
                                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{res.group}</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-secondary text-xs font-bold">{res.calories} KCAL</p>
                                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">P: {res.protein}g • C: {res.carbs}g</p>
                                   </div>
                                </button>
                             ))}
                          </div>
                       )}
                    </div>

                    <div className="h-[1px] bg-outline-variant/10 w-full" />

                    {/* Manual Override / Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Protocol Label</label>
                          <input
                            type="text"
                            placeholder="e.g., Filet Mignon"
                            className="glass-input !py-3"
                            value={food.name}
                            onChange={(e) => setFood({...food, name: e.target.value})}
                            required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Quantity (Grams)</label>
                          <input
                            type="number"
                            placeholder="Weight in grams"
                            className="glass-input !py-3 border-secondary/20"
                            value={food.weight}
                            onChange={(e) => setFood({...food, weight: e.target.value})}
                            required
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Kcal / 100g</label>
                          <input type="number" className="glass-input !py-2 !text-sm" value={food.calories} onChange={(e) => setFood({...food, calories: e.target.value})} required />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Protein (g)</label>
                          <input type="number" step="0.1" className="glass-input !py-2 !text-sm" value={food.protein} onChange={(e) => setFood({...food, protein: e.target.value})} required />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Carbs (g)</label>
                          <input type="number" step="0.1" className="glass-input !py-2 !text-sm" value={food.carbs} onChange={(e) => setFood({...food, carbs: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Fat (g)</label>
                          <input type="number" step="0.1" className="glass-input !py-2 !text-sm" value={food.fat} onChange={(e) => setFood({...food, fat: e.target.value})} />
                       </div>
                    </div>

                    <NeonButton type="submit" className="w-full h-14 text-sm tracking-[0.2em]">
                       <div className="flex items-center gap-2">
                          <Save size={18} />
                          <span>SYNCHRONIZE TO METABOLIC LOG</span>
                       </div>
                    </NeonButton>
                 </form>
              </GlassCard>
            )}

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
