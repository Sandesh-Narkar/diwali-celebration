/**
 * DIWALI SCROLL-DRIVEN ANIMATION CONTROLLER
 * Coordinates Dual-Sequence Engine (Desktop & Mobile), Canvas Rendering,
 * and Apple-style Scroll Synchronization.
 */

(function () {
  'use strict';

  // --- DOM ELEMENTS ---
  const canvas = document.getElementById('diwaliCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scrollTrack = document.getElementById('scrollTrack');
  const introOverlay = document.getElementById('introOverlay');
  const loaderScreen = document.getElementById('loaderScreen');
  const loaderProgressBar = document.getElementById('loaderProgressBar');
  const loaderStatusText = document.getElementById('loaderStatusText');
  const scrollHud = document.getElementById('scrollHud');
  const hudFill = document.getElementById('hudFill');
  const hudText = document.getElementById('hudText');
  const replayBtn = document.getElementById('replayBtn');

  // --- ENGINE STATE ---
  let activeMode = window.DeviceDetector ? window.DeviceDetector.getMode() : 'desktop';
  let targetFrameIndex = 0;
  let currentFrameFloat = 0;
  let lastRenderedFrame = -1;
  let lastRenderedMode = null;
  let isRafRunning = false;
  let isReady = false;

  // --- CANVAS RESIZING WITH DEVICE PIXEL RATIO ---
  function resizeCanvas() {
    if (!canvas) return;

    // Use DPR capped at 2 for crisp rendering without excessive GPU memory on mobile
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const targetWidth = Math.floor(displayWidth * dpr);
    const targetHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';
      // Repaint frame immediately on resize
      renderFrame(Math.round(currentFrameFloat), true);
    }
  }

  // --- ADVANCED DUAL-SEQUENCE CANVAS RENDERING ---
  function renderFrame(index, force = false) {
    if (!canvas || !ctx) return;

    const frameData = window.FrameLoader.getFrameOrNearest(index);
    if (!frameData || !frameData.image) return;

    const safeIndex = frameData.index;
    if (!force && safeIndex === lastRenderedFrame && activeMode === lastRenderedMode) {
      return;
    }

    const img = frameData.image;
    const cw = canvas.width;
    const ch = canvas.height;

    if (frameData.crop) {
      // --- MOBILE SEQUENCE (VERTICAL 9:16 ARTWORK) ---
      // Sample precisely from the 9:16 artwork coordinates, eliminating white padding
      const { sx, sy, sw, sh } = frameData.crop;

      // Ambient festive gradient background extending the room's atmosphere
      const bgGrad = ctx.createRadialGradient(
        cw / 2, ch / 2, Math.min(cw, ch) * 0.15,
        cw / 2, ch / 2, Math.max(cw, ch) * 0.75
      );
      bgGrad.addColorStop(0, '#240621');
      bgGrad.addColorStop(0.5, '#120310');
      bgGrad.addColorStop(1, '#080206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Safe containment scaling:
      // Guarantees 100% of the artwork is visible (the children, family, garlands & diyas are never cropped)
      const scale = Math.min(cw / sw, ch / sh);
      const dw = Math.round(sw * scale);
      const dh = Math.round(sh * scale);
      const dx = Math.round((cw - dw) / 2);
      const dy = Math.round((ch - dh) / 2);

      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
      // --- DESKTOP SEQUENCE (HORIZONTAL 16:9 ARTWORK) ---
      // Preserves 100% of the desktop composition and typography
      ctx.fillStyle = '#080206';
      ctx.fillRect(0, 0, cw, ch);

      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1080;

      const scale = Math.min(cw / iw, ch / ih);
      const dw = Math.round(iw * scale);
      const dh = Math.round(ih * scale);
      const dx = Math.round((cw - dw) / 2);
      const dy = Math.round((ch - dh) / 2);

      ctx.drawImage(img, dx, dy, dw, dh);
    }

    lastRenderedFrame = safeIndex;
    lastRenderedMode = activeMode;
  }

  // --- SCROLL CALCULATION & INTERACTION ---
  function calculateScrollState() {
    if (!scrollTrack) return;

    const trackRect = scrollTrack.getBoundingClientRect();
    const totalDistance = scrollTrack.offsetHeight - window.innerHeight;

    if (totalDistance <= 0) return;

    // Map scroll distance to normalized progress (0.0 to 1.0)
    const progress = Math.max(0, Math.min(1, -trackRect.top / totalDistance));
    const totalFrames = window.FrameLoader.getTotalFrames();

    targetFrameIndex = Math.floor(progress * (totalFrames - 1));
    targetFrameIndex = Math.max(0, Math.min(totalFrames - 1, targetFrameIndex));

    // Handle Section 1 Intro Fade (smoothly fades in first 12% of scroll)
    if (introOverlay) {
      const fadeThreshold = 0.12;
      const introFade = Math.min(1, progress / fadeThreshold);
      const introOpacity = Math.max(0, 1 - introFade);

      introOverlay.style.opacity = introOpacity.toFixed(3);
      introOverlay.style.transform = `translateY(${(-introFade * 24).toFixed(1)}px)`;

      if (introOpacity <= 0.01) {
        introOverlay.classList.add('hidden');
      } else {
        introOverlay.classList.remove('hidden');
      }
    }

    // Handle Ambient Corner HUD
    if (scrollHud && hudFill && hudText) {
      if (progress > 0.04 && progress < 0.98) {
        scrollHud.classList.add('visible');
      } else {
        scrollHud.classList.remove('visible');
      }
      const pct = Math.round(progress * 100);
      hudFill.style.width = `${pct}%`;
      hudText.textContent = `${pct}%`;
    }

    // Dynamic queue prioritization for nearby frames
    window.FrameLoader.prioritize(targetFrameIndex, (readyIdx) => {
      const currentInt = Math.round(currentFrameFloat);
      if (currentInt === readyIdx) {
        renderFrame(currentInt, true);
      }
    });
  }

  // --- REQUEST-ANIMATION-FRAME ENGINE (APPLE-STYLE LERP) ---
  function animationLoop() {
    // Smooth inertia dampener (0.18):
    // Synchronizes frame advancement naturally without lag or scroll hijacking
    const diff = targetFrameIndex - currentFrameFloat;

    if (Math.abs(diff) > 0.001) {
      currentFrameFloat += diff * 0.18;
      const frameToDraw = Math.round(currentFrameFloat);
      renderFrame(frameToDraw);
    } else if (currentFrameFloat !== targetFrameIndex) {
      // Settle on exact frame when scrolling halts
      currentFrameFloat = targetFrameIndex;
      renderFrame(targetFrameIndex);
    }

    requestAnimationFrame(animationLoop);
  }

  // --- DEVICE & ORIENTATION MODE SWITCHING ---
  function handleDeviceModeSwitch(newMode) {
    if (newMode === activeMode) return;

    console.log(`[Diwali Animation] Switching animation sequence: ${activeMode} -> ${newMode}`);
    const prevProgress = currentFrameFloat / (window.FrameLoader.getTotalFrames() - 1);

    activeMode = newMode;
    window.FrameLoader.initMode(newMode);
    resizeCanvas();

    // Preload critical frames for newly activated sequence
    window.FrameLoader.preloadInitial(newMode, null, () => {
      // Restore equivalent progress in new sequence
      const newTotal = window.FrameLoader.getTotalFrames();
      currentFrameFloat = Math.round(prevProgress * (newTotal - 1));
      targetFrameIndex = currentFrameFloat;

      renderFrame(currentFrameFloat, true);
      window.FrameLoader.queueRemaining((readyIdx) => {
        if (Math.round(currentFrameFloat) === readyIdx) {
          renderFrame(readyIdx, true);
        }
      });
    });
  }

  // --- INITIALIZATION ---
  function init() {
    activeMode = window.DeviceDetector.getMode();
    window.FrameLoader.initMode(activeMode);

    resizeCanvas();

    // Listen for orientation or screen size breakpoint changes
    window.DeviceDetector.onChange(handleDeviceModeSwitch);

    // Initial critical preloading for active mode
    window.FrameLoader.preloadInitial(
      activeMode,
      // Progress tracking
      function (percent) {
        if (loaderProgressBar) {
          loaderProgressBar.style.width = `${percent}%`;
        }
        if (loaderStatusText) {
          loaderStatusText.textContent = `${percent}%`;
        }
      },
      // Completion
      function () {
        isReady = true;

        setTimeout(() => {
          if (loaderScreen) {
            loaderScreen.classList.add('fade-out');
          }
          // Render initial frame
          renderFrame(0, true);

          // Begin progressive background loading for the rest of frames
          window.FrameLoader.queueRemaining((readyIdx) => {
            if (Math.round(currentFrameFloat) === readyIdx) {
              renderFrame(readyIdx, true);
            }
          });

          // Start RAF tick
          if (!isRafRunning) {
            isRafRunning = true;
            requestAnimationFrame(animationLoop);
          }
        }, 400);
      }
    );

    calculateScrollState();
  }

  // --- LISTENERS ---
  window.addEventListener('scroll', calculateScrollState, { passive: true });

  let resizeDebounce;
  function onResize() {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      resizeCanvas();
      calculateScrollState();
    }, 60);
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
