# Downdetector Outage Auto-Sorter

A lightweight, high-performance Tampermonkey userscript that automatically sorts service cards on **Downdetector** by their current outage status.

Instead of scrolling endlessly to find out what's currently broken, this script instantly reorganizes the home/service grids using CSS Flexbox `order`—putting active outages right at the top without breaking React hydration or causing page crashes.

---

## ⚡ Features

- **🚨 Outage-First Priority Sorting:**
  - **Priority 1 (Red):** Active outages & severe service problems.
  - **Priority 2 (Yellow):** Possible problems / degraded performance.
  - **Priority 3 (Green):** Normal operations / no reported issues.
- **🛡️ React-Safe Sorting:** Uses native CSS Flexbox `order` styling instead of moving DOM nodes directly.
- **📱 Responsive Layout Fixes:** Injects a clean 3 to 4 column responsive grid for optimal viewing across various desktop and tablet screen sizes.
- **🔄 Dynamic DOM Watcher:** Powered by a debounced `MutationObserver` to ensure live status updates are sorted instantly as React re-renders.
- **🌍 Multi-Region Support:** Built with international domains in mind.

---

## 🌍 Supported Domains

| Region | Domain URL | Status |
| :--- | :--- | :---: |
| **United States** | `downdetector.com` | ✅ Supported |
| **United Kingdom** | `downdetector.co.uk` | ✅ Supported |
| **Global / Other** | `downdetector.*` | 🟡 TBC |


---

## 🚀 Installation

### Prerequisites
Make sure you have a userscript manager extension installed on your browser:
* [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
* [Violentmonkey](https://violentmonkey.github.io/)

### Quick Install
1. Open your userscript manager dashboard.
2. Create a new script.
3. Copy and paste the contents of userscript into the editor.
4. Save the script (`Ctrl+S` or `Cmd+S`).
5. Navigate to supported downdetector website to see it in action!

---

## 🛠️ How It Works

1. **Multi-Attribute Detection:** The script scans every card using a scoring engine that checks CSS variables (`--color-dd-red`), hex codes, class names (`danger`, `warning`), and text indicators (`problems at`, `possible problems`).
2. **CSS Flex Ordering:** Each card gets assigned a numerical `order` value (`1` for Red, `2` for Yellow, `3` for Green). Flexbox visually moves the broken services to the top automatically.
3. **Loop Prevention:** The script temporarily disconnects the `MutationObserver` while applying styles to prevent infinite layout update loops.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
