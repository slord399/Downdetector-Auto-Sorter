// ==UserScript==
// @name         Downdetector JP - Sort Services by Graph Color
// @namespace    https://github.com/slord399/Downdetector-Auto-Sorter/
// @version      2.0
// @description  Sort services on Downdetector based on graph color priority (Red > Yellow > Blue)
// @author       Tony_Lewis
// @match        https://downdetector.jp/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Priority map for stroke colors (lower index = higher priority)
    const colorPriority = {
        'red': 1,
        'yellow': 2,
        'blue': 3,
        'unknown': 4
    };

    /**
     * Determines the status category based on the SVG path stroke attribute.
     * @param {Element} li - The <li> element containing the card.
     * @returns {number} Priority number (1: Red, 2: Yellow, 3: Blue, 4: Unknown)
     */
    function getCardPriority(li) {
        const path = li.querySelector('svg path[stroke]');
        if (!path) return colorPriority.unknown;

        const strokeVal = path.getAttribute('stroke').toLowerCase();

        if (strokeVal.includes('red')) {
            return colorPriority.red;
        } else if (strokeVal.includes('yellow')) {
            return colorPriority.yellow;
        } else if (strokeVal.includes('blue')) {
            return colorPriority.blue;
        }

        return colorPriority.unknown;
    }

    /**
     * Sorts cards by modifying their CSS inline 'order' property.
     */
    function sortCards() {
        const ul = document.querySelector('ul.contents[aria-label*="services"]');
        if (!ul) return;

        const items = Array.from(ul.children);

        // Sort items by priority rank
        items.sort((a, b) => getCardPriority(a) - getCardPriority(b));

        // Assign ascending CSS order values (0, 1, 2, ...) to rearrange items visually
        items.forEach((item, index) => {
            item.style.order = index;
        });
    }

    // Run sorting on initial load
    sortCards();

    // Observe DOM changes (useful for dynamically loaded elements)
    const observer = new MutationObserver(() => {
        sortCards();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
