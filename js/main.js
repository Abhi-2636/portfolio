// ===== ADVANCED CURSOR & INTERACTION =====
// Dynamically inject cursor HTML so it works on EVERY page automatically
if (window.matchMedia("(pointer: fine)").matches) {
    if (!document.getElementById('cursor-dot')) {
        const cursorHTML = `
                    <div id="cursor-dot">
                        <div class="dot-core"></div>
                        <div class="dot-pulse"></div>
                    </div>
                    <div id="custom-cursor">
                        <svg class="cursor-ring ring-1" viewBox="0 0 100 100">
                            <defs>
                                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#38bdf8" />
                                    <stop offset="100%" stop-color="#818cf8" />
                                </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ring-grad)" stroke-width="2" stroke-dasharray="30 20 15 20" stroke-linecap="round" />
                        </svg>
                        <svg class="cursor-ring ring-2" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="10 10" />
                        </svg>
                        <span class="cursor-text"></span>
                    </div>
                `;
        document.body.insertAdjacentHTML('beforeend', cursorHTML);
    }
}

const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('custom-cursor');
const cursorGlow = document.getElementById('cursor-glow');

let mouseX = 0, mouseY = 0; // Actual mouse position
let ringX = 0, ringY = 0;   // Interpolated ring position
let velX = 0, velY = 0;
let isMoving = false;
let moveTimer;


window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }

    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => isMoving = false, 100);

    // Background glow follows cursor with a slight delay
    if (cursorGlow) {
        cursorGlow.style.transform = `translate(${mouseX - 400}px, ${mouseY - 400}px)`;
    }
});

function animateCursor() {
    // Ring smoothly interpolates to mouse position
    const ease = 0.18; // Adjust for snappiness
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;

    ringX += dx * ease;
    ringY += dy * ease;

    const speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, 40);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Elastic scale based on speed (stretches along movement path)
    const scaleX = 1 + (speed / 100);
    const scaleY = 1 - (speed / 150);

    if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
    }

    if (cursorGlow) {
        cursorGlow.style.transform = `translate3d(${ringX - 400}px, ${ringY - 400}px, 0)`;
    }


    requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic Effect
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const strength = this.getAttribute('data-strength') || 40;
        this.style.transform = `translate(${x / strength}px, ${y / strength}px)`;

        // Content inside also moves slightly less
        const sub = this.querySelector('.relative, span, img');
        if (sub) {
            sub.style.transform = `translate(${x / (strength * 2)}px, ${y / (strength * 2)}px)`;
        }
    });

    el.addEventListener('mouseleave', function () {
        this.style.transform = 'translate(0, 0)';
        const sub = this.querySelector('.relative, span, img');
        if (sub) sub.style.transform = 'translate(0, 0)';
    });
});

window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

// Contextual Cursor
const cursorTextEl = document.querySelector('#custom-cursor .cursor-text');
document.querySelectorAll('[data-cursor], a, button, .project-card-v2, .tech-tag, .marquee-item, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (el.hasAttribute('data-cursor')) {
            cursorTextEl.textContent = el.getAttribute('data-cursor');
            document.body.classList.add('cursor-text-active');
        }
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        document.body.classList.remove('cursor-text-active');
        cursorTextEl.textContent = '';
    });
});

// Directional Liquid Button Fills
document.querySelectorAll('.btn-liquid').forEach(btn => {
    btn.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
    btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let pseudoEl = this.querySelector('.liquid-fill');
        if (!pseudoEl) {
            pseudoEl = document.createElement('div');
            pseudoEl.className = 'liquid-fill';
            pseudoEl.style.position = 'absolute';
            pseudoEl.style.background = '#38bdf8';
            pseudoEl.style.borderRadius = '50%';
            pseudoEl.style.width = '300%';
            pseudoEl.style.height = '300%';
            pseudoEl.style.top = 'var(--y)';
            pseudoEl.style.left = 'var(--x)';
            pseudoEl.style.transform = 'translate(-50%, -50%) scale(0)';
            pseudoEl.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            pseudoEl.style.zIndex = '0';
            pseudoEl.style.pointerEvents = 'none';
            this.insertBefore(pseudoEl, this.firstChild);

            // Force reflow
            pseudoEl.offsetHeight;
            pseudoEl.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
            this.style.setProperty('--x', x + 'px');
            this.style.setProperty('--y', y + 'px');
            pseudoEl.style.top = 'var(--y)';
            pseudoEl.style.left = 'var(--x)';
        }
    });
    btn.addEventListener('mouseleave', function (e) {
        const pseudoEl = this.querySelector('.liquid-fill');
        if (pseudoEl) {
            pseudoEl.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                if (pseudoEl && pseudoEl.parentNode) pseudoEl.remove();
            }, 600);
        }
    });
});



// ===== ADVANCED PRELOADER & COUNTER =====
let isLoaded = document.readyState === 'complete';
window.addEventListener('load', () => { isLoaded = true; });
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { isLoaded = true; }, 3000); // Failsafe DOM ready
});

const preloader = document.getElementById('preloader');
const counter = document.getElementById('loader-count');
const bar = document.getElementById('loader-bar');
const terminal = document.getElementById('terminal-loader');

// Force overflow hidden initially
document.body.style.overflow = 'hidden';


const minDuration = 2200;
const startTime = performance.now();
let lastTerminalUpdate = 0;
let preloaderSkipped = false;

const terminalLogs = [
    "[SYSTEM] Initializing kernel...",
    "[CORE] Loading fonts & assets...",
    "[NETWORK] Establishing secure handshake...",
    "[GRAPHICS] Syncing Three.js buffers...",
    "[MEMORY] Allocation successful (1.2GB)",
    "[MODULE] React Engine: READY",
    "[MODULE] Motion Control: READY",
    "[READY] Deployment environment stable."
];

// Skip preloader
document.getElementById('skip-preloader').addEventListener('click', () => {
    preloaderSkipped = true;
    preloader.style.transition = 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    preloader.style.opacity = '0';
    preloader.style.transform = 'translateY(-100%)';
    preloader.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    setTimeout(() => {
        if (preloader) preloader.style.display = 'none';
        initCanvas();
    }, 600);
});

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function updateCounter(timestamp) {
    if (preloaderSkipped) return;
    const elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / minDuration, 0.99);

    // If page is fully loaded, we can speed up to 100%
    if (isLoaded && elapsed > 2000) {
        progress = Math.min(elapsed / minDuration, 1);
    }

    const count = Math.floor(easeOutExpo(progress) * 100);
    const pct = 100 - count;

    // Terminal sequence
    const logIndex = Math.floor(progress * (terminalLogs.length - 1));
    if (timestamp - lastTerminalUpdate > (350 / (progress + 0.5)) && progress < 0.98) {
        lastTerminalUpdate = timestamp;
        if (terminal) {
            const randomHex = "0x" + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
            terminal.innerHTML += `<div style="opacity:0.8; animation: slideUp 0.3s ease-out;"><span style="color:var(--primary); font-weight:800">[${randomHex}]</span> ${terminalLogs[logIndex]}</div>`;
            terminal.scrollTop = terminal.scrollHeight;
            if (terminal.childElementCount > 5) terminal.removeChild(terminal.firstChild);
        }
    }

    counter.textContent = count + '%';
    counter.setAttribute('data-count', count + '%');
    counter.style.clipPath = `polygon(0 ${pct}%, 100% ${pct}%, 100% 100%, 0 100%)`;
    bar.style.width = count + '%';

    if (progress < 1) {
        requestAnimationFrame(updateCounter);
    } else {
        counter.textContent = '100%';
        if (terminal) {
            terminal.innerHTML += `<div style="color:#10b981; font-weight:900; margin-top:4px">[READY] SYSTEM ONLINE</div>`;
            terminal.scrollTop = terminal.scrollHeight;
        }

        setTimeout(() => {
            preloader.style.transition = 'opacity 0.8s ease-out, transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
            preloader.style.opacity = '0';
            preloader.style.transform = 'translateY(-100%)';
            preloader.style.pointerEvents = 'none';
            document.body.style.overflow = '';

            // Final cleanup
            setTimeout(() => {
                if (preloader) preloader.style.display = 'none';
                initCanvas();
            }, 1000);
        }, 400);
    }
}

requestAnimationFrame(updateCounter);

// ===== TYPEWRITER =====
const words = ["Front-End Architect", "React Specialist", "UI Engineer", "TypeScript Dev", "Creative Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById("typewriter");

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 40 : 80);
    }
}
type();

// ===== COUNTER ANIMATION =====
let countersAnimated = false;
function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function updateCounter() {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        }
        updateCounter();
    });
}

// ===== SCROLL HANDLER (OPTIMIZED) =====
let ticking = false;
const progressBar = document.getElementById("progress-bar");
const auras = {
    1: document.querySelector('.aura-1'),
    2: document.querySelector('.aura-2'),
    3: document.querySelector('.aura-3')
};
const scrollTopBtn = document.getElementById('scroll-top');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Cache section offsets for faster lookup
let sectionOffsets = [];
function refreshSectionOffsets() {
    sectionOffsets = Array.from(sections).map(s => ({
        id: s.getAttribute('id'),
        top: s.offsetTop - 300
    }));
}
refreshSectionOffsets();
window.addEventListener('resize', refreshSectionOffsets, { passive: true });

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

function handleScroll() {
    const winScroll = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Progress Bar
    if (progressBar) {
        const scrolled = (scrollHeight === 0) ? 0 : (winScroll / scrollHeight) * 100;
        progressBar.style.width = scrolled + "%";
    }

    // Auras (Parallax)
    if (auras[1]) auras[1].style.transform = `translate3d(0, ${winScroll * 0.12}px, 0) rotate(${winScroll * 0.01}deg)`;
    if (auras[2]) auras[2].style.transform = `translate3d(0, ${winScroll * -0.08}px, 0) rotate(${winScroll * -0.01}deg)`;
    if (auras[3]) auras[3].style.transform = `translate3d(0, ${winScroll * 0.05}px, 0)`;



    // Sticky Navbar
    if (winScroll > 80) {
        if (!navbar.classList.contains('bg-black/80')) {
            navbar.classList.add('bg-black/80', 'backdrop-blur-2xl', 'py-4', 'border-b', 'border-white/5', 'shadow-2xl');
            navbar.classList.remove('py-6', 'md:py-8');
        }
    } else {
        if (navbar.classList.contains('bg-black/80')) {
            navbar.classList.remove('bg-black/80', 'backdrop-blur-2xl', 'py-4', 'border-b', 'border-white/5', 'shadow-2xl');
            navbar.classList.add('py-6', 'md:py-8');
        }
    }

    // Active Nav Link (Using Cached Offsets)
    let current = '';
    for (let i = sectionOffsets.length - 1; i >= 0; i--) {
        if (winScroll >= sectionOffsets[i].top) {
            current = sectionOffsets[i].id;
            break;
        }
    }

    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', isActive);
        link.classList.toggle('text-sky-400', isActive);
    });
}

document.getElementById('scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Consolidated cursor glow moved to animateCursor for perf


// ===== MAGNETIC EFFECT (OPTIMIZED) =====
document.querySelectorAll('.magnetic').forEach(el => {
    let rect = null;
    el.addEventListener('mouseenter', () => {
        rect = el.getBoundingClientRect();
    }, { passive: true });

    el.addEventListener('mousemove', (e) => {
        if (!rect) return;
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Use translate3d for GPU acceleration
        el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0, 0, 0)';
        rect = null;
    }, { passive: true });
});

// ===== 3D TILT FOR PROJECT CARDS (OPTIMIZED) =====
document.querySelectorAll('.project-card-v2').forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    let rect = null;

    card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
        card.style.willChange = 'transform';
    }, { passive: true });

    card.addEventListener('mousemove', (e) => {
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (window.matchMedia('(pointer: fine)').matches && inner) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Holographic Parallax for inner items
            const img = card.querySelector('img');
            const tags = card.querySelector('.flex.flex-wrap');
            if (img) img.style.transform = `translate3d(${(x - centerX) / 15}px, ${(y - centerY) / 15}px, 0) scale(1.1)`;
            if (tags) tags.style.transform = `translate3d(${(centerX - x) / 20}px, ${(centerY - y) / 20}px, 30px)`;
        }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
        if (inner) {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
        const img = card.querySelector('img');
        const tags = card.querySelector('.flex.flex-wrap');
        if (img) img.style.transform = 'translate3d(0, 0, 0) scale(1)';
        if (tags) tags.style.transform = 'translate3d(0, 0, 0)';

        card.style.willChange = 'auto';
        rect = null;
    }, { passive: true });
});

// ===== 3D TILT FOR TESTIMONIAL CARDS (OPTIMIZED) =====
document.querySelectorAll('.testi-card').forEach(card => {
    let rect = null;

    card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
        card.style.willChange = 'transform';
    }, { passive: true });

    card.addEventListener('mousemove', (e) => {
        if (!rect || !window.matchMedia('(pointer: fine)').matches) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        card.style.transform = `translate3d(0, -8px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
        card.style.willChange = 'auto';
        rect = null;
    }, { passive: true });
});

// ===== COPY EMAIL =====
const copyBtn = document.getElementById('copy-email');
copyBtn.addEventListener('click', async () => {
    const email = "abhisingh11644@gmail.com";
    try {
        await navigator.clipboard.writeText(email);
    } catch (err) {
        const el = document.createElement('textarea');
        el.value = email;
        el.style.position = 'fixed';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let width, height, particles;
const particleCount = window.innerWidth < 768 ? 15 : 40;
const connectionDistance = 160;
let mouseCanvasX = -1000, mouseCanvasY = -1000;

window.addEventListener('mousemove', (e) => {
    mouseCanvasX = e.clientX;
    mouseCanvasY = e.clientY;
});

class Particle {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
    }
    update() {
        const dx = this.x - mouseCanvasX;
        const dy = this.y - mouseCanvasY;
        const distSq = dx * dx + dy * dy;
        // Performance: Using squared distance to avoid Math.sqrt
        if (distSq < 22500) { // 150^2
            const dist = Math.sqrt(distSq);
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 1.5;
            this.y += (dy / dist) * force * 1.5;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width) this.x = 0; else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0; else if (this.y < 0) this.y = height;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, ' + this.opacity + ')';
        ctx.fill();
    }
}

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = Array.from({ length: particleCount }, () => new Particle());
    canvas.style.opacity = '0.4';
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    const connDistSq = connectionDistance * connectionDistance;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connDistSq) {
                const dist = Math.sqrt(distSq);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / connectionDistance) * 0.08})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (canvas) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
    }, 250);
});

// ===== MAGNETIC GRID EFFECT =====
const gridEl = document.querySelector('.bg-grid');
let mouseGridX = 0, mouseGridY = 0;
let targetGridX = 0, targetGridY = 0;

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetGridX = x * 20; // Max skew amount
    targetGridY = y * 20;
});

function animateGrid() {
    mouseGridX += (targetGridX - mouseGridX) * 0.05;
    mouseGridY += (targetGridY - mouseGridY) * 0.05;
    if (gridEl) {
        gridEl.style.transform = `perspective(1000px) rotateX(${-mouseGridY}deg) rotateY(${mouseGridX}deg) scale3d(1.1, 1.1, 1.1)`;
    }
    requestAnimationFrame(animateGrid);
}
animateGrid();

// ===== LINE REVEAL TYPOGRAPHY =====
const bioText = document.getElementById('bio-text');
if (bioText) {
    const words = bioText.innerText.split(' ');
    bioText.innerHTML = '';
    words.forEach((word, i) => {
        const wrap = document.createElement('span');
        const inner = document.createElement('span');
        inner.innerHTML = word + '&nbsp;';
        inner.style.transitionDelay = `${i * 15}ms`;
        wrap.appendChild(inner);
        bioText.appendChild(wrap);
    });
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Stagger children if any
            const children = entry.target.querySelectorAll('.stagger-item, .glass-card, .tech-tag');
            children.forEach((child, i) => {
                child.style.transitionDelay = `${i * 100}ms`;
                child.classList.add('visible');
            });

            if (entry.target.id === 'about' || entry.target.closest('#about')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-text').forEach(el => observer.observe(el));

// Parallax Logic
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax').forEach(el => {
        const speed = el.getAttribute('data-speed') || 10;
        const yPos = -(scrolled * speed / 100);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isOpen = false;
let _menuTimers = [];

function toggleMenu(open) {
    _menuTimers.forEach(clearTimeout);
    _menuTimers = [];
    isOpen = open;

    const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    const navItems = mobileMenu.querySelectorAll('.mobile-nav-item');
    const allEls = [...navLinks, ...navItems];

    if (isOpen) {
        menuBtn.classList.add('menu-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        mobileMenu.style.visibility = 'visible';
        mobileMenu.style.pointerEvents = 'auto';
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'scale(1) translateY(0)';

        mobileMenu.classList.add('menu-active');
        allEls.forEach((el, i) => {
            const t = setTimeout(() => {
                el.style.transitionDelay = `${i * 50}ms`;
            }, 50);
            _menuTimers.push(t);
        });
    } else {
        menuBtn.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('menu-active');
        document.body.style.overflow = '';
        mobileMenu.style.pointerEvents = 'none';
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'scale(0.9) translateY(-10px)';

        allEls.forEach(el => {
            el.style.transform = 'translateY(10px)';
            el.style.opacity = '0';
        });

        const t = setTimeout(() => {
            mobileMenu.style.visibility = 'hidden';
        }, 500);
        _menuTimers.push(t);
    }
}

// Active Link Highlighter logic
function updateActiveMobileLink() {
    const sections = ['about', 'expertise', 'education', 'projects'];
    const scrollPos = window.scrollY + 150;

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section && scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            const link = mobileMenu.querySelector(`a[data-section="${id}"]`);
            if (link) {
                mobileMenu.querySelectorAll('.mobile-nav-link').forEach(l => {
                    l.querySelector('.nav-text').style.color = 'rgba(255,255,255,0.7)';
                    l.querySelector('.id-text').style.color = 'rgba(255, 255, 255, 0.1)';
                });
                link.querySelector('.nav-text').style.color = '#38bdf8';
                link.querySelector('.id-text').style.color = '#38bdf8';
            }
        }
    });
}
window.addEventListener('scroll', updateActiveMobileLink);
window.addEventListener('load', updateActiveMobileLink);

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(!isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleMenu(false);
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && isOpen) toggleMenu(false);
});

// ===== SCROLL PROGRESS & BREADCRUMBS =====
const scrollProgress = document.getElementById('scroll-progress');
const navBreadcrumb = document.getElementById('nav-breadcrumb');

window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const st = h.scrollTop || document.body.scrollTop;
    const sh = h.scrollHeight || document.body.scrollHeight;
    const percent = (st / (sh - h.clientHeight)) * 100;
    if (scrollProgress) scrollProgress.style.width = percent + '%';

    // Breadcrumb logic
    const sections = ['about', 'expertise', 'education', 'stack', 'projects', 'certifications', 'testimonial-section', 'contact'];
    let current = 'HOME';
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section && (window.scrollY + 200) >= section.offsetTop) {
            current = id.toUpperCase();
        }
    });
    if (navBreadcrumb) navBreadcrumb.innerText = `PATH: /${current}`;
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== REDUCED MOTION =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        el.style.transition = 'none';
        el.classList.add('active');
    });
}
// ===== CERTIFICATE MODAL LOGIC =====
const certBtns = document.querySelectorAll('.cert-btn');
const certModal = document.getElementById('cert-modal');
const certModalContent = document.getElementById('cert-modal-content');
const certIframe = document.getElementById('cert-iframe');
const closeModalBtn = document.getElementById('close-modal');
const certModalBg = document.getElementById('cert-modal-bg');
let certOpen = false;

function toggleCertModal(open, url = '') {
    certOpen = open;
    if (open) {
        document.body.style.overflow = 'hidden';
        certModal.classList.remove('opacity-0', 'invisible');
        certModal.classList.add('opacity-100', 'visible');
        certModalContent.classList.remove('scale-95');
        certModalContent.classList.add('scale-100');

        certIframe.style.opacity = '0';
        certIframe.src = url;

        // Fade iframe in after it loads
        certIframe.onload = () => {
            setTimeout(() => {
                certIframe.style.opacity = '1';
            }, 500);
        };
    } else {
        document.body.style.overflow = '';
        certModal.classList.remove('opacity-100', 'visible');
        certModal.classList.add('opacity-0', 'invisible');
        certModalContent.classList.remove('scale-100');
        certModalContent.classList.add('scale-95');

        setTimeout(() => {
            certIframe.src = '';
            certIframe.style.opacity = '0';
        }, 500);
    }
}

certBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('href');
        toggleCertModal(true, url);
    });
});

closeModalBtn.addEventListener('click', () => toggleCertModal(false));
certModalBg.addEventListener('click', () => toggleCertModal(false));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certOpen) toggleCertModal(false);
});



// ===== HUE SLIDER (CHROMA SHIFT ENGINE) =====
const hueSlider = document.getElementById('hue-slider');
hueSlider.addEventListener('input', () => {
    document.documentElement.style.setProperty('--hue-shift', hueSlider.value + 'deg');
});

// ===== PROJECT DRAWER =====
const drawer = document.getElementById('project-drawer');
const drawerBackdrop = document.getElementById('drawer-backdrop');
const drawerClose = document.getElementById('drawer-close');
const drawerContent = document.getElementById('drawer-content');

const projectData = {
    'anvi-stay': {
        title: 'Anvi Stay', color: '#c084fc',
        tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack'],
        desc: 'A comprehensive PropTech platform built for student housing management. Features an advanced operations dashboard, real-time tenant management, dynamic billing system, heatmap-based room inventory, kanban complaint board, and a full vendor assignment system.',
        features: ['Advanced Admin Dashboard', 'Real-Time Billing Engine', 'Heatmap Room Grid', 'Kanban Complaint Board', 'Vendor Management System', 'Tenant Document Vault', 'UPI Payment Integration', 'Lead Tracking Analytics'],
        liveUrl: '#', year: '2024'
    },
    'mindcare': {
        title: 'MindCare App', color: '#10b981',
        tags: ['Angular', 'Ionic', 'Health & Wellness'],
        desc: 'A mental wellness companion app built with Angular. Features mood tracking, personalised wellness suggestions, journaling, breathing exercises, and progress analytics to help users maintain their mental health.',
        features: ['Mood Tracking Dashboard', 'Wellness Suggestions Engine', 'Private Journal', 'Breathing Exercises', 'Progress Analytics', 'Push Notifications'],
        liveUrl: '#', year: '2024'
    },
    'heaven-rooms': {
        title: 'Heaven Rooms', color: '#38bdf8',
        tags: ['Ionic', 'Mobile', 'Real Estate'],
        desc: 'A specialised student housing booking mobile application built with Ionic Framework. Provides a native-like experience with room browsing, online booking, payment gateway integration, and booking management.',
        features: ['Room Listing & Search', 'Online Booking System', 'Payment Integration', 'Real-Time Availability', 'Photo Gallery', 'User Reviews'],
        liveUrl: 'https://abhishek263639.github.io/HEAVEN-ROOMS-/', year: '2023'
    },
    'explore-patna': {
        title: 'Explore Patna', color: '#818cf8',
        tags: ['HTML', 'CSS', 'JavaScript', 'Tourism'],
        desc: 'A heritage city guide web application showcasing the cultural landmarks, cuisine, history, and travel tips of Patna. Features a modern, performance-first design with interactive maps and photo galleries.',
        features: ['Heritage Site Directory', 'Interactive City Map', 'Local Cuisine Guide', 'Travel Itineraries', 'Photo Galleries', 'Responsive Design'],
        liveUrl: 'https://abhishek263639.github.io/EXPLORE-PATNA/', year: '2023'
    }
};

function openDrawer(key) {
    const p = projectData[key];
    if (!p) return;
    drawerContent.innerHTML = `
                <div style="margin-bottom:1.5rem">
                    <div style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 0.9rem;border-radius:2rem;border:1px solid ${p.color}30;background:${p.color}10;margin-bottom:1rem">
                        <span style="width:6px;height:6px;background:${p.color};border-radius:50%"></span>
                        <span style="font-size:0.6rem;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:${p.color}">${p.year} Case Study</span>
                    </div>
                    <h2 style="font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:900;color:white;text-transform:uppercase;letter-spacing:-0.03em;margin-bottom:0.5rem">${p.title}</h2>
                    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem">
                        ${p.tags.map(t => `<span style="padding:0.3rem 0.7rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:0.5rem;font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:rgba(148,163,184,0.9)">${t}</span>`).join('')}
                    </div>
                    <p style="color:rgba(148,163,184,0.8);line-height:1.8;font-size:0.9rem;margin-bottom:2rem">${p.desc}</p>
                    <h4 style="font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:${p.color};margin-bottom:1rem">Core Features</h4>
                    <ul style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:2rem">
                        ${p.features.map(f => `<li style="display:flex;align-items:center;gap:0.5rem;color:rgba(226,232,240,0.8);font-size:0.8rem"><span style="width:5px;height:5px;background:${p.color};border-radius:50%;flex-shrink:0"></span>${f}</li>`).join('')}
                    </ul>
                    <div style="display:flex;gap:1rem">
                        ${p.liveUrl !== '#' ? `<a href="${p.liveUrl}" target="_blank" style="flex:1;text-align:center;padding:0.9rem;background:${p.color};color:black;border-radius:0.75rem;font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;transition:opacity 0.2s" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">View Live ↗</a>` : ''}
                        <button onclick="closeDrawer()" style="flex:1;padding:0.9rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(148,163,184,0.8);border-radius:0.75rem;font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer">Close</button>
                    </div>
                </div>`;
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

drawerClose.addEventListener('click', closeDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);

// Attach drawer to project cards
const drawerMap = { 0: 'anvi-stay', 1: 'mindcare', 2: 'heaven-rooms', 3: 'explore-patna' };
document.querySelectorAll('.project-card-v2').forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) { e.preventDefault(); openDrawer(drawerMap[i] || 'anvi-stay'); }
    });
});


// ===== AI CHATBOT =====
const chatbot = document.getElementById('chatbot-widget');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

document.getElementById('chatbot-toggle').addEventListener('click', () => { chatbot.classList.toggle('open'); if (chatbot.classList.contains('open')) chatInput.focus(); });
document.getElementById('chatbot-close').addEventListener('click', () => chatbot.classList.remove('open'));

const aiReplies = {
    skills: "I specialise in React.js, Angular, Next.js, TypeScript, and Tailwind CSS on the frontend. For mobile, I use Ionic Framework. Backend: Node.js, Express, and PHP. I'm also strong with MongoDB, MySQL, and Firebase. 💪",
    react: "React is my primary framework! I've built several production apps with it including Anvi Stay — a full-stack PropTech platform with complex state management and real-time features.",
    projects: "My key projects are: 🏠 Anvi Stay (full PropTech platform), 🧠 MindCare App (wellness tracker in Angular), 🏨 Heaven Rooms (Ionic mobile app), and 🗺️ Explore Patna (tourism web app). Click 'View Details' on any project card!",
    hire: "I'm actively open to work! 🚀 I'm available for full-time roles, freelance projects, and global remote opportunities. Best to reach me at abhisingh11644@gmail.com or click 'Contact' in the menu.",
    experience: "I'm a BCA student at Lovely Professional University (2023-present) with hands-on production experience. I've built and deployed multiple real-world apps used by actual clients like Anvi Stay and Heaven Rooms.",
    salary: "I'm flexible on compensation and open to discussing based on the role and company. Feel free to reach out directly so we can have a proper conversation! 🤝",
    education: "I'm currently pursuing BCA at Lovely Professional University (2023-present). Before that, I studied PCM at A.N. College, Patna. I also hold certifications from FreeCodeCamp, Coursera, and Cisco Academy.",
    contact: "Best ways to reach me: 📧 abhisingh11644@gmail.com | 📱 +91 8409 898 626 | 🔗 LinkedIn | 💬 WhatsApp. Or just scroll down to the contact section!",
    location: "I'm based in Patna, Bihar, India 📍 but I'm open to remote work globally and willing to relocate for the right opportunity!",
    default: ["That's a great question! I'd love to answer properly — please reach out at abhisingh11644@gmail.com for detailed discussions. 🙏", "I'm not sure about that specific detail! For the best answer, connect with me directly on LinkedIn or WhatsApp. Let's chat! 💬", "Hmm, I'd need to think about that one! Best to reach Abhishek directly — he'll give you a much better answer than I can. 😄"]
};

function getBotReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('skill') || m.includes('tech') || m.includes('stack') || m.includes('know')) return aiReplies.skills;
    if (m.includes('react') || m.includes('angular') || m.includes('next')) return aiReplies.react;
    if (m.includes('project') || m.includes('work') || m.includes('built') || m.includes('portfolio')) return aiReplies.projects;
    if (m.includes('hire') || m.includes('job') || m.includes('available') || m.includes('freelance') || m.includes('work')) return aiReplies.hire;
    if (m.includes('experience') || m.includes('year') || m.includes('background')) return aiReplies.experience;
    if (m.includes('salary') || m.includes('rate') || m.includes('pay') || m.includes('cost')) return aiReplies.salary;
    if (m.includes('educat') || m.includes('college') || m.includes('university') || m.includes('degree')) return aiReplies.education;
    if (m.includes('contact') || m.includes('email') || m.includes('phone') || m.includes('reach')) return aiReplies.contact;
    if (m.includes('location') || m.includes('where') || m.includes('remote') || m.includes('india')) return aiReplies.location;
    return aiReplies.default[Math.floor(Math.random() * aiReplies.default.length)];
}

function addChatMsg(text, role) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMsg() {
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMsg(text, 'user');
    chatInput.value = '';
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
        chatMessages.removeChild(typing);
        addChatMsg(getBotReply(text), 'bot');
    }, 800 + Math.random() * 600);
}

chatSend.addEventListener('click', sendChatMsg);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChatMsg(); });

// Chatbot Suggestion Chips
const chipsContainer = document.createElement('div');
chipsContainer.className = 'chat-chips';
chipsContainer.innerHTML = [
    'What\'s your stack?',
    'Best project?',
    'Are you available?',
    'How to hire you?'
].map(q => `<span class="chat-chip">${q}</span>`).join('');
chatMessages.parentNode.insertBefore(chipsContainer, chatMessages.nextSibling);
chipsContainer.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        chatInput.value = chip.textContent;
        sendChatMsg();
        chipsContainer.style.display = 'none';
    });
});

// Dynamic Footer Year
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();



// ===== SPOTLIGHT DIGITAL SCANNER REVEAL =====
(function () {
    const spotlightCanvas = document.getElementById('spotlight-canvas');
    const spotlightSection = document.getElementById('spotlight-section');
    const scannerUI = document.getElementById('scanner-ui');
    const spotlightIcons = document.getElementById('spotlight-icons');

    const techStackIcons = [
        { name: 'React', emoji: '⚛️' }, { name: 'Next.js', emoji: '▲' }, { name: 'Angular', emoji: '🔴' },
        { name: 'TypeScript', emoji: '📘' }, { name: 'Node.js', emoji: '🟢' }, { name: 'MongoDB', emoji: '🍃' },
        { name: 'Tailwind', emoji: '💨' }, { name: 'Ionic', emoji: '📱' }, { name: 'Firebase', emoji: '🔥' },
        { name: 'MySQL', emoji: '🐬' }, { name: 'PHP', emoji: '🐘' }, { name: 'Git', emoji: '🌿' },
        { name: 'Python', emoji: '🐍' }, { name: 'Docker', emoji: '🐋' }, { name: 'AWS', emoji: '☁️' }, { name: 'Three.js', emoji: '🧊' }
    ];

    if (spotlightIcons) {
        spotlightIcons.innerHTML = techStackIcons.map(t => `
                    <div class="spotlight-icon">
                        <div class="testi-avatar-glow from-sky-500/20" style="opacity:0.4;inset:-15px"></div>
                        <div style="font-size:2.8rem;filter:drop-shadow(0 0 10px rgba(56,189,248,0.2))">${t.emoji}</div>
                        <span>${t.name}</span>
                    </div>`).join('');
    }

    let spotX = -500, spotY = -500;
    let iconCache = [];
    let spotlightRect = null;
    let particles = [];

    class Dust {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * (spotlightCanvas?.width || 1000);
            this.y = Math.random() * (spotlightCanvas?.height || 600);
            this.size = Math.random() * 2;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > spotlightCanvas.width || this.y < 0 || this.y > spotlightCanvas.height) this.reset();
        }
    }

    function refreshSpotlightCache() {
        if (!spotlightSection || !spotlightCanvas) return;
        spotlightRect = spotlightSection.getBoundingClientRect();
        spotlightCanvas.width = spotlightSection.offsetWidth;
        spotlightCanvas.height = spotlightSection.offsetHeight;

        const icons = document.querySelectorAll('.spotlight-icon');
        iconCache = Array.from(icons).map(icon => {
            const rect = icon.getBoundingClientRect();
            return {
                el: icon,
                cx: rect.left - spotlightRect.left + rect.width / 2,
                cy: rect.top - spotlightRect.top + rect.height / 2,
                driftX: 0, driftY: 0
            };
        });

        particles = Array.from({ length: 80 }, () => new Dust());
    }

    refreshSpotlightCache();
    window.addEventListener('resize', refreshSpotlightCache, { passive: true });

    spotlightSection.addEventListener('mousemove', (e) => {
        if (!spotlightRect) return;
        spotX = e.clientX - spotlightRect.left;
        spotY = e.clientY - spotlightRect.top;

        if (scannerUI) {
            scannerUI.style.opacity = '1';
            // Offset by radius (120px) to center on cursor
            scannerUI.style.transform = `translate3d(${e.clientX - 120}px, ${e.clientY - 120}px, 0)`;

            // Update readouts
            const xLabel = document.getElementById('scan-x');
            const yLabel = document.getElementById('scan-y');
            const strengthLabel = document.getElementById('scan-strength');
            if (xLabel) xLabel.innerText = e.clientX.toFixed(1);
            if (yLabel) yLabel.innerText = e.clientY.toFixed(1);
            if (strengthLabel) strengthLabel.innerText = (Math.random() * 20 + 80).toFixed(1);
        }
    }, { passive: true });


    spotlightSection.addEventListener('mouseleave', () => {
        spotX = -500; spotY = -500;
        if (scannerUI) scannerUI.style.opacity = '0';
    });

    function drawSpotlight() {
        const sctx = spotlightCanvas.getContext('2d');
        sctx.clearRect(0, 0, spotlightCanvas.width, spotlightCanvas.height);

        // Dust particles
        particles.forEach(p => {
            p.update();
            const dist = Math.hypot(p.x - spotX, p.y - spotY);
            if (dist < 200) {
                sctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * (1 - dist / 200)})`;
                sctx.beginPath(); sctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); sctx.fill();
            }
        });

        if (spotX > -100) {
            const gradient = sctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 200);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.3)');
            gradient.addColorStop(1, 'rgba(2,2,4,0.98)');
            sctx.fillStyle = gradient;
            sctx.fillRect(0, 0, spotlightCanvas.width, spotlightCanvas.height);

            // Scanline edge
            sctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
            sctx.lineWidth = 1;
            sctx.beginPath(); sctx.arc(spotX, spotY, 140, 0, Math.PI * 2); sctx.stroke();

            iconCache.forEach(icon => {
                const dx = icon.cx - spotX;
                const dy = icon.cy - spotY;
                const dist = Math.hypot(dx, dy);
                const reveal = Math.max(0.04, 1 - dist / 240); // Increased range

                if (dist < 240) {
                    icon.el.classList.add('scanned');
                    icon.el.style.opacity = reveal;
                    // Kinetic 'Snap' effect
                    const snap = (1 - dist / 240) * 15;
                    icon.driftX += ((-dx / dist || 0) * snap - icon.driftX) * 0.15;
                    icon.driftY += ((-dy / dist || 0) * snap - icon.driftY) * 0.15;
                    icon.el.style.transform = `translate3d(${icon.driftX}px, ${icon.driftY}px, 0) scale3d(${0.9 + reveal * 0.2}, ${0.9 + reveal * 0.2}, 1)`;
                    icon.el.style.filter = `brightness(${1 + reveal * 0.5}) drop-shadow(0 0 ${reveal * 20}px rgba(56,189,248,0.3))`;
                } else {
                    icon.el.classList.remove('scanned');
                    icon.el.style.opacity = '0.04';
                    icon.el.style.transform = 'translate3d(0, 0, 0) scale3d(0.9, 0.9, 1)';
                    icon.el.style.filter = 'none';
                }
            });
        } else {
            sctx.fillStyle = '#020204';
            sctx.fillRect(0, 0, spotlightCanvas.width, spotlightCanvas.height);
        }
        requestAnimationFrame(drawSpotlight);
    }
    drawSpotlight();
})();


// ===== THREE.JS FLOATING HERO OBJECT =====
(function () {
    if (typeof THREE === 'undefined') return;
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4';
    const heroSection = document.querySelector('section:first-of-type');
    if (!heroSection) return;
    heroSection.style.position = 'relative';
    heroSection.appendChild(container);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 100);
    camera.position.z = 3.5;

    const geo = new THREE.IcosahedronGeometry(1, 1);
    const mat = new THREE.MeshPhongMaterial({
        color: 0x38bdf8, emissive: 0x0a2a40, wireframe: false,
        transparent: true, opacity: 0.15,
        shininess: 100
    });
    const meshFill = new THREE.Mesh(geo, mat);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.25 });
    const meshWire = new THREE.Mesh(geo, wireMat);

    const group = new THREE.Group();
    group.add(meshFill); group.add(meshWire);
    group.position.set(2.5, 0, 0);
    scene.add(group);

    const light1 = new THREE.PointLight(0x38bdf8, 2, 10);
    light1.position.set(3, 3, 3);
    const light2 = new THREE.PointLight(0xc084fc, 1.5, 10);
    light2.position.set(-3, -2, 2);
    scene.add(light1, light2, new THREE.AmbientLight(0xffffff, 0.1));

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    function animThree() {
        requestAnimationFrame(animThree);
        const t = Date.now() * 0.001;
        group.rotation.x = t * 0.3 + scrollY * 0.002;
        group.rotation.y = t * 0.5;
        group.position.y = Math.sin(t * 0.7) * 0.3;
        renderer.render(scene, camera);
    }
    animThree();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
})();

// ===== TESTIMONIAL CAROUSEL LOGIC =====
(function () {
    const testiContainer = document.querySelector('#testimonial-section .marquee-container');
    const prevTesti = document.getElementById('prev-testi');
    const nextTesti = document.getElementById('next-testi');
    const testiCurrent = document.getElementById('testi-current');
    const testiProgress = document.getElementById('testi-progress');

    if (testiContainer && prevTesti && nextTesti) {
        const updateTestiUI = () => {
            const scrollLeft = testiContainer.scrollLeft;
            const containerWidth = testiContainer.clientWidth;
            const maxScroll = testiContainer.scrollWidth - containerWidth;

            const testiCards = testiContainer.querySelectorAll('.testi-card');
            if (testiCards.length === 0) return;

            const cardWidth = testiCards[0].offsetWidth + 32;
            const currentIndex = Math.min(testiCards.length - 1, Math.round(scrollLeft / cardWidth));

            if (testiCurrent) testiCurrent.textContent = (currentIndex + 1).toString().padStart(2, '0');
            if (testiProgress) {
                const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
                testiProgress.style.width = `${Math.max(15, progress)}%`;
            }
        };

        nextTesti.addEventListener('click', () => {
            const card = testiContainer.querySelector('.testi-card');
            if (card) {
                const amount = card.offsetWidth + 32;
                testiContainer.scrollBy({ left: amount, behavior: 'smooth' });
            }
        });

        prevTesti.addEventListener('click', () => {
            const card = testiContainer.querySelector('.testi-card');
            if (card) {
                const amount = card.offsetWidth + 32;
                testiContainer.scrollBy({ left: -amount, behavior: 'smooth' });
            }
        });

        testiContainer.addEventListener('scroll', updateTestiUI, { passive: true });
        window.addEventListener('resize', updateTestiUI, { passive: true });
        updateTestiUI();
    }
})();
