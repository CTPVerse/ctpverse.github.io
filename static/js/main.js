(function(){
(function(){
  // Date line — always the visitor's live current date (v79: was a hardcoded
  // "Sunday, November 8, 2026", one day stale on Nov 9). Format matches the
  // old text: "Monday, November 9, 2026". The news-item dates are
  // real publication stamps and stay as they are.
  // v83: the fill ran once per load only, so a tab left open overnight kept
  // showing yesterday (Nov 10 screenshot still read Nov 9). Re-check every
  // minute so the line rolls over at midnight without a reload.
  var todayEl=document.getElementById('todayDate');
  function updateDate(){
    if(todayEl){ try{ todayEl.textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }catch(e){} }
  }
  updateDate();
  setInterval(updateDate,60000);
  var toast=document.getElementById('toast');
  function show(msg){ toast.textContent=msg; toast.classList.add('show'); setTimeout(function(){toast.classList.remove('show')},1800); }
  function copyText(text,msg){
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){show(msg)}).catch(function(){show(text)}); }
    else{ show(text); }
  }
  // Theme drop-down — 41 themes: CTP-EOS Cynamic first, then the 4 logo-derived CTP-EOS themes, then the 4 CTP Space Cadet themes, then the 2 CTP Midnight themes, then the 2 Tecknotronic themes, then CTPIX, then the 4 C-domain themes, then the 4 Frey Grey Blue themes, then Light / Medium / Dark, then the 12 CTP-EOS GitHub IO themes, then Void Signal, Plasma Field, Cathode Green and Deep Current, then Corporate.
  // CTP-EOS Cynamic is first and the default; the choice is remembered on this device.
  var THEME_KEY='ctpverse-dashboard-theme';
  var VALID_THEMES=['eos','eos-light','eos-medium','eos-medium-dark','eos-dark','space-cadet-light','space-cadet-medium','space-cadet-medium-dark','space-cadet-dark','midnight-blue','midnight','tecknotronic-psy','tecknotronic-matrix','ctpix','cdomain-light','cdomain-medium','cdomain-medium-dark','cdomain-dark','frey-light','frey-medium','frey-medium-dark','frey-dark','light','medium','dark','nuke-dark','matrix','amber','catppuccin','cerulean','synthwave','dracula','nord','cyberpunk','tokyonight','solarized','void-signal','plasma-field','cathode-green','deep-current','corporate'];
  var LIGHT_THEMES={light:true,medium:true,corporate:true,'eos-light':true,'eos-medium':true,'cdomain-light':true,'frey-light':true,'frey-medium':true};
  var THEME_LABELS={eos:'CTP-EOS Cynamic','eos-light':'CTP-EOS Light','eos-medium':'CTP-EOS Medium','eos-medium-dark':'CTP-EOS Medium Dark','eos-dark':'CTP-EOS Dark','space-cadet-light':'CTP Space Cadet Light','space-cadet-medium':'CTP Space Cadet Medium','space-cadet-medium-dark':'CTP Space Cadet Medium Dark','space-cadet-dark':'CTP Space Cadet Dark','midnight-blue':'CTP Midnight Blue','midnight':'CTP Midnight','tecknotronic-psy':'CTP Tecknotronic Psy','tecknotronic-matrix':'CTP Tecknotronic Matrix',ctpix:'CTPIX','cdomain-light':'C-domain Light','cdomain-medium':'C-domain Medium','cdomain-medium-dark':'C-domain Medium Dark','cdomain-dark':'C-domain Dark','frey-light':'Frey Light','frey-medium':'Frey Medium','frey-medium-dark':'Frey Medium Dark','frey-dark':'Frey Dark',light:'Light',medium:'Medium',dark:'Dark','nuke-dark':'Nuke Dark',matrix:'Matrix',amber:'Amber',catppuccin:'Catppuccin',cerulean:'Cerulean',synthwave:'Synthwave',dracula:'Dracula',nord:'Nord',cyberpunk:'Cyberpunk',tokyonight:'Tokyo Night',solarized:'Solarized','void-signal':'Void Signal','plasma-field':'Plasma Field','cathode-green':'Cathode Green','deep-current':'Deep Current',corporate:'Corporate'};
  var themeSelect=document.getElementById('themeSelect');
  function loadTheme(){
    try{ return localStorage.getItem(THEME_KEY); }catch(e){ return null; }
  }
  function saveTheme(name){
    try{ localStorage.setItem(THEME_KEY,name); }catch(e){}
  }
  function setTheme(name,silent,persist){
    if(VALID_THEMES.indexOf(name)===-1) name='eos';
    document.documentElement.setAttribute('data-theme',name);
    if(themeSelect) themeSelect.value=name;
    var cs=document.querySelector('meta[name="color-scheme"]');
    if(cs) cs.setAttribute('content', LIGHT_THEMES[name]?'light':'dark');
    if(persist) saveTheme(name);
    if(!silent) show('Theme: '+(THEME_LABELS[name]||name));
  }
  if(themeSelect){
    var applyThemeSelect=function(){ setTheme(themeSelect.value,false,true); };
    /* 'change' is the standard event; 'input' is added because some phone
       browsers / in-app webviews fire only 'input' for <select> picks. Both
       call the same handler, and setTheme is idempotent. */
    themeSelect.addEventListener('change',applyThemeSelect);
    themeSelect.addEventListener('input',applyThemeSelect);
  }
  setTheme(loadTheme()||document.documentElement.getAttribute('data-theme')||'eos',true,false);
  // Width toggle — classic Nuke width (default) vs FULL spread. The choice is
  // remembered on this device and restored before first paint (head script).
  var WIDTH_KEY='ctpverse-dashboard-width';
  var widthBtn=document.getElementById('widthToggle');
  function loadWidth(){
    try{ return localStorage.getItem(WIDTH_KEY); }catch(e){ return null; }
  }
  function saveWidth(mode){
    try{ localStorage.setItem(WIDTH_KEY,mode); }catch(e){}
  }
  function setWidth(mode,silent){
    if(mode!=='full') mode='nuke';
    if(mode==='full'){ document.documentElement.setAttribute('data-width','full'); }
    else{ document.documentElement.removeAttribute('data-width'); }
    if(widthBtn) widthBtn.textContent=mode==='full'?'WIDTH: Full':'WIDTH: Nuke';
    syncStickTop();
    if(!silent) show(mode==='full'?'Width: Full spread':'Width: Nuke');
  }
  if(widthBtn){
    widthBtn.addEventListener('click',function(){
      var next=document.documentElement.getAttribute('data-width')==='full'?'nuke':'full';
      setWidth(next,false); saveWidth(next);
    });
  }
  setWidth(loadWidth()==='full'?'full':'nuke',true);
  document.getElementById('copyEmail').addEventListener('click',function(){copyText('info@ctp-energy.com','Email copied — info@ctp-energy.com')});
  var input=document.getElementById('unitSearch'), cards=[].slice.call(document.querySelectorAll('#unitGrid .card')), noRes=document.getElementById('noResults');
  input.addEventListener('input',function(){
    var q=input.value.trim().toLowerCase(), visible=0;
    cards.forEach(function(c){ var hit=!q || (c.textContent+' '+c.getAttribute('data-search')).toLowerCase().indexOf(q)>-1; c.classList.toggle('hidden',!hit); if(hit)visible++; });
    noRes.classList.toggle('hidden',visible!==0);
  });
  // LinkedIn directory search
  var liInput=document.getElementById('liSearch'), liRows=[].slice.call(document.querySelectorAll('#liDirectory .li-row')), liGroups=[].slice.call(document.querySelectorAll('#liDirectory .li-group')), liNoRes=document.getElementById('liNoResults');
  if(liInput){
    liInput.addEventListener('input',function(){
      var q=liInput.value.trim().toLowerCase(), visible=0;
      liRows.forEach(function(r){ var hit=!q || (r.textContent+' '+r.getAttribute('data-search')).toLowerCase().indexOf(q)>-1; r.classList.toggle('hidden',!hit); if(hit)visible++; });
      liGroups.forEach(function(g){ var any=[].slice.call(g.querySelectorAll('.li-row')).some(function(r){return !r.classList.contains('hidden')}); g.classList.toggle('hidden',!any); });
      liNoRes.classList.toggle('hidden',visible!==0);
    });
  }
  // Featured article — randomly pull one of 11 verified LinkedIn articles from Resofactor Prime
  // Source: ~/workspace/ctpverse-dashboard/linkedin-articles-full-list.md (verified 2026-11-08).
  // Only article 11 has a verified individual Pulse URL; the other 10 link to the profile — no individual URLs are invented.
  var featuredArticles=JSON.parse(document.getElementById('featured-data').textContent);;
  var fKicker=document.getElementById('featuredKicker'), fTitle=document.getElementById('featuredTitle'), fExcerpt=document.getElementById('featuredExcerpt'), fCount=document.getElementById('featuredCount'), fNext=document.getElementById('featuredNext'), fRead=document.getElementById('featuredRead');
  var featuredIdx=-1;
  function showFeatured(idx){
    featuredIdx=idx;
    var a=featuredArticles[idx];
    if(fKicker) fKicker.textContent=a.kicker;
    if(fTitle) fTitle.textContent=a.title;
    if(fExcerpt) fExcerpt.textContent=a.excerpt;
    if(fRead && a.url) fRead.href=a.url;
    if(fCount) fCount.textContent='Article '+(idx+1)+' of '+featuredArticles.length+' \u00B7 From LinkedIn \u2014 Resofactor Prime';
  }
  function randomFeatured(){
    if(featuredArticles.length<2) return 0;
    var n; do{ n=Math.floor(Math.random()*featuredArticles.length); }while(n===featuredIdx);
    return n;
  }
  if(fTitle && featuredArticles.length){
    showFeatured(Math.floor(Math.random()*featuredArticles.length));
    if(fNext) fNext.addEventListener('click',function(){ showFeatured(randomFeatured()); });
  }
  // Random video — randomly pull one of the CTP craft videos verified on Resofactor's LinkedIn (verified live 2026-11-08).
  // LinkedIn's videos tab / recent-activity list sits behind the sign-in wall, so no individual profile video posts are
  // publicly verifiable. Both entries below were verified live inside Resofactor's LinkedIn article "The CTP Era"
  // (CTP Space Systems, Jul 12, 2026): entry 1 is the CTP Energy LinkedIn video post embedded in that article (it has no
  // public standalone post URL, so Watch opens the article where the video plays); entry 2 is the craft clip embedded in
  // the article's "CTP Technologies Demonstrated" section, with its title and URL exactly as verified. No titles or URLs invented.
  var craftVideos=JSON.parse(document.getElementById('videos-data').textContent);;
  var vKicker=document.getElementById('videoKicker'), vTitle=document.getElementById('videoTitle'), vExcerpt=document.getElementById('videoExcerpt'), vCount=document.getElementById('videoCount'), vNext=document.getElementById('videoNext'), vWatch=document.getElementById('videoWatch');
  var videoIdx=-1;
  function showVideo(idx){
    videoIdx=idx;
    var v=craftVideos[idx];
    if(vKicker) vKicker.textContent=v.kicker;
    if(vTitle) vTitle.textContent=v.title;
    if(vExcerpt) vExcerpt.textContent=v.excerpt;
    if(vWatch && v.url) vWatch.href=v.url;
    if(vWatch && v.btn) vWatch.textContent=v.btn;
    if(vCount) vCount.textContent='Video '+(idx+1)+' of '+craftVideos.length+' \u00B7 From LinkedIn \u2014 Resofactor';
  }
  function randomVideo(){
    if(craftVideos.length<2) return 0;
    var n; do{ n=Math.floor(Math.random()*craftVideos.length); }while(n===videoIdx);
    return n;
  }
  if(vTitle && craftVideos.length){
    showVideo(Math.floor(Math.random()*craftVideos.length));
    if(vNext) vNext.addEventListener('click',function(){ showVideo(randomVideo()); });
  }
  // CTP Space Systems Showcase — randomly pull one of 9 verified showcase items.
  // Source: ~/workspace/ctpverse-dashboard/linkedin-showcase-content-full-list.md (verified 2026-11-08).
  // Only item 1 has a verified individual Pulse URL; items 2-9 link to the showcase page — no individual post URLs are invented.
  var showcaseItems=JSON.parse(document.getElementById('showcase-data').textContent);;
  var sKicker=document.getElementById('showcaseKicker'), sTitle=document.getElementById('showcaseTitle'), sExcerpt=document.getElementById('showcaseExcerpt'), sCount=document.getElementById('showcaseCount'), sNext=document.getElementById('showcaseNext'), sRead=document.getElementById('showcaseRead');
  var showcaseIdx=-1;
  function showShowcase(idx){
    showcaseIdx=idx;
    var s=showcaseItems[idx];
    if(sKicker) sKicker.textContent=s.kicker;
    if(sTitle) sTitle.textContent=s.title;
    if(sExcerpt) sExcerpt.textContent=s.excerpt;
    if(sRead && s.url) sRead.href=s.url;
    if(sRead && s.btn) sRead.textContent=s.btn;
    if(sCount) sCount.textContent='Showcase item '+(idx+1)+' of '+showcaseItems.length;
  }
  function randomShowcase(){
    if(showcaseItems.length<2) return 0;
    var n; do{ n=Math.floor(Math.random()*showcaseItems.length); }while(n===showcaseIdx);
    return n;
  }
  if(sTitle && showcaseItems.length){
    showShowcase(Math.floor(Math.random()*showcaseItems.length));
    if(sNext) sNext.addEventListener('click',function(){ showShowcase(randomShowcase()); });
  }
  // Active nav on scroll
  var links=[].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))}).filter(Boolean);
  function onScroll(){
    var y=window.scrollY+90, cur=secs[0];
    secs.forEach(function(s){ if(s.offsetTop<=y) cur=s; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')==='#'+cur.id); });
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
})();
})();
