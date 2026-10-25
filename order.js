/* Order Online: menu synced from Square, regrouped like Sunny Side */
(function(){
  var SYNCED="24 Oct 2026";
  var all={};SQ_MENU.forEach(function(c){c.items.forEach(function(it){all[it.name]=it;});});
  function pick(names){return names.map(function(n){return all[n];}).filter(Boolean);}
  /* new item, not in Square yet */
  var OJ={id:"NEW_OJ",name:"Freshly Squeezed Orange Juice",desc:"100% oranges, pressed to order. Nothing added.",v:[{id:"NEW_OJ_V",name:"Regular",p:1050}],m:[],img:null,tag:"NEW",fresh:true};
  var SECTIONS=[
    {id:"specials",name:"Specials",note:"This week and this month.",items:pick(["Butter Chicken Sanga","Southern Fried BLAT"])},
    {id:"chicken",name:"Chicken",items:pick(["Butter Chicken Sanga","Southern Fried Chicken Sandwich","Southern Fried BLAT","Chicken Sanga"])},
    {id:"beef",name:"Beef & Pork",items:pick(["Philly Cheese Steak Sanga","Smoky BBQ Brisket Sanga","Scott's Reuben","Smash Burger","Spicy Pulled Pork Sanga","The Deli Stack","Leg Ham Sanga","Toasted Salami Melt"])},
    {id:"fish",name:"Fish",items:pick(["Fish Katsu","Hot Fish Finger","Tuna Steak Melt"])},
    {id:"veg",name:"Vegetarian & Vegan",items:pick(["'No Chicken' Sanga","Mushroom Sanga"])},
    {id:"brekky",name:"Brekky",note:"Breakfast Burger and Avo Brekky Sanga until 10:30am.",items:pick(["BRAT","Full Brekky","Bacon Brekky Sanga","Breakfast Burger","Avo Brekky Sanga"])},
    {id:"sides",name:"Sides & Sauces",items:pick(["Chips","Hash Brown","Aioli","Chipotle Mayo","Chilli BBQ"])},
    {id:"juice",name:"Freshly Squeezed",note:"100% fresh orange juice, pressed when you order.",items:[OJ]},
    {id:"drinks",name:"Cold Drinks",items:pick(["Orange Blend","Watermelon Blend","Green Blend","Gym Nut Smoothie","Fujin Sunset Smoothie","Iced Latte","Iced Long Black","Iced Chai","Iced Mocha"])},
    {id:"soft",name:"Soft Drinks",soon:true,items:[]}
  ];
  var FOOD=["chicken","beef","fish","veg","brekky","specials"];
  var MEAL_LIST="RC5ZV6NANDE5J76GD7B3JNRJ";
  /* online ordering window: 7:30am to 2:30pm, every day */
  var HOURS={0:["07:30","14:30"],1:["07:30","14:30"],2:["07:30","14:30"],3:["07:30","14:30"],4:["07:30","14:30"],5:["07:30","14:30"],6:["07:30","14:30"]};
  /* SOLD OUT: put item names here (or mark them sold out in Square) and they can't be ordered */
  var SOLD_OUT=[];
  function isOut(it){return SOLD_OUT.indexOf(it.name)>-1||it.soldOut;}
  var DIET={"'No Chicken' Sanga":"vg ve sp","Mushroom Sanga":"vg sp","Avo Brekky Sanga":"vg","Orange Blend":"vg ve","Watermelon Blend":"vg ve","Green Blend":"vg ve","Fujin Sunset Smoothie":"vg ve","Gym Nut Smoothie":"vg","Chips":"vg","Hash Brown":"vg","Iced Latte":"vg","Iced Long Black":"vg ve","Iced Chai":"vg","Iced Mocha":"vg","Aioli":"vg","Chipotle Mayo":"vg","Chilli BBQ":"vg ve sp","Freshly Squeezed Orange Juice":"vg ve",
   "Leg Ham Sanga":"pk","Toasted Salami Melt":"pk","Spicy Pulled Pork Sanga":"pk sp","The Deli Stack":"pk","BRAT":"pk","Full Brekky":"pk","Bacon Brekky Sanga":"pk","Breakfast Burger":"pk","Southern Fried BLAT":"pk",
   "Chicken Sanga":"sp","Tuna Steak Melt":"sp","Smoky BBQ Brisket Sanga":"sp","Southern Fried Chicken Sandwich":"sp","Fish Katsu":"sp","Hot Fish Finger":"sp"};
  var items={},dietOn=[],cart=sess.get("cart",[]),pickup="";
  SECTIONS.forEach(function(s){s.items.forEach(function(it){if(!items[it.id])items[it.id]={it:it,sec:s.id};});});
  function money(c){return "$"+(c/100).toFixed(2);}
  function from(it){return it.v.length>1?"From A"+money(Math.min.apply(null,it.v.map(function(v){return v.p;}))):"A"+money(it.v[0].p);}
  function pic(it){if(it.img)return '<img src="'+it.img+'" alt="" loading="lazy">';if(it.fresh)return '<div class="noimg" style="background:var(--red)"><span>Fresh OJ</span></div>';return '<div class="noimg"><span>'+esc(it.name)+'</span></div>';}
  function tag(it){return it.tag?'<span class="tag'+(it.tag==="VEGAN"?" v":"")+'">'+it.tag+'</span>':"";}
  function dietOf(it){return (DIET[it.name]||"").split(" ");}
  function icons(it){var d=dietOf(it),h="";if(d.indexOf("ve")>-1)h+='<span class="ic ve">VE</span>';else if(d.indexOf("vg")>-1)h+='<span class="ic vg">V</span>';if(d.indexOf("sp")>-1)h+='<span class="ic sp">SPICY</span>';return h?'<span class="icons">'+h+'</span>':"";}
  function passDiet(it){var d=dietOf(it);return dietOn.every(function(f){return f==="np"?d.indexOf("pk")<0:d.indexOf(f)>-1;});}

  $("#cats").insertAdjacentHTML("beforeend",SECTIONS.map(function(c){return '<a href="#c-'+c.id+'" data-cat="'+c.id+'">'+esc(c.name)+'</a>';}).join(""));
  var io="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id.slice(2);document.querySelectorAll(".cats a").forEach(function(a){a.classList.toggle("on",a.dataset.cat===id);});}});},{rootMargin:"-40% 0px -55% 0px"}):null;
  function render(){
    var q=($("#q").value||"").trim().toLowerCase(),any=false;
    $("#menu").innerHTML=SECTIONS.map(function(c){
      if(c.soon){if(q||dietOn.length)return "";any=true;return '<section class="cat" id="c-'+c.id+'"><h2>'+esc(c.name)+'</h2><div class="soon">Coke, Sprite, sparkling water and more. Our full soft drink range is coming to online ordering soon.</div></section>';}
      var list=c.items.filter(function(it){return (!q||(it.name+" "+it.desc).toLowerCase().indexOf(q)>-1)&&passDiet(it);});
      if(!list.length)return "";any=true;
      if(c.id==="juice"){var oj=list[0],out=isOut(oj);return '<section class="cat" id="c-juice"><h2>'+esc(c.name)+'</h2><button class="feature-row" type="button" data-item="'+oj.id+'"'+(out?' disabled':'')+' style="border:0;padding:0;width:100%;text-align:left;cursor:pointer;grid-template-columns:1fr"><div class="in" style="background:var(--red)"><span class="kicker" style="color:#fff">New · 100% fresh</span><h3>Freshly squeezed orange juice</h3><p>Oranges pressed to order. Nothing added, nothing from a bottle.</p><span class="pill white" style="align-self:flex-start;margin-top:8px">'+(out?'Sold out':'Add · '+from(oj))+'</span></div></button></section>';}
      return '<section class="cat" id="c-'+c.id+'"><h2>'+esc(c.name)+'</h2>'+(c.note?'<p style="margin:0 0 16px;color:var(--muted);font-size:15px">'+esc(c.note)+'</p>':'')+'<div class="rows">'+list.map(function(it){
        var out=isOut(it);return '<button class="row'+(out?' out':'')+'" type="button" data-item="'+it.id+'"'+(out?' aria-disabled="true"':'')+'><div class="t"><h3>'+esc(it.name)+tag(it)+icons(it)+(out?'<span class="soldout">Sold out</span>':'')+'</h3><p>'+esc(it.desc)+'</p><span class="pr">'+from(it)+'</span></div>'+(it.img?'<div class="th"><img src="'+it.img+'" alt="" loading="lazy"></div>':'')+'<span class="plus" aria-hidden="true">+</span></button>';
      }).join("")+'</div></section>';
    }).join("");
    $("#noResults").hidden=any;
    if(io)document.querySelectorAll(".cat").forEach(function(c){io.observe(c);});
  }
  $("#q").addEventListener("input",render);
  $("#cats").addEventListener("click",function(e){var a=e.target.closest("a[data-cat]");if(!a)return;e.preventDefault();var t=document.getElementById("c-"+a.dataset.cat);if(t)t.scrollIntoView({behavior:"smooth"});});
  $("#diet").addEventListener("click",function(e){var b=e.target.closest("[data-diet]");if(!b)return;var on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);var f=b.dataset.diet;dietOn=dietOn.filter(function(x){return x!==f;});if(on)dietOn.push(f);render();});
  render();
  $("#synced").textContent="Menu and prices synced from Square · "+SYNCED+". Fresh OJ and the $6.50 meal deal are new and still need adding in Square.";
  document.addEventListener("click",function(e){var c=e.target.closest("[data-item]");if(c)openItem(c.dataset.item);});

  /* pickup times from Square opening hours */
  function slots(){
    var out=[],now=new Date();
    for(var day=0;day<7&&out.length<24;day++){
      var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+day),h=HOURS[d.getDay()];if(!h)continue;
      var o=h[0].split(":"),c=h[1].split(":"),t=new Date(d);t.setHours(+o[0],+o[1],0,0);var end=new Date(d);end.setHours(+c[0],+c[1]-15,0,0);
      var earliest=new Date(now.getTime()+20*60000);
      while(t<=end&&out.length<24){if(t>=earliest)out.push((day===0?"Today":day===1?"Tomorrow":t.toLocaleDateString("en-AU",{weekday:"short"}))+" "+t.toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"}));t=new Date(t.getTime()+15*60000);}
    }
    return out;
  }
  pickup=slots()[0]||"";$("#pickupWhen").textContent=pickup?"Earliest pickup: "+pickup:"Closed";
  function opts(sel){return slots().map(function(s){return '<option'+(s===sel?" selected":"")+'>'+esc(s)+'</option>';}).join("");}

  /* item sheet */
  function openItem(id){
    var rec=items[id];if(!rec)return;if(isOut(rec.it)){toast(rec.it.name+" is sold out today");return;}var it=rec.it,qty=1,food=FOOD.indexOf(rec.sec)>-1;
    var groups=[];
    if(it.v.length>1)groups.push({t:"Choose",single:true,o:it.v.map(function(v){return [v.name,v.p];}),isVar:true});
    if(food)groups.push({t:"Make it a meal",single:true,o:[["No thanks",0],["Meal: side of chips + any drink",650]],meal:true});
    it.m.forEach(function(mid){if(mid===MEAL_LIST)return;var M=SQ_MODS[mid];if(M)groups.push({t:M.name,single:M.single,o:M.o});});
    var g=groups.map(function(gr,gi){return '<div class="grp"><h4>'+esc(gr.t)+'</h4>'+gr.o.map(function(o,oi){
      var price=gr.isVar?money(o[1]):(o[1]?"+"+money(o[1]):"");
      return '<label class="opt"><input type="'+(gr.single?"radio":"checkbox")+'" name="g'+gi+'" value="'+oi+'"'+(gr.single&&oi===0?" checked":"")+'><span>'+esc(o[0])+'</span><em>'+price+'</em></label>';}).join("")+
      (gr.meal?'<div id="mealDrink" hidden><label class="f" for="md" style="display:block;font-family:var(--ui);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin:8px 0 6px">Your drink</label><select id="md"><option>Coke</option><option>Coke No Sugar</option><option>Sprite</option><option>Sparkling water</option><option>Still water</option></select></div>':'')+'</div>';}).join("");
    openSheet('<div class="img">'+pic(it)+'</div><div class="in"><h3>'+esc(it.name)+'</h3><p class="d">'+esc(it.desc)+'</p>'+g+
      '<div class="grp"><h4>Notes for the kitchen</h4><textarea id="itemNote" rows="2" placeholder="e.g. no pickles, extra crispy"></textarea></div></div>'+
      '<div class="foot"><button class="x" type="button" id="xBtn" aria-label="Close">&times;</button><div class="qty"><button type="button" id="qm" aria-label="One less">&minus;</button><span id="qn">1</span><button type="button" id="qp" aria-label="One more">+</button></div><button class="pill" type="button" id="addBtn"></button></div>');
    function calc(){
      var unit=it.v[0].p,vname=it.v.length>1?it.v[0].name:"",mods=[];
      groups.forEach(function(gr,gi){$("#sheet").querySelectorAll('input[name="g'+gi+'"]:checked').forEach(function(inp){var o=gr.o[+inp.value];
        if(gr.isVar){unit=o[1];vname=o[0];}else{unit+=o[1];if(!(gr.single&&+inp.value===0&&!o[1]))mods.push(gr.meal?"MEAL: chips + "+$("#md").value:o[0]);}});});
      return{unit:unit,v:vname,mods:mods};
    }
    function upd(){var m=$("#mealDrink");if(m){var on=$("#sheet").querySelector('#sheet input[value="1"][name="g'+groups.findIndex(function(x){return x.meal;})+'"]');m.hidden=!(on&&on.checked);}
      $("#addBtn").textContent="Add to order · A"+money(calc().unit*qty);$("#qn").textContent=qty;}
    $("#sheet").onchange=upd;upd();
    $("#qm").onclick=function(){if(qty>1){qty--;upd();}};
    $("#qp").onclick=function(){qty++;upd();};
    $("#xBtn").onclick=closeSheet;
    $("#addBtn").onclick=function(){var c=calc();addLine({name:it.name+(c.v?" ("+c.v+")":""),unit:c.unit,mods:c.mods,note:$("#itemNote").value.trim(),qty:qty});closeSheet();toast(it.name+" added");};
  }
  function addLine(l){cart.push(l);sess.set("cart",cart);updCartBadge();}
  function toast(t){var d=document.createElement("div");d.textContent=t;d.setAttribute("role","status");d.style.cssText="position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:120;background:var(--ink);color:#fff;padding:12px 18px;border-radius:999px;font-family:var(--ui);font-weight:700;font-size:13px";document.body.appendChild(d);setTimeout(function(){d.remove();},1800);}

  /* cart + upsell + checkout */
  function total(){return cart.reduce(function(s,l){return s+l.unit*l.qty;},0);}
  var UPSELL=[["Chips",550,null],["Freshly Squeezed Orange Juice",1050,null],["Hash Brown",300,null],["Aioli",200,null]];
  function openCart(){
    if(!cart.length){openSheet('<div class="in"><h3>Your order</h3><p class="d">Your cart is empty. Pick a sanga to get started.</p></div><div class="foot"><button class="x" type="button" id="xBtn" aria-label="Close">&times;</button><button class="pill" type="button" id="goMenu">Browse the menu</button></div>');
      $("#xBtn").onclick=closeSheet;$("#goMenu").onclick=closeSheet;return;}
    openSheet('<div class="in"><h3>Your order</h3><p class="d">Pickup from Scott\'s Palm Beach</p><div id="lines"></div>'+
      '<div class="grp"><h4>Add a little extra</h4><div class="upsell" id="ups">'+UPSELL.map(function(u,i){return '<button type="button" data-up="'+i+'"><span class="ico" aria-hidden="true">+</span><span><b>'+esc(u[0])+'</b><small>+'+money(u[1])+'</small></span></button>';}).join("")+'</div></div>'+
      '<div class="tot"><span>Total</span><span id="tot"></span></div>'+
      '<form id="co" novalidate class="form"><label for="cName">Name for the order</label><input type="text" id="cName" autocomplete="name">'+
      '<label for="cPhone">Mobile</label><input type="tel" id="cPhone" autocomplete="tel">'+
      '<label for="cTime">Pickup time</label><select id="cTime">'+opts(pickup)+'</select></form>'+
      '<div class="note">If anything sells out after you order, we\'ll text you and refund that item, or cancel and refund the whole order if you prefer. Preview: on the live site, paying here goes through Square, the order lands in your Square POS and prints this docket. Members earn 1 point per $1.</div><div id="dk"></div></div>'+
      '<div class="foot"><button class="x" type="button" id="xBtn" aria-label="Close">&times;</button><button class="pill" type="button" id="placeBtn">Pay &amp; place order</button></div>');
    function draw(){
      $("#lines").innerHTML=cart.map(function(l,i){return '<div class="line"><span class="q">'+l.qty+'×</span><div class="nm">'+esc(l.name)+(l.mods.length?'<small>'+esc(l.mods.join(", "))+'</small>':"")+(l.note?'<small>Note: '+esc(l.note)+'</small>':"")+'</div><div><div>'+money(l.unit*l.qty)+'</div><button class="rm" type="button" data-rm="'+i+'">Remove</button></div></div>';}).join("");
      $("#tot").textContent="A"+money(total());
    }
    draw();
    $("#ups").addEventListener("click",function(e){var b=e.target.closest("[data-up]");if(!b)return;var u=UPSELL[+b.dataset.up];addLine({name:u[0],unit:u[1],mods:[],note:"",qty:1});draw();b.querySelector("small").textContent="Added";});
    $("#lines").addEventListener("click",function(e){var r=e.target.closest("[data-rm]");if(!r)return;cart.splice(+r.dataset.rm,1);sess.set("cart",cart);updCartBadge();if(!cart.length){closeSheet();openCart();}else draw();});
    $("#xBtn").onclick=closeSheet;
    $("#cTime").onchange=function(e){pickup=e.target.value;$("#pickupWhen").textContent="Pickup: "+pickup;};
    $("#co").addEventListener("submit",function(e){e.preventDefault();});
    $("#placeBtn").onclick=function(){
      var nm=$("#cName").value.trim();if(!nm){$("#cName").focus();$("#cName").style.borderColor="var(--red)";return;}
      var no=1000+Math.floor(Math.random()*900),t=new Date(),tot=total();
      $("#dk").innerHTML='<div class="docket"><div class="c"><b>SCOTT\'S PALM BEACH</b><br>ONLINE ORDER · PICKUP</div><hr>'+
        '<div class="r"><span>Order</span><b>#'+no+'</b></div><div class="r"><span>Name</span><b>'+esc(nm.toUpperCase())+'</b></div><div class="r"><span>Pickup</span><b>'+esc($("#cTime").value)+'</b></div><div class="r"><span>Placed</span><span>'+t.toLocaleTimeString("en-AU",{hour:"numeric",minute:"2-digit"})+'</span></div><hr>'+
        cart.map(function(l){return '<div class="r"><b>'+l.qty+' x '+esc(l.name)+'</b><span>'+money(l.unit*l.qty)+'</span></div>'+l.mods.map(function(m){return '<div class="m">+ '+esc(m)+'</div>';}).join("")+(l.note?'<div class="m">** '+esc(l.note)+'</div>':"");}).join("")+
        '<hr><div class="r"><b>TOTAL</b><b>'+money(tot)+'</b></div><div class="c" style="margin-top:8px">PAID ONLINE</div></div>';
      var acct=store.get("account",null);if(acct){acct.points=(acct.points||0)+Math.floor(tot/100);store.set("account",acct);$("#dk").insertAdjacentHTML("beforeend",'<p class="note">You earned '+Math.floor(tot/100)+' points. You now have '+acct.points+'.</p>');}
      $("#placeBtn").textContent="Docket preview below";$("#dk").scrollIntoView({behavior:"smooth",block:"nearest"});
    };
  }
  $("#cartBtn").addEventListener("click",function(e){e.preventDefault();openCart();});
  $("#viewCart").addEventListener("click",openCart);
  $("#changeTime").addEventListener("click",function(){
    openSheet('<div class="in"><h3>Pickup time</h3><label class="f" for="pt">When do you want it?</label><select id="pt">'+opts(pickup)+'</select></div><div class="foot"><button class="x" type="button" id="xBtn" aria-label="Close">&times;</button><button class="pill" type="button" id="ptOk">Save</button></div>');
    $("#xBtn").onclick=closeSheet;$("#ptOk").onclick=function(){pickup=$("#pt").value;$("#pickupWhen").textContent="Pickup: "+pickup;closeSheet();};
  });
  var h=location.hash.slice(1);
  if(h==="cart")setTimeout(openCart,300);else if(h){var t=document.getElementById("c-"+h);if(t)setTimeout(function(){t.scrollIntoView();},200);}
})();
