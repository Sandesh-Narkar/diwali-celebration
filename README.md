# 🪔 Happy Diwali — Responsive Dual-Sequence Scroll-Driven Website

An Apple-inspired, scroll-driven interactive Diwali greeting website with intelligent dual-sequence animation. The site automatically detects whether the visitor is on a desktop computer or a smartphone/tablet and seamlessly serves the dedicated horizontal or portrait image sequence.

---

## ✨ Features

- **Dual-Sequence Architecture**:
  - **Desktop Experience**: Loads horizontal (16:9) frames from `images/` with edge-to-edge full-screen presentation.
  - **Mobile Experience**: Loads vertical (9:16) portrait frames from `MOBILE_IMAGE/`, fitting modern smartphone viewports edge-to-edge without white borders or empty negative spaces.
- **Intelligent Responsive Detection**:
  - Detects screen width, orientation, touch capabilities, and tablet dimensions.
  - Portrait tablets gracefully use the mobile sequence; landscape tablets use the desktop sequence.
  - Smoothly handles orientation changes, preserving the user's current animation progress.
- **Apple-Inspired Scroll Dynamics**:
  - Natural forward playback on scroll down, smooth reversal on scroll up.
  - Precise frame holding on scroll pause (zero autoplay).
  - Synchronized via `requestAnimationFrame` with tactile inertia damping.
- **High-Performance Asset Management**:
  - Independent preloading & caching: only loads the sequence required for the active device.
  - Progressive background loader with priority queueing for frames near the current scroll position.
  - Nearest-frame fallback to eliminate blank frames or flickering during fast scrubbing.
- **Pure Vanilla Implementation**:
  - Zero heavy framework dependencies (pure HTML5, CSS3, vanilla JS).

---

## 📁 Project Structure

```
DIWALI_WEBSITE/
├── index.html              # Main HTML structure with semantic sections
├── css/
│   └── style.css           # Responsive styling & typography
├── js/
│   ├── deviceDetection.js  # Device, orientation & breakpoint detector
│   ├── frameLoader.js      # Independent frame cache & progressive queue
│   └── animation.js        # Canvas rendering & scroll engine
├── IMAGES/                 # Desktop horizontal frames (ezgif-frame-001 to 101)
├── MOBILE_IMAGE/           # Mobile vertical frames (ezgif-frame-001 to 101)
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
