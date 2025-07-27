import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Login from './Login';
import SignUp from './SignUp';
import OtpLogin from './OtpLogin';
import ResetPassword from './ResetPassword';

const AuthModal = ({ isOpen, onClose, activeTab = 'login', onTabChange }) => {
  const currentTab = activeTab;
  const [portalContainer, setPortalContainer] = useState(null);
  const [navigationContext, setNavigationContext] = useState(null);

  useEffect(() => {
    // Create or get the portal container
    let container = document.getElementById('modal-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-portal';
      container.style.position = 'relative';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Clean up portal container if it's empty and no longer needed
      const currentContainer = document.getElementById('modal-portal');
      if (currentContainer && currentContainer.children.length === 0 && !isOpen) {
        try {
          document.body.removeChild(currentContainer);
        } catch (e) {
          // Ignore if already removed
        }
      }
    };
  }, [isOpen]);

  const switchTab = (tab, context = null) => {
    setNavigationContext(context);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Clear navigation context when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNavigationContext(null);
    }
  }, [isOpen]);

  // Handle body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Return null if modal is not open or portal container is not ready
  if (!isOpen || !portalContainer) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'login':
        return <Login onSwitchTab={switchTab} onClose={onClose} isModal={true} />;
      case 'signup':
        return <SignUp onSwitchTab={switchTab} onClose={onClose} isModal={true} modalNavigationContext={navigationContext} />;
      case 'otplogin':
        return <OtpLogin onSwitchTab={switchTab} onClose={onClose} isModal={true} />;
      case 'resetpassword':
        return <ResetPassword onSwitchTab={switchTab} onClose={onClose} isModal={true} />;
      default:
        return <Login onSwitchTab={switchTab} onClose={onClose} isModal={true} />;
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center px-2 pt-18 pb-8 sm:px-4 max-sm:items-center"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-lg mt-4 mx-auto sm:min-h-full sm:flex sm:items-center sm:justify-center">
        {/* Modal content - Responsive width, dynamic height, no scrollbar */}
        <div className="bg-gray-900 bg-opacity-95 rounded-xl shadow-2xl border border-gray-600 border-opacity-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  return createPortal(modalContent, portalContainer);
};

export default AuthModal;
