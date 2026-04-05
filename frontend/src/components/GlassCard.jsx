import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`glass-card p-6 ${hoverEffect ? 'transition-all hover:bg-surface-high/70 hover:shadow-glow' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
