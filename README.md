# 🪔 Happy Diwali — Full-Screen Scroll-Driven Animation Website

An Apple-inspired, scroll-driven interactive Diwali greeting website. The visual progression is directly mapped to the visitor's scrolling, synchronizing frame advancement with scroll physics on both desktop and mobile devices.

---

## ✨ Features

- **Apple-Inspired Scroll Dynamics**: Advancing forward on scroll down, smooth reversal on scroll up, natural holding on pause, zero autoplay.
- **Full-Screen Sticky Canvas**: High-DPI responsive canvas rendering with `object-fit: contain` logic preserving 100% of the artwork and typography without cropping.
- **Smart Asset Preloader**: Lightweight festive loader with real-time percentage tracking and priority queue preloading to prevent blank frames.
- **Typography & Festive Styling**: Elegant Google Fonts (`Cinzel`, `Cormorant Garamond`, `Outfit`), warm gold metallic gradients, and subtle glowing Diya motifs.
- **Conclusion Greeting**: Festive conclusion message with an interactive replay action.
- **Zero Heavy Dependencies**: Built purely with vanilla HTML5, CSS3, and JavaScript.

---

## 📁 Project Structure

```
DIWALI_WEBSITE/
├── index.html          # Main HTML structure with semantic sections
├── css/
│   └── style.css       # Responsive styling, typography & animations
├── js/
│   └── animation.js    # Canvas rendering & scroll engine
├── IMAGES/             # 101 sequential animation frames (ezgif-frame-001 to 101)
├── .gitignore          # Git exclusion rules
└── README.md           # Project documentation
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

---

## 🌐 Deploying to GitHub Pages

1. Go to your repository on GitHub.
2. Navigate to **Settings** &rarr; **Pages**.
3. Under **Branch**, select `main` and root folder `/`, then click **Save**.
4. In a few minutes, your site will be live on `https://<username>.github.io/<repo-name>/`.

