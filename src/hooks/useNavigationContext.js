import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectNavigationContext, 
  clearNavigationContext, 
  clearPreviousPage,
  selectPreviousPage 
} from '../components/store/authStore';

/**
 * Custom hook to handle intelligent navigation based on context
 * Determines where to navigate back based on user's journey
 */
export const useNavigationContext = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationContext = useSelector(selectNavigationContext);
  const previousPage = useSelector(selectPreviousPage);

  const getBackButtonText = () => {
    if (navigationContext.fromPage === 'otplogin') return 'Back to OTP Login';
    if (navigationContext.fromPage === 'otplogin-direct') return 'Back to Login';
    if (navigationContext.fromPage === 'resetpassword-direct') return 'Back to Login';
    if (navigationContext.fromPage === 'resetpassword') return 'Back to Reset Password';
    if (navigationContext.fromPage === 'login') return 'Back to Login';
    if (navigationContext.isDirectEntry) return 'Back to Home';
    return 'Go Back';
  };

  const goBack = () => {
    // Enhanced navigation logic based on context
    if (navigationContext.fromPage && !navigationContext.isDirectEntry) {
      // User came from a specific auth page - restore that page with state
      if (navigationContext.fromPage === 'otplogin') {
        // Navigate back to OTP login with state parameters
        const { otpSent, email } = navigationContext.pageState || {};
        const params = new URLSearchParams();
        if (otpSent) params.set('otpSent', 'true');
        if (email) params.set('email', email);
        
        const queryString = params.toString();
        navigate(`/login-with-otp${queryString ? `?${queryString}` : ''}`);
      } else if (navigationContext.fromPage === 'otplogin-direct') {
        // OTP login page should go back to regular login
        navigate('/login');
      } else if (navigationContext.fromPage === 'resetpassword-direct') {
        // Reset password page should go back to regular login
        navigate('/login');
      } else if (navigationContext.fromPage === 'resetpassword') {
        navigate('/reset-password');
      } else if (navigationContext.fromPage === 'login') {
        navigate('/login');
      } else {
        navigate('/login'); // Default auth page
      }
      
      // Clear navigation context after using it
      dispatch(clearNavigationContext());
      dispatch(clearPreviousPage());
    } else if (navigationContext.isDirectEntry) {
      // User entered directly on login/signup, so go back to home
      navigate('/');
      dispatch(clearNavigationContext());
      dispatch(clearPreviousPage());
    } else if (previousPage) {
      // Fallback to stored previous page
      navigate(previousPage);
      dispatch(clearPreviousPage());
    } else if (window.history.length > 1) {
      // Fallback to browser history
      navigate(-1);
    } else {
      // Final fallback to home page
      navigate('/');
    }
  };

  return {
    goBack,
    getBackButtonText,
    navigationContext,
    hasNavigationContext: !!navigationContext.fromPage || navigationContext.isDirectEntry
  };
};
