import { useEffect } from 'react';
import { scrollToTop, scrollToPosition } from '../utils/scrollUtils';

/**
 * Custom hook for smooth scrolling to top when component mounts
 * @param {Array} dependencies - Dependencies array for useEffect (default: [])
 * @param {number} delay - Optional delay before scrolling (default: 0)
 * @param {boolean} condition - Optional condition to control when to scroll (default: true)
 */
export const useScrollToTop = (dependencies = [], delay = 0, condition = true) => {
  useEffect(() => {
    if (condition) {
      scrollToTop(delay);
    }
  }, dependencies);
};

/**
 * Custom hook for smooth scrolling to top when loading completes
 * @param {boolean} isLoading - Loading state
 * @param {Array} additionalDeps - Additional dependencies (default: [])
 * @param {number} delay - Optional delay before scrolling (default: 0)
 */
export const useScrollOnLoadComplete = (isLoading, additionalDeps = [], delay = 0) => {
  useEffect(() => {
    if (!isLoading) {
      scrollToTop(delay);
    }
  }, [isLoading, ...additionalDeps]);
};

/**
 * Custom hook for smooth scrolling to a specific position
 * @param {number} top - Top position to scroll to
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {number} left - Left position (default: 0)
 * @param {number} delay - Optional delay before scrolling (default: 0)
 */
export const useScrollToPosition = (top, dependencies, left = 0, delay = 0) => {
  useEffect(() => {
    scrollToPosition(top, left, delay);
  }, dependencies);
};

/**
 * Custom hook that returns scroll utility functions
 * @returns {Object} - Object containing scroll utility functions
 */
export const useScrollUtils = () => {
  return {
    scrollToTop: (delay = 0) => scrollToTop(delay),
    scrollToPosition: (top, left = 0, delay = 0) => scrollToPosition(top, left, delay),
    scrollToTopOnMount: () => scrollToTop(),
    scrollToTopDelayed: (delay) => scrollToTop(delay)
  };
};

export default useScrollToTop;
