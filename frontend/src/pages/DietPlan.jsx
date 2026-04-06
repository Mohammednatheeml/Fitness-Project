import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InfoModal from '../components/InfoModal';
import { Coffee, Salad, Beef, Apple, Target, RefreshCw, CheckCircle, Circle, Lock } from 'lucide-react';
import { generate30DayPlan } from '../utils/dietEngine';

const DietPlan = () => {
  const [profile, setProfile] = useState(null);
  const [thirtyDayPlan, setThirtyDayPlan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchAndInitialize = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        const res = await axios.get('http://localhost:5000/user/profile', config);
        
        if (res.data) {
          setProfile(res.data);
          
          const targetCalories = res.data.target_calories || 2000;
          const userGoal = res.data.goal || 'maintain';
          
          // Check local storage for an existing plan for this calorie target
          const savedPlanStr = localStorage.getItem(`dietPlan_${targetCalories}`);
          if (savedPlanStr) {
             setThirtyDayPlan(JSON.parse(savedPlanStr));
          } else {
             // Generate a fresh 30 day plan if none matches current exact target
             handleRegenerate(targetCalories, userGoal);
          }
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchAndInitialize();
  }, []);

  const handleRegenerate = (calories, goal) => {
     const cals = calories || profile.target_calories;
     const g = goal || profile.goal;
     const newPlan = generate30DayPlan(cals, g);
     setThirtyDayPlan(newPlan);
     localStorage.setItem(`dietPlan_${cals}`, JSON.stringify(newPlan));
  };

  const toggleDayCompletion = (dayNumber) => {
      // A day is unlocked if it's Day 1, OR the previous day is completed, OR it's already completed
      const isUnlocked = dayNumber === 1 || thirtyDayPlan[dayNumber - 2]?.completed || thirtyDayPlan[dayNumber - 1]?.completed;
      if (!isUnlocked) return;

      const updated = thirtyDayPlan.map(day => {
          if (day.dayNumber === dayNumber) return {...day, completed: !day.completed};
          return day;
      });
      setThirtyDayPlan(updated);
      if (profile?.target_calories) {
        localStorage.setItem(`dietPlan_${profile.target_calories}`, JSON.stringify(updated));
      }
  };

  const showDetails = (mealName, macroHint, isUnlocked) => {
    if (!isUnlocked) return;
    setModalTitle(`${mealName}`);
    setModalContent(`This meal protocol adheres to the structural constraint: ${macroHint}. Portion sizes are mathematically scaled to hit your exact BMR ± 500 kcal requirement.`);
    setIsModalOpen(true);
  };

  if (!profile || thirtyDayPlan.length === 0) {
      return <div className="p-20 text-center animate-pulse text-white font-display uppercase tracking-widest">Generating 30-Day Protocol...</div>;
  }

  const badgeColor = 
      profile.goal === 'lose_weight' ? 'text-primary border-primary bg-primary/10' : 
      profile.goal === 'gain_muscle' ? 'text-blue-400 border-blue-400 bg-blue-400/10' : 
      'text-emerald-400 border-emerald-400 bg-emerald-400/10';

  const goalLabel = 
      profile.goal === 'lose_weight' ? 'Weight Loss' : 
      profile.goal === 'gain_muscle' ? 'Weight Gain' : 
      'Maintain Weight';

  return (
    <div className="space-y-8 pb-20">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
        content={modalContent}
      />

      <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-8">
        <div>
           <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">Your Personalized Diet Plan</h1>
           <div className="flex items-center gap-4 mt-6">
              <div className={`px-5 py-2 border rounded-full text-xs font-black uppercase tracking-widest shadow-glow-sm ${badgeColor}`}>
                  {goalLabel}
              </div>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                 <Target size={14} className="text-primary"/> Baseline Target: <span className="text-white text-sm">{profile.target_calories} Kcal</span>
              </p>
           </div>
        </div>
        
        <button 
           onClick={() => handleRegenerate()}
           className="flex items-center gap-2 px-6 py-3 bg-surface-high/50 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors border border-outline-variant/20"
        >
           <RefreshCw size={14} /> Regenerate Matrix
        </button>
      </header>

      <div className="grid grid-cols-1 space-y-12">
         {thirtyDayPlan.map((day, index) => {
             const isUnlocked = day.dayNumber === 1 || thirtyDayPlan[index - 1]?.completed || day.completed;
             
             return (
                 <div key={day.dayNumber} className="relative">
                     {/* Visual connector line for timeline effect */}
                     {day.dayNumber !== 30 && <div className="absolute left-[39px] top-20 bottom-[-48px] w-0.5 bg-outline-variant/5"></div>}
                     
                     <div className="flex items-start gap-6">
                         <div 
                            onClick={() => toggleDayCompletion(day.dayNumber)}
                            className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border cursor-pointer transition-all duration-300 z-10 
                              ${day.completed ? 'bg-primary border-primary shadow-glow shadow-primary/30' : 
                                isUnlocked ? 'bg-surface-low border-outline-variant/10 hover:border-primary/50' : 
                                'bg-surface-high/50 border-outline-variant/5 opacity-40'}`}
                         >
                             {!isUnlocked ? (
                                <Lock className="text-zinc-500" size={20} />
                             ) : (
                                <>
                                   <h4 className={`font-display text-xs font-black uppercase tracking-widest ${day.completed ? 'text-background' : 'text-zinc-500'}`}>Day</h4>
                                   <span className={`font-display text-2xl font-bold ${day.completed ? 'text-background' : 'text-white'}`}>{day.dayNumber}</span>
                                </>
                             )}
                         </div>
                         
                         <div className={`flex-1 min-w-0 pb-4 transition-all duration-500 ${!isUnlocked ? 'opacity-30 blur-[2px] pointer-events-none select-none' : ''}`}>
                             <div className="flex justify-between items-end mb-6">
                                 <div>
                                   <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">{day.totalCalories} KCAL DAILY CAP</p>
                                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> {day.macroHint}</p>
                                 </div>
                                 <button onClick={() => toggleDayCompletion(day.dayNumber)} className="text-zinc-600 hover:text-white transition-colors">
                                     {day.completed ? <CheckCircle className="text-primary" /> : <Circle />}
                                 </button>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                 {[
                                   { label: 'Breakfast', icon: <Coffee size={18}/>, meal: day.meals.breakfast },
                                   { label: 'Lunch', icon: <Salad size={18}/>, meal: day.meals.lunch },
                                   { label: 'Dinner', icon: <Beef size={18}/>, meal: day.meals.dinner },
                                   { label: 'Snack', icon: <Apple size={18}/>, meal: day.meals.snack }
                                 ].map((m, idx) => (
                                   <GlassCard 
                                     key={idx} 
                                     onClick={() => showDetails(m.meal.name, day.macroHint, isUnlocked)}
                                     className="p-5 cursor-pointer group hover:border-primary/30 transition-all bg-surface-low/30 hover:bg-surface-high/20 border-outline-variant/5"
                                   >
                                  <div className="flex justify-between items-center mb-4 text-zinc-500 group-hover:text-primary transition-colors">
                                      {m.icon}
                                      <span className="text-[10px] uppercase font-black tracking-widest">{m.label}</span>
                                  </div>
                                  <h5 className="font-body font-medium text-white text-sm mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">{m.meal.name}</h5>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 tracking-widest border-t border-outline-variant/10 pt-3">
                                      <span>~{m.meal.calories} kcal</span>
                                  </div>
                               </GlassCard>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
         );
     })}
      </div>
    </div>
  );
};

export default DietPlan;
