window.FrameLoader = (function () {
  'use strict';

  // Configure sequence metadata and frame clipping boundaries
  const SEQUENCES = {
    desktop: {
      folder: 'IMAGES',
      totalFrames: 101,
      firstFrameNum: 1,
      prefix: 'ezgif-frame-',
      ext: '.png',

      crop: null,
      aspectMode: 'contain'
    },
    mobile: {
      folder: 'MOBILE_IMAGE',
      totalFrames: 101,
      firstFrameNum: 1,
      prefix: 'ezgif-frame-',
      ext: '.png',

      crop: {
        sx: 656,
        sy: 0,
        sw: 608,
        sh: 1080
      },
      aspectMode: 'cover'
    }
  };

  const INITIAL_PRELOAD_COUNT = 14;
  const MAX_CONCURRENT_LOADS = 4;

  let activeMode = 'desktop';
  let activeConfig = SEQUENCES.desktop;

  const caches = {
    desktop: {
      images: new Array(SEQUENCES.desktop.totalFrames),
      status: new Array(SEQUENCES.desktop.totalFrames).fill('idle'),
      queue: [],
      activeLoads: 0,
      isInitialLoaded: false
    },
    mobile: {
      images: new Array(SEQUENCES.mobile.totalFrames),
      status: new Array(SEQUENCES.mobile.totalFrames).fill('idle'),
      queue: [],
      activeLoads: 0,
      isInitialLoaded: false
    }
  };

  function getFrameUrl(mode, index) {
    const cfg = SEQUENCES[mode];
    const frameNum = String(index + cfg.firstFrameNum).padStart(3, '0');
    return `${cfg.folder}/${cfg.prefix}${frameNum}${cfg.ext}`;
  }

  function loadImage(mode, index) {
    const cache = caches[mode];
    return new Promise((resolve, reject) => {
      if (cache.status[index] === 'loaded') {
        resolve(cache.images[index]);
        return;
      }
      if (cache.status[index] === 'loading') {
        const interval = setInterval(() => {
          if (cache.status[index] === 'loaded') {
            clearInterval(interval);
            resolve(cache.images[index]);
          } else if (cache.status[index] === 'error') {
            clearInterval(interval);
            reject(new Error(`Failed to load frame ${index}`));
          }
        }, 40);
        return;
      }

      cache.status[index] = 'loading';
      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        cache.images[index] = img;
        cache.status[index] = 'loaded';
        resolve(img);
      };

      img.onerror = () => {
        cache.status[index] = 'error';
        console.warn(`[FrameLoader] Error loading ${mode} frame ${index} from ${getFrameUrl(mode, index)}`);
        reject(new Error(`Error loading frame ${index}`));
      };

      img.src = getFrameUrl(mode, index);
    });
  }

  function processQueue(mode, onFrameReady) {
    const cache = caches[mode];
    while (cache.activeLoads < MAX_CONCURRENT_LOADS && cache.queue.length > 0) {
      const nextIndex = cache.queue.shift();
      if (cache.status[nextIndex] === 'idle') {
        cache.activeLoads++;
        loadImage(mode, nextIndex)
          .then((img) => {
            if (typeof onFrameReady === 'function') {
              onFrameReady(nextIndex, img);
            }
          })
          .catch(() => {})
          .finally(() => {
            cache.activeLoads--;
            processQueue(mode, onFrameReady);
          });
      }
    }
  }

  function prioritize(index, onFrameReady) {
    const cache = caches[activeMode];
    const safeIdx = Math.max(0, Math.min(activeConfig.totalFrames - 1, index));

    const neighbors = [safeIdx, safeIdx + 1, safeIdx - 1, safeIdx + 2, safeIdx - 2, safeIdx + 3];

    for (let i = 0; i < neighbors.length; i++) {
      const idx = neighbors[i];
      if (idx >= 0 && idx < activeConfig.totalFrames && cache.status[idx] === 'idle') {
        cache.queue = cache.queue.filter(q => q !== idx);
        cache.queue.unshift(idx);
      }
    }

    processQueue(activeMode, onFrameReady);
  }

  function queueAllRemaining(mode, onFrameReady) {
    const cache = caches[mode];
    const total = SEQUENCES[mode].totalFrames;
    for (let i = 0; i < total; i++) {
      if (cache.status[i] === 'idle' && !cache.queue.includes(i)) {
        cache.queue.push(i);
      }
    }
    processQueue(mode, onFrameReady);
  }

  function preloadInitial(mode, onProgress, onComplete) {
    activeMode = mode;
    activeConfig = SEQUENCES[mode];

    const cache = caches[mode];
    if (cache.isInitialLoaded) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    const total = activeConfig.totalFrames;
    const criticalIndices = [];

    for (let i = 0; i < Math.min(INITIAL_PRELOAD_COUNT, total); i++) {
      criticalIndices.push(i);
    }

    criticalIndices.push(total - 1);

    for (let i = 20; i < total - 1; i += 15) {
      if (!criticalIndices.includes(i)) {
        criticalIndices.push(i);
      }
    }

    let loadedCount = 0;
    const targetCount = criticalIndices.length;

    criticalIndices.forEach(idx => {
      loadImage(mode, idx)
        .then(() => {
          loadedCount++;
          const percent = Math.min(100, Math.round((loadedCount / targetCount) * 100));
          if (typeof onProgress === 'function') {
            onProgress(percent, loadedCount, targetCount);
          }
          if (loadedCount >= targetCount && !cache.isInitialLoaded) {
            cache.isInitialLoaded = true;
            if (typeof onComplete === 'function') onComplete();
          }
        })
        .catch(() => {
          loadedCount++;
          if (loadedCount >= targetCount && !cache.isInitialLoaded) {
            cache.isInitialLoaded = true;
            if (typeof onComplete === 'function') onComplete();
          }
        });
    });
  }

  function getFrameOrNearest(index) {
    const cache = caches[activeMode];
    const total = activeConfig.totalFrames;
    const safeIndex = Math.max(0, Math.min(total - 1, index));

    if (cache.images[safeIndex] && cache.status[safeIndex] === 'loaded') {
      return {
        image: cache.images[safeIndex],
        index: safeIndex,
        isExact: true,
        crop: activeConfig.crop,
        aspectMode: activeConfig.aspectMode
      };
    }

    let closestImg = null;
    let closestIdx = safeIndex;
    let minDistance = Infinity;

    for (let i = 0; i < total; i++) {
      if (cache.images[i] && cache.status[i] === 'loaded') {
        const dist = Math.abs(i - safeIndex);
        if (dist < minDistance) {
          minDistance = dist;
          closestImg = cache.images[i];
          closestIdx = i;
        }
      }
    }

    prioritize(safeIndex);

    return {
      image: closestImg,
      index: closestIdx,
      isExact: closestIdx === safeIndex,
      crop: activeConfig.crop,
      aspectMode: activeConfig.aspectMode
    };
  }

  return {
    initMode: function (mode) {
      if (SEQUENCES[mode]) {
        activeMode = mode;
        activeConfig = SEQUENCES[mode];
      }
    },
    getActiveMode: function () {
      return activeMode;
    },
    getConfig: function () {
      return activeConfig;
    },
    getTotalFrames: function () {
      return activeConfig.totalFrames;
    },
    preloadInitial: preloadInitial,
    queueRemaining: function (onFrameReady) {
      queueAllRemaining(activeMode, onFrameReady);
    },
    prioritize: prioritize,
    getFrameOrNearest: getFrameOrNearest
  };
})();
