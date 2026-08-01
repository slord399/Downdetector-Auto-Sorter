// ==UserScript==
// @name         Downdetector CA - Sort Services by Graph Color
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sort Downdetector service cards by graph status color (Red > Yellow > Blue) continuously
// @author       Tony_Lewis
// @match        https://downdetector.ca/*
// @match        https://*.downdetector.ca/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isSorting = false;

    function getColorPriority(strokeAttr) {
        if (!strokeAttr) return 4;
        const val = strokeAttr.toLowerCase();
        if (val.includes('red')) return 1;    // Outage / Problems
        if (val.includes('yellow')) return 2; // Possible problems
        if (val.includes('blue')) return 3;   // No problems
        return 4;                             // Default / Unknown
    }

    function sortServiceCards() {
        if (isSorting) return;

        const container = document.querySelector('ul.contents[aria-label*="services"]');
        if (!container) return;

        const items = Array.from(container.children);
        if (items.length === 0) return;

        // Check if items are already sorted to avoid unnecessary DOM operations
        let needsSort = false;
        let lastPriority = -1;

        for (const item of items) {
            const path = item.querySelector('svg path[stroke]');
            const stroke = path ? path.getAttribute('stroke') : '';
            const priority = getColorPriority(stroke);

            if (priority < lastPriority) {
                needsSort = true;
                break;
            }
            lastPriority = priority;
        }

        if (!needsSort) return;

        // Set lock flag to avoid Infinite Mutation Observer loops
        isSorting = true;

        items.sort((a, b) => {
            const pathA = a.querySelector('svg path[stroke]');
            const pathB = b.querySelector('svg path[stroke]');

            const priorityA = getColorPriority(pathA ? pathA.getAttribute('stroke') : '');
            const priorityB = getColorPriority(pathB ? pathB.getAttribute('stroke') : '');

            return priorityA - priorityB;
        });

        // Re-append sorted elements
        items.forEach((item, index) => {
            item.style.order = index;
            container.appendChild(item);
        });

        // Release the lock after DOM updates complete
        setTimeout(() => {
            isSorting = false;
        }, 100);
    }

    // Continuously watch for DOM changes (React re-renders / live updates)
    const observer = new MutationObserver(() => {
        sortServiceCards();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run periodic backup check every 2 seconds for quiet re-renders
    setInterval(sortServiceCards, 2000);
})();
