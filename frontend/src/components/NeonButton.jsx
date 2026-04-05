import React from 'react';

const NeonButton = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const baseClasses = "px-6 py-3 rounded-full font-display font-semibold transition-all duration-300 transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-dim text-on-primary shadow-neon-primary hover:shadow-[0_0_25px_rgba(223,142,255,0.5)]",
    secondary: "bg-surface-variant/40 backdrop-blur-md border border-outline-variant/20 text-primary hover:bg-surface-variant/60",
    tertiary: "text-secondary hover:text-white drop-shadow-[0_0_8px_rgba(0,227,253,0.5)]"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default NeonButton;
