// ==UserScript==
//
// @name         Imgur Images Unblocker
// @version      1.8
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
        }
      });
    });

    $$('[style*="i.imgur.com"], [style*="img1.pixhost"], [style*="img2.pixhost"], [style*="img3.pixhost"]').forEach(el => {
      const bg = el.style.backgroundImage;
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
        !document.documentElement.innerHTML.includes("//img3.pixhost")
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

