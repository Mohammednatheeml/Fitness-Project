import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { Dumbbell, Target, Lock, CheckCircle2, Circle, Unlock, Info, Timer, EyeOff } from 'lucide-react';
import { getBmiStatus } from '../utils/dailyContent';
import { generate30DayWorkout } from '../utils/workoutEngine';

const Workout = () => {
  const [profile, setProfile] = useState(null);
  const [thirtyDayPlan, setThirtyDayPlan] = useState([]);
  const [completedDays, setCompletedDays] = useState([]);
  const [localChecks, setLocalChecks] = useState({}); // tracks checked exercises per day: { dayNumber: [ex_id1, ex_id2] }
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', instructions: [], rest: '' });

  const fetchProfileAndProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [profileRes, progressRes] = await Promise.all([
        axios.get('http://localhost:5000/user/profile', config),
        axios.get('http://localhost:5000/workouts/progress_days', config)
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        const goal = profileRes.data.goal || 'maintain';
        
        // Build or Load 30-day matrix
        let matrix = localStorage.getItem(`workoutMatrix_${goal}`);
        if (matrix) {
            setThirtyDayPlan(JSON.parse(matrix));
        } else {
            const newMatrix = generate30DayWorkout(goal);
            localStorage.setItem(`workoutMatrix_${goal}`, JSON.stringify(newMatrix));
            setThirtyDayPlan(newMatrix);
        }

        setCompletedDays(progressRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching workout data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndProgress();
  }, []);

  const toggleExerciseCheck = (dayNum, exId) => {
      setLocalChecks(prev => {
          const currentDayChecks = prev[dayNum] || [];
          if (currentDayChecks.includes(exId)) {
             return { ...prev, [dayNum]: currentDayChecks.filter(id => id !== exId) };
          } else {
             return { ...prev, [dayNum]: [...currentDayChecks, exId] };
          }
      });
  };

  const markDayComplete = async (dayNum) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post('http://localhost:5000/workouts/complete_day', { day_number: dayNum }, config);
      
      setCompletedDays(prev => [...prev, dayNum]);
    } catch (error) {
      console.error('Error completing day', error);
    }
  };

  const showInstructions = (exercise) => {
    setModalData({
      title: exercise.name,
      instructions: exercise.instructions || ['Perform with controlled tempo.', 'Focus on mind-muscle connection.'],
      rest: exercise.rest
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-white font-display text-xs tracking-[0.3em] uppercase animate-pulse">Synchronizing Unlocks...</p>
         </div>
      </div>
    );
  }

  const overallProgress = Math.round((completedDays.length / 30) * 100);

  const goalBadgeColor = 
      profile?.goal === 'lose_weight' ? 'text-primary border-primary bg-primary/10' : 
      profile?.goal === 'gain_muscle' ? 'text-blue-400 border-blue-400 bg-blue-400/10' : 
      'text-emerald-400 border-emerald-400 bg-emerald-400/10';

  const goalLabel = 
      profile?.goal === 'lose_weight' ? 'Weight Loss Protocol' : 
      profile?.goal === 'gain_muscle' ? 'Hypertrophy Protocol' : 
      'Maintenance Protocol';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="pt-6 relative mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-8">
           <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tighter uppercase">Your Workout Plan</h1>
              <div className="flex items-center gap-4 mt-6">
                 <div className={`px-5 py-2 border rounded-full text-xs font-black uppercase tracking-widest shadow-glow-sm ${goalBadgeColor}`}>
                     {goalLabel}
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-8 bg-surface-low/40 p-6 rounded-3xl border border-outline-variant/10 backdrop-blur-md w-full md:w-auto">
              <div className="w-full md:w-48">
                 <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">30-Day Completion</p>
                    <p className="text-white font-display font-bold">{overallProgress}%</p>
                 </div>
                 <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 shadow-glow shadow-primary/20" 
                      style={{ width: `${overallProgress}%` }}
                    />
                 </div>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 space-y-12">
        {thirtyDayPlan.map((day) => {
           // A day is unlocked if it's Day 1, OR the immediate prior day is completed, OR the day itself is already completed.
           const isUnlocked = day.dayNumber === 1 || completedDays.includes(day.dayNumber - 1) || completedDays.includes(day.dayNumber);
           const isCompletedDB = completedDays.includes(day.dayNumber);
           const checkedCount = localChecks[day.dayNumber]?.length || 0;
           const allExercisesChecked = checkedCount === day.exercises.length;

           return (
             <div key={day.dayNumber} className="relative">
                 {/* Visual connector line */}
                 {day.dayNumber !== 30 && <div className="absolute left-[39px] top-20 bottom-[-48px] w-0.5 bg-outline-variant/5"></div>}
                 
                 <div className="flex items-start gap-6">
                     <div 
                        className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border z-10 transition-all duration-500
                          ${isCompletedDB ? 'bg-primary border-primary shadow-glow shadow-primary/30' : 
                            isUnlocked ? 'bg-surface-low border-primary/40' : 
                            'bg-surface-high/50 border-outline-variant/5 opacity-40'}`}
                     >
                         {isLocked(isUnlocked, isCompletedDB) ? (
                            <Lock className="text-zinc-500" />
                         ) : (
                            <>
                               <h4 className={`font-display text-xs font-black uppercase tracking-widest ${isCompletedDB ? 'text-background' : 'text-primary'}`}>Day</h4>
                               <span className={`font-display text-2xl font-bold ${isCompletedDB ? 'text-background' : 'text-white'}`}>{day.dayNumber}</span>
                            </>
                         )}
                     </div>
                     
                     <div className={`flex-1 min-w-0 pb-4 transition-all duration-500 ${!isUnlocked ? 'opacity-30 blur-[2px] pointer-events-none select-none' : ''}`}>
                         <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                             <div>
                               <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{day.type}</p>
                               <h3 className="font-display text-2xl font-bold text-white tracking-tight uppercase">{day.title}</h3>
                             </div>
                             
                             {isUnlocked && !isCompletedDB && (
                               <button 
                                 onClick={() => markDayComplete(day.dayNumber)}
                                 disabled={!allExercisesChecked}
                                 className={`px-6 py-3 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border
                                   ${allExercisesChecked 
                                      ? 'bg-primary text-background border-primary hover:scale-[1.02] shadow-glow shadow-primary/30 cursor-pointer' 
                                      : 'bg-surface-high/50 text-zinc-500 border-outline-variant/10 cursor-not-allowed'}`}
                               >
                                  {allExercisesChecked ? 'Complete Day' : `${checkedCount} / ${day.exercises.length} Exercises`}
                               </button>
                             )}
                             {isCompletedDB && (
                                <div className="px-6 py-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                                   <CheckCircle2 size={14} /> Day Secured
                                </div>
                             )}
                         </div>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                             {day.exercises.map((ex) => {
                                const isChecked = localChecks[day.dayNumber]?.includes(ex.id) || isCompletedDB;
                                return (
                                  <GlassCard 
                                    key={ex.id} 
                                    className={`p-5 transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-4 
                                       ${isChecked ? 'bg-secondary/5 border-secondary/20' : 'bg-surface-low/30 border-outline-variant/5 hover:border-primary/20 cursor-pointer'}`}
                                    onClick={() => !isCompletedDB && toggleExerciseCheck(day.dayNumber, ex.id)}
                                  >
                                     <div className="flex items-center gap-4">
                                        <button 
                                           className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                             ${isChecked ? 'bg-secondary text-background shadow-glow shadow-secondary/30' : 'bg-surface-high/50 text-zinc-600'}`
                                           }
                                        >
                                           {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                        </button>
                                        <div>
                                           <h5 className={`font-body font-bold text-sm mb-1 ${isChecked ? 'text-secondary/70 line-through' : 'text-white'}`}>{ex.name}</h5>
                                           <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                               <span>{ex.sets} Sets</span>
                                               <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                               <span className="text-primary">{ex.reps}</span>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                        <button 
                                           onClick={(e) => { e.stopPropagation(); showInstructions(ex); }}
                                           className="p-3 text-zinc-500 hover:text-white bg-surface-high/20 rounded-xl transition-colors shrink-0"
                                        >
                                           <Info size={16} />
                                        </button>
                                        
                                        <button
                                          onClick={(e) => { e.stopPropagation(); !isCompletedDB && toggleExerciseCheck(day.dayNumber, ex.id); }}
                                          disabled={isCompletedDB}
                                          className={`px-4 py-3 shrink-0 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all
                                            ${isChecked 
                                              ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                                              : 'bg-primary text-background border border-primary hover:bg-primary/80 shadow-glow shadow-primary/20'}`}
                                        >
                                          {isChecked ? 'Finished' : 'Finish'}
                                        </button>
                                     </div>
                                  </GlassCard>
                                )
                             })}
                         </div>
                     </div>
                 </div>
             </div>
           )
        })}
      </div>

      {/* Instruction/Rest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md">
           <GlassCard className="w-full max-w-lg p-10 relative overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              <h2 className="font-display text-3xl font-bold text-white mb-6 tracking-tighter uppercase">{modalData.title}</h2>
              
              <div className="mb-8 p-4 bg-surface-high/40 rounded-2xl flex items-center gap-4 border border-outline-variant/10">
                 <Timer className="text-secondary" />
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Prescribed Rest</p>
                    <p className="text-white font-display text-xl font-bold">{modalData.rest}</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {modalData.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary shrink-0 mt-1">
                          {i + 1}
                       </span>
                       <p className="text-on-surface-variant font-body text-sm leading-relaxed">{step}</p>
                    </div>
                 ))}
              </div>
              
              <div className="mt-10 flex justify-end">
                 <NeonButton onClick={() => setIsModalOpen(false)}>CLOSE INSTRUCTIONS</NeonButton>
              </div>
           </GlassCard>
        </div>
      )}
    </div>
  );
};

// Helper inside file
function isLocked(isUnlocked, isCompletedDB) {
    if (!isUnlocked) return true;
    return false;
}

export default Workout;
