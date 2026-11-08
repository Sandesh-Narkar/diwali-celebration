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
    const isPortrait = height >= width;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Landscape orientation: horizontal desktop composition is ideal
    if (!isPortrait && width > 540) {
      return 'desktop';
    }

    // Portrait orientation on mobile or tablet (width <= 1024):
    // Dedicated vertical mobile sequence fits best
    if (isPortrait && (width <= 1024 || isTouch)) {
      return 'mobile';
    }

    // Standard Desktop / Laptop / Large Screen
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
      }, 120);
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
