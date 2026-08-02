// ==UserScript==
// @name         Downdetector US&UK - Sort Services by Graph Color
// @namespace    https://github.com/slord399/Downdetector-Auto-Sorter/
// @version      12.0
// @description  Sorts Downdetector items (Red -> Yellow -> Green) using multi-attribute detection & CSS flex order.
// @match        https://downdetector.com/*
// @match        https://*.downdetector.com/*
// @match        https://downdetector.co.uk/*
// @match        https://*.downdetector.co.uk/*
// @match        https://downdetector.*/*
// @grant        none
// @author       Tony_Lewis
// ==/UserScript==

(function () {
    'use strict';

    let observer = null;

    // Inject styles to enforce 3-4 column layout across containers
    function injectLayoutStyles() {
        if (document.getElementById('dd-robust-grid-styles')) return;

        const style = document.createElement('style');
        style.id = 'dd-robust-grid-styles';
        style.textContent = `
            /* Convert target containers to Flex Wrap layout */
            ul.contents,
            .entries-list,
            [data-testid="entries-grid"],
            .row.contents-row,
            div[class*="grid"],
            div[class*="list"] {
                display: flex !important;
                flex-wrap: wrap !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 auto !important;
                list-style: none !important;
            }

            /* Direct child card sizing (4 columns on desktop) */
            ul.contents > *,
            .entries-list > *,
            [data-testid="entries-grid"] > *,
            .row.contents-row > * {
                flex: 1 0 220px !important;
                max-width: calc(25% - 12px) !important;
                min-width: 200px !important;
                margin: 6px !important;
                box-sizing: border-box !important;
            }

            @media (max-width: 1100px) {
                ul.contents > *, .entries-list > *, [data-testid="entries-grid"] > * {
                    max-width: calc(33.333% - 12px) !important;
                }
            }
            @media (max-width: 768px) {
                ul.contents > *, .entries-list > *, [data-testid="entries-grid"] > * {
                    max-width: calc(50% - 12px) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Comprehensive Status Detection:
     * Priority 1 = Red (Outage / Major Problems)
     * Priority 2 = Yellow (Possible Problems)
     * Priority 3 = Green (No Problems)
     */
    function getCardPriority(card) {
        const fullHTML = (card.innerHTML || '').toLowerCase();
        const fullText = (card.innerText || '').toLowerCase();
        const classNames = (card.className || '').toLowerCase();

        // Check explicit class indicators or data attributes
        const isDangerClass = classNames.includes('danger') || fullHTML.includes('danger') || fullHTML.includes('outage');
        const isWarningClass = classNames.includes('warning') || fullHTML.includes('warning') || fullHTML.includes('possible');

        // Check colors (SVG stroke/fill or hex codes)
        const hasRedColor = fullHTML.includes('--color-dd-red') || fullHTML.includes('#f00') || fullHTML.includes('rgb(255') || fullHTML.includes('rgb(238') || fullHTML.includes('red');
        const hasYellowColor = fullHTML.includes('--color-dd-yellow') || fullHTML.includes('#f0a') || fullHTML.includes('#ffb') || fullHTML.includes('yellow');

        // Check text content
        const isNoProblem = fullText.includes('no problems') || fullText.includes('no outage');
        const isProblem = fullText.includes('problems at') || fullText.includes('user reports indicate') || fullText.includes('outage');

        // PRIORITY 1: RED
        if ((isDangerClass || hasRedColor || isProblem) && !isNoProblem) {
            return 1;
        }

        // PRIORITY 2: YELLOW
        if (isWarningClass || hasYellowColor || fullText.includes('possible problems')) {
            return 2;
        }

        // PRIORITY 3: GREEN / BLUE (Normal)
        return 3;
    }

    function sortCards() {
        injectLayoutStyles();

        const containers = document.querySelectorAll('ul.contents, .entries-list, [data-testid="entries-grid"], .row.contents-row');

        containers.forEach(container => {
            const cards = Array.from(container.children);
            if (cards.length <= 1) return;

            // Pause observer while making style changes to prevent infinite loops
            if (observer) observer.disconnect();

            // Calculate priorities
            const prioritizedCards = cards.map(card => ({
                element: card,
                priority: getCardPriority(card)
            }));

            // Sort by priority score
            prioritizedCards.sort((a, b) => a.priority - b.priority);

            // Apply CSS flex order
            prioritizedCards.forEach((item, index) => {
                item.element.style.order = index;
            });

            // Re-enable observer after DOM updates
            if (observer) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    // Run on initial page load
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        sortCards();
    } else {
        window.addEventListener('DOMContentLoaded', sortCards);
    }
    window.addEventListener('load', () => setTimeout(sortCards, 300));

    // Debounced MutationObserver with loop prevention
    let timer = null;
    observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            sortCards();
        }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
