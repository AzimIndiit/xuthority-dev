/**
 * Scroll to top of the page
 * @param behavior - Scroll behavior ('smooth' | 'auto')
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * Scroll to a specific element
 * @param elementId - ID of the element to scroll to
 * @param behavior - Scroll behavior ('smooth' | 'auto')
 */
export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior,
      block: 'start',
      inline: 'nearest'
    });
  }
};

/**
 * Scroll to a specific position
 * @param x - Horizontal position
 * @param y - Vertical position
 * @param behavior - Scroll behavior ('smooth' | 'auto')
 */
export const scrollToPosition = (x: number, y: number, behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: y,
    left: x,
    behavior
  });
}; 