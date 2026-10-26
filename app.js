/* Shared header, footer, cart count and the Scott's Family sign-up popup */
(function(){
  var PAGES=[["./","Home","home"],["menu.html","Menu","menu"],["order.html","Order Online","order"],["catering.html","Catering","catering"],["about.html","About","about"],["account.html","Your Account","account"],["contact.html","Contact Us","contact"]];
  var cur=document.body.getAttribute("data-page")||"home";
  window.$=function(s){return document.querySelector(s);};
  window.esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  window.store={get:function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
  window.sess={get:function(k,d){try{var v=sessionStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set:function(k,v){try{sessionStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

  var nav=PAGES.map(function(p){return '<a href="'+p[0]+'"'+(p[2]===cur?' aria-current="page"':'')+'>'+p[1]+'</a>';}).join("");
  var header='<header class="top"><div class="wrap">'+
    '<a class="logo" href="./" aria-label="Scott\'s Sandwiches home"><img src="img/logo.png" alt="Scott\'s Sandwiches" width="1623" height="385"></a>'+
    '<nav class="nav" aria-label="Main">'+nav+'</nav>'+
    '<div class="right"><a class="pill" href="order.html">Order Online</a>'+
    '<a class="cartbtn" href="order.html#cart" id="cartBtn" aria-label="Your order"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1.2 11.1a2 2 0 0 1-2 1.9H9.2a2 2 0 0 1-2-1.9L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="n" id="cartN" hidden>0</span></a>'+
    '<button class="burger" type="button" id="burger" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>'+
    '</div></header>';
  var footer='<footer><div class="wrap" style="flex-direction:column;align-items:flex-start;gap:14px">'+
    '<img src="img/logo.png" alt="Scott\'s Sandwiches" width="1623" height="385" loading="lazy">'+
    '<div class="footlinks">'+PAGES.map(function(p){return '<a href="'+p[0]+'">'+p[1]+'</a>';}).join("")+'<a href="https://www.instagram.com/scotts_luncheonette_bar/" target="_blank" rel="noopener">Instagram</a><a href="https://www.tiktok.com/@scottssandwiches" target="_blank" rel="noopener">TikTok</a></div>'+
    '<span>1/1114 Gold Coast Highway, Palm Beach QLD 4221 · 0473 460 362 · hello@scottspalmbeach.com.au</span>'+
    '<span>Scott\'s Luncheonette &amp; Bar · Foodie Mate Pty Ltd · ABN 66 675 612 174</span></div></footer>';
  var pr=document.getElementById("promo");if(pr)pr.insertAdjacentHTML("afterend",header);else document.body.insertAdjacentHTML("afterbegin",header);
  document.body.insertAdjacentHTML("beforeend",footer+'<div class="scrim" id="scrim" hidden><div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Dialog"></div></div>');

  /* mobile drawer */
  $("#burger").addEventListener("click",function(){
    var d=document.createElement("div");d.className="drawer";d.setAttribute("role","dialog");d.setAttribute("aria-label","Menu");
    d.innerHTML='<button class="x" type="button" aria-label="Close menu">&times;</button>'+nav+'<a href="order.html" class="pill" style="font-family:var(--ui);font-size:15px;color:#fff;margin-top:14px;border:0">Order Online</a>';
    document.body.appendChild(d);document.body.style.overflow="hidden";
    d.querySelector(".x").onclick=function(){d.remove();document.body.style.overflow="";};d.querySelector(".x").focus();
  });

  /* Real ordering runs on Square Online (pickup, payment, dockets) */
  var ORDER_URL="https://scottspalmbeach.square.site/";
  window.ORDER_URL=ORDER_URL;
  if(cur==="order"){location.replace(ORDER_URL);}
  function fixOrderLinks(root){(root||document).querySelectorAll('a[href^="order.html"]').forEach(function(a){a.href=ORDER_URL;});}
  fixOrderLinks();
  document.addEventListener("click",function(e){var a=e.target.closest('a[href^="order.html"]');if(a){e.preventDefault();location.href=ORDER_URL;}},true);
  setTimeout(fixOrderLinks,500);

  /* cart count (shared across pages for this visit) */
  window.updCartBadge=function(){var c=sess.get("cart",[]),n=c.reduce(function(s,l){return s+l.qty;},0),b=$("#cartN");b.hidden=!n;b.textContent=n;};
  updCartBadge();

  /* sheet helpers */
  var scrim=$("#scrim"),sheet=$("#sheet");
  window.openSheet=function(html){sheet.onchange=null;sheet.innerHTML=html;scrim.hidden=false;document.body.style.overflow="hidden";var f=sheet.querySelector("button,input");if(f)f.focus();};
  window.closeSheet=function(){scrim.hidden=true;scrim.classList.remove("signup");document.body.style.overflow="";};
  scrim.addEventListener("click",function(e){if(e.target===scrim)closeSheet();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!scrim.hidden)closeSheet();});

  /* copy buttons */
  document.addEventListener("click",function(e){var b=e.target.closest("[data-copy]");if(!b)return;var t=b.getAttribute("data-copy");
    var done=function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy";},1500);};
    try{navigator.clipboard.writeText(t).then(done,function(){});}catch(err){}});

  /* Join Scott's Family popup (first visit) */
  window.openJoin=function(){
    scrim.classList.add("signup");
    openSheet('<div class="in"><span class="kicker">Join Scott\'s Family</span><h3>$3 off any sanga, every week</h3><p class="d">Sign up with your email and get $3 off any sanga, once a week, plus member deals and first dibs on new menu drops.</p>'+
      '<a class="pill" id="suGo" href="'+ORDER_URL+'">Sign up on our ordering site</a>'+
      '<p class="fine">Sign up with the "Join Scott\'s Family" box on our ordering page, then say "Scott\'s Family" at the counter. Unsubscribe any time.</p><button class="pill ghost" type="button" id="suX" style="margin-top:12px">Maybe later</button></div>');
    function done(){store.set("joinSeen",true);closeSheet();}
    $("#suX").onclick=done;
    $("#suGo").addEventListener("click",function(){store.set("joinSeen",true);});
  };
  document.addEventListener("click",function(e){if(e.target.closest("[data-join]")){e.preventDefault();openJoin();}});
  if(!store.get("joinSeen",false)&&!store.get("member",null))setTimeout(function(){if(scrim.hidden)openJoin();},2500);
})();
