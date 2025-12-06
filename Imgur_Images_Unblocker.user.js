// ==UserScript==
//
// @name         Imgur Images Unblocker
// @version      1.0
// @namespace    https://github.com/Purfview/Imgur-Images-Unblocker
// @description  Loads images from Imgur in the blocked countries
// @license      MIT
//
// @updateURL    https://greasyfork.org/scripts/558123-imgur-images-unblocker/code/Imgur%20Images%20Unblocker.meta.js
// @downloadURL  https://greasyfork.org/scripts/558123-imgur-images-unblocker/code/Imgur%20Images%20Unblocker.user.js
// @homepage     https://github.com/Purfview/Imgur-Images-Unblocker
// @supportURL   https://github.com/Purfview/Imgur-Images-Unblocker/issues
//
// @require      https://code.jquery.com/jquery-3.7.1.min.js
//
// @match        *://*/*
// @run-at       document-start
//
// ==/UserScript==
/*=========================  Version History  ==================================

1.0 -    First public release.

==============================================================================*/

(function() {
  'use strict';
  const from = 'https://i.imgur.com';
  const to = 'https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com';

  function unblock() {
    console.log("Imgur Images Unblocker: Executed!");
    $('img, a').each(function() {
      const el = $(this);
      ['src', 'href'].forEach(a => {
        const v = el.attr(a);
        if (v && v.startsWith(from)) {
          el.attr(a, v.replace(from, to));
        }
      });
    });
  }

  function startObserver() {
    new MutationObserver(unblock).observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', startObserver);
})();
