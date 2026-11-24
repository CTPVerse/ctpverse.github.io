(function(){
  var banner=document.getElementById('hero-banner');
  if(!banner) return;
  var captions=[
    'CTPVerse \u2014 Conscious Translational Physics',
    'Resofactor in the aluminum chamber room',
    'Triangular CTP Space Systems craft',
    'Resofactor portrait, white background, ankle-length coat',
    'CTPSci, blue chrome entity \u2014 \u201Cno other being or outside entity creates your thoughts for you\u201D',
    'Cylindrical craft over Earth',
    'UFO over trees, black and white',
    'UFO disc, small square image, centred',
    'Craft interior cabin',
    'Blue pyramids',
    '\u201CThe Rocket Tyranny Equation\u201D infographic',
    'Galaxy, edge-on',
    'Cylindrical craft in space',
    'Unlocking the Universe, CTP Energy Science',
    'Telescope, CTP',
    'CTP Space Systems, CTP Space Cruiser',
    'Resofactor and CTP Craft',
    'C-Energy orbs',
    'UFO Disclosure Trading Card, Resofactor',
    'X-1 Heavy Lift Fuselage, CTP Space Systems',
    'Sun and Earth, gravity',
    'UFO over airport',
    'UFO over airport, second view',
    'Blue craft at night',
    'Cigar craft over city',
    'UFO with lights, trees',
    'UAP, FLIR',
    'Triangular craft, top view',
    'Blue diamond, sparkles',
    'Blue X, sparkles',
    'Blue X, sparkles, second view',
    'CTP Space Systems saucer craft',
    'CTP Space Systems, CTP Spaceliner',
    'CTP Space Systems, CTP Industrial Space Platform (CTPISP)',
    'CTP Gravity Control System',
    'Three orbs, C-Energy',
    'Espírito Santo, Brazil, May 29, 1991',
    'Mixquic, Mexico, November 2, 2004',
    'Beijing, China, February 3, 1995',
    'Kannarraville, Utah, USA, June 6, 1996',
    'Santa Monica, California, USA, 1990',
    'Scottsdale, Arizona, USA, October 3, 1995',
    'Topanga Canyon, California, USA, 1997',
    'Gulf Breeze, Florida, USA, 1994',
    'Denver, Colorado, USA, 1991',
    'Tepoztlán, Mexico, June 7, 1992',
    'Fyffe, Alabama, USA, 1976',
    'Bryce Canyon, Utah, USA, July 1996',
    'Milan, Italy, November 27, 2004',
    'Milan, Italy, May 8, 2005',
    'UFO disc, black and white',
    'UFO disc over city, black and white',
    'UFO disc over trees, black and white',
    'Resofactor in the CTP lab, UFO screens',
    'Canaima, Venezuela, 1990',
    'Purple disc craft',
    'CTP space cruiser',
    'CTP gravitics — manned space travel, transformed',
    'CTP Energy Science — the book',
    'CTP Energy Computer — Beyond Quantum. Built for Conscious.',
    'CTP Energy Computer tower',
    'CTP-EOS Installer',
    'CTP-EOS file system',
    'CTP-EOS logo',
    'CTP EXO — next-gen exo-space exploration',
    'CTP Industrial Space Platform — blueprint',
    'CTP and the telescope',
    'CTP-EOS build terminal',
    'CTP University lecture hall',
    'CTP Space Liner',
    'CTP diamond craft',
    'CTP Space Systems platform',
    'CTP Space Systems diamond craft',
    'Three CTP orbs, white, blue and black',
    'CE entity, chrome with green glowing eyes and green holographic data panels',
    'Wireframe CE entity holding a glowing orb above the clouds',
    'CTP-EOS banner — Tri-Force',
    'Cylindrical craft — New York, 1950'
  ];
  var slides=[].slice.call(banner.querySelectorAll('.hero-slide'));
  /* Each slide's own hero number, parsed from its image filename (hero-NN-...).
     The counter shows this number, not the slide's position in the rotation:
     there is no hero-13 or hero-58, so position and number diverge after 12. */
  var heroNumbers=slides.map(function(s,i){
    var img=s.querySelector('img');
    var src=img ? (img.getAttribute('src')||'') : '';
    var m=src.match(/hero-(\d+)/i);
    return m ? parseInt(m[1],10) : (i+1);
  });
  var captionEl=document.getElementById('heroCaption');
  var countEl=document.getElementById('heroCount');
  var prevBtn=document.getElementById('heroPrev');
  var nextBtn=document.getElementById('heroNext');
  if(!slides.length) return;
  var heroIdx=0, timer=null;
  var reduceMotion=false;
  try{ reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  function showHero(idx,manual){
    var prevSlide=slides[heroIdx];
    heroIdx=(idx+slides.length)%slides.length;
    var nextSlide=slides[heroIdx];
    slides.forEach(function(s){
      if(s===nextSlide){
        /* Incoming slide goes fully opaque UNDERNEATH at once; the outgoing
           one dissolves away on top of it (see .is-leaving in the CSS). */
        s.classList.remove('is-leaving');
        s.classList.add('is-active');
        s.removeAttribute('aria-hidden');
      } else if(s===prevSlide){
        s.classList.remove('is-active');
        s.classList.add('is-leaving');
        s.setAttribute('aria-hidden','true');
      } else {
        s.classList.remove('is-active');
        s.classList.remove('is-leaving');
        s.setAttribute('aria-hidden','true');
      }
    });
    if(captionEl) captionEl.textContent=captions[heroIdx]||'';
    if(countEl) countEl.textContent='Hero '+((heroNumbers[heroIdx]!=null)?heroNumbers[heroIdx]:(heroIdx+1))+' of '+slides.length;
    if(manual) restart();
  }
  /* Auto-advance is RANDOM: each automatic step jumps to a slide picked at
     random from the whole banner. Two rules, checked against the slide
     currently on screen: never repeat the slide already showing, and never
     follow a Resofactor slide (hero-01, 02, 18, 19, 55) with another
     Resofactor slide — so the no-two-Resofactor-in-a-row rule holds across
     every step, including when the sequence wraps. The prev / next arrows
     and swipes stay linear through DOM order; only this automatic advance
     is random. */
  var RESOFACTOR_HEROES={1:1,2:1,18:1,19:1,55:1};
  function isResofactorSlide(i){ return !!RESOFACTOR_HEROES[heroNumbers[i]]; }
  function randomHero(){
    if(slides.length<2) return heroIdx;
    var curIsResofactor=isResofactorSlide(heroIdx);
    var pool=[];
    for(var i=0;i<slides.length;i++){
      if(i===heroIdx) continue;
      if(curIsResofactor && isResofactorSlide(i)) continue;
      pool.push(i);
    }
    if(!pool.length){
      for(var j=0;j<slides.length;j++){ if(j!==heroIdx) pool.push(j); }
    }
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function nextHero(){
    var target=randomHero();
    var img=slides[target].querySelector('img');
    var done=false;
    function go(){ if(!done){ done=true; showHero(target,false); } }
    /* Dissolving into an image that has not decoded yet pops in mid-fade
       and reads as a chop. Wait for the target to decode first, but never
       stall the rotation on a slow image — 600ms at most. */
    if(img && img.decode){
      var p=null;
      try{ p=img.decode(); }catch(e){}
      if(p && p.then){ p.then(go,go); setTimeout(go,600); } else { go(); }
    } else { go(); }
  }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function start(){
    stop();
    if(reduceMotion || slides.length<2) return;
    timer=setInterval(nextHero,11000);
  }
  function restart(){ start(); }
  if(prevBtn) prevBtn.addEventListener('click',function(){ showHero(heroIdx-1,true); });
  if(nextBtn) nextBtn.addEventListener('click',function(){ showHero(heroIdx+1,true); });
  /* Touch swipe — swipe left for the next hero, swipe right for the previous one.
     Works alongside the prev / next arrows, the caption and the Hero X of 79 counter. */
  var swipeX=null, swipeY=null;
  function swipeStart(x,y){ swipeX=x; swipeY=y; }
  function swipeEnd(x,y){
    if(swipeX===null || x===null) { swipeX=null; swipeY=null; return; }
    var dx=x-swipeX, dy=y-swipeY;
    swipeX=null; swipeY=null;
    if(Math.abs(dx)>=40 && Math.abs(dx)>Math.abs(dy)*1.4){
      if(dx<0){ showHero(heroIdx+1,true); } else { showHero(heroIdx-1,true); }
    }
  }
  banner.addEventListener('touchstart',function(e){
    if(e.touches && e.touches.length===1){ swipeStart(e.touches[0].clientX,e.touches[0].clientY); stop(); }
  },{passive:true});
  var lastTouchNav=0;
  banner.addEventListener('touchend',function(e){
    var t=e.changedTouches && e.changedTouches[0];
    lastTouchNav=Date.now();
    swipeEnd(t?t.clientX:null, t?t.clientY:null);
    start();
  },{passive:true});
  banner.addEventListener('touchcancel',function(){ swipeX=null; swipeY=null; start(); },{passive:true});
  /* Pointer Events fallback for browsers / webviews that report swipes as pointer drags */
  var ptrDown=false;
  banner.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse') return;
    if(Date.now()-lastTouchNav<700) return; /* same gesture already handled as a touch */
    ptrDown=true; swipeStart(e.clientX,e.clientY);
  });
  banner.addEventListener('pointerup',function(e){
    if(!ptrDown) return;
    ptrDown=false;
    if(Date.now()-lastTouchNav<700) { swipeX=null; swipeY=null; return; }
    swipeEnd(e.clientX,e.clientY);
  });
  banner.addEventListener('pointercancel',function(){ ptrDown=false; swipeX=null; swipeY=null; });
  banner.addEventListener('mouseenter',stop);
  banner.addEventListener('mouseleave',start);
  banner.addEventListener('focusin',stop);
  banner.addEventListener('focusout',start);
  document.addEventListener('visibilitychange',function(){ if(document.hidden){ stop(); } else { start(); } });
  /* Warm the cache for every hero image in the background, a few hundred ms
     apart, so a random jump never lands on a slide that is still loading. */
  (function preloadHeroes(){
    var i=0;
    function step(){
      if(i>=slides.length) return;
      var img=slides[i].querySelector('img'); i++;
      if(img){ var pre=new Image(); pre.src=img.getAttribute('src'); }
      setTimeout(step,350);
    }
    if(window.requestIdleCallback){ requestIdleCallback(step,{timeout:3000}); }
    else { setTimeout(step,1500); }
  })();
  showHero(0,false);
  start();
})();
