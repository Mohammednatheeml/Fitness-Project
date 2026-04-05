import React from 'react';
import { X, Info } from 'lucide-react';
import GlassCard from './GlassCard';

const InfoModal = ({ isOpen, onClose, title, content, type = 'info' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <GlassCard className="relative w-full max-w-lg p-8 bg-surface-low border border-outline-variant/20 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
           <div className={`p-3 rounded-2xl ${type === 'tip' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
              <Info size={24} />
           </div>
           <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-white mb-4">{title}</h3>
              <div className="font-body text-on-surface-variant leading-relaxed">
                 {content}
              </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant/10 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all uppercase tracking-widest"
           >
             Understood
           </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default InfoModal;
