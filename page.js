/* İZTEM sayfa etkileşimleri: belirme, önce/sonra, raylar */
(function(){
 var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 var doc=document.documentElement;

 /* scroll reveal: once, subtle */
 if(doc.classList.contains('js')&&'IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.01});
  var groups={};
  document.querySelectorAll('.rv').forEach(function(el){
   var p=el.parentElement,k=groups[p]=groups[p]||{n:0};
   el.style.transitionDelay=Math.min(k.n++,3)*70+'ms';io.observe(el);
  });
  /* safety: never leave content hidden */
  setTimeout(function(){document.querySelectorAll('.rv:not(.on)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('on')})},2500);
 }

 /* before / after */
 var ba=document.getElementById('ba');
 if(ba){
  var range=document.getElementById('ba-range'),bImg=document.getElementById('ba-before'),aImg=document.getElementById('ba-after');
  var cur=50,anim=null,user=false;
  function set(v){cur=Math.max(0,Math.min(100,v));ba.style.setProperty('--s',cur.toFixed(2)+'%');range.value=Math.round(cur)}
  function fromX(x){var r=ba.getBoundingClientRect();set((x-r.left)/r.width*100)}
  function stop(){user=true;if(anim){cancelAnimationFrame(anim);anim=null}}
  var dragging=false,sx=0,sy=0,decided=false;
  ba.addEventListener('pointerdown',function(e){if(e.button>0)return;stop();dragging=true;decided=e.pointerType==='mouse';sx=e.clientX;sy=e.clientY;if(decided){ba.setPointerCapture(e.pointerId);ba.classList.add('is-drag');fromX(e.clientX)}});
  ba.addEventListener('pointermove',function(e){if(!dragging)return;
   if(!decided){var dx=Math.abs(e.clientX-sx),dy=Math.abs(e.clientY-sy);if(dx<6&&dy<6)return;if(dy>dx){dragging=false;return}decided=true;try{ba.setPointerCapture(e.pointerId)}catch(_){}ba.classList.add('is-drag')}
   fromX(e.clientX)});
  function end(e){if(dragging&&!decided&&e&&e.type==='pointerup')fromX(e.clientX);dragging=false;ba.classList.remove('is-drag')}
  ba.addEventListener('pointerup',end);ba.addEventListener('pointercancel',end);
  range.addEventListener('input',function(){stop();set(+range.value)});
  ba.tabIndex=-1;ba.addEventListener('focus',function(){range.focus()});
  /* one gentle reveal when first visible */
  function intro(){if(reduce||user){set(50);return}var t0=null,from=100,to=50,d=1400;
   function step(t){if(user)return;if(t0===null)t0=t;var p=Math.min(1,(t-t0)/d);p=1-Math.pow(1-p,3);set(from+(to-from)*p);if(p<1)anim=requestAnimationFrame(step)}
   anim=requestAnimationFrame(step)}
  if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();setTimeout(intro,500)}},{threshold:.5});o.observe(ba)}else set(50);
  /* tabs */
  var tabs=[].slice.call(document.querySelectorAll('.ba-tabs [role=tab]'));
  tabs.forEach(function(t){var i1=new Image();t.addEventListener('pointerenter',function(){i1.src=t.dataset.a;new Image().src=t.dataset.b},{once:true})});
  tabs.forEach(function(t,i){t.addEventListener('click',function(){
   if(t.getAttribute('aria-selected')==='true')return;stop();
   tabs.forEach(function(x){x.setAttribute('aria-selected',x===t?'true':'false');x.tabIndex=x===t?0:-1});
   var nb=new Image(),na=new Image(),n=0;function ready(){if(++n<2)return;
    var swap=function(){bImg.src=t.dataset.b;aImg.src=t.dataset.a;bImg.alt=t.dataset.n+', temizlik öncesi';aImg.alt=t.dataset.n+', temizlik sonrası';set(50);requestAnimationFrame(function(){ba.classList.remove('is-switching')})};
    if(reduce){swap()}else{ba.classList.add('is-switching');setTimeout(swap,260)}}
   nb.onload=na.onload=nb.onerror=na.onerror=ready;nb.src=t.dataset.b;na.src=t.dataset.a;
  });
  t.addEventListener('keydown',function(e){var k=e.key,j=k==='ArrowRight'?i+1:k==='ArrowLeft'?i-1:-9;if(j===-9)return;e.preventDefault();var n=tabs[(j+tabs.length)%tabs.length];n.focus();n.click()})});
  tabs.forEach(function(x,i){x.tabIndex=i?-1:0});
 }

 /* rails */
 document.querySelectorAll('[data-rail]').forEach(function(btn){
  var rail=document.getElementById(btn.dataset.rail);if(!rail)return;
  btn.addEventListener('click',function(){var it=rail.children[0];var step=it?it.getBoundingClientRect().width+18:320;rail.scrollBy({left:step*(+btn.dataset.dir)*(innerWidth>1100?2:1),behavior:reduce?'auto':'smooth'})});
  function upd(){var max=rail.scrollWidth-rail.clientWidth-2;btn.disabled=(+btn.dataset.dir<0)?rail.scrollLeft<=2:rail.scrollLeft>=max}
  rail.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
 });

})();
