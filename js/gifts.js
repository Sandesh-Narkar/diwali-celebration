(function () {
  'use strict';

  // Core configuration and asset paths for interactive gift reveal system
  const SHARED_FAMILY_VIDEO = 'GIFTS/FAMILY/diwali_video.mp4';
  const SPECIAL_FRIENDS_VIDEO = 'GIFTS/FAMILY/WhatsApp Video 2026-11-08 at 4.26.19 PM.mp4';
  const SHARED_GEMINI_TEMPLATE = 'GIFTS/FAMILY/Gemini_Generated_Image_e6np99e6np99e6np.png';

  const RECIPIENTS = {

    sandesh: {
      displayName: 'Sandesh',
      type: 'image',
      asset: SHARED_GEMINI_TEMPLATE,
      message: 'Happy Diwali, Sandesh! May this labor of love and creativity bring warm light, smiles, and lasting togetherness to all our loved ones.'
    },

    yaswanth: {
      displayName: 'Yaswanth',
      type: 'image',
      asset: 'GIFTS/FRIENDS/yaswanth.jpeg',
      message: 'Hey Yaswanth! Wishing you a sparkling festival of lights! May this new season bring you tremendous achievements, continuous joy, and bright horizons.'
    },

    ashish: {
      displayName: 'Ashish',
      type: 'image',
      asset: 'GIFTS/FRIENDS/ashish.jpeg',
      message: 'Hey Ashish! A little surprise, specially picked for you. May your Diwali be filled with great laughter, thriving success, and unforgettable moments.'
    },

    deepak: {
      displayName: 'Deepak',
      type: 'image',
      asset: 'GIFTS/FRIENDS/Deepak.jpeg',
      message: 'Hey Deepak! May the warmth and light of Diwali brighten your path toward greatness. Wishing you peace, abundance, and memorable festivities with loved ones.'
    },

    satyam: {
      displayName: 'Satyam',
      type: 'image',
      asset: 'GIFTS/FRIENDS/satyam.jpeg',
      message: 'Hey Satyam! Here is a special Diwali token for you. May your days ahead be illuminated with clarity, boundless happiness, and wonderful milestones.'
    },

    rehan: {
      displayName: 'Rehan',
      type: 'image',
      asset: 'GIFTS/FRIENDS/rehan.jpeg',
      message: 'Hey Rehan! May the festive lights shine down upon you and bring limitless smiles, prosperity, and peace to your life. Have an incredible celebration!'
    },

    subhjite: {
      displayName: 'Subhjite',
      type: 'video',
      asset: SPECIAL_FRIENDS_VIDEO,
      poster: SHARED_GEMINI_TEMPLATE,
      message: 'Hey Subhjite! Pressed play on this festive memory for you! Wishing you a dazzling Diwali filled with vibrant joy, laughter, and lifelong prosperity.'
    },

    junaid: {
      displayName: 'Junaid',
      type: 'image',
      asset: 'GIFTS/FRIENDS/junaid.jpeg',
      message: 'Hey Junaid! May this auspicious occasion illuminate your dreams and lead you to inspiring achievements. Have a blessed and joyful Diwali!'
    },

    aryan: {
      displayName: 'Aryan',
      type: 'image',
      asset: 'GIFTS/FRIENDS/aryan.jpeg',
      message: 'Hey Aryan! Here is a little festive magic curated for you. May your year ahead be as luminous, uplifting, and radiant as Diwali night.'
    },

    zeeshan: {
      displayName: 'Zeeshan',
      type: 'image',
      asset: 'GIFTS/FRIENDS/zeeshan.jpeg',
      message: 'Hey Zeeshan! Wishing you good vibes, prosperous days, and unending happiness. May the celebrations leave you inspired and recharged!'
    },

    harsh: {
      displayName: 'Harsh',
      type: 'image',
      asset: 'GIFTS/FRIENDS/harsh.jpeg',
      message: 'Hey Harsh! Light up the night and celebrate in full spirit! May this year open doors to bold opportunities and fulfilling achievements.'
    },

    akash: {
      displayName: 'Akash',
      type: 'image',
      asset: 'GIFTS/FRIENDS/akash.jpeg',
      message: 'Hey Akash! Sending you heartfelt festive wishes. May this Diwali fill your days with bright ideas, enduring harmony, and lasting success.'
    },

    karim: {
      displayName: 'Karim',
      type: 'image',
      asset: 'GIFTS/FRIENDS/karim.jpeg',
      message: 'Hey Karim! A warm Diwali surprise just for you. May the divine lights bring a wealth of happiness, good health, and sweet moments.'
    },

    sahil: {
      displayName: 'Sahil',
      type: 'image',
      asset: 'GIFTS/FRIENDS/sahil.jpeg',
      message: 'Hey Sahil! Wishing you a Diwali glowing with endless energy, laughter, and high spirits. Have a joyful celebration with your family!'
    },

    rahul: {
      displayName: 'Rahul',
      type: 'image',
      asset: 'GIFTS/FRIENDS/rahul.jpeg',
      message: 'Hey Rahul! May the warmth of every diya bring peace to your soul and fuel your highest ambitions. Have a fantastic and blessed Diwali!'
    },

    shani: {
      displayName: 'Shani',
      type: 'image',
      asset: 'GIFTS/FRIENDS/shani.jpeg',
      message: 'Hey Shani! May this festival of lights banish all shadows and illuminate a prosperous, fulfilling future for you and your family.'
    },

    lav: {
      displayName: 'Lav',
      type: 'video',
      asset: SPECIAL_FRIENDS_VIDEO,
      poster: SHARED_GEMINI_TEMPLATE,
      message: 'Hey Lav! A special Diwali video celebration just for you. May your days be filled with sparkling memories, good fortune, and festive bliss.'
    },

    sadaf: {
      displayName: 'Sadaf',
      type: 'video',
      asset: SPECIAL_FRIENDS_VIDEO,
      poster: SHARED_GEMINI_TEMPLATE,
      message: 'Hey Sadaf! Bringing you a special festive celebration in motion. May this Diwali shower peace, grace, and radiant blessings upon your life.'
    },

    yash: {
      displayName: 'Yash',
      type: 'video',
      asset: SPECIAL_FRIENDS_VIDEO,
      poster: SHARED_GEMINI_TEMPLATE,
      message: 'Hey Yash! Here is a vibrant celebration in video for you. May your new year be powered by great adventures, success, and warm moments.'
    },

    raj: {
      displayName: 'Raj',
      type: 'image',
      asset: 'GIFTS/FRIENDS/raj.jpeg',
      message: 'Hey Raj! May the glow of diyas illuminate your home and work with boundless prosperity, energy, and joy. Celebrate with a big smile!'
    }
  };

  let currentRecipient = null;
  let tapCount = 0;
  let isTapping = false;

  const claimGiftBtn = document.getElementById('claimGiftBtn');
  const giftModal = document.getElementById('giftModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const stageName = document.getElementById('stageName');
  const stageTap = document.getElementById('stageTap');
  const stageReveal = document.getElementById('stageReveal');

  const nameInput = document.getElementById('nameInput');
  const nameContinueBtn = document.getElementById('nameContinueBtn');
  const validationMsg = document.getElementById('validationMsg');

  const giftBoxStage = document.getElementById('giftBoxStage');
  const tapInstruction = document.getElementById('tapInstruction');

  const revealSalutation = document.getElementById('revealSalutation');
  const revealMediaContainer = document.getElementById('revealMediaContainer');
  const revealPersonalMessage = document.getElementById('revealPersonalMessage');
  const revealSignoffHeadline = document.getElementById('revealSignoffHeadline');
  const giftActionsRow = document.getElementById('giftActionsRow');

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

    // Convert input string to title case representation for UI presentation
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Normalize input text and resolve matching recipient profile
  function resolveRecipient(rawName) {
    const cleanKey = rawName.trim().toLowerCase().replace(/\s+/g, ' ');

    if (RECIPIENTS[cleanKey]) {
      return RECIPIENTS[cleanKey];
    }

    const formattedName = toTitleCase(rawName.trim());
    return {
      displayName: formattedName,
      type: 'video',
      asset: SHARED_FAMILY_VIDEO,
      poster: SHARED_GEMINI_TEMPLATE,
      isFamily: true,
      message: `Dearest ${formattedName}, to our beloved family: may the divine light of Diwali bless our home with boundless peace, health, prosperity, and togetherness across generations.`
    };
  }

  function openGiftModal() {
    if (!giftModal) return;
    giftModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    showStage('name');
    if (nameInput) {
      nameInput.value = '';
      setTimeout(() => nameInput.focus(), 250);
    }
    if (validationMsg) {
      validationMsg.textContent = '';
      validationMsg.classList.remove('visible');
    }
  }

  function closeGiftModal() {
    if (!giftModal) return;
    giftModal.classList.remove('active');
    document.body.style.overflow = '';

    const activeVideo = giftModal.querySelector('video');
    if (activeVideo) {
      activeVideo.pause();
    }

    setTimeout(() => {
      showStage('name');
      resetGiftBox();
    }, 450);
  }

  function showStage(stageNameKey) {
    if (stageName) stageName.classList.remove('active');
    if (stageTap) stageTap.classList.remove('active');
    if (stageReveal) stageReveal.classList.remove('active');

    if (stageNameKey === 'name' && stageName) stageName.classList.add('active');
    if (stageNameKey === 'tap' && stageTap) stageTap.classList.add('active');
    if (stageNameKey === 'reveal' && stageReveal) stageReveal.classList.add('active');
  }

  function handleNameSubmit() {
    if (!nameInput) return;
    const val = nameInput.value ? nameInput.value.trim() : '';

    if (!val) {
      if (validationMsg) {
        validationMsg.textContent = 'Please enter your name to discover your gift.';
        validationMsg.classList.add('visible');
      }
      nameInput.focus();
      return;
    }

    if (validationMsg) {
      validationMsg.classList.remove('visible');
    }

    currentRecipient = resolveRecipient(val);

    resetGiftBox();
    showStage('tap');
  }

  // Manage three-stage gift opening interaction and progression
  function resetGiftBox() {
    tapCount = 0;
    isTapping = false;
    if (giftBoxStage) {
      giftBoxStage.className = 'gift-box-stage idle';
    }
    if (tapInstruction) {
      tapInstruction.textContent = 'Your surprise is waiting. Tap to open!';
    }
  }

  function handleGiftTap() {
    if (isTapping || tapCount >= 3) return;
    isTapping = true;
    tapCount++;

    if (tapCount === 1) {
      giftBoxStage.className = 'gift-box-stage tap-1';
      if (tapInstruction) {
        tapInstruction.textContent = 'Keep going! Tap again... (1/3)';
      }
      setTimeout(() => { isTapping = false; }, 420);
    } else if (tapCount === 2) {
      giftBoxStage.className = 'gift-box-stage tap-2';
      if (tapInstruction) {
        tapInstruction.textContent = 'Almost there! One more tap to reveal! (2/3)';
      }
      setTimeout(() => { isTapping = false; }, 450);
    } else if (tapCount === 3) {
      giftBoxStage.className = 'gift-box-stage tap-3';
      if (tapInstruction) {
        tapInstruction.textContent = 'Opening your gift... ✨';
      }

      setTimeout(() => {
        renderGiftCard(currentRecipient);
        showStage('reveal');
        isTapping = false;
      }, 750);
    }
  }

  function renderGiftCard(recipient) {
    if (!recipient) return;

    if (revealSalutation) {
      revealSalutation.textContent = `Hey ${recipient.displayName}!`;
    }

    if (revealPersonalMessage) {
      revealPersonalMessage.textContent = recipient.message;
    }

    if (revealSignoffHeadline) {
      revealSignoffHeadline.textContent = `Happy Diwali, ${recipient.displayName}!`;
    }

    if (revealMediaContainer) {
      revealMediaContainer.innerHTML = '';

      if (recipient.type === 'video') {
        const video = document.createElement('video');
        video.className = 'gift-video-display';
        video.src = recipient.asset;
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', 'true');
        if (recipient.poster) {
          video.poster = recipient.poster;
        }
        revealMediaContainer.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.className = 'gift-image-display';
        img.src = recipient.asset;
        img.alt = `Diwali Gift for ${recipient.displayName}`;
        img.loading = 'eager';
        revealMediaContainer.appendChild(img);
      }
    }

    if (giftActionsRow) {
      giftActionsRow.innerHTML = '';

      if (recipient.type === 'video') {

        const playBtn = document.createElement('button');
        playBtn.className = 'gift-action-btn primary';
        playBtn.type = 'button';
        playBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Play Video</span>
        `;
        playBtn.addEventListener('click', () => {
          const v = revealMediaContainer.querySelector('video');
          if (v) {
            if (v.paused) {
              v.play();
              playBtn.querySelector('span').textContent = 'Pause Video';
            } else {
              v.pause();
              playBtn.querySelector('span').textContent = 'Play Video';
            }
          }
        });

        const replayVideoBtn = document.createElement('button');
        replayVideoBtn.className = 'gift-action-btn secondary';
        replayVideoBtn.type = 'button';
        replayVideoBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          <span>Replay</span>
        `;
        replayVideoBtn.addEventListener('click', () => {
          const v = revealMediaContainer.querySelector('video');
          if (v) {
            v.currentTime = 0;
            v.play();
            playBtn.querySelector('span').textContent = 'Pause Video';
          }
        });

        const homeBtn = document.createElement('button');
        homeBtn.className = 'gift-action-btn tertiary';
        homeBtn.type = 'button';
        homeBtn.textContent = 'Back to Home';
        homeBtn.addEventListener('click', closeGiftModal);

        giftActionsRow.appendChild(playBtn);
        giftActionsRow.appendChild(replayVideoBtn);
        giftActionsRow.appendChild(homeBtn);
      } else {

        const viewBtn = document.createElement('button');
        viewBtn.className = 'gift-action-btn secondary';
        viewBtn.type = 'button';
        viewBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>View Gift</span>
        `;
        viewBtn.addEventListener('click', () => {
          openLightbox(recipient.asset);
        });

        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'gift-action-btn primary';
        downloadBtn.href = recipient.asset;
        const filename = recipient.asset.split('/').pop();
        downloadBtn.download = filename;
        downloadBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download Gift</span>
        `;

        const homeBtn = document.createElement('button');
        homeBtn.className = 'gift-action-btn tertiary';
        homeBtn.type = 'button';
        homeBtn.textContent = 'Back to Home';
        homeBtn.addEventListener('click', closeGiftModal);

        giftActionsRow.appendChild(viewBtn);
        giftActionsRow.appendChild(downloadBtn);
        giftActionsRow.appendChild(homeBtn);
      }
    }
  }

  function openLightbox(src) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
  }

  function initListeners() {
    if (claimGiftBtn) {
      claimGiftBtn.addEventListener('click', openGiftModal);
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeGiftModal);
    }

    if (giftModal) {
      giftModal.addEventListener('click', (e) => {
        if (e.target === giftModal) {
          closeGiftModal();
        }
      });
    }

    if (nameContinueBtn) {
      nameContinueBtn.addEventListener('click', handleNameSubmit);
    }

    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleNameSubmit();
        }
      });
    }

    if (giftBoxStage) {
      giftBoxStage.addEventListener('click', handleGiftTap);
    }

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          closeLightbox();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
          closeLightbox();
        } else if (giftModal && giftModal.classList.contains('active')) {
          closeGiftModal();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initListeners);
  } else {
    initListeners();
  }

  window.GiftEngine = {
    recipients: RECIPIENTS,
    resolveRecipient: resolveRecipient,
    openModal: openGiftModal,
    closeModal: closeGiftModal
  };

})();
