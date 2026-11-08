# 🪔 Happy Diwali — Interactive Scroll-Driven Experience

An immersive, Apple-inspired Diwali greeting website featuring scroll-controlled frame animations, responsive dual-sequence rendering, and an interactive personalized gift-reveal experience.

Designed to bring together festive storytelling, smooth motion, and personalized digital greetings through a clean, minimal, and responsive web experience.

---

## ✨ Features

### 1. Dual-Sequence Scroll Animation Engine

A custom canvas-based animation engine that creates a smooth, scroll-controlled visual experience.

**Desktop Experience**
- Uses 16:9 horizontal animation frames.
- Edge-to-edge full-screen presentation.
- Optimized rendering for desktop and laptop displays.
- Loads 101 animation frames from the desktop image sequence.

**Mobile Experience**
- Uses 9:16 vertical animation frames.
- Optimized for modern smartphone viewports.
- Edge-to-edge portrait presentation without unnecessary empty space.
- Loads 101 animation frames from the mobile image sequence.

**Animation Engine**
- Automatically selects the appropriate animation sequence based on viewport dimensions and orientation.
- Uses `requestAnimationFrame` for smooth rendering.
- Implements inertia damping using a `0.18` interpolation factor.
- Supports forward and reverse animation playback through scrolling.
- Holds the current frame when scrolling stops.
- No automatic animation playback.
- Uses frame caching and preloading to improve rendering performance.

### 2. Personalized Diwali Gift Reveal

An interactive gift experience accessible through the final greeting section.

**Gift Entry**
- A dedicated "Claim Your Diwali Gift" call-to-action.
- Clean name-entry interface.
- Case-insensitive recipient identification.
- Automatic whitespace trimming.
- Instant input validation.

**Interactive Three-Tap Gift Box**

A three-stage interaction designed to make opening a digital gift feel engaging.

| Stage | Interaction | Visual Response |
|---|---|---|
| Initial | Idle state | Floating gift box with subtle motion |
| Tap 1 | First interaction | Spring bounce, ribbon movement, initial golden light |
| Tap 2 | Second interaction | Gift shake, loosened ribbon, stronger light effect |
| Tap 3 | Final interaction | Lid opening, golden reveal animation, transition to gift card |

The interaction supports both mouse clicks and mobile touch input.

### 3. Personalized Gift Assignment

The gift system uses predefined JavaScript mappings to identify recipients and display their assigned gifts.

| Gift Category | Assignment | Reveal Content |
|---|---|---|
| Personalized image gifts | 15 recipients | Individually assigned image gifts |
| Personalized video gifts | 4 recipients | Shared celebratory Diwali video |
| Creator greeting | Dedicated creator experience | Special greeting card with celebration artwork |
| Family experience | Unrecognized names | Shared family Diwali video with a personalized greeting |

**Personalization Logic**
- Each recipient is matched to the corresponding uploaded asset.
- Image and video gifts are handled separately.
- Personalized greetings dynamically display the entered name.
- Unrecognized names automatically receive the family experience.
- Shared assets are reused instead of unnecessarily duplicating files.

### 4. Personalized Reveal Card

After the gift-opening animation, a personalized greeting card is displayed.

The reveal card includes:

- Personalized greeting.
- Recipient-specific message.
- Assigned image or video.
- Festive visual styling.
- Relevant gift actions.

The design prioritizes readability, balanced spacing, and a premium presentation.

### 5. Gift Actions

**For Image Gifts**
- View Gift — Opens an enlarged preview.
- Download Gift — Downloads the original image file.
- Back to Home — Returns to the main experience.

**For Video Gifts**
- Play/Pause Video.
- Replay Video.
- Back to Home.

---

## 🎨 Design Philosophy

The website follows a minimal, premium festive design direction.

**Visual Principles**
- Clean and balanced layouts.
- Warm festive color palette.
- Restrained golden accents.
- Elegant typography.
- Subtle transitions and motion.
- Carefully controlled decorative elements.
- Responsive layouts across screen sizes.

The goal is to create an immersive personal experience without overwhelming the visitor with excessive visual effects or unnecessary interface elements.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Layout, responsive styling, and animations |
| JavaScript | Interaction and application logic |
| HTML Canvas API | Frame-based animation rendering |
| RequestAnimationFrame | Smooth animation updates |
| CSS Transitions & Keyframes | Gift interactions and visual effects |
| HTML5 Video | Video gift playback |

**No backend or database is required.** Recipient identification and gift assignment are handled through frontend JavaScript.

---

## 📁 Project Structure

```text
DIWALI_WEBSITE/
│
├── index.html
│
├── css/
│   ├── style.css
│   └── gifts.css
│
├── js/
│   ├── deviceDetection.js
│   ├── frameLoader.js
│   ├── animation.js
│   └── gifts.js
│
├── IMAGES/
│   └── Desktop animation frames (101 images)
│
├── MOBILE_IMAGE/
│   └── Mobile animation frames (101 images)
│
├── GIFTS/
│   │
│   ├── ANIMATIONS/
│   │   └── Gift box animation assets
│   │
│   ├── FAMILY/
│   │   ├── Family Diwali video
│   │   └── Shared celebration artwork
│   │
│   └── FRIENDS/
│       └── Personalized gift images
│
├── .gitignore
│
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

- A modern web browser.
- Python or Node.js installed.
- A code editor such as Visual Studio Code.

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd DIWALI_WEBSITE
```

### 3. Start a Local Development Server

**Option 1: Python (Recommended)**

```bash
python -m http.server 3000
```

**Option 2: Node.js**

```bash
npx serve .
```

### 4. Open the Website

Visit:

```text
http://localhost:3000
```

> **Note:** Running the website through a local development server is recommended. Directly opening `index.html` using `file://` may prevent JavaScript from loading certain local assets correctly due to browser security restrictions.

---

## 🔄 User Experience Flow

The complete experience follows this sequence:

```text
          WEBSITE ENTRY
                │
                ▼
      SCROLL-DRIVEN ANIMATION
                │
                ▼
        FINAL DIWALI GREETING
                │
                ▼
       CLAIM YOUR DIWALI GIFT
                │
                ▼
           ENTER NAME
                │
                ▼
       RECIPIENT IDENTIFICATION
                │
                ▼
        INTERACTIVE GIFT BOX
                │
          ┌─────┴─────┐
          │           │
        TAP 1       TAP 2
          │           │
          └─────┬─────┘
                │
              TAP 3
                │
                ▼
          GIFT REVEAL
                │
                ▼
       PERSONALIZED GREETING
                │
          ┌─────┴─────┐
          │           │
       IMAGE        VIDEO
          │           │
          ▼           ▼
       DOWNLOAD     REPLAY
          │           │
          └─────┬─────┘
                │
                ▼
            BACK HOME
```

---

## 📱 Responsive Design

The website is designed for:

- Desktop computers.
- Laptops.
- Tablets.
- Modern smartphones.

The animation engine selects the appropriate frame sequence based on the available viewport.

The gift interface also adapts to smaller screens, supporting touch-based interactions and responsive content sizing.

---

## 🚀 Performance Considerations

The project incorporates several techniques to improve the user experience:

- Frame preloading and caching.
- Canvas-based frame rendering.
- RequestAnimationFrame-driven updates.
- Responsive asset selection.
- Reuse of shared video and artwork assets.
- Controlled animation state transitions.
- Optimized image and video presentation.

Large animation sequences and video assets can increase initial loading time. Asset optimization and progressive loading are important for maintaining a smooth experience, particularly on mobile networks.

---

## 🔒 Privacy & Implementation Notes

- Recipient information is maintained in frontend JavaScript.
- No backend database is required.
- Personal gift assets should not contain unnecessary identifying information.
- Name-based recipient matching is a convenience feature, not an authentication or access-control system.
- Anyone who knows a recognized recipient name may be able to view that recipient's assigned gift.

---

## 📌 Future Improvements

Potential enhancements include:

- More optimized frame-loading strategies.
- Additional gift-opening animation states.
- Improved mobile performance.
- More personalized greeting variations.
- Accessibility enhancements.
- Better asset compression and loading feedback.

---

## 🪔 Final Note

Created as a digital Diwali celebration that combines interactive storytelling, smooth animation, and personalized gifting.

**A little light, a little surprise, and a special greeting for everyone.**

Happy Diwali! ✨
