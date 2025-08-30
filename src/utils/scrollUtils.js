/**
 * Utility functions for smooth scrolling throughout the application
 */

/**
 * Smooth scroll to top of the page
 * @param {number} delay - Optional delay in milliseconds before scrolling (default: 0)
 */
export const scrollToTop = (delay = 0) => {
  const scroll = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };

  if (delay > 0) {
    setTimeout(scroll, delay);
  } else {
    scroll();
  }
};

/**
 * Smooth scroll to a specific position
 * @param {number} top - Top position to scroll to
 * @param {number} left - Left position to scroll to (default: 0)
 * @param {number} delay - Optional delay in milliseconds before scrolling (default: 0)
 */
export const scrollToPosition = (top, left = 0, delay = 0) => {
  const scroll = () => {
    window.scrollTo({
      top,
      left,
      behavior: "smooth"
    });
  };

  if (delay > 0) {
    setTimeout(scroll, delay);
  } else {
    scroll();
  }
};

/**
 * Smooth scroll to a specific element by ID
 * @param {string} elementId - ID of the element to scroll to
 * @param {number} offset - Optional offset from the top of the element (default: 0)
 * @param {number} delay - Optional delay in milliseconds before scrolling (default: 0)
 */
export const scrollToElement = (elementId, offset = 0, delay = 0) => {
  const scroll = () => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        left: 0,
        behavior: "smooth"
      });
    }
  };

  if (delay > 0) {
    setTimeout(scroll, delay);
  } else {
    scroll();
  }
};

/**
 * Smooth scroll with a callback when scroll is complete
 * @param {number} top - Top position to scroll to
 * @param {number} left - Left position to scroll to (default: 0)
 * @param {Function} callback - Function to call when scroll is complete
 */
export const scrollWithCallback = (top, left = 0, callback) => {
  window.scrollTo({
    top,
    left,
    behavior: "smooth"
  });

  // Since there's no native way to detect when smooth scroll is complete,
  // we'll use a timeout based on typical smooth scroll duration
  if (callback && typeof callback === 'function') {
    setTimeout(callback, 500); // Adjust timing as needed
  }
};

/**
 * Get current scroll position
 * @returns {Object} - Object with top and left scroll positions
 */
export const getCurrentScrollPosition = () => {
  return {
    top: window.pageYOffset || document.documentElement.scrollTop,
    left: window.pageXOffset || document.documentElement.scrollLeft
  };
};

/**
 * Check if user has scrolled past a certain point
 * @param {number} threshold - Scroll threshold in pixels
 * @returns {boolean} - True if scrolled past threshold
 */
export const hasScrolledPast = (threshold) => {
  return window.pageYOffset > threshold;
};

/**
 * Smooth scroll to top when component mounts (React hook utility)
 * @param {Array} dependencies - useEffect dependencies array
 * @param {number} delay - Optional delay before scrolling
 */
export const useScrollToTop = (dependencies = [], delay = 0) => {
  // This is just a helper - actual implementation should use React's useEffect
  return () => scrollToTop(delay);
};
