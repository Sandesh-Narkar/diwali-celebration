/**
 * DEVICE DETECTION MODULE
 * Intelligent responsive device & orientation detector for Diwali Celebration.
 * Distinguishes between desktop, mobile, and tablet viewports.
 */

window.DeviceDetector = (function () {
  'use strict';

  let currentMode = null;
  const changeListeners = [];

  // Determine device mode based on viewport geometry, orientation & capabilities
  function detectMode() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Mobile Phone: Screen width <= 768px (regardless of orientation)
    if (width <= 768) {
      return 'mobile';
    }

    // Tablet in portrait orientation: prefers vertical mobile sequence
    if (isPortrait && width <= 1024) {
      return 'mobile';
    }

    // Touch device in portrait: mobile sequence
    if (isTouch && isPortrait) {
      return 'mobile';
    }

    // Desktop / Laptop / Large screen / Landscape tablet: desktop sequence
    return 'desktop';
  }

  function init() {
    currentMode = detectMode();

    let resizeTimer = null;
    function handleResizeOrOrientation() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newMode = detectMode();
        if (newMode !== currentMode) {
          const oldMode = currentMode;
          currentMode = newMode;
          notifyChange(newMode, oldMode);
        }
      }, 150);
    }

    window.addEventListener('resize', handleResizeOrOrientation, { passive: true });
    window.addEventListener('orientationchange', handleResizeOrOrientation, { passive: true });
  }

  function notifyChange(newMode, oldMode) {
    for (let i = 0; i < changeListeners.length; i++) {
      try {
        changeListeners[i](newMode, oldMode);
      } catch (err) {
        console.error('[DeviceDetector] Listener error:', err);
      }
    }
  }

  init();

  return {
    getMode: function () {
      return currentMode || detectMode();
    },
    isMobile: function () {
      return this.getMode() === 'mobile';
    },
    isDesktop: function () {
      return this.getMode() === 'desktop';
    },
    onChange: function (callback) {
      if (typeof callback === 'function') {
        changeListeners.push(callback);
      }
    }
  };
})();
