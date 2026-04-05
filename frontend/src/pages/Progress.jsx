import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { TrendingUp, TrendingDown, Target, Scale, Droplet, Flame, CheckCircle2, XCircle, ChevronRight, Activity, Plus } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const generate30Days = () => Array.from({ length: 30 }, (_, i) => i + 1);

const Progress = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [inputDay, setInputDay] = useState('');
  const [newWeight, setNewWeight] = useState('');

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const [histRes, profRes] = await Promise.all([
        axios.get('http://localhost:5000/progress', config),
        axios.get('http://localhost:5000/user/profile', config)
      ]);
      
      const aggregation30Matrix = Array.isArray(histRes.data) ? histRes.data : [];
      setHistory(aggregation30Matrix);
      setProfile(profRes.data);
      
      // Auto-set the input day to the next unlogged physical weight day
      let nextDay = 1;
      if (aggregation30Matrix.length > 0) {
        for(let i=0; i<aggregation30Matrix.length; i++) {
            if(!aggregation30Matrix[i].weight) {
                nextDay = aggregation30Matrix[i].day;
                break;
            }
        }
      }
      setInputDay(nextDay);
    } catch (error) {
      console.error('Error fetching progress logic', error);
      setHistory([]); // Ensure it is an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncLog = async (e) => {
    e.preventDefault();
    if (!inputDay || !newWeight) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/progress', {
          day: parseInt(inputDay),
          weight: parseFloat(newWeight)
      }, config);
      
      setNewWeight('');
      fetchData();
    } catch (error) {
      console.error('Error syncing log', error);
    }
  };

  const getDayStatusData = (dayIndex) => {
      if (!Array.isArray(history)) return { status: 'missed', data: null };
      const data = history.find(h => h.day === dayIndex);
      if(!data) return { status: 'missed', data: null };

      const workoutDone = Boolean(data.workout_completed);
      const targetCals = profile?.target_calories || 2000;
      const isTargetCal = data.calories > 0 && Math.abs(data.calories - targetCals) <= 300;
      
      if(workoutDone && isTargetCal) return { status: 'good', data };
      if(data.weight || data.calories > 0 || data.water > 0) return { status: 'moderate', data };
      
      return { status: 'missed', data: null };
  };

  if (loading) return <div className="p-20 text-center animate-pulse tracking-[0.3em] uppercase text-xs font-display text-white">Aggregating 30-Day Matrix...</div>;

  // Header Calculations
  const currentWeight = history.length > 0 ? history[history.length - 1].weight : profile?.weight || 0;
  const startWeight = profile?.weight || currentWeight;
  const totalChange = (currentWeight - startWeight).toFixed(1);
  
  // Calculate Goal Progress %
  const idealBmiWeight = 22 * Math.pow((profile?.height || 170) / 100, 2);
  const targetWeight = profile?.goal === 'lose_weight' ? idealBmiWeight : profile?.goal === 'gain_muscle' ? idealBmiWeight + 10 : idealBmiWeight;
  const totalDifferenceNeeded = Math.abs(startWeight - targetWeight);
  const progressMade = Math.abs(startWeight - currentWeight);
  const goalPercentage = totalDifferenceNeeded > 0 ? Math.min(100, Math.round((progressMade / totalDifferenceNeeded) * 100)) : 100;

  // Graph Data (Only mapped for entered days to keep the curve realistic, but indexed to 30 days)
  const graphLabels = generate30Days().map(d => `D${d}`);
  const graphWeights = generate30Days().map(d => {
      if (!Array.isArray(history)) return null;
      const entry = history.find(h => h.day === d);
      return entry && entry.weight ? entry.weight : null;
  });

  const chartData = {
    labels: graphLabels,
    datasets: [{
      fill: true, label: 'Weight Progression (KG)',
      data: graphWeights,
      borderColor: '#00e3fd',
      backgroundColor: 'rgba(0, 227, 253, 0.1)',
      tension: 0.4,
      spanGaps: true, // connects the line across missing days
      pointBackgroundColor: '#00e3fd',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
    }]
  };
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  // Calculate Weeks Aggregation
  const weeks = [
      { num: 1, range: [1, 7] },
      { num: 2, range: [8, 14] },
      { num: 3, range: [15, 21] },
      { num: 4, range: [22, 30] }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Top Summary Section */}
      <header className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <GlassCard className="p-6 border-b-4 border-b-primary flex flex-col justify-between">
             <div className="text-zinc-500 font-display font-black text-[10px] uppercase tracking-widest mb-4 flex justify-between">Current Mass <Scale size={14} /></div>
             <p className="text-4xl font-display font-bold text-white tabular-nums">{currentWeight} <span className="text-sm opacity-50">KG</span></p>
         </GlassCard>
         <GlassCard className="p-6 border-b-4 border-b-secondary flex flex-col justify-between">
             <div className="text-zinc-500 font-display font-black text-[10px] uppercase tracking-widest mb-4 flex justify-between">Total Variation <TrendingUp size={14} /></div>
             <div className={`text-4xl font-display font-bold tabular-nums ${totalChange <= 0 ? 'text-secondary' : 'text-primary'}`}>
                {totalChange} <span className="text-sm opacity-50 text-white">KG</span>
             </div>
         </GlassCard>
         <GlassCard className="p-6 border-b-4 border-b-yellow-400 flex flex-col justify-between">
             <div className="text-zinc-500 font-display font-black text-[10px] uppercase tracking-widest mb-4 flex justify-between">Consecutive Streak <Activity size={14} /></div>
             <p className="text-4xl font-display font-bold text-yellow-400 tabular-nums">{profile?.streak || 0} <span className="text-sm opacity-50 text-white">DAYS</span></p>
         </GlassCard>
         <GlassCard className="p-6 border-b-4 border-b-emerald-400 flex flex-col justify-between group">
             <div className="text-zinc-500 font-display font-black text-[10px] uppercase tracking-widest mb-4 flex justify-between">Target Completion <Target size={14} /></div>
             <p className="text-4xl font-display font-bold text-emerald-400 tabular-nums mb-3">{goalPercentage}%</p>
             <div className="w-full h-1 bg-surface-high rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 shadow-glow" style={{width: `${goalPercentage}%`}}></div>
             </div>
         </GlassCard>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Chart & Form */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <GlassCard className="p-8 min-h-[400px] flex flex-col border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-primary text-background font-black text-[10px] tracking-[0.2em] uppercase rounded-bl-3xl">Visual Engine</div>
                <h3 className="font-display text-xl font-bold text-white tracking-widest uppercase mb-8">Trajectorial Mapping</h3>
                <div className="flex-1 min-h-[300px]">
                   <Line data={chartData} options={chartOptions} />
                </div>
             </GlassCard>

             {/* Daily Input Form */}
             <GlassCard className="p-8 border border-white/5 bg-surface-low/30 relative">
                 <h3 className="font-display font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-3">
                     <Plus size={20} className="text-primary"/> Update Body Mass Trajectory
                 </h3>
                 <form onSubmit={handleSyncLog} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div>
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500 mb-2">Day Num</label>
                        <input type="number" min="1" max="30" value={inputDay} onChange={e => setInputDay(e.target.value)} required className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-primary" />
                     </div>
                     <div className="col-span-1 md:col-span-2">
                        <label className="block text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500 mb-2">Current Weight (KG)</label>
                        <input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)} required className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-lg font-bold text-emerald-400 focus:outline-none focus:border-primary" />
                     </div>
                     <div className="flex items-end">
                        <NeonButton type="submit" className="w-full h-[52px] flex items-center justify-center">LOG</NeonButton>
                     </div>
                 </form>
             </GlassCard>
          </div>

          {/* 30-Day Matrix Scroll View */}
          <GlassCard className="lg:col-span-4 p-6 h-[720px] overflow-y-auto custom-scrollbar border-outline-variant/10">
             <div className="flex justify-between items-center mb-6 sticky top-0 bg-background/90 py-2 backdrop-blur z-10">
                 <h3 className="font-display font-black text-white tracking-[0.2em] uppercase text-xs">30-Day Matrix</h3>
                 <div className="flex gap-2">
                     <span className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-400"></span>
                     <span className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400"></span>
                     <span className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400"></span>
                 </div>
             </div>

             <div className="space-y-3">
                 {generate30Days().map(day => {
                     const { status, data } = getDayStatusData(day);
                     
                     const baseStyles = "p-4 rounded-2xl border transition-all flex items-center justify-between ";
                     const statusStyles = 
                         status === 'good' ? "bg-emerald-400/5 border-emerald-400/30 text-emerald-100" :
                         status === 'moderate' ? "bg-yellow-400/5 border-yellow-400/30 text-yellow-100" :
                         "bg-surface-high/30 border-red-400/10 text-zinc-600 opacity-50";

                     return (
                         <div key={day} className={baseStyles + statusStyles}>
                             <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black uppercase text-xs 
                                    ${status === 'good' ? 'bg-emerald-400/20 text-emerald-400' : status === 'moderate' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-surface-high text-zinc-500'}`}
                                 >
                                    D{day}
                                 </div>
                                 {data ? (
                                     <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                         <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest"><Scale size={10}/> {data.weight}kg</div>
                                         <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-secondary"><Flame size={10}/> {data.calories}</div>
                                         <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-blue-400"><Droplet size={10}/> {data.water}L</div>
                                         <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-emerald-400">
                                            {data.workout_completed ? <CheckCircle2 size={12}/> : <XCircle size={12} className="text-red-400/50"/>} Task
                                         </div>
                                     </div>
                                 ) : (
                                     <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-2">No Telemetry</span>
                                 )}
                             </div>
                         </div>
                     );
                 })}
             </div>
          </GlassCard>
      </div>

      {/* Weekly Breakdown Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-outline-variant/10">
         {weeks.map((week) => {
             // Calculate stats from history for this week
             const weekData = history.filter(h => h.day >= week.range[0] && h.day <= week.range[1]);
             const avgCal = weekData.length > 0 ? Math.round(weekData.reduce((acc, h) => acc + h.calories, 0) / weekData.length) : 0;
             const totalWorkout = weekData.filter(h => h.workout_completed).length;

             return (
                 <GlassCard key={week.num} className="p-6 border-outline-variant/5">
                     <h4 className="font-display font-black text-white uppercase tracking-widest text-lg mb-4">Phase {week.num}</h4>
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Avg Calories</span>
                         <span className="font-body font-bold text-secondary">{avgCal || '---'} kcal</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Workout Compliance</span>
                         <span className="font-body font-bold text-primary">{totalWorkout} / 7</span>
                     </div>
                     <div className="pt-4 mt-2">
                         <p className="text-[10px] text-zinc-500 italic font-medium leading-relaxed">
                             {weekData.length === 0 ? "Awaiting timeline entry." :
                              totalWorkout >= 5 ? "Exceptional protocol adherence." : 
                              totalWorkout > 0 ? "Moderate compliance detected." : "Critical workout deficiency."}
                         </p>
                     </div>
                 </GlassCard>
             )
         })}
      </div>
    </div>
  );
};

export default Progress;
