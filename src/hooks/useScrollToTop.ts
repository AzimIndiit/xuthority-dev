import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopOptions {
  behavior?: ScrollBehavior;
  smooth?: boolean;
}

/**
 * Custom hook that scrolls to top when the route changes
 * @param options - Scroll behavior options
 */
const useScrollToTop = (options: ScrollToTopOptions = {}) => {
  const { pathname } = useLocation();
  const { behavior = 'smooth', smooth = true } = options;

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? behavior : 'auto'
    });
  }, [pathname, behavior, smooth]);
};

export default useScrollToTop; 