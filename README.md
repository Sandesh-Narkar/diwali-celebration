# 🪔 Happy Diwali — Premium Scroll-Driven Website with Personalized Gift Reveal

An Apple-inspired, scroll-driven interactive Diwali greeting website with intelligent dual-sequence animation and a personalized, interactive gift-reveal experience.

---

## ✨ Features

### 1. Dual-Sequence Scroll Animation Engine
- **Desktop Experience**: Loads horizontal (16:9) frames from `images/` with edge-to-edge full-screen presentation.
- **Mobile Experience**: Loads vertical (9:16) portrait frames from `MOBILE_IMAGE/`, fitting modern smartphone viewports edge-to-edge without white borders or empty negative spaces.
- **Intelligent Responsive Detection**: Automatically selects between desktop and mobile sequences based on viewport geometry, orientation, and device capabilities.
- **Inertia Damping**: Synchronized via `requestAnimationFrame` with smooth Apple-style inertia damping (`diff * 0.18`), forward on scroll down, reverse on scroll up, holds frame on pause (zero autoplay).

### 2. Personalized Diwali Gift Reveal
- **"Claim Your Diwali Gift" CTA**: Subtle festive action button located in the final greeting section.
- **Intelligent Name Matching**: Case-insensitive name identification, trimming accidental whitespace, with instant validation.
- **Interactive 3-Tap Gift Box**:
  - **Idle State**: Floating luxury festive box with gentle breathing physics and golden ribbon.
  - **Tap 1**: Haptic spring bounce, loosened ribbon knot, and first crack of glowing golden light.
  - **Tap 2**: Playful excited shake, untied ribbon, and intense radiant golden beam.
  - **Tap 3**: Dramatic lid lift, expanding golden starburst, smoothly transitioning into the Personalized Reveal Card.
- **Dedicated Recipient Mappings**:
  - **15 Friends with Personalized Images**: Ashish, Yaswanth, Deepak, Satyam, Rehan, Junaid, Aryan, Zeeshan, Harsh, Akash, Karim, Sahil, Rahul, Shani, Raj.
  - **4 Friends with Personalized Video Gifts**: Subhjite, Yash, Lav (assigned to the celebratory Diwali video).
  - **Sandesh (Host/Creator)**: Special Diwali creator card with Gemini celebration artwork.
  - **Family Rule**: Any unrecognized name automatically receives the warm Family Diwali Video experience with personalized greeting.
- **Action Controls**:
  - **For Images**: "View Gift" (lightbox preview), "Download Gift" (direct file download), "Back to Home".
  - **For Videos**: "Play/Pause Video", "Replay", "Back to Home".

---

## 📁 Project Structure

```
DIWALI_WEBSITE/
├── index.html              # Main semantic HTML structure & modals
├── css/
│   ├── style.css           # Core layout, sticky canvas & typography
│   └── gifts.css           # Gift modal, 3D gift box animations & reveal card
├── js/
│   ├── deviceDetection.js  # Viewport & orientation detection
│   ├── frameLoader.js      # Dual-sequence frame caching & priority queue
│   ├── animation.js        # Canvas drawing engine & RAF lerp dampener
│   └── gifts.js            # Recipient resolution, 3-tap physics & actions
├── IMAGES/                 # Desktop horizontal frames (101 frames)
├── MOBILE_IMAGE/           # Mobile vertical frames (101 frames)
├── GIFTS/
│   ├── ANIMATIONS/         # Gift box animation assets directory
│   ├── FAMILY/             # diwali_video.mp4 & Gemini template artwork
│   └── FRIENDS/            # 15 personalized friend images (.jpeg)
├── .gitignore              # Git exclusion rules
└── README.md               # Project documentation
```

---

## 🚀 How to Run Locally

### Option 1: Python (Recommended)
```bash
python -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Option 2: Node.js
```bash
npx serve .
```

### Option 3: Direct File Access
Open `index.html` directly in any modern web browser.
