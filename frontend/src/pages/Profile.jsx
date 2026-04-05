import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { User, Ruler, Weight, Target, Calendar, Info, CheckCircle, Activity, Heart, Sparkles, Target as TargetIcon } from 'lucide-react';
import { getBmiStatus, getWeightStatusColor, getIdealWeightRange, getStatusLabel } from '../utils/dailyContent';

const Profile = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    bmi: 0,
    target_calories: 0,
    status: 'healthy'
  });
  const [activeBmi, setActiveBmi] = useState(0);
  const [activeStatus, setActiveStatus] = useState('healthy');
  const [idealRange, setIdealRange] = useState({ min: 0, max: 0 });
  const [isNewUser, setIsNewUser] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/user/profile', config);
        
        if (res.data) {
          // Merge fetched data with initial state to ensure all fields exist
          setProfile(prev => ({ ...prev, ...res.data }));
          
          if (!res.data.age || !res.data.height || !res.data.weight) {
            setIsNewUser(true);
          }
        }
      } catch (error) {
        // 404 is expected for new users, just set isNewUser to true
        setIsNewUser(true);
      }
    };
    fetchProfile();
  }, []);

  // Real-time Bio Engine
  useEffect(() => {
    if (profile.height && profile.weight) {
      const hM = profile.height / 100;
      const bmiVal = profile.weight / (hM * hM);
      setActiveBmi(bmiVal);
      setActiveStatus(getBmiStatus(bmiVal));
      setIdealRange(getIdealWeightRange(profile.height));

      // Calculate approximate TDEE / Target based on goal
      let base = 2000;
      if (profile.goal === 'lose_weight') base = 1650;
      if (profile.goal === 'gain_muscle') base = 2800;
      setProfile(prev => ({ ...prev, bmi: bmiVal, target_calories: base }));
    }
  }, [profile.height, profile.weight, profile.goal]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/user/profile', profile, config);
      
      setSaveStatus('success');
      
      // Update global profile status in App.jsx
      if (onProfileUpdate) await onProfileUpdate();
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setSaveStatus('error');
      alert('Error updating profile settings.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="pt-6 relative">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-primary to-transparent opacity-50" />
        <h1 className="font-display text-5xl font-bold text-white tracking-tight uppercase">
           {isNewUser ? 'Initialize Bio-Metric Sync' : 'Engine Calibration'}
        </h1>
        <p className="text-on-surface-variant font-body text-lg mt-2 font-medium opacity-70">
           {isNewUser ? 'Please provide your essential data to unlock the performance ecosystem.' : 'Adjusting your physiological parameters for maximum efficiency.'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-10 bg-surface-low border border-outline-variant/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
                  <User size={120} className="text-primary" />
               </div>
               
               <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                           <Calendar size={12} />
                           <span>Subject Age</span>
                        </label>
                        <input
                           name="age"
                           type="number"
                           className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-all font-body text-lg"
                           value={profile.age || ''}
                           onChange={handleChange}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
                           <User size={12} />
                           <span>Physiological Gender</span>
                        </label>
                        <select
                           name="gender"
                           className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-all font-body text-lg appearance-none cursor-pointer"
                           value={profile.gender || ''}
                           onChange={handleChange}
                           required
                        >
                           <option value="">Select</option>
                           <option value="male">Male</option>
                           <option value="female">Female</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">
                           <Ruler size={12} />
                           <span>Height (CM)</span>
                        </label>
                        <input
                           name="height"
                           type="number"
                           className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/50 transition-all font-body text-lg"
                           value={profile.height || ''}
                           onChange={handleChange}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">
                           <Weight size={12} />
                           <span>Weight (KG)</span>
                        </label>
                        <input
                           name="weight"
                           type="number"
                           className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/50 transition-all font-body text-lg"
                           value={profile.weight || ''}
                           onChange={handleChange}
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] ml-1">
                        <Target size={12} />
                        <span>Core Objective</span>
                     </label>
                     <select
                        name="goal"
                        className="w-full bg-surface-high/50 border border-outline-variant/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-body text-lg appearance-none cursor-pointer"
                        value={profile.goal || ''}
                        onChange={handleChange}
                        required
                     >
                        <option value="">Select Protocol</option>
                        <option value="gain_muscle">Weight Gain</option>
                        <option value="lose_weight">Weight Loss</option>
                        <option value="maintain">Maintain Weight</option>
                     </select>
                  </div>

                  <div className="pt-6">
                     <NeonButton type="submit" className="w-full h-16 text-xl tracking-widest">
                        <div className="flex items-center justify-center gap-4">
                           {saveStatus === 'success' ? (
                              <>
                                 <CheckCircle size={24} className="text-secondary animate-bounce" />
                                 <span>CALIBRATION COMPLETE</span>
                              </>
                           ) : (
                              <>
                                 <Activity size={24} className={saveStatus === 'saving' ? 'animate-spin' : ''} />
                                 <span>{saveStatus === 'saving' ? 'SAVING DATA...' : 'SAVE BIOMETRICS'}</span>
                              </>
                           )}
                        </div>
                     </NeonButton>
                  </div>
               </form>
            </GlassCard>
        </div>

        <div className="space-y-6">
            <GlassCard 
               className="p-8 border-2 transition-all duration-500 overflow-hidden group relative"
               style={{ borderColor: `${getWeightStatusColor(activeStatus)}40`, background: `linear-gradient(135deg, ${getWeightStatusColor(activeStatus)}10, transparent)` }}
            >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Heart size={100} style={{ color: getWeightStatusColor(activeStatus) }} />
                </div>

                <div className="flex items-center justify-between mb-8">
                   <h3 className="font-display font-black text-white text-xs uppercase tracking-[0.3em]">Bio-Metric Analysis</h3>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getWeightStatusColor(activeStatus) }} />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">{activeStatus}</span>
                   </div>
                </div>
                
                <div className="space-y-8">
                    <div className="relative">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Calculated BMI</p>
                        <p className="text-6xl font-display font-bold text-white tracking-tighter">
                           {activeBmi.toFixed(2)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                        <div>
                           <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Ideal Range</p>
                           <p className="text-xl font-display font-bold text-white">
                              {idealRange.min}-{idealRange.max} <span className="text-[10px] opacity-40">KG</span>
                           </p>
                        </div>
                        <div>
                           <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Baseline</p>
                           <p className="text-xl font-display font-bold text-white">
                              {profile.target_calories} <span className="text-[10px] opacity-40">KCAL</span>
                           </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/5 flex items-start gap-3">
                   <Sparkles size={16} className="text-secondary shrink-0 mt-0.5" />
                   <p className="text-[10px] text-zinc-400 font-body leading-relaxed italic">
                      "Your protocol will follow the <strong>{getStatusLabel(activeStatus)}</strong> logic path."
                   </p>
                </div>
            </GlassCard>
            
            <GlassCard className="p-8 border-outline-variant/10">
                <TargetIcon size={24} className="text-secondary mb-4" />
                <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-2">Goal Trajectory</h4>
                <p className="text-xs text-on-surface-variant font-body leading-relaxed opacity-60">
                   {activeBmi < 18.5 && "Focus on progressive overload and high caloric density."}
                   {activeBmi >= 18.5 && activeBmi < 25 && "Focus on lean muscle maintenance and athletic output."}
                   {activeBmi >= 25 && activeBmi < 30 && "Focus on metabolic optimization and consistent cardio."}
                   {activeBmi >= 30 && "Focus on high-volume activity and strict caloric deficit."}
                </p>
            </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
