// ==UserScript==
//
// @name         Imgur Images Unblocker
// @version      1.4
// @namespace    https://github.com/Purfview/Imgur-Images-Unblocker
// @description  Loads images from Imgur in the blocked countries
// @icon         https://proxy.duckduckgo.com/iu/?u=https://imgur.com/favicon.ico
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

1.4 -    Prevent code running if Imgur images not found in a site's source code.
         [Note: Some dynamic site would need an option disabling that]

1.3 -    Mitigate multiple unblock() executions

1.2 -    Fix: Wasn't working on doom9.

1.1 -    Added support for http links.

1.0 -    First public release.

==============================================================================*/

(function() {
  'use strict';
  const from1 = 'https://i.imgur.com';
  const from2 = 'http://i.imgur.com';
  const to = 'https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com';
  let onTimeout = false;
  let runningDenied = false;

  function unblock() {
    $('img, a').each(function() {
      const el = $(this);
      ['src', 'href'].forEach(a => {
        const v = el.attr(a);
        if (v && v.startsWith(from1)) {
          el.attr(a, v.replace(from1, to));
        } else if (v && v.startsWith(from2)) {
          el.attr(a, v.replace(from2, to));
        }
      });
    });
  }

  function startObserver() {
    let timer = null;
    const observer = new MutationObserver(() => {
      if (!onTimeout) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log("Imgur Images Unblocker: Mutation unblock() is executed!");
          unblock();
        }, 70); // debounce: time to wait after last mutation before calling unblock()
      } else {
          // console.log("Imgur Images Unblocker: Mutation unblock() is on timeout!");
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.onreadystatechange = function() {
    if (document.readyState === "interactive") {
      if (!document.documentElement.innerHTML.includes("//i.imgur.com")) {
        console.log("Imgur Images Unblocker: Unblock not running: Imgur images not found!");
        return;
      } else {
        onTimeout = true;
        console.log("Imgur Images Unblocker: readyState unblock() is executed!");
        unblock();

        setTimeout(() => {
          onTimeout = false;
        }, 300); // timeout length for subsequent unblock() on mutations

        if (document.readyState === "complete") {
          startObserver();
        } else {
          document.addEventListener('DOMContentLoaded', startObserver);
        }
      }
    }
  };
})();

