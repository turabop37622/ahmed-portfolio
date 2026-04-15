// ─── HAMBURGER ───────────────────────────────────────────
function toggleMenu(){
  const ham=document.getElementById('hamburger');
  const links=document.getElementById('nav-links');
  const overlay=document.getElementById('mob-overlay');
  ham.classList.toggle('open');links.classList.toggle('open');overlay.classList.toggle('show');
  document.body.style.overflow=links.classList.contains('open')?'hidden':'';
}
function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('mob-overlay').classList.remove('show');
  document.body.style.overflow='';
}

// ─── INTRO ───────────────────────────────────────────────
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const i=document.getElementById('intro');
    if(!i)return;
    i.style.transition='opacity .85s ease,transform .85s ease';
    i.style.opacity='0';i.style.transform='scale(1.04)';
    setTimeout(()=>i.style.display='none',880);
  },2500);
});

// ─── PARTICLES ───────────────────────────────────────────
(function(){
  const wrap=document.getElementById('hero-particles');if(!wrap)return;
  const colors=['rgba(168,85,247,.5)','rgba(236,72,153,.4)','rgba(6,182,212,.35)','rgba(249,115,22,.3)'];
  for(let i=0;i<22;i++){
    const p=document.createElement('div');p.className='hp';
    const size=Math.random()*3+1.5,dur=Math.random()*12+10,delay=Math.random()*15,left=Math.random()*100;
    p.style.cssText=`width:${size}px;height:${size}px;left:${left}%;bottom:-20px;background:${colors[Math.floor(Math.random()*colors.length)]};box-shadow:0 0 ${size*3}px ${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${dur}s;animation-delay:-${delay}s;`;
    wrap.appendChild(p);
  }
})();

// ─── CURSOR ──────────────────────────────────────────────
const cur=document.getElementById('cur'),curR=document.getElementById('curR');
if(cur&&curR){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.width='16px';cur.style.height='16px';curR.style.width='52px';curR.style.height='52px';});
    el.addEventListener('mouseleave',()=>{cur.style.width='9px';cur.style.height='9px';curR.style.width='34px';curR.style.height='34px';});
  });
}

// ─── APPLE SCROLL — ABOUT ME ─────────────────────────────
(function(){
  const section=document.querySelector('.apple-scroll-section');
  const frame=document.getElementById('apple-frame');
  const aoContent=document.getElementById('ao-content');
  if(!section||!frame)return;
  function lerp(a,b,t){return a+(b-a)*t;}
  function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
  function ease(t){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
  function updateAppleAbout(){
    if(window.innerWidth<=767){frame.style.transform='';frame.style.borderRadius='';frame.style.opacity='';return;}
    const rect=section.getBoundingClientRect();
    const total=section.offsetHeight-window.innerHeight;
    const p=clamp(-rect.top/total,0,1);
    const shrinkStart=0.45;
    const shrinkP=clamp((p-shrinkStart)/(1-shrinkStart),0,1);
    const easedShrink=ease(shrinkP);
    const scale=lerp(1,0.72,easedShrink);
    const radius=lerp(0,28,easedShrink);
    const opacityFadeStart=0.6;
    const opacityP=clamp((p-opacityFadeStart)/(1-opacityFadeStart),0,1);
    const opacity=lerp(1,0,opacityP);
    frame.style.transform=`scale(${scale})`;
    frame.style.borderRadius=`${radius}px`;
    frame.style.opacity=opacity;
    if(aoContent){
      if(p>0.12&&p<0.44)aoContent.classList.add('show');
      else aoContent.classList.remove('show');
    }
  }
  window.addEventListener('scroll',updateAppleAbout,{passive:true});
  updateAppleAbout();
})();

// ─── SVC CINEMATIC ANIMATION ENGINE ──────────────────────
(function(){
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function easeOut(t){return 1-Math.pow(1-t,3);}
  function easeInOut(t){return t<0.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1;}
  const wraps=document.querySelectorAll('.svc-sticky-wrap');
  let scanlineAnimating={};
  function runScanline(wrap,id){
    if(scanlineAnimating[id])return;
    scanlineAnimating[id]=true;
    const sl=wrap.querySelector('.svc-scanline');
    if(!sl)return;
    sl.style.opacity='1';sl.style.left='0';
    const dur=900,start=performance.now();
    function anim(now){
      const t=Math.min((now-start)/dur,1);
      sl.style.left=(t*100)+'%';
      if(t<1){requestAnimationFrame(anim);}
      else{sl.style.opacity='0';sl.style.left='0';setTimeout(()=>{scanlineAnimating[id]=false;},800);}
    }
    requestAnimationFrame(anim);
  }
  wraps.forEach((wrap,i)=>{
    const id=wrap.id||i;
    const stickyH=wrap.querySelector('.svc-sticky-height');
    const pin=wrap.querySelector('.svc-sticky-pin');
    const curtainTop=wrap.querySelector('.svc-curtain-top');
    const curtainBot=wrap.querySelector('.svc-curtain-bottom');
    if(!stickyH||!pin)return;
    let wasActive=false;
    function update(){
      const rect=stickyH.getBoundingClientRect();
      const wh=window.innerHeight;
      const total=stickyH.offsetHeight-wh;
      const p=clamp(-rect.top/total,0,1);
      const isActive=rect.top<=0&&rect.bottom>=wh*0.1;
      if(isActive&&!wasActive){wrap.classList.add('svc-active');runScanline(wrap,id);wasActive=true;}
      if(!isActive){wrap.classList.remove('svc-active');wasActive=false;}
      if(window.innerWidth<=767){
        if(curtainTop)curtainTop.style.transform='';
        if(curtainBot)curtainBot.style.transform='';
        pin.style.opacity='';return;
      }
      const openP=clamp(p/0.35,0,1);
      const openEased=easeOut(openP);
      const closeStart=0.58,closeEnd=0.88;
      const closeP=clamp((p-closeStart)/(closeEnd-closeStart),0,1);
      const closeEased=easeInOut(closeP);
      let topY,botY;
      if(p<=closeStart){topY=lerp(0,-100,openEased);botY=lerp(0,100,openEased);}
      else{topY=lerp(-100,0,closeEased);botY=lerp(100,0,closeEased);}
      if(curtainTop)curtainTop.style.transform=`translateY(${topY}%)`;
      if(curtainBot)curtainBot.style.transform=`translateY(${botY}%)`;
      const pinOpacity=lerp(1,0,clamp((p-closeEnd)/(1-closeEnd),0,1));
      pin.style.opacity=pinOpacity;
    }
    wrap._update=update;
  });
  function tick(){wraps.forEach(w=>{if(w._update)w._update();});}
  window.addEventListener('scroll',tick,{passive:true});
  tick();
})();

// ─── SCROLL REVEAL ───────────────────────────────────────
const ro=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible');});},{threshold:.1});
document.querySelectorAll('.reveal').forEach(r=>ro.observe(r));

// ─── COUNT UP ────────────────────────────────────────────
document.querySelectorAll('[data-count]').forEach(el=>{
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      obs.unobserve(e.target);
      const t=+e.target.dataset.count;let c=0;
      const ti=setInterval(()=>{c=Math.min(c+t/55,t);e.target.textContent=Math.floor(c)+(t===99?'%':'+');if(c>=t)clearInterval(ti);},16);
    });
  },{threshold:.5});
  obs.observe(el);
});

// ─── CAROUSEL ENGINE ─────────────────────────────────────
const afState={};
const afIds=['poster','banner','logo','video','uiux','lottie','invoice'];
afIds.forEach(id=>{
  const track=document.getElementById('aft-'+id);
  if(!track)return;
  const pages=Array.from(track.querySelectorAll('.af-page'));
  afState[id]={current:0,total:pages.length};
  const dotsWrap=document.getElementById('afd-'+id);
  if(dotsWrap){
    dotsWrap.innerHTML='';
    pages.forEach((_,i)=>{
      const d=document.createElement('button');
      d.className='af-dot'+(i===0?' active':'');
      d.onclick=()=>afGoTo(id,i);
      dotsWrap.appendChild(d);
    });
  }
  afUpdate(id);
  let startX=0;
  const viewport=track.closest('.af-carousel-viewport');
  if(viewport){
    viewport.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;},{passive:true});
    viewport.addEventListener('touchend',e=>{
      const diff=e.changedTouches[0].clientX-startX;
      if(diff<-40)afGoTo(id,afState[id].current+1);
      else if(diff>40)afGoTo(id,afState[id].current-1);
    },{passive:true});
  }
});
function afGoTo(id,index){
  const s=afState[id];
  s.current=Math.max(0,Math.min(index,s.total-1));
  const track=document.getElementById('aft-'+id);
  if(track)track.style.transform=`translateX(-${s.current*100}%)`;
  afUpdate(id);
}
function afPrev(id){afGoTo(id,afState[id].current-1);}
function afNext(id){afGoTo(id,afState[id].current+1);}
function afUpdate(id){
  const s=afState[id];
  const prevBtn=document.getElementById('afb-'+id+'-prev');
  const nextBtn=document.getElementById('afb-'+id+'-next');
  if(prevBtn)prevBtn.disabled=s.current===0;
  if(nextBtn)nextBtn.disabled=s.current===s.total-1;
  const dotsWrap=document.getElementById('afd-'+id);
  if(dotsWrap)Array.from(dotsWrap.children).forEach((d,i)=>d.classList.toggle('active',i===s.current));
}

// ─── LIGHTBOX ────────────────────────────────────────────
let lbItems=[],lbIdx=0;
function getAllFrameItems(){
  afIds.forEach(id=>{
    const track=document.getElementById('aft-'+id);
    if(!track)return;
    Array.from(track.querySelectorAll('.af-item')).forEach(item=>{
      item.style.cursor='zoom-in';
      item.addEventListener('click',()=>{
        const allItems=Array.from(track.querySelectorAll('.af-item'));
        const items=allItems.map(i=>{
          const img=i.querySelector('img');
          const vid=i.querySelector('video');
          if(img)return{type:'image',src:img.src};
          if(vid){const s=vid.querySelector('source');return{type:'video',src:s?s.src:vid.src};}
          return null;
        }).filter(Boolean);
        lbOpen(items,allItems.indexOf(item));
      });
    });
  });
}
getAllFrameItems();
function lbOpen(items,index){lbItems=items;lbIdx=index;lbRender();document.getElementById('lightbox').classList.add('open');document.body.style.overflow='hidden';}
function lbClose(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow='';setTimeout(()=>{document.getElementById('lb-media').innerHTML='';},350);}
function lbNav(dir){lbIdx=(lbIdx+dir+lbItems.length)%lbItems.length;lbRender();}
function lbRender(){
  const wrap=document.getElementById('lb-media');
  const item=lbItems[lbIdx];
  if(item.type==='video'){wrap.innerHTML=`<video src="${item.src}" autoplay muted loop playsinline controls style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;"></video>`;}
  else{wrap.innerHTML=`<img src="${item.src}" alt="preview">`;}
  const counter=document.getElementById('lb-counter');
  if(lbItems.length>1)counter.textContent=`${lbIdx+1} / ${lbItems.length}`;
  else counter.textContent='';
  const dots=document.getElementById('lb-dots');
  if(lbItems.length<=1||lbItems.length>20){dots.innerHTML='';}
  else{dots.innerHTML=lbItems.map((x,i)=>`<button class="lb-dot${i===lbIdx?' active':''}" onclick="lbIdx=${i};lbRender()"></button>`).join('');}
  const show=lbItems.length>1;
  document.getElementById('lb-prev').style.display=show?'flex':'none';
  document.getElementById('lb-next').style.display=show?'flex':'none';
}
document.addEventListener('keydown',e=>{
  if(!document.getElementById('lightbox').classList.contains('open'))return;
  if(e.key==='Escape')lbClose();
  if(e.key==='ArrowRight')lbNav(1);
  if(e.key==='ArrowLeft')lbNav(-1);
});
const lbEl=document.getElementById('lightbox');
if(lbEl){
  lbEl.addEventListener('click',e=>{
    if(e.target===lbEl||e.target===document.getElementById('lb-media'))lbClose();
  });
}

// ─── 3D PACKAGING ────────────────────────────────────────
const box=document.getElementById('pkg3d');
if(box){
  let rX=-18,rY=28,drag=false,lx=0,ly=0,vx=0,vy=0;
  const applyR=()=>{box.style.transform=`translate(-50%,-50%) rotateX(${rX}deg) rotateY(${rY}deg)`;};
  (function spin(){if(!drag){rY+=0.35;applyR();}requestAnimationFrame(spin);})();
  box.addEventListener('mousedown',e=>{drag=true;lx=e.clientX;ly=e.clientY;vx=0;vy=0;e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!drag)return;vx=e.clientX-lx;vy=e.clientY-ly;rY+=vx*.5;rX-=vy*.5;rX=Math.max(-85,Math.min(85,rX));lx=e.clientX;ly=e.clientY;applyR();});
  document.addEventListener('mouseup',()=>{
    if(!drag)return;drag=false;
    let bvx=vx*.5,bvy=vy*.5;
    (function mom(){if(Math.abs(bvx)<.05&&Math.abs(bvy)<.05)return;rY+=bvx*.4;rX-=bvy*.4;rX=Math.max(-85,Math.min(85,rX));bvx*=.92;bvy*=.92;applyR();requestAnimationFrame(mom);})();
  });
  box.addEventListener('touchstart',e=>{drag=true;lx=e.touches[0].clientX;ly=e.touches[0].clientY;vx=0;vy=0;},{passive:true});
  document.addEventListener('touchmove',e=>{if(!drag)return;vx=e.touches[0].clientX-lx;vy=e.touches[0].clientY-ly;rY+=vx*.5;rX-=vy*.5;rX=Math.max(-85,Math.min(85,rX));lx=e.touches[0].clientX;ly=e.touches[0].clientY;applyR();},{passive:true});
  document.addEventListener('touchend',()=>{
    if(!drag)return;drag=false;
    let bvx=vx*.5,bvy=vy*.5;
    (function mom(){if(Math.abs(bvx)<.05&&Math.abs(bvy)<.05)return;rY+=bvx*.4;rX-=bvy*.4;rX=Math.max(-85,Math.min(85,rX));bvx*=.92;bvy*=.92;applyR();requestAnimationFrame(mom);})();
  });
  const faces=['front','back','right','left','top','bottom'];
  const faceBtns=document.getElementById('face-btns');
  if(faceBtns){
    faces.forEach(face=>{
      const inp=document.createElement('input');
      inp.type='file';inp.accept='image/*,video/*';inp.id='finp-'+face;
      document.body.appendChild(inp);
      const btn=document.createElement('button');
      btn.className='face-btn';btn.textContent=face.charAt(0).toUpperCase()+face.slice(1);
      btn.onclick=()=>inp.click();
      faceBtns.appendChild(btn);
      inp.addEventListener('change',e=>{
        const file=e.target.files[0];if(!file)return;
        const url=URL.createObjectURL(file);
        const faceEl=document.getElementById('f-'+face);
        if(!faceEl){URL.revokeObjectURL(url);return;}
        if(file.type.startsWith('video/')){faceEl.innerHTML=`<video src="${url}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;}
        else{faceEl.innerHTML=`<img src="${url}" alt="${face}">`;}
        btn.classList.add('done');
      });
    });
  }
}

// ─── CONTACT FORM ────────────────────────────────────────
function submitForm(){
  const name=document.getElementById('cf-name').value.trim();
  const email=document.getElementById('cf-email').value.trim();
  const msg=document.getElementById('cf-msg').value.trim();
  const status=document.getElementById('cf-status');
  if(!name||!email||!msg){status.style.display='block';status.style.color='#f97316';status.textContent='Please fill in name, email and message.';return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){status.style.display='block';status.style.color='#f97316';status.textContent='Please enter a valid email address.';return;}
  status.style.display='block';status.style.color='var(--g1)';
  status.textContent='✓ Message sent! I\'ll get back to you soon.';
  document.getElementById('cf-name').value='';
  document.getElementById('cf-email').value='';
  document.getElementById('cf-service').value='';
  document.getElementById('cf-msg').value='';
}

// ─── APP CAROUSEL & MODAL ───────────────────────────────
let currentAppModal={src:'',index:1,app:'app1',totalScreens:6};
const appScreens={
  app1:['assets/1.png','assets/2.png','assets/3.png','assets/4.png','assets/5.png','assets/6.png'],
  app2:['assets/7.png','assets/8.png','assets/11.png','assets/22.png','assets/33.png','assets/44.png','assets/55.png','assets/66.png']
};

function scrollCarousel(direction,trackId){
  const track=document.getElementById(trackId);
  if(!track)return;
  const scrollAmount=280;
  track.scrollLeft+=direction*scrollAmount;
}

function openAppModal(src,index,app){
  const modal=document.getElementById('appModal');
  const img=document.getElementById('modalImg');
  const counter=document.getElementById('modalCounter');
  const totalScreens=appScreens[app].length;
  currentAppModal={src,index,app,totalScreens};
  img.src=src;
  counter.textContent=index+' / '+totalScreens;
  modal.classList.add('active');
  document.body.style.overflow='hidden';
}

function closeAppModal(){
  const modal=document.getElementById('appModal');
  modal.classList.remove('active');
  document.body.style.overflow='';
}

function appModalNav(direction){
  let newIndex=currentAppModal.index+direction;
  const screens=appScreens[currentAppModal.app];
  if(newIndex<1)newIndex=screens.length;
  if(newIndex>screens.length)newIndex=1;
  openAppModal(screens[newIndex-1],newIndex,currentAppModal.app);
}

document.addEventListener('keydown',e=>{
  const modal=document.getElementById('appModal');
  if(!modal.classList.contains('active'))return;
  if(e.key==='ArrowLeft')appModalNav(-1);
  if(e.key==='ArrowRight')appModalNav(1);
  if(e.key==='Escape')closeAppModal();
});
