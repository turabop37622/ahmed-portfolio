// CUSTOM CURSOR ENGINE
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  if (!cursor) return;
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

const interactables = document.querySelectorAll('a, button, .c-item, .c-btn');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.classList.remove('active');
  });
});

// ─── HERO 3D PARALLAX ENGINE (Multi-Layer) ───
const heroSection = document.getElementById('hero');
const layers = document.querySelectorAll('.layer');

if (heroSection) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    
    layers.forEach(layer => {
      const depth = layer.getAttribute('data-depth') || 0.1;
      const moveX = x * (depth * 150);
      const moveY = y * (depth * 150);
      const rotateX = y * (depth * -20);
      const rotateY = x * (depth * 20);
      
      // Special handling for the title to give it a slight tilt
      if(layer.classList.contains('hero-title')) {
        layer.style.transform = `translate(${moveX}px, ${moveY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      } else {
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });
  });
}

// ─── ENTRANCE SEQUENCE (Triggered after Splash) ───
function startEntranceSequence() {
  setTimeout(() => {
    document.querySelector('.hero-label')?.classList.add('active');
  }, 300);
  
  setTimeout(() => {
    document.querySelectorAll('.reveal-mask').forEach(el => el.classList.add('active'));
  }, 600);
  
  setTimeout(() => {
    document.querySelector('.hero-desc')?.classList.add('active');
  }, 1000);
}

// ─── SPLASH SCREEN ENGINE ───
const splash = document.getElementById('splash-screen');
const bar = document.getElementById('loading-bar');
const pct = document.getElementById('load-percentage');
const splashName = document.getElementById('splash-name');
const splashTag = document.getElementById('splash-tagline');

document.body.classList.add('loading');

async function runSplash() {
  await typeWriterSplash(splashName, "NOOR AHMED", 80);
  await typeWriterSplash(splashTag, "PORTFOLIO", 100);
  
  // Directly finish after typing
  finishLoading();
}

function typeWriterSplash(target, text, speed) {
  return new Promise(resolve => {
    let index = 0;
    const interval = setInterval(() => {
      if (target) target.textContent += text.charAt(index);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}


function finishLoading() {
  setTimeout(() => {
    if (splash) splash.classList.add('splash-hidden');
    document.body.classList.remove('loading');
    setTimeout(startEntranceSequence, 400); 
  }, 500);
}

// Start the whole sequence safely
if (splashName && splashTag) {
  runSplash();
} else {
  // Fallback if elements not found
  finishLoading();
}

// INTERSECTION OBSERVER - Cinematic Reveal
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); 
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
});

// ─── ABOUT SECTION REVEAL (APPLE-STYLE & PINNING) ───
const aboutSection = document.querySelector('.about-section');
const aboutContainer = document.querySelector('.about-container');
const words = document.querySelectorAll('.word');

if (aboutSection && words.length > 0) {
  window.addEventListener('scroll', () => {
    const sectionTop = aboutSection.offsetTop;
    const sectionHeight = aboutSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = sectionHeight - viewportHeight;
    const relativeScroll = window.scrollY - sectionTop;
    
    // Normalize global progress (0 to 1)
    let progress = Math.min(Math.max(relativeScroll / scrollDistance, 0), 1);
    
    // PHASE 1: Text Highlighting (0% to 75% of progress)
    if (progress <= 0.75) {
      const highlightProgress = progress / 0.75;
      const totalWords = words.length;
      const highlightCount = Math.floor(highlightProgress * totalWords * 1.1); 
      
      words.forEach((word, index) => {
        word.classList.toggle('active', index < highlightCount);
      });
      
      // Reset zoom/fade
      if (aboutContainer) {
        aboutContainer.style.transform = `scale(1)`;
        aboutContainer.style.opacity = `1`;
        aboutContainer.style.filter = `blur(0px)`;
      }
    } 
    // PHASE 2: Zoom Out & Fade (75% to 100% of progress)
    else {
      // Ensure all words are active
      words.forEach(word => word.classList.add('active'));
      
      const transitionProgress = (progress - 0.75) / 0.25;
      const scale = 1 - (transitionProgress * 0.2); // Scale down to 0.8
      const opacity = 1 - transitionProgress; // Fade to 0
      const blur = transitionProgress * 10; // Slight blur
      
      if (aboutContainer) {
        aboutContainer.style.transform = `scale(${scale})`;
        aboutContainer.style.opacity = `${opacity}`;
        aboutContainer.style.filter = `blur(${blur}px)`;
      }
    }
  });
}

// ─── FOOTER TYPEWRITER ENGINE ───
const typeTargetFooter = document.getElementById('typewriter-text');
const typeSnippetFooter = "LET'S BUILD TOGETHER";
let typeIndexFooter = 0;
let isTypingFooter = false;

function typeFooter() {
  if (typeIndexFooter < typeSnippetFooter.length) {
    if (typeTargetFooter) typeTargetFooter.textContent += typeSnippetFooter.charAt(typeIndexFooter);
    typeIndexFooter++;
    setTimeout(typeFooter, 100);
  }
}

const typeObserverFooter = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !isTypingFooter) {
    isTypingFooter = true;
    typeFooter();
  }
}, { threshold: 0.5 });

if (typeTargetFooter) {
  typeObserverFooter.observe(typeTargetFooter);
}

// ─── SMART STICKY HEADER ───
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // Scrolling down - Hide
    header.classList.add('nav-hidden');
  } else {
    // Scrolling up - Show
    header.classList.remove('nav-hidden');
  }
  
  lastScrollY = currentScrollY;
}, { passive: true });

// UNIVERSAL CAROUSEL ENGINE
// Function to slide carousels left and right cleanly
window.slideCarousel = function(trackId, direction) {
  const track = document.getElementById(trackId);
  if(!track) return;

  // Assuming items inside have various widths, we use the first child's width as the jump size
  // or default to an aesthetic chunk scroll size.
  const jumpSize = (window.innerWidth * 0.4); // Scroll by 40vw chunks
  
  if(direction === 1) {
    track.scrollLeft += jumpSize;
  } else {
    track.scrollLeft -= jumpSize;
  }
};

// Enable mouse-wheel/trackpad swiping to scroll carousels dynamically 
const carouselWraps = document.querySelectorAll('.carousel-track');
carouselWraps.forEach(wrap => {
  wrap.addEventListener('wheel', (e) => {
    // Only scroll horizontally if user tracks sideways natively.
  }, {passive: true});
});

// ─── LIGHTBOX ENGINE ───
const lb = document.getElementById('lightbox');
const lbContent = document.getElementById('lb-content');
let currentGallery = [];
let currentIndex = 0;

function openLightbox(index) {
  if (!lb || !lbContent || !currentGallery[index]) return;
  
  currentIndex = index;
  lbContent.innerHTML = '';
  
  const media = currentGallery[currentIndex];
  const clone = media.cloneNode(true);
  clone.style.cursor = 'default';
  
  if (clone.tagName === 'VIDEO') {
    clone.controls = true;
    clone.muted = false;
    clone.autoplay = true;
  }
  
  lbContent.appendChild(clone);
  lb.classList.add('active');
}

window.changeLightbox = function(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = currentGallery.length - 1;
  if (currentIndex >= currentGallery.length) currentIndex = 0;
  openLightbox(currentIndex);
};

window.closeLightbox = function() {
  if (lb) lb.classList.remove('active');
  if (lbContent) lbContent.innerHTML = ''; 
};

// Bind clicks to all media in carousels
document.querySelectorAll('.carousel-track').forEach(track => {
  const items = Array.from(track.querySelectorAll('.c-item img, .c-item video'));
  
  items.forEach((media, index) => {
    media.style.cursor = 'zoom-in';
    media.addEventListener('click', () => {
      currentGallery = items;
      openLightbox(index);
    });
  });
});

// ─── AUTO-SCROLL ENGINE ───
const tracks = document.querySelectorAll('.carousel-track');
const scrollSpeeds = new Map(); // Store individual speeds/states

tracks.forEach(track => {
  let speed = 0.5; // Pixels per frame
  let isPaused = false;
  
  track.addEventListener('mouseenter', () => isPaused = true);
  track.addEventListener('mouseleave', () => isPaused = false);
  
  function animate() {
    if (!isPaused) {
      track.scrollLeft += speed;
      
      // Reset to start if it reaches the end for infinite-like feel
      if (track.scrollLeft >= (track.scrollWidth - track.clientWidth - 1)) {
        track.scrollLeft = 0;
      }
    }
    requestAnimationFrame(animate);
  }
  
  // Start the loop
  requestAnimationFrame(animate);
});

