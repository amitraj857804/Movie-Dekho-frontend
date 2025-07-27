import React, { createContext, useContext } from 'react';
import { useAuthModal } from './useAuthModal';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const authModalState = useAuthModal();
  return (
    <AuthModalContext.Provider value={authModalState}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModalContext = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    // Return a fallback object with dummy functions to prevent crashes
    return {
      isAuthModalOpen: false,
      authModalTab: 'login',
      openAuthModal: () => console.warn('AuthModalProvider not found - modal will not open'),
      closeAuthModal: () => console.warn('AuthModalProvider not found'),
      switchAuthTab: () => console.warn('AuthModalProvider not found - tab will not switch')
    };
  }
  return context;
};