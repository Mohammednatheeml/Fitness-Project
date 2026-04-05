import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import GlassCard from '../components/GlassCard';
import InfoModal from '../components/InfoModal';
import { Download, FileText, CheckCircle, Clock, Zap, Activity } from 'lucide-react';

const Reports = () => {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ calories: 0, water: 0, streak: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
        const [profRes, calRes, waterRes] = await Promise.all([
          axios.get('http://localhost:5000/user/profile', config),
          axios.get('http://localhost:5000/calories/today', config),
          axios.get('http://localhost:5000/water/today', config)
        ]);
        setProfile(profRes.data);
        setStats({
          calories: calRes.data.summary?.total_calories || 0,
          water: (waterRes.data.summary?.total_ml || 0) / 1000,
          streak: profRes.data.streak || 1
        });
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async () => {
    setIsExporting(true);
    const element = reportRef.current;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Protocol_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const reportItems = [
    { label: 'Calorie Adherence', value: stats.calories > profile?.target_calories ? 'Over Target' : 'Synchronized', icon: <Clock size={16} />, status: stats.calories > profile?.target_calories ? 'text-red-400' : 'text-primary' },
    { label: 'Hydration Protocol', value: `${stats.water.toFixed(1)}L / 8.0L`, icon: <CheckCircle size={16} />, status: stats.water >= 8 ? 'text-secondary' : 'text-zinc-500' },
    { label: 'Current Streak', value: `${stats.streak} Days`, icon: <Zap size={16} />, status: 'text-primary' },
    { label: 'Metabolic State', value: 'Optimized', icon: <Activity size={16} />, status: 'text-secondary' }
  ];

  return (
    <div className="space-y-6 pb-20">
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Protocol Export Successful"
        content="Your physiological performance report has been compiled and downloaded. This data represents a cryptographic snapshot of your metabolic state."
      />

      <header className="mb-14 flex justify-between items-end">
        <div>
           <h1 className="font-display text-4xl font-bold neon-text-gradient bg-clip-text text-transparent inline-block uppercase tracking-tighter">Report Analytics</h1>
           <p className="text-on-surface-variant font-body mt-2">Exporting daily biometric synchronization archives.</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isExporting}
          className={`flex items-center gap-3 px-8 py-4 bg-primary text-background font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-glow shadow-primary ${isExporting ? 'opacity-50 animate-pulse' : ''}`}
        >
          <Download size={18} />
          {isExporting ? 'COMPILING...' : 'GENERATE PDF'}
        </button>
      </header>

      <div ref={reportRef} className="p-8 bg-[#0a0a0f] rounded-3xl border border-outline-variant/10">
        <GlassCard className="p-12 mb-8 bg-surface-high/20">
           <div className="flex justify-between items-start mb-12 border-b border-outline-variant/10 pb-8">
              <div>
                 <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Physiological Log</h2>
                 <p className="text-zinc-500 font-black text-[10px] mt-2 uppercase tracking-[0.4em]">Internal Reference: {profile?.id?.toString().padStart(6, '0')}</p>
              </div>
              <div className="text-right">
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Station Date</p>
                 <p className="text-lg font-display font-bold text-white uppercase">{new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reportItems.map((item, i) => (
                <div key={i} className="p-6 bg-surface-high/30 rounded-2xl border border-outline-variant/5">
                   <div className="flex items-center gap-2 text-zinc-500 mb-3">
                      {item.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                   </div>
                   <p className={`text-xl font-display font-bold ${item.status}`}>{item.value}</p>
                </div>
              ))}
           </div>

           <div className="mt-12">
              <h3 className="font-display text-sm font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Subject Profile</h3>
              <div className="grid grid-cols-3 gap-6">
                 <div className="p-6 bg-surface-high/10 rounded-2xl">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Height</p>
                    <p className="text-white font-bold">{profile?.height} CM</p>
                 </div>
                 <div className="p-6 bg-surface-high/10 rounded-2xl">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Weight</p>
                    <p className="text-white font-bold">{profile?.weight} KG</p>
                 </div>
                 <div className="p-6 bg-surface-high/10 rounded-2xl">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Goal</p>
                    <p className="text-white font-bold uppercase">{profile?.goal?.replace('_', ' ')}</p>
                 </div>
              </div>
           </div>

           <div className="mt-12 pt-12 border-t border-outline-variant/10 text-center">
              <FileText className="mx-auto text-zinc-800 mb-4" size={48} />
              <p className="text-xs text-on-surface-variant font-body leading-relaxed max-w-lg mx-auto">
                 This report is generated by the Elite Fitness OS. Adherence to the prescribed metabolic protocol is mandatory for target biometric attainment.
              </p>
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Reports;
