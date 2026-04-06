import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InfoModal from '../components/InfoModal';
import { ChevronRight, Droplet, TrendingUp, Flame, Award, Zap, AlertCircle, Info, Activity, Weight } from 'lucide-react';
import { getBmiStatus, getStatusLabel, getSmartInsight, getIdealWeightRange } from '../utils/dailyContent';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState({ 
    total_calories: 0, 
    target_calories: 2000, 
    total_protein: 0,
    bmi: 0,
    weight: 0,
    hydration: 0,
    streak: 1
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      try {
        const profRes = await axios.get('http://localhost:5000/user/profile', config);
        if (profRes.data) setProfile(profRes.data);
        
        const calRes = await axios.get('http://localhost:5000/calories/today', config);
        const waterRes = await axios.get('http://localhost:5000/water/today', config);
        
        setSummary({
          total_calories: calRes.data.summary?.total_calories || 0,
          target_calories: profRes.data.target_calories || 2000,
          total_protein: calRes.data.summary?.total_protein || 0,
          bmi: profRes.data.bmi || 0,
          weight: profRes.data.weight || 0,
          hydration: (waterRes.data.summary?.total_ml || 0) / 1000,
          streak: profRes.data.streak || 1
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  const bmiStatus = getBmiStatus(summary?.bmi || 0);
  const statusLabel = getStatusLabel(bmiStatus);
  const smartInsight = getSmartInsight(bmiStatus, profile?.goal || 'maintain', profile?.age, profile?.gender);
  const calProgress = summary?.target_calories > 0 ? Math.min(((summary?.total_calories || 0) / summary.target_calories) * 100, 100) : 0;

  const showDetailModal = (title, content) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    if (status === 'obese') return 'text-red-400 border-red-400/30 bg-red-400/10';
    if (status === 'overweight') return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    if (status === 'underweight') return 'text-primary border-primary/30 bg-primary/10';
    return 'text-secondary border-secondary/30 bg-secondary/10';
  };

  const meals = [
    { name: 'Fuel Protocol A', cals: '420 kcal', type: 'Breakfast', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWD5Lho4FMxnN3Vno61a2rMsWjP5JRdD1qv5DBfJXsMiougNSD11UsL0pLSfAJSFQEy19fdIRIVsfJcTDAho908V6-F6XXt4AvG2I84YBu4j_fBshIVnZdMlDolLhf_T2l4S-aC31apU7p8zyo5MV13bey6Alw5Nka6vrLI0XPk_WsqKza4eKnTHo2IyxZP_e9p8v4gBnjD_XQTux5gSzn1uQdtXYYK6tj8mlL1baSmYvGilWWzLYyS7E4aFQJ9zCEcqSjZr79v4R-' },
    { name: 'Fuel Protocol B', cals: '580 kcal', type: 'Lunch', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATOYKWzMZiEB8nOzujnu45Nfa9dLp_85fq_uaOCzItloQ8hL2C9QuRcg3Yra4hOo4zUUFBi1JwvUj5AXSKc8Xk2GcGh6FM-QC1rKKSV0qAJTdk3m_QvRhaNrZ8cH547Ps1ds4J1t2NTgfrDv85CBlsnA6Y7OvvknJxGu5OwjnYg9W2ruWCa850QMbB9FkT3IZ6pAgy03T5x-rtQRaFPYcXAjKr3mCDqGG5qtiyuADmecDPZigFGsbm2jH2GFoJG9QNUxoh27zMNvUb' },
    { name: 'Fuel Protocol C', cals: '610 kcal', type: 'Dinner', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUov8pZ1TmbO4WP_vlpzfhnffQX1GwRlL94vDc-xXBI8arYEoEKyqcy_hFsVhXTfPSol-NGJH5VV68rWr7Lanx16Rk9R0VKzWuTEueeMH2JFC_X29b7TlsseRs6fWwheD_llrm3VJIN-3-ZKApGAqlNbMNHY1ccPtKBx7sMzkFfVaRG2tDQ-E1MxnPd9MhBCvWDZzhuVBHDAxidLeTN6Wkm4pB2F7Ss6wN6RLLlLowKdlqRRBrlZoYWGKlAdGh05seGhpItu-LtJIu' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalContent.title}
        content={modalContent.content}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl font-bold text-white tracking-tight">Synchronization: {profile?.username || 'User'}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
             <div className="flex items-center gap-1.5 bg-primary/20 px-4 py-1.5 rounded-full border border-primary/30">
                <Flame size={14} className="text-primary fill-primary" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">{summary.streak} DAY LOG</span>
             </div>
             <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${getStatusColor(bmiStatus)}`}>
                {statusLabel}
             </div>
          </div>
        </div>
      </div>

      {/* Smart Insights Row - BMI DRIVEN */}
      <GlassCard className="p-8 bg-gradient-to-r from-secondary/5 via-primary/5 to-transparent border border-outline-variant/10 flex items-center gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform"><Activity size={120} /></div>
         <div className="p-5 bg-surface-high/50 rounded-3xl border border-outline-variant/5">
            <Zap className="text-primary" size={32} />
         </div>
         <div className="flex-1 relative z-10">
            <h4 className="font-display font-black text-xs text-primary uppercase tracking-[0.4em] mb-2">{smartInsight.title}</h4>
            <p className="text-lg text-white font-body opacity-90 leading-relaxed font-medium">{smartInsight.text}</p>
         </div>
         <button 
           onClick={() => showDetailModal(smartInsight.title, `Based on your BMI of ${summary.bmi.toFixed(1)}, the system has recalibrated all goal-based parameters. Efficiency in adhering to the ${bmiStatus.toUpperCase()} protocol is mandatory.`)}
           className="px-8 py-3 bg-white text-background text-[10px] font-black rounded-xl hover:scale-105 transition-all uppercase tracking-widest relative z-10 shadow-glow shadow-primary"
         >
           CALIBRATION DATA
         </button>
      </GlassCard>
      
      {/* METABOLIC OVERFLOW ALERT */}
      {summary.total_calories > summary.target_calories && (
        <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-[2.5rem] p-6 flex items-center gap-6 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.1)] group">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-glow shadow-red-500/20">
              <AlertCircle size={32} />
           </div>
           <div className="flex-1">
              <h4 className="font-display font-black text-xs text-red-500 uppercase tracking-[0.4em] mb-1">CRITICAL OVERFLOW DETECTED</h4>
              <p className="text-white text-lg font-medium italic opacity-90 leading-relaxed">
                 Caloric saturation reached. Bio-fuel equilibrium is unstable. Adjust protocol intake or increase metabolic burn rate immediately.
              </p>
           </div>
           <div className="px-6 py-2 bg-red-500/20 border border-red-500/40 rounded-xl">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">+{(summary.total_calories - summary.target_calories)} KCAL</span>
           </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <GlassCard className="col-span-12 lg:col-span-4 p-8 flex flex-col items-center min-h-[480px] relative overflow-hidden">
          <h3 className="font-display text-xl font-bold self-start text-white uppercase tracking-tight">Physiological Load</h3>
          <div className="relative w-64 h-64 my-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1f1f26" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke={bmiStatus === 'obese' ? '#f87171' : (bmiStatus === 'healthy' ? '#00e3fd' : '#df8eff')} 
                strokeWidth="10" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * calProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="font-display text-6xl font-bold text-white tracking-widest">{summary.total_calories}</span>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2">Kcal / {summary.target_calories}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-6 pt-8 border-t border-outline-variant/10 text-center">
            <div>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">State</p>
              <p className={`text-xl font-display font-bold uppercase ${calProgress > 100 ? 'text-red-400' : 'text-primary'}`}>
                 {calProgress > 100 ? 'Saturation' : 'Operating'}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
              <p className={`text-xl font-display font-bold uppercase ${getStatusColor(bmiStatus).split(' ')[0]}`}>{bmiStatus}</p>
            </div>
          </div>
        </GlassCard>

        {/* Global Parameters */}
        <GlassCard className="col-span-12 lg:col-span-8 p-10 flex flex-col min-h-[480px]">
           <div className="flex justify-between items-center mb-10 pb-8 border-b border-outline-variant/5">
              <div>
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">Kinetic Bio-History</h3>
                <p className="text-sm text-zinc-500 font-body italic">Biometrically aligned for the {bmiStatus} range.</p>
              </div>
              <div className="p-3 bg-surface-high rounded-2xl border border-outline-variant/10 text-primary">
                 <Award size={24} />
              </div>
           </div>
           
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant/10 rounded-[40px] bg-surface-high/5 relative group cursor-pointer overflow-hidden" onClick={() => navigate('/progress')}>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center space-y-6 max-w-sm px-8 relative z-10">
                  <TrendingUp size={48} className="mx-auto text-primary animate-pulse" />
                  <h4 className="font-display text-xl font-bold text-white uppercase">Neural Mapping Active</h4>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                     Your biometrics are being synchronized in 3D. {bmiStatus === 'obese' ? 'Focusing on aggressive lipid mobilization protocols.' : 'Synchronizing for peak metabolic efficiency.'}
                  </p>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                     <Zap size={14} /> VIEW HISTOREAL LOGS
                  </div>
              </div>
           </div>

           <div className="mt-10 grid grid-cols-2 gap-8">
              <div className="p-6 bg-surface-high/30 rounded-3xl border border-outline-variant/10 flex items-center gap-6">
                 <div className="p-3 bg-secondary/10 text-secondary rounded-2xl"><Weight size={24} /></div>
                  <div>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Current Weight</p>
                    <div className="flex items-baseline gap-2">
                       <p className="text-3xl font-display font-bold text-white">{summary?.weight || 0} <span className="text-xs opacity-30 font-bold">KG</span></p>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter italic">
                          (Ideal: {getIdealWeightRange(profile?.height).min}-{getIdealWeightRange(profile?.height).max}kg)
                       </p>
                    </div>
                  </div>
              </div>
              <div className="p-6 bg-surface-high/30 rounded-3xl border border-outline-variant/10 flex items-center gap-6">
                 <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Activity size={24} /></div>
                  <div>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Diagnostic BMI</p>
                    <p className="text-3xl font-display font-bold text-white">{Number(summary?.bmi || 0).toFixed(2)}</p>
                  </div>
              </div>
           </div>
        </GlassCard>

        {/* Dynamic Tips & Hydration */}
        <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-8">
            <GlassCard className="p-8 flex flex-col justify-between relative overflow-hidden group border-primary/20">
                <div className="absolute top-0 right-0 p-4 text-primary/5 group-hover:scale-125 transition-transform"><Flame size={140} /></div>
                <div>
                   <h3 className="font-display text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Laboratory Instruction</h3>
                   <p className="font-body text-white leading-relaxed text-lg font-medium relative z-10 italic">
                      {bmiStatus === 'obese' 
                        ? "Prioritize lipid oxidation. High intensity anaerobic flux mandatory every 24h."
                        : "Maintain homeostatic consistency. Skill acquisition and form focus recommended."}
                   </p>
                </div>
                <button 
                  onClick={() => showDetailModal('Protocol Intelligence', 'Our diagnostics show that adhering to your specific biometric range protocol increases successful metabolic transition by 94%.')}
                  className="flex items-center gap-3 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-6 hover:underline relative z-10"
                >
                   <Info size={16} />
                   <span>Access Research Data</span>
                </button>
            </GlassCard>
            
            <GlassCard className="p-8 flex flex-col justify-between group cursor-pointer border-secondary/20" onClick={() => navigate('/water')}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">Saturation Goal</h3>
                    <Droplet className="text-secondary group-hover:scale-110 transition-transform" size={24} />
                </div>
                <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-display font-bold text-white">{summary.hydration.toFixed(1)}</span>
                        <span className="text-zinc-600 font-black text-xs uppercase">/ 8.0 L</span>
                    </div>
                </div>
                <div className="w-full h-2 bg-surface-high rounded-full overflow-hidden mt-6">
                    <div className="h-full bg-secondary shadow-glow" style={{width: `${(summary.hydration / 8) * 100}%`}}></div>
                </div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-4">System Hydration: {((summary.hydration / 8) * 100).toFixed(0)}%</p>
            </GlassCard>
        </div>

        {/* Final Meal Protocol */}
        <GlassCard className="col-span-12 lg:col-span-8 p-10">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-outline-variant/5">
               <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">Today's Nutrient Protocol</h3>
               <button onClick={() => navigate('/diet')} className="text-primary font-black text-[10px] border border-primary/20 px-6 py-2 rounded-xl hover:bg-primary/10 transition-all uppercase tracking-widest shadow-glow-sm">Full Fuel Schedule</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {meals.map((meal, idx) => (
                  <div key={idx} className="flex flex-col gap-4 group cursor-pointer" onClick={() => showDetailModal(meal.name, `This fuel set is selected for your ${bmiStatus.toUpperCase()} protocol.`)}>
                      <div className="relative aspect-video rounded-3xl overflow-hidden ring-1 ring-white/5 group-hover:ring-primary/40 transition-all duration-500">
                          <img src={meal.img} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                          <div className="absolute top-4 right-4 p-2 bg-background/60 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                             <Zap size={14} className="text-secondary" />
                          </div>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{meal.type}</p>
                          <h4 className="font-display font-bold text-white text-md group-hover:text-primary transition-colors uppercase tracking-tight">{meal.name}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">{meal.cals} Protocol Balanced</p>
                      </div>
                  </div>
               ))}
            </div>
        </GlassCard>
      </div>
    </div>
  );
};

const Scale = (props) => <Weight {...props} />;

export default Dashboard;
