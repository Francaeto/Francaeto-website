/* Francaeto website: menu, slideshow, gentle animations and the booking form. */
/* BOOKING FORM KEY: paste your Web3Forms access key between the quotes below.
   Until a key is added, the form opens an email to you with the details filled in. */
var FORM_KEY = 'f25704d4-33ab-4dce-a1a2-8673366eb186';
var FORM_TO = 'info@francaeto.com';

(function(){
  document.documentElement.classList.remove('no-js');
  var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded','false')}})}
  document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});

  /* gentle fade-in as sections scroll into view */
  var rv=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    rv.forEach(function(el){io.observe(el)});
  } else rv.forEach(function(el){el.classList.add('in')});

  /* slideshow */
  var s=document.querySelector('[data-slides]');
  if(s){var imgs=[].slice.call(s.querySelectorAll('img')),dots=s.querySelector('.dots'),i=0,t;
    if(imgs.length>1){
      imgs.forEach(function(_,k){var d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Picture '+(k+1));d.onclick=function(){show(k);start()};dots.appendChild(d)});
      var show=function(k){imgs[i].classList.remove('on');i=k;void imgs[i].offsetWidth;imgs[i].classList.add('on');[].forEach.call(dots.children,function(d,j){d.setAttribute('aria-current',j===i)})};
      var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
      var start=function(){clearInterval(t);if(!still)t=setInterval(function(){show((i+1)%imgs.length)},6000)};
      show(0);start();
    }}

  /* email links: many laptops have no email app, so clicking does nothing.
     We copy the address and show a note, then still try to open the email app. */
  var toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);
  var tt;function note(t){toast.textContent=t;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},6000)}
  function copy(t){try{navigator.clipboard.writeText(t)}catch(e){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e2){}a.remove()}}
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="mailto:"]');if(!a)return;
    var addr=decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]);copy(addr);
    note('Email address copied: '+addr+'. If your email app doesn’t open, paste it into Gmail, Outlook or any email.')});

  /* banner slideshow */
  var hs=document.querySelector('.hs');
  if(hs){var sl=[].slice.call(hs.querySelectorAll('.hs-slide')),dt=hs.querySelector('.hs-dots'),k=0,tm,paused=false;
    sl.forEach(function(_,j){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(j+1));b.onclick=function(){go(j);run()};dt.appendChild(b)});
    var go=function(j){sl[k].classList.remove('on');k=(j+sl.length)%sl.length;sl[k].classList.add('on');sl[k].querySelectorAll('img[loading=lazy]').forEach(function(im){im.loading='eager'});
      [].forEach.call(dt.children,function(b,i){b.setAttribute('aria-current',i===k)});
      var nx=sl[(k+1)%sl.length];nx.querySelectorAll('img[loading=lazy]').forEach(function(im){im.loading='eager'})};
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var run=function(){clearInterval(tm);if(!reduce)tm=setInterval(function(){if(!paused&&!document.hidden)go(k+1)},k===0?6500:6000)};
    hs.querySelector('.hs-prev').onclick=function(){go(k-1);run()};hs.querySelector('.hs-next').onclick=function(){go(k+1);run()};
    hs.addEventListener('mouseenter',function(){paused=true});hs.addEventListener('mouseleave',function(){paused=false});
    var x0=null;hs.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    hs.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(k+(dx<0?1:-1));run()}x0=null});
    go(0);run();}

  /* header shadow when scrolling */
  var top=document.querySelector('.top');if(top){var sc=function(){top.classList.toggle('scrolled',scrollY>10)};addEventListener('scroll',sc,{passive:true});sc()}

  /* pre-select the service from links like contact.html?service=EMDR */
  try{var want=new URLSearchParams(location.search).get('service');var sel=document.querySelector('#bookForm select[name=service]');
    if(want&&sel){[].forEach.call(sel.options,function(o){if(o.text.toLowerCase()===want.toLowerCase())sel.value=o.value})}}catch(e){}

  /* forms: booking and corporate enquiries */
  var LABEL={first_name:'First name',last_name:'Last name',name:'Name',organisation:'Organisation',role:'Role',size:'Size',email:'Email',phone:'Phone',service:'Interested in',interest:'Interested in',where:'Where',message:'Message'};
  [].forEach.call(document.querySelectorAll('form.book-form'),function(f){
    var msg=f.querySelector('.form-msg'),kind=f.getAttribute('data-kind')||'Enquiry';
    var say=function(t,ok){msg.textContent=t;msg.className='form-msg '+(ok?'ok':'err')};
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var bad=null;
      [].forEach.call(f.querySelectorAll('[required]'),function(el){
        var v=el.type==='checkbox'?el.checked:el.value.trim();
        if(el.type==='email'&&v&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))v='';
        el.classList.toggle('invalid',!v);if(!v&&!bad)bad=el});
      if(bad){say(bad.type==='checkbox'?'Please tick the box to agree to be contacted.':'Please fill in the required fields and a valid email address.',false);bad.focus();return}
      if(f.botcheck&&f.botcheck.checked)return;
      var d={},lines=[];[].forEach.call(f.elements,function(el){if(el.name&&el.type!=='checkbox'&&el.type!=='hidden'){d[el.name]=el.value.trim();lines.push((LABEL[el.name]||el.name)+': '+(d[el.name]||'-'))}});
      var who=d.name||((d.first_name||'')+' '+(d.last_name||'')).trim();
      var subject=kind+': '+who+(d.organisation?' ('+d.organisation+')':'');
      var body=lines.join('\n');
      if(!FORM_KEY){copy(body);location.href='mailto:'+FORM_TO+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
        say('Your email app should open with your details filled in. If it doesn’t, your details have been copied: paste them into an email to '+FORM_TO+'.',true);return}
      var btn=f.querySelector('button[type=submit]'),label=btn.textContent;btn.disabled=true;btn.textContent='Sending…';
      var payload={access_key:FORM_KEY,subject:subject,from_name:'francaeto.com',replyto:d.email};for(var k in d)payload[LABEL[k]?LABEL[k].toLowerCase().replace(/ /g,'_'):k]=d[k]||'-';
      fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)})
      .then(function(r){return r.json()}).then(function(j){if(j&&j.success){f.reset();say('Thank you. Your request has been sent, and I’ll be in touch soon.',true)}else throw 0})
      .catch(function(){say('Sorry, that didn’t send. Please email '+FORM_TO+' instead.',false)})
      .then(function(){btn.disabled=false;btn.textContent=label});
    });
  });
})();
