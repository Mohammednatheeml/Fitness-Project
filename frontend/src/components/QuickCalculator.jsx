import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from './GlassCard';
import { Search, Zap, Activity, Droplet, Hash, Scale, X, Plus, Minus, Info } from 'lucide-react';

const QuickCalculator = ({ onLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [grams, setGrams] = useState(100);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

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
      console.error("Quick search error", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectFood = (food) => {
    setSelectedFood(food);
    setSearchTerm(food.name);
    setSearchResults([]);
  };

  const clearSelection = () => {
    setSelectedFood(null);
    setSearchTerm('');
    setSearchResults([]);
    setGrams(100);
  };

  const calculateNutrients = () => {
    if (!selectedFood) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    const multiplier = grams / 100;
    return {
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: parseFloat((selectedFood.protein * multiplier).toFixed(1)),
      fat: parseFloat((selectedFood.fat * multiplier).toFixed(1)),
      carbs: parseFloat((selectedFood.carbs * multiplier).toFixed(1))
    };
  };

  const nutrition = calculateNutrients();

  const handleLogClick = async () => {
    if (!onLog || !selectedFood) return;
    setIsLogging(true);
    try {
      await onLog(nutrition);
      // Optional: Clear after log or show success
    } catch (error) {
      console.error("Logging error", error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <GlassCard className="p-8 border-primary/20 bg-surface-low/30 backdrop-blur-3xl overflow-visible relative group">
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/50 via-primary/50 to-secondary/50 opacity-30 group-hover:opacity-60 transition-opacity" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
             <span className="p-2 bg-secondary/10 rounded-xl text-secondary animate-pulse inline-flex items-center justify-center">
                <Zap size={24} />
             </span>
             AI-Powered Nutrient Hub
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            MANUAL INTAKE CALCULATION MATRIX
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {selectedFood && (
             <button 
               onClick={handleLogClick}
               disabled={isLogging}
               className={`flex items-center gap-2 px-6 py-3 bg-secondary/20 border border-secondary/40 rounded-2xl text-secondary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary/30 transition-all active:scale-95 shadow-glow-sm ${isLogging ? 'opacity-50 cursor-wait' : ''}`}
             >
                <Plus size={14} />
                {isLogging ? "SYNCHRONIZING..." : "SYNCHRONIZE TO LOG"}
             </button>
           )}

           <div className="flex items-center bg-surface-high/50 rounded-2xl p-2 border border-outline-variant/10 shadow-inner">
             <button 
               onClick={() => setGrams(Math.max(1, grams - 10))}
               className="p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all active:scale-95"
             >
               <Minus size={18} />
             </button>
             <div className="flex flex-col items-center px-6 border-l border-r border-outline-variant/10 min-w-[100px]">
               <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Intake Mass</span>
               <div className="flex items-center gap-2">
                 <input 
                   type="number"
                   value={grams}
                   onChange={(e) => setGrams(parseInt(e.target.value) || 0)}
                   className="bg-transparent border-none focus:outline-none text-white font-display text-xl font-bold text-center w-16"
                   placeholder="0"
                 />
                 <span className="text-xs text-secondary font-black uppercase tracking-tighter">g</span>
               </div>
             </div>
             <button 
               onClick={() => setGrams(grams + 10)}
               className="p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all active:scale-95"
             >
               <Plus size={18} />
             </button>
           </div>
        </div>
      </div>

      <div className="relative mb-10">
        <label className="absolute -top-3 left-6 bg-background px-2 text-[8px] font-black text-secondary uppercase tracking-[0.3em] z-10 transition-all hover:text-white">
           Step 1: Define Bio-Source
        </label>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none group-focus-within:text-secondary">
          <Search size={22} />
        </div>
        <input 
          type="text"
          placeholder="TYPE FOOD NAME (E.G. CHICKEN, RICE, BEEF...)"
          className="w-full bg-surface-low border-2 border-outline-variant/10 focus:border-secondary/40 rounded-3xl py-7 pl-16 pr-20 text-white font-display text-xl tracking-widest placeholder:text-zinc-700 focus:outline-none transition-all shadow-glow-sm"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={clearSelection}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface-high/50 rounded-full text-zinc-500 hover:text-white transition-all hover:scale-110 shadow-lg"
          >
            <X size={20} />
          </button>
        )}

        {/* Intelligence Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-[#0d1117]/95 border border-outline-variant/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-white/5">
             <div className="p-3 bg-surface-high/30 border-b border-outline-variant/10">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Top Matches from AI-Bio Engine</span>
             </div>
            {searchResults.map((f, i) => (
              <button
                key={i}
                onMouseDown={() => selectFood(f)}
                className="w-full text-left p-5 flex items-center justify-between hover:bg-primary/10 transition-all border-b border-white/[0.03] group/btn"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-high/50 flex items-center justify-center text-secondary group-hover/btn:scale-110 group-hover/btn:bg-secondary/20 transition-all shadow-sm">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base uppercase tracking-tight group-hover/btn:text-secondary">{f.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1 opacity-60 italic">{f.group} Classification</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-lg group-hover/btn:text-secondary transition-colors">{f.calories} <span className="text-[10px]">KCAL</span></p>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">BASE UNIT: 100G</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ENERGY (KCAL)', val: nutrition.calories, icon: <Zap size={20} />, color: 'shadow-secondary/10 border-secondary/20 hover:border-secondary/50', text: 'text-secondary' },
          { label: 'PROTEIN (G)', val: nutrition.protein, icon: <Activity size={20} />, color: 'shadow-primary/10 border-primary/20 hover:border-primary/50', text: 'text-primary' },
          { label: 'FAT (LIPIDS)', val: nutrition.fat, icon: <Droplet size={20} />, color: 'shadow-red-500/10 border-red-500/20 hover:border-red-500/50', text: 'text-red-500' },
          { label: 'CARBS (GLYCOGEN)', val: nutrition.carbs, icon: <Hash size={20} />, color: 'shadow-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50', text: 'text-emerald-500' }
        ].map((m, i) => (
          <div key={i} className={`p-8 rounded-[2rem] bg-surface-high/10 border-2 ${m.color} shadow-2xl transition-all hover:-translate-y-2 hover:bg-surface-high/20 group/card relative overflow-hidden backdrop-blur-md`}>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/card:opacity-[0.07] transition-opacity">
                {m.icon && React.cloneElement(m.icon, { size: 64 })}
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div className={`${m.text} p-3 bg-current/5 rounded-2xl shadow-glow-sm`}>
                {m.icon}
              </div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none text-right">{m.label}</span>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display font-black text-white tracking-widest">{m.val}</span>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] italic opacity-40 ${m.text}`}>Units</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Info / Data Source */}
      <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-zinc-600">
           <Info size={16} className="text-secondary" />
           <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Source: AI-Bio Engine (Standardized USDA/FDC Reference)</p>
        </div>
        <div className="px-4 py-1.5 bg-secondary/5 border border-secondary/20 rounded-full">
           <span className="text-[9px] font-black text-secondary uppercase tracking-[0.3em]">INTELLIGENCE MODE: ON</span>
        </div>
      </div>
      
      {!selectedFood && (
          <div className="absolute inset-x-0 bottom-0 top-[180px] bg-surface-low/60 backdrop-blur-md rounded-b-[2.5rem] flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 border-t border-outline-variant/5">
              <div className="w-16 h-16 bg-surface-high rounded-full flex items-center justify-center mb-4 text-zinc-700 animate-bounce">
                 <Scale size={32} />
              </div>
              <p className="text-zinc-500 font-display text-sm font-black uppercase tracking-[0.6em] animate-pulse">Awaiting Bio-Input</p>
          </div>
      )}
    </GlassCard>
  );
};

export default QuickCalculator;
