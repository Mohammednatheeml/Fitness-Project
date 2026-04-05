import React from 'react';
import { Search, Bell, Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="h-20 w-full z-50 bg-surface-low/30 backdrop-blur-3xl flex justify-between items-center px-8 shadow-[0_0_20px_rgba(223,142,255,0.05)] border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim font-display">KINETIC</span>
        <div className="hidden md:flex items-center bg-surface-high/50 rounded-full px-4 py-2 border border-outline-variant/10 group focus-within:border-secondary/30 transition-all">
          <Search size={18} className="text-on-surface-variant group-focus-within:text-secondary" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-zinc-600 ml-2" 
            placeholder="Search analytics..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-secondary transition-colors">
            <Bell size={20} />
        </button>
        <button className="text-on-surface-variant hover:text-secondary transition-colors">
            <Zap size={20} />
        </button>
        <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20 hover:border-secondary transition-colors cursor-pointer ring-2 ring-primary/10">
          <img 
            alt="User profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-7v2lTgnPxkO6GRBklI_7d-hSzSOwsDMwJIwXVN_OBSM9refynvR2oOcAkzO8e0xDt9_cHl6oQEVETa0x3WeQP--qEOTGus6hgSk7D7wjebj4TbLmvTyopWXtuXQmSbAJgG_jfCKcxbOvsb_HEMeNRP_-1BOTTJ0-ePhAkRZ9M56eiqPpYhbRT0-9dEKz3aW5WxzTMWGUxEyG3usqfIAY1nkmeqw3Nz6ueUbs8QAiUj7TPREAe6U-XNIeMiUmk33Ypa4sVh3FgL1i" 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
