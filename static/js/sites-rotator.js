/* ===== CTPVerse sites — random rotating square banner, bottom of the left column =====
   Picks a random sister site logo (different from the one showing) every 5 seconds
   and swaps the image + link. No fade — a plain swap. Starts on CTP-EOS. */
(function(){
  var sites=[
    {name:'CTP-EOS',href:'https://ctp-eos.github.io/',img:'https://ctp-eos.github.io/assets/branding/ctp-eos-triangle-logo.jpg'},
    {name:'CTP Magazine',href:'https://ctp-magazine.github.io/',img:'https://ctp-magazine.github.io/assets/branding/ctp-magazine-1254x1254.png'},
    {name:'FIN-DSP',href:'https://fin-dsp.github.io/',img:'https://fin-dsp.github.io/assets/branding/findsp-logo-200x200.jpg'},
    {name:'CTP Music',href:'https://ctp-music.github.io/',img:'https://ctp-music.github.io/assets/branding/ctp-music-org-avatar.jpg'},
    {name:'CTP Space Systems',href:'https://ctp-space-systems.github.io/',img:'https://ctp-space-systems.github.io/assets/branding/ctp-space-systems-org-avatar.jpg'},
    {name:'CTP-PSY',href:'https://ctp-psy.github.io/',img:'https://ctp-psy.github.io/assets/branding/ctp-psy-org-avatar.jpg'},
    {name:'CTPETEAMS',href:'https://ctpeteams.github.io/',img:'https://ctpeteams.github.io/assets/branding/ctpeteams-logo-400.jpg'}
  ];
  var link=document.getElementById('ctpverse-sites-link');
  var img=document.getElementById('ctpverse-sites-img');
  if(!link||!img||sites.length<2) return;
  var idx=0, timer=null, reduceMotion=false;
  try{ reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  function show(i){
    idx=i;
    link.href=sites[idx].href;
    link.title=sites[idx].name+' — visit the live site';
    img.src=sites[idx].img;
    img.alt=sites[idx].name;
  }
  function randomNext(){
    var n=idx;
    while(n===idx){ n=Math.floor(Math.random()*sites.length); }
    show(n);
  }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function start(){
    stop();
    if(reduceMotion) return;
    timer=setInterval(randomNext,5000);
  }
  document.addEventListener('visibilitychange',function(){ if(document.hidden){ stop(); } else { start(); } });
  start();
})();
