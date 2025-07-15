import React from 'react';

const ScrollContainer = ({ children, className = '', horizontal = false }) => {
  const baseClasses = 'custom-scrollbar';
  const scrollClasses = horizontal 
    ? 'overflow-x-auto overflow-y-hidden' 
    : 'overflow-y-auto overflow-x-hidden';
  
  return (
    <div className={`${baseClasses} ${scrollClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollContainer;
