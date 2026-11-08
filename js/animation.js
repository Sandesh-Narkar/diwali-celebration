/**
 * DIWALI SCROLL-DRIVEN ANIMATION ENGINE
 * Premium Apple-style interactive image sequence controller.
 */

(function () {
  'use strict';

  // --- CONFIGURATION & ASSET SPECS ---
  const TOTAL_FRAMES = 101;
  const FIRST_FRAME_NUM = 1;
  const INITIAL_PRELOAD_COUNT = 14; // First 14 frames for instantaneous start
  const MAX_CONCURRENT_LOADS = 4;

  // Frame URL constructor (detected sequential 3-digit pattern: ezgif-frame-001.png to 101.png)
  function getFrameUrl(index) {
    const frameNum = String(index + FIRST_FRAME_NUM).padStart(3, '0');
    return `IMAGES/ezgif-frame-${frameNum}.png`;
  }

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

  // --- STATE ---
  const imageCache = new Array(TOTAL_FRAMES);
  const imageStatus = new Array(TOTAL_FRAMES).fill('idle'); // 'idle', 'loading', 'loaded', 'error'
  
  let targetFrameIndex = 0;
  let currentFrameFloat = 0;
  let lastRenderedFrame = -1;
  let isInitialLoadComplete = false;
  let activeLoadsCount = 0;
  let loadQueue = [];
  let isRafRunning = false;

  // --- RESPONSIVE HIGH-DPI CANVAS SIZING ---
  function resizeCanvas() {
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const targetWidth = Math.floor(displayWidth * dpr);
    const targetHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // Force immediate repaint on resize
      renderFrame(Math.round(currentFrameFloat), true);
    }
  }

  // --- DRAW FRAME WITH OBJECT-FIT: CONTAIN LOGIC ---
  function renderFrame(index, force = false) {
    if (!canvas || !ctx) return;
    
    // Clamp index safely
    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));

    if (!force && safeIndex === lastRenderedFrame) {
      return;
    }

    const img = getFrameOrNearest(safeIndex);
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    // object-fit: contain scaling calculation
    // Preserves 100% of the artwork without distortion or cropping
    const scale = Math.min(cw / iw, ch / ih);
    const dw = Math.round(iw * scale);
    const dh = Math.round(ih * scale);
    const dx = Math.round((cw - dw) / 2);
    const dy = Math.round((ch - dh) / 2);

    // Fill surrounding letterbox/pillarbox with ambient deep tone
    ctx.fillStyle = '#080206';
    ctx.fillRect(0, 0, cw, ch);

    // Draw frame
    ctx.drawImage(img, dx, dy, dw, dh);
    lastRenderedFrame = safeIndex;
  }

  // --- GET LOADED FRAME OR NEAREST FALLBACK ---
  // Guarantees zero blank frames and eliminates flickering
  function getFrameOrNearest(index) {
    if (imageCache[index] && imageStatus[index] === 'loaded') {
      return imageCache[index];
    }

    // Search outwards for closest loaded frame
    let closestImg = null;
    let minDistance = Infinity;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (imageCache[i] && imageStatus[i] === 'loaded') {
        const dist = Math.abs(i - index);
        if (dist < minDistance) {
          minDistance = dist;
          closestImg = imageCache[i];
        }
      }
    }

    // Trigger priority loading for the missing frame
    prioritizeFrame(index);

    return closestImg;
  }

  // --- SMART PRELOADER & PROGRESSIVE QUEUE ---
  function loadImage(index) {
    return new Promise((resolve, reject) => {
      if (imageStatus[index] === 'loaded') {
        resolve(imageCache[index]);
        return;
      }
      if (imageStatus[index] === 'loading') {
        // Already loading; wait for it
        const check = setInterval(() => {
          if (imageStatus[index] === 'loaded') {
            clearInterval(check);
            resolve(imageCache[index]);
          } else if (imageStatus[index] === 'error') {
            clearInterval(check);
            reject(new Error(`Frame ${index} failed`));
          }
        }, 50);
        return;
      }

      imageStatus[index] = 'loading';
      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        imageCache[index] = img;
        imageStatus[index] = 'loaded';
        resolve(img);
      };

      img.onerror = () => {
        imageStatus[index] = 'error';
        console.warn(`[Diwali Website] Could not load frame ${index} at ${getFrameUrl(index)}`);
        reject(new Error(`Failed to load frame ${index}`));
      };

      img.src = getFrameUrl(index);
    });
  }

  // Background queue processing
  function processQueue() {
    while (activeLoadsCount < MAX_CONCURRENT_LOADS && loadQueue.length > 0) {
      const nextIndex = loadQueue.shift();
      if (imageStatus[nextIndex] === 'idle') {
        activeLoadsCount++;
        loadImage(nextIndex)
          .catch(() => {})
          .finally(() => {
            activeLoadsCount--;
            // If current frame needed this image, redraw
            const currentInt = Math.round(currentFrameFloat);
            if (currentInt === nextIndex) {
              renderFrame(currentInt, true);
            }
            processQueue();
          });
      }
    }
  }

  // Dynamically prioritize frames around user scroll position
  function prioritizeFrame(index) {
    if (imageStatus[index] === 'idle') {
      // Remove if present further down in queue
      loadQueue = loadQueue.filter(i => i !== index);
      // Place at front of queue
      loadQueue.unshift(index);
      processQueue();
    }
  }

  function queueRemainingFrames() {
    // Fill queue with remaining frames in forward order
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (imageStatus[i] === 'idle' && !loadQueue.includes(i)) {
        loadQueue.push(i);
      }
    }
    processQueue();
  }

  // --- INITIAL CRITICAL PRELOAD ---
  function startInitialPreload() {
    const criticalIndices = [];
    // 1. Initial sequential batch (frames 0 to 13)
    for (let i = 0; i < Math.min(INITIAL_PRELOAD_COUNT, TOTAL_FRAMES); i++) {
      criticalIndices.push(i);
    }
    // 2. Final frame so end greeting transition is instantaneous
    criticalIndices.push(TOTAL_FRAMES - 1);
    // 3. Milestone checkpoints (every 15 frames) for instant scrub preview
    for (let i = 20; i < TOTAL_FRAMES - 1; i += 15) {
      if (!criticalIndices.includes(i)) {
        criticalIndices.push(i);
      }
    }

    let loadedCount = 0;
    const totalCritical = criticalIndices.length;

    criticalIndices.forEach(idx => {
      loadImage(idx)
        .then(() => {
          loadedCount++;
          const percent = Math.min(100, Math.round((loadedCount / totalCritical) * 100));
          if (loaderProgressBar) {
            loaderProgressBar.style.width = `${percent}%`;
          }
          if (loaderStatusText) {
            loaderStatusText.textContent = `${percent}%`;
          }

          if (loadedCount === 1) {
            // Draw first frame immediately
            renderFrame(0, true);
          }

          if (loadedCount >= totalCritical && !isInitialLoadComplete) {
            finishLoader();
          }
        })
        .catch(() => {
          // If a frame fails, proceed so user is never blocked
          loadedCount++;
          if (loadedCount >= totalCritical && !isInitialLoadComplete) {
            finishLoader();
          }
        });
    });
  }

  function finishLoader() {
    isInitialLoadComplete = true;

    // Smooth fade out of loader screen
    setTimeout(() => {
      if (loaderScreen) {
        loaderScreen.classList.add('fade-out');
      }
      // Paint first frame cleanly
      renderFrame(0, true);
      
      // Begin progressive background loading for remaining frames
      queueRemainingFrames();
      
      // Start main animation tick
      if (!isRafRunning) {
        isRafRunning = true;
        requestAnimationFrame(animationLoop);
      }
    }, 450);
  }

  // --- SCROLL ENGINE & CALCULATION ---
  function calculateScrollState() {
    if (!scrollTrack) return;

    const trackRect = scrollTrack.getBoundingClientRect();
    const totalDistance = scrollTrack.offsetHeight - window.innerHeight;

    if (totalDistance <= 0) return;

    // Progress = scrollProgress / totalScrollDistance
    const progress = Math.max(0, Math.min(1, -trackRect.top / totalDistance));

    // Map scroll progress to frame index
    targetFrameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
    targetFrameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrameIndex));

    // Handle Section 1 Intro Fade
    if (introOverlay) {
      // Intro gently fades out as user begins scrolling (first 12% of scroll distance)
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

    // Handle Scroll HUD visibility & progress fill
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

    // Dynamic queue prioritizing nearby frames on scroll
    prioritizeFrame(targetFrameIndex);
    if (targetFrameIndex + 1 < TOTAL_FRAMES) prioritizeFrame(targetFrameIndex + 1);
    if (targetFrameIndex + 2 < TOTAL_FRAMES) prioritizeFrame(targetFrameIndex + 2);
    if (targetFrameIndex - 1 >= 0) prioritizeFrame(targetFrameIndex - 1);
  }

  // --- RAF ANIMATION LOOP (APPLE-STYLE LERP DAMPING) ---
  function animationLoop() {
    // Natural easing dampener (0.18):
    // Smooth frame transitions without lag or scroll hijacking
    const diff = targetFrameIndex - currentFrameFloat;

    if (Math.abs(diff) > 0.001) {
      currentFrameFloat += diff * 0.18;
      const frameToDraw = Math.round(currentFrameFloat);
      renderFrame(frameToDraw);
    } else if (currentFrameFloat !== targetFrameIndex) {
      // Snap to exact frame when scrolling halts
      currentFrameFloat = targetFrameIndex;
      renderFrame(targetFrameIndex);
    }

    requestAnimationFrame(animationLoop);
  }

  // --- EVENT LISTENERS ---
  // Native scroll handler (Passive for 60fps / 120fps scrolling performance)
  window.addEventListener('scroll', calculateScrollState, { passive: true });

  // Responsive resize & orientation handlers
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      calculateScrollState();
    }, 60);
  }

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleResize, { passive: true });

  // Interactive Replay Button
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Keyboard navigation support (Arrow Up / Down, Page Up / Down, Home / End)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // --- INITIALIZATION ---
  function init() {
    resizeCanvas();
    startInitialPreload();
    calculateScrollState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

