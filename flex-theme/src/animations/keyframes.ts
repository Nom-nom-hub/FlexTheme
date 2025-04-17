/**
 * Common animation keyframes
 */
export const keyframes = {
  /**
   * Fade in animation
   */
  fadeIn: `
    @keyframes flex-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  
  /**
   * Fade out animation
   */
  fadeOut: `
    @keyframes flex-fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,
  
  /**
   * Slide in from top animation
   */
  slideInTop: `
    @keyframes flex-slide-in-top {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  
  /**
   * Slide out to top animation
   */
  slideOutTop: `
    @keyframes flex-slide-out-top {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-20px);
        opacity: 0;
      }
    }
  `,
  
  /**
   * Slide in from bottom animation
   */
  slideInBottom: `
    @keyframes flex-slide-in-bottom {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  
  /**
   * Slide out to bottom animation
   */
  slideOutBottom: `
    @keyframes flex-slide-out-bottom {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(20px);
        opacity: 0;
      }
    }
  `,
  
  /**
   * Slide in from left animation
   */
  slideInLeft: `
    @keyframes flex-slide-in-left {
      from {
        transform: translateX(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  
  /**
   * Slide out to left animation
   */
  slideOutLeft: `
    @keyframes flex-slide-out-left {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(-20px);
        opacity: 0;
      }
    }
  `,
  
  /**
   * Slide in from right animation
   */
  slideInRight: `
    @keyframes flex-slide-in-right {
      from {
        transform: translateX(20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  
  /**
   * Slide out to right animation
   */
  slideOutRight: `
    @keyframes flex-slide-out-right {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(20px);
        opacity: 0;
      }
    }
  `,
  
  /**
   * Zoom in animation
   */
  zoomIn: `
    @keyframes flex-zoom-in {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  
  /**
   * Zoom out animation
   */
  zoomOut: `
    @keyframes flex-zoom-out {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.95);
        opacity: 0;
      }
    }
  `,
  
  /**
   * Spin animation
   */
  spin: `
    @keyframes flex-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  
  /**
   * Pulse animation
   */
  pulse: `
    @keyframes flex-pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `,
  
  /**
   * Bounce animation
   */
  bounce: `
    @keyframes flex-bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
  `,
};
