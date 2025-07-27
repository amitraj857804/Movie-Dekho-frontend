import { useState } from 'react';

export const useAuthModal = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const openAuthModal = (tab = 'login') => {

    setAuthModalTab(tab);
    setIsAuthModalOpen((prev)=> !prev );

    // Simple overflow hidden approach
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = '';
  };

  const switchAuthTab = (tab) => {
    setAuthModalTab(tab);
  };

  return {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    switchAuthTab
  };
};
