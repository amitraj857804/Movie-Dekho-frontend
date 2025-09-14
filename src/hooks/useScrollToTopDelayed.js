import { useEffect } from 'react';

/**
 * Custom hook to scroll to top smoothly after a delay
 * Useful for scrolling to top after navigation or modal close
 * 
 * @param {number} delay - Delay in milliseconds before scrolling (default: 100)
 */
export const useScrollToTopDelayed = (delay = 100) => {
  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, delay);
  };

  return scrollToTop;
};

/**
 * Custom hook to automatically scroll to top when a value changes
 * Useful for scrolling to top when user logs in/out
 * 
 * @param {any} trigger - Value to watch for changes
 * @param {number} delay - Delay in milliseconds before scrolling (default: 100)
 */
export const useScrollToTopOnChange = (trigger, delay = 100) => {
  useEffect(() => {
    if (trigger) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, delay);
    }
  }, [trigger, delay]);
};

export default useScrollToTopDelayed;