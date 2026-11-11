# NovaTech — Autonomous Cloud Intelligence & AI Infrastructure

A complete, professional, visually polished, and fully responsive landing page website built with **100% pure HTML5 and CSS3** (zero JavaScript, zero CSS frameworks).

---

## 🚀 Project Overview

**NovaTech** is a next-generation cloud intelligence platform designed for engineering teams and modern tech enterprises. The landing page showcases autonomous multi-cloud orchestration, edge AI processing, predictive observability, and enterprise-grade security.

---

## 📁 Project Structure

```text
Landing Page Website/
├── index.html     # Semantic HTML5 markup, accessible SVG icons & zero-JS accordion
├── style.css      # Custom pure CSS3 styles, design tokens, flex/grid layouts & responsive breakpoints
└── README.md      # Documentation and local setup instructions
```

---

## ✨ Assignment Checklist Verification

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Pure HTML5 & CSS3 Only** | No JavaScript used anywhere. No external CSS frameworks (no Bootstrap, Tailwind, etc.). | ✅ Passed |
| **Separate Files** | Cleanly split into `index.html` and `style.css`. | ✅ Passed |
| **Sticky Navigation Bar** | `position: sticky; top: 0; z-index: 1000;` with backdrop blur, brand logo, and 6 working section links. | ✅ Passed |
| **Working Section Links** | All internal links (`#features`, `#about`, `#solutions`, `#testimonials`, `#pricing`, `#contact`) smoothly navigate to target sections with `scroll-margin-top` offset. | ✅ Passed |
| **Hero Section** | High-impact headline, subheadline, dual call-to-action buttons, trust badges, and interactive simulated telemetry dashboard. | ✅ Passed |
| **At Least 2 Content Sections** | Includes **5 distinct sections**: Features (6 cards), About NovaTech (Story & Bento Grid), Solutions (3 workflows), Customer Testimonials (3 cards), Pricing Tiers (3 tiers), plus native HTML5 FAQ accordion. | ✅ Passed |
| **Footer** | 4-column layout with brand mission, platform navigation, company links, contact details (address, email, phone), and accessible SVG social links. | ✅ Passed |
| **Color Palette & Typography** | Modern dark obsidian palette (`#0B0F19`, `#6366F1`, `#06B6D4`, `#10B981`) with Google Fonts (*Plus Jakarta Sans*), high contrast text (WCAG AAA/AA), and multi-tier typography scale. | ✅ Passed |
| **Responsive Layouts** | CSS Grid & Flexbox layouts adapting across desktop (>1024px), tablet (641px–1024px), and mobile (<=640px). | ✅ Passed |
| **Box-Sizing & Spacing** | Universal `box-sizing: border-box`, standard container boundaries, consistent section spacing, zero horizontal overflow or overlapping elements. | ✅ Passed |
| **Hover Effects & Polish** | Micro-interactions, button hover states, card lifts, animated hamburger toggle, and rotating accordion icons. | ✅ Passed |
| **Zero JavaScript Mobile Menu** | Accessible pure CSS checkbox toggle pattern (`#nav-toggle:checked ~ .nav-menu`). | ✅ Passed |

---

## 💻 How to Run Locally in VS Code

### Method 1: Using the Live Server Extension (Recommended)
1. Launch **Visual Studio Code**.
2. Open the project folder:
   - Click **File > Open Folder...** and select `Landing Page Website`.
3. In the left Extensions sidebar (`Ctrl + Shift + X`), search for **Live Server** (by *Ritwick Dey*) and click **Install**.
4. In the VS Code File Explorer, right-click on `index.html` and select **"Open with Live Server"** (or click **"Go Live"** in the bottom status bar).
5. Your default web browser will automatically open `http://127.0.0.1:5500/index.html` with instant live-reload upon saving any edits.

### Method 2: Direct Browser Launch
1. Open the project folder in your Windows File Explorer (`c:\Users\roush\OneDrive\Desktop\Landing Page Website`).
2. Double-click [index.html](file:///c:/Users/roush/OneDrive/Desktop/Landing%20Page%20Website/index.html) to open it directly in Chrome, Edge, Firefox, or Brave.
3. Alternatively, inside VS Code, right-click `index.html` and select **"Copy Path"**, open your browser, and paste the path into the address bar.

### Method 3: Built-in Terminal Server (Python)
1. Open the terminal in VS Code (`Ctrl + \``).
2. Run the following command:
   ```powershell
   python -m http.server 3000
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```
