# 🏗️ Abhishek's Developer Portfolio 

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-3.0-blue?style=for-the-badge)

A highly interactive, award-winning style personal portfolio designed to showcase front-end architecture, advanced CSS styling, and high-performance WebGL rendering. This repository serves not just as a display of past projects, but as a live demonstration of my UI/UX and engineering capabilities.

🌍 **Live Website:** [Insert Your Live Link Here]

## ✨ Key Architectural Features

- **Cinematic Terminal Preloader:** A custom-built boot sequence featuring CSS `clip-path` math, generating randomized hex-code glitch effects before revealing the DOM.
- **Dynamic Hue-Shift Engine:** The entire website is wrapped in a scroll-linked variable (`--hue-shift`), dynamically rotating the neon color palette (Sky Blue → Indigo → Purple → Emerald) as the user navigates down the page.
- **Interactive WebGL Background:** Utilizes `Three.js` to render a responsive, fluid 3D particle mesh that reacts seamlessly to mouse movement and viewport resizing.
- **Glassmorphism & Depth Mechanics:** Extensive use of `backdrop-filter: blur`, CSS Grid, and custom SVG noise filters to generate physical depth and premium material textures.
- **Custom Hardware-Accelerated Animations:** Zero-dependency stagger reveals, circular-clip-path mobile navigation, and interactive magnetic hover properties relying heavily on `cubic-bezier` math for Native-App feeling weight.
- **Bento Grid Layout:** Implementing modern, asymmetrical grid systems to display skills, certifications, and featured projects like *Anvi Stay* and *Heaven Rooms*.

## 🛠️ Technology Stack

- **Structure:** Semantic HTML5
- **Styling:** CSS3, Tailwind CSS (via CDN for rapid prototyping), Custom CSS Properties
- **Logic:** Vanilla JavaScript (ES6+), IntersectionObserver API, Performance API
- **3D Rendering:** Three.js (WebGL)
- **Typography:** 'Syne' (Display) and 'Plus Jakarta Sans' (Body)

## 📁 Core Sections

1. **The Hero:** 3D interactive mesh, dynamic typewriter effect, and custom cursor mapping.
2. **Core Foundation (About):** Bento-box style breakdown of my journey, mindset, and current status.
3. **Technical Arsenal (Skills):** Categorized badges mapping out my frontend, backend, and database proficiency.
4. **Blueprint Section (Projects):** Massive, hover-revealing project cards with live deep-links to *Anvi Stay* and *Heaven Rooms*.
5. **Contact Architecture:** A custom-styled floating glassy bottom bar and detailed footer system.

## 🚀 Getting Started Locally

Since this project relies heavily on raw ES6 JavaScript, HTML, and CSS, no complicated build pipelines (like Webpack or Vite) are required to view the core files.

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhi-2636/portfolio.git
   ```
2. Navigate to the directory:
   ```bash
   cd portfolio
   ```
3. Open `index.html` in your browser. *(Note: For the Three.js canvas to run perfectly securely, it is recommended to run a local dev server like VS Code's "Live Server" extension).*

---

*Designed and Engineered by Abhishek.* 
