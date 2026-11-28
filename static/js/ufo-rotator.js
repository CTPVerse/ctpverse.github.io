/* UFO image rotator — investment documents.
   Dated UFO sighting photographs, matched as closely as possible to each
   document's calendar date, cycling in RANDOM order with a crossfade,
   continuously and non-stop (a fresh shuffle every full pass).
   Two modes: (1) injects a rotator at the top-left of each of the four
   investment documents, matched by heading; (2) wires up any .ufo-rotator
   already present in the page (e.g. the Virk module on the Dashboard). */
(function () {
  'use strict';

  var INTERVAL_MS = 4000;

  /* Dated UFO sighting photographs, per document. No sighting photograph is
     dated 2026, so each pool leads with the closest calendar match:
     - prospectus (Feb 2, 2026): Beijing, Feb 3 — one day off the month/day.
     - fact sheet (Mar 31, 2026): Milan, May 8, 2005 — the most recent dated
       sighting; nearest dated month after March is May.
     - compliance (March 2026): Milan, Nov 27, 2004 and the remaining dated
       sightings nearest in season to March.
     - conversations (July 2026): Bryce Canyon, July 1996 — July matches July;
       UFOs over the White House, July 1952 — July matches July.
     - virk (Winter 2025): Beijing, Feb 3 — a winter month; plus the three
       most recent dated sightings. */
  var POOLS = {
    'prospectus': [
      { src: '/assets/hero/beijing-china-1995.jpg', cap: 'Beijing, China — February 3, 1995' },
      { src: '/assets/hero/denver-colorado-1991.jpg', cap: 'Denver, Colorado, USA — 1991' },
      { src: '/assets/hero/santa-monica-california-1990.jpg', cap: 'Santa Monica, California, USA — 1990' },
      { src: '/assets/hero/gulf-breeze-florida-1994.jpg', cap: 'Gulf Breeze, Florida, USA — 1994' }
    ],
    'fact-sheet': [
      { src: '/assets/hero/milan-italy-2005.jpg', cap: 'Milan, Italy — May 8, 2005' },
      { src: '/assets/hero/espirito-santo-brazil-1991.jpg', cap: 'Espírito Santo, Brazil — May 29, 1991' },
      { src: '/assets/hero/canaima-venezuela-1990.jpg', cap: 'Canaima, Venezuela — 1990' },
      { src: '/assets/hero/fyffe-alabama-1976.jpg', cap: 'Fyffe, Alabama, USA — 1976' }
    ],
    'compliance': [
      { src: '/assets/hero/milan-italy-2004.jpg', cap: 'Milan, Italy — November 27, 2004' },
      { src: '/assets/hero/scottsdale-arizona-1995.jpg', cap: 'Scottsdale, Arizona, USA — October 3, 1995' },
      { src: '/assets/hero/topanga-canyon-california-1997.jpg', cap: 'Topanga Canyon, California, USA — 1997' },
      { src: '/assets/hero/tepoztlan-mexico-1992.jpg', cap: 'Tepoztlán, Mexico — June 7, 1992' }
    ],
    'conversations': [
      { src: '/assets/hero/bryce-canyon-utah-1996.jpg', cap: 'Bryce Canyon, Utah, USA — July 1996' },
      { src: '/assets/hero/kannarraville-utah-1996.jpg', cap: 'Kannarraville, Utah, USA — June 6, 1996' },
      { src: '/assets/hero/ufos-over-whitehouse.jpg', cap: 'UFOs over the White House — July 1952' },
      { src: '/assets/hero/cylindrical-craft-1950.jpg', cap: 'Cylindrical craft — New York, 1950' }
    ],
    'virk': [
      { src: '/assets/hero/beijing-china-1995.jpg', cap: 'Beijing, China — February 3, 1995' },
      { src: '/assets/hero/milan-italy-2005.jpg', cap: 'Milan, Italy — May 8, 2005' },
      { src: '/assets/hero/mixquic-mexico-2004.jpg', cap: 'Mixquic, Mexico — November 2, 2004' },
      { src: '/assets/hero/milan-italy-2004.jpg', cap: 'Milan, Italy — November 27, 2004' }
    ]
  };

  function poolForHeading(text) {
    var t = (text || '').toLowerCase();
    if (t.indexOf('prospectus') !== -1) return 'prospectus';
    if (t.indexOf('fact sheet') !== -1) return 'fact-sheet';
    if (t.indexOf('fundraising compliance') !== -1) return 'compliance';
    if (t.indexOf('investor conversations') !== -1) return 'conversations';
    return null;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function buildRotator(poolKey) {
    var pool = shuffle(POOLS[poolKey].slice());
    var box = document.createElement('div');
    box.className = 'ufo-rotator';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', 'UFO sighting photographs');
    pool.forEach(function (item, i) {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.cap;
      img.loading = 'lazy';
      if (i === 0) img.className = 'is-active';
      box.appendChild(img);
    });
    var cap = document.createElement('div');
    cap.className = 'ufo-rotator-cap';
    cap.textContent = pool[0].cap;
    box.appendChild(cap);
    return box;
  }

  /* Cycle a rotator's images in random order, forever: advance every
     INTERVAL_MS; at the end of each pass reshuffle so the order never
     repeats the same way twice. The CSS opacity transition does the fade. */
  function startRotator(box) {
    if (box.dataset.ufoStarted) return;
    box.dataset.ufoStarted = '1';
    var imgs = Array.prototype.slice.call(box.querySelectorAll('img'));
    if (imgs.length < 2) return;
    var capEl = box.querySelector('.ufo-rotator-cap');
    var order = shuffle(imgs.map(function (_, i) { return i; }));
    /* The first image (index 0) is the one showing in the DOM — start the
       order there so the very first tick is a real change. */
    var zeroPos = order.indexOf(0);
    if (zeroPos > 0) { var t = order[0]; order[0] = 0; order[zeroPos] = t; }
    var pos = 0;
    var current = 0;
    setInterval(function () {
      pos = (pos + 1) % order.length;
      if (pos === 0) {
        order = shuffle(order);
        if (order[0] === current && order.length > 1) {
          var tmp = order[0]; order[0] = order[1]; order[1] = tmp;
        }
      }
      var next = order[pos];
      imgs[current].classList.remove('is-active');
      imgs[next].classList.add('is-active');
      /* Caption follows the fade, not the class change, so it never names
         the image still fading out. */
      var nextCap = imgs[next].alt || '';
      setTimeout(function () { if (capEl) capEl.textContent = nextCap; }, 1200);
      current = next;
    }, INTERVAL_MS);
  }

  function init() {
    /* Mode 1: inject rotators into the four investment documents. */
    var heads = document.querySelectorAll('#investors h3, #uap-investment-documents h3');
    Array.prototype.forEach.call(heads, function (h3) {
      var key = poolForHeading(h3.textContent);
      if (!key) return;
      var article = h3.closest ? h3.closest('article') : null;
      var box = buildRotator(key);
      if (article) {
        article.insertBefore(box, article.firstChild);
      } else {
        h3.parentNode.insertBefore(box, h3);
      }
      startRotator(box);
    });
    /* Mode 2: wire up rotators already in the page (Virk module). */
    Array.prototype.forEach.call(document.querySelectorAll('.ufo-rotator'), function (box) {
      startRotator(box);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
