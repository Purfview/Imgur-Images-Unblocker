// ==UserScript==
//
// @name         Imgur Images Unblocker
// @version      1.10
// @namespace    https://github.com/Purfview/Imgur-Images-Unblocker
// @description  Loads images from Imgur/PIXhost in the blocked countries
// @icon         https://proxy.duckduckgo.com/iu/?u=https://imgur.com/favicon.ico
// @license      MIT
//
// @updateURL    https://greasyfork.org/scripts/558123-imgur-images-unblocker/code/Imgur%20Images%20Unblocker.meta.js
// @downloadURL  https://greasyfork.org/scripts/558123-imgur-images-unblocker/code/Imgur%20Images%20Unblocker.user.js
// @homepage     https://github.com/Purfview/Imgur-Images-Unblocker
// @supportURL   https://github.com/Purfview/Imgur-Images-Unblocker/issues
//
// @match        *://*/*
// @run-at       document-start
//
// ==/UserScript==
/*=========================  Version History  ==================================

1.10 -   Added support for PIXhost thumbnails.

1.9 -    Handle background images that are set via CSS
         Support any TLD for PIXhost

1.8 -    Added unblocking for PIXhost images too.

1.7 -    Performance: Removed jQuery dependency.

1.6 -    Fix: On some sites Violentmonkey failed with "$(...) is null" error.

1.5 -    Fix: The script sometimes didn't execute.

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
  const to  = 'https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com';

  const from3 = 'https://img1.pixhost';
  const to3 = 'https://proxy.duckduckgo.com/iu/?u=https://img1.pixhost';
  const from4 = 'https://img2.pixhost';
  const to4 = 'https://proxy.duckduckgo.com/iu/?u=https://img2.pixhost';
  const from5 = 'https://img3.pixhost';
  const to5 = 'https://proxy.duckduckgo.com/iu/?u=https://img3.pixhost';
  const from6 = 'https://t1.pixhost';
  const to6 = 'https://proxy.duckduckgo.com/iu/?u=https://t1.pixhost';
  const from7 = 'https://t2.pixhost';
  const to7 = 'https://proxy.duckduckgo.com/iu/?u=https://t2.pixhost';
  const from8 = 'https://t3.pixhost';
  const to8 = 'https://proxy.duckduckgo.com/iu/?u=https://t3.pixhost';


  let onTimeout = false;
  let isStarted = false;

  function unblock() {
    const $$ = document.querySelectorAll.bind(document);
    $$('img, a').forEach(el => {
      ['src', 'href'].forEach(a => {
        const v = el[a];
        if (v && v.startsWith(from1)) {
          el[a] = v.replace(from1, to);
        } else if (v && v.startsWith(from2)) {
          el[a] = v.replace(from2, to);
        } else if (v && v.startsWith(from3)) {
          el[a] = v.replace(from3, to3);
        } else if (v && v.startsWith(from4)) {
          el[a] = v.replace(from4, to4);
        } else if (v && v.startsWith(from5)) {
          el[a] = v.replace(from5, to5);
        } else if (v && v.startsWith(from6)) {
          el[a] = v.replace(from6, to6);
        } else if (v && v.startsWith(from7)) {
          el[a] = v.replace(from7, to7);
        } else if (v && v.startsWith(from8)) {
          el[a] = v.replace(from8, to8);
        }
      });
    });

    $$('[style*="i.imgur.com"], [style*="img1.pixhost"], [style*="img2.pixhost"], [style*="img3.pixhost"], [style*="t1.pixhost"], [style*="t2.pixhost"], [style*="t3.pixhost"]').forEach(el => {
      const bg = el.style.backgroundImage;
      if (!bg || bg.includes('proxy.duckduckgo')) return; // Prevent nested proxy URLs since the style URL search isn't anchored to the start of the URL
      if (bg && bg.indexOf(from1) !== -1) {
        el.style.backgroundImage = bg.split(from1).join(to);
      } else if (bg && bg.indexOf(from2) !== -1) {
        el.style.backgroundImage = bg.split(from2).join(to);
      } else if (bg && bg.indexOf(from3) !== -1) {
        el.style.backgroundImage = bg.split(from3).join(to3);
      } else if (bg && bg.indexOf(from4) !== -1) {
        el.style.backgroundImage = bg.split(from4).join(to4);
      } else if (bg && bg.indexOf(from5) !== -1) {
        el.style.backgroundImage = bg.split(from5).join(to5);
      } else if (bg && bg.indexOf(from6) !== -1) {
        el.style.backgroundImage = bg.split(from6).join(to6);
      } else if (bg && bg.indexOf(from7) !== -1) {
        el.style.backgroundImage = bg.split(from7).join(to7);
      } else if (bg && bg.indexOf(from8) !== -1) {
        el.style.backgroundImage = bg.split(from8).join(to8);
      }
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

  function mainFunc() {
    if (
        !document.documentElement.innerHTML.includes("//i.imgur.com") &&
        !document.documentElement.innerHTML.includes("//img1.pixhost") &&
        !document.documentElement.innerHTML.includes("//img2.pixhost") &&
        !document.documentElement.innerHTML.includes("//img3.pixhost") &&
        !document.documentElement.innerHTML.includes("//t1.pixhost") &&
        !document.documentElement.innerHTML.includes("//t2.pixhost") &&
        !document.documentElement.innerHTML.includes("//t3.pixhost")
       ) {
      console.log("Imgur Images Unblocker: Unblock not running: Imgur/PIXhost images not found!");
      return;
    } else {
      isStarted = true;
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

  document.onreadystatechange = function() {
    if (!isStarted) {
      if (document.readyState === "interactive" || document.readyState === "complete") {
        mainFunc();
      }
    }
  };
})();

