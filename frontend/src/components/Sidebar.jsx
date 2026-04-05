import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, Activity, MessageSquare, Droplet, Settings, User, FileText, LogOut, Dumbbell, Moon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/diet', icon: <Utensils size={20} />, label: 'Diet Plan' },
    { to: '/workout', icon: <Dumbbell size={20} />, label: 'Workout' },
    { to: '/progress', icon: <Activity size={20} />, label: 'Progress' },
    { to: '/chat', icon: <MessageSquare size={20} />, label: 'AI Coach' },
    { to: '/calories', icon: <Activity size={20} />, label: 'Calories' },
    { to: '/water', icon: <Droplet size={20} />, label: 'Hydration' },
    { to: '/sleep', icon: <Moon size={20} />, label: 'Sleep' },
    { to: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-surface-low/50 backdrop-blur-3xl border-r border-outline-variant/10 flex flex-col p-6 hidden md:flex shrink-0">
      <div className="mb-8 px-2">
        <h1 className="font-display text-2xl font-bold neon-text-gradient tracking-tight">KINETIC</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mt-1">Elite Performance</p>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 text-primary border-l-4 border-primary font-bold' 
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-variant/40'
              }`
            }
          >
            <span className="opacity-80">{link.icon}</span>
            <span className="font-body text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 space-y-3 px-2">
         <button className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-on-primary font-black rounded-xl tracking-tighter hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-primary/20 text-xs uppercase">
            UPGRADE TO PRO
         </button>
         <button 
           onClick={handleLogout}
           className="w-full flex items-center justify-center gap-2 py-3 text-error/60 hover:text-error hover:bg-error/10 rounded-xl transition-all text-sm font-bold"
         >
            <LogOut size={18} />
            <span>Log Out</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
