import { useState, useEffect } from 'react';

/**
 * Custom hook to detect scroll position and determine if user has scrolled past a threshold
 * @param {number} threshold - The scroll position threshold (default: 20)
 * @returns {boolean} - Whether the user has scrolled past the threshold
 */
export const useScrollDetection = (threshold = 20) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > threshold);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

export default useScrollDetection;
