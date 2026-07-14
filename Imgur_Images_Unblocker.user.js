// ==UserScript==
//
// @name         Imgur Images Unblocker
// @version      2.1
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

2.1 -    Changed the script initialization method.
         Using document.onreadystatechange = function() is unsafe because it conflicts with other userscripts that use the same event.

2.0 -    Reworked unblock() because PIXhost has few hundreds subdomain variations.

1.11 -   Fixed: Nested proxy URLs in styles [loop replacement on mutation]

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
  let onTimeout = false;
  const proxy = 'https://proxy.duckduckgo.com/iu/?u=';

  function proxyUrl(url) {
    if (url.startsWith('https://i.imgur.com')) {
      return proxy + 'https://i.imgur.com' + url.slice('https://i.imgur.com'.length);
    } else if (url.startsWith('http://i.imgur.com')) {
        return proxy + 'https://i.imgur.com' + url.slice('http://i.imgur.com'.length);
    } else if (url.match(/^https:\/\/(?:[a-z]+\d*\.)?pixhost\./)) {
        return url.replace(/^https:\/\/(?:[a-z]+\d*\.)?pixhost\./, m => proxy + m);
    } else {
        return false;
    }
  }

  function unblock() {
    const $$ = document.querySelectorAll.bind(document);
    $$('img, a').forEach(el => {
      ['src', 'href'].forEach(attr => {
        const v = el[attr];
        if (v) {
          const u = proxyUrl(v);
          if (u) {
            el[attr] = u;
          }
        }
      });
    });

    $$('[style*="i.imgur.com"], [style*=".pixhost."]').forEach(el => {
      const bg = el.style.backgroundImage;
      if (bg && !bg.includes('proxy.duckduckgo')) {
        el.style.backgroundImage = bg.replace(/https:\/\/(?:[a-z]+\d*\.)?pixhost\.[^)"']+/g, m => proxy + m)
                                     .replace(/https?:\/\/i\.imgur\.com[^)"']+/g, m => proxy + m);
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
        !document.documentElement.innerHTML.includes(".pixhost.")
       ) {
      console.log("Imgur Images Unblocker: Unblock not running: Imgur/PIXhost images not found!");
      return;
    } else {
      onTimeout = true;
      console.log("Imgur Images Unblocker: DOMContentLoaded unblock() is executed!");
      unblock();

      setTimeout(() => {
        onTimeout = false;
      }, 300); // timeout length for subsequent unblock() on mutations

      startObserver();
    }
  }

  document.addEventListener('DOMContentLoaded', mainFunc, { once: true });
})();

