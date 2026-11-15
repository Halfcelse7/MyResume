const AppData = {
    theme: { current: 'green', colors: { green: '#00ffaa', blue: '#0088ff' } }
};

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing1 = document.querySelector('.cursor-ring-1');
const cursorRing2 = document.querySelector('.cursor-ring-2');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    cursorRing1.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 100, fill: "forwards" });

    cursorRing2.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 250, fill: "forwards" });

    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => { img.src = img.dataset.fallback; }, { once: true });
});

document.getElementById('contact-form')?.addEventListener('submit', (e) => handleFormSubmit(e));
document.getElementById('modal-close')?.addEventListener('click', () => closeModal());

document.querySelectorAll('.cursor-hover, a, button, .interactive-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

document.querySelectorAll('.tilt-element').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        el.style.transition = 'transform 0.5s ease';
        setTimeout(() => el.style.transition = '', 500);
    });
});

let isCurrentSectionLight = false;
const header = document.getElementById('header');
const body = document.body;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
            
            if(entry.target.classList.contains('section-light')) {
                isCurrentSectionLight = true;
                body.classList.add('light-section-active');
                header.classList.add('header-light');
            } else if (entry.target.classList.contains('section-dark')) {
                isCurrentSectionLight = false;
                body.classList.remove('light-section-active');
                header.classList.remove('header-light');
            }

            const theme = entry.target.dataset.theme;
            if(theme && theme !== AppData.theme.current) {
                changeTheme(theme);
            }
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('section').forEach(el => observer.observe(el));
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const changeTheme = (themeName) => {
    AppData.theme.current = themeName;
    const color = AppData.theme.colors[themeName];
    
    document.documentElement.style.setProperty('--theme-color', color);
    
    body.setAttribute('data-current-theme', themeName);
    
    const texts = document.querySelectorAll('.theme-text');
    const bgs = document.querySelectorAll('.theme-bg');
    const gradients = document.querySelectorAll('.theme-gradient');
    const borders = document.querySelectorAll('.theme-border');
    
    texts.forEach(el => {
        el.classList.remove('text-brand-green', 'text-brand-blue');
        el.classList.add(`text-brand-${themeName}`);
    });
    bgs.forEach(el => {
        el.classList.remove('bg-brand-green', 'bg-brand-blue');
        el.classList.add(`bg-brand-${themeName}`);
    });
    gradients.forEach(el => {
        el.classList.remove('via-brand-green', 'via-brand-blue');
        el.classList.add(`via-brand-${themeName}`);
    });
    
    document.querySelectorAll('.theme-hover-text').forEach(el => {
        el.classList.remove('hover:text-brand-green', 'hover:text-brand-blue', 'group-hover:text-brand-green', 'group-hover:text-brand-blue');
        el.classList.add(el.classList.contains('group') || el.closest('.group') ? `group-hover:text-brand-${themeName}` : `hover:text-brand-${themeName}`);
    });
    document.querySelectorAll('.theme-hover-bg').forEach(el => {
        el.classList.remove('hover:bg-brand-green', 'hover:bg-brand-blue', 'group-hover:bg-brand-green', 'group-hover:bg-brand-blue');
        el.classList.add('group-hover:bg-brand-' + themeName);
    });
    document.querySelectorAll('.theme-hover-border').forEach(el => {
        el.classList.remove('hover:border-brand-green', 'hover:border-brand-blue', 'group-hover:border-brand-green', 'group-hover:border-brand-blue');
        el.classList.add(el.classList.contains('group') || el.closest('.group') ? `group-hover:border-brand-${themeName}` : `hover:border-brand-${themeName}`);
    });
};

const initCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
            if (this.x > width || this.x < 0) this.speedX *= -1;
        }
        draw() {
            if (isCurrentSectionLight) {
                 ctx.fillStyle = AppData.theme.colors[AppData.theme.current];
                 ctx.globalAlpha = 0.15;
            } else {
                 ctx.fillStyle = AppData.theme.colors[AppData.theme.current];
                 ctx.globalAlpha = 0.3;
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for(let i=0; i<150; i++) particles.push(new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        for(let i=0; i<particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    };
    animate();
};
initCanvas();

const modal = document.getElementById('skillModal');
const modalContent = document.getElementById('modal-content');

document.querySelectorAll(".skill-card").forEach(card => {
    card.addEventListener("click", () => {
        const title = card.dataset.title;
        const items = card.dataset.items;
        const iconClass = card.querySelector('i').className.replace(/text-\w+.*?(?=\s|$)/g, ''); 

        if (!title || !items) return;

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modal-icon').className = `${iconClass.trim()} w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl theme-text border border-white/10`;
        document.getElementById('modal-icon').classList.add(`text-brand-${AppData.theme.current}`);
        
        const list = document.getElementById('modalList');
        list.replaceChildren(...items.split(",").map(d => {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-3';
            const ic = document.createElement('i');
            ic.className = `fas fa-angle-right mt-1 text-brand-${AppData.theme.current}`;
            const sp = document.createElement('span');
            sp.textContent = d.trim();
            li.append(ic, sp);
            return li;
        }));

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
        document.body.style.overflow = 'hidden';
    });
});

const closeModal = () => {
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }, 300);
};

modal?.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

const handleFormSubmit = (e) => {
    e.preventDefault();
    const btn2 = document.getElementById('btn-text-2');
    const status = document.getElementById('form-status');
    const form = document.getElementById('contact-form');
    const original = btn2.innerHTML;

    status.classList.add('hidden');
    btn2.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const fail = () => {
        btn2.innerHTML = original;
        status.textContent = 'Message could not be sent. Please try again or email me directly.';
        status.classList.remove('hidden');
    };

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            window.location.href = 'thank-you.html';
        } else {
            fail();
        }
    }).catch(fail);
};

window.addEventListener('load', () => {
    const el = document.getElementById('typewriter');
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    let i = 0;
    const type = () => {
        if (i < text.length) {
            i++;
            el.textContent = text.slice(0, i);
            setTimeout(type, 100);
        }
    };
    setTimeout(type, 500);

    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});


// References are intentionally NOT stored in this public repo.
// The button pre-fills the contact form so recruiters can request them privately.
document.getElementById('ref-request-btn')?.addEventListener('click', () => {
    const msg = document.getElementById('message');
    if (msg && !msg.value.trim()) {
        msg.value = 'Hello İsmet, I would like to request your professional references.';
    }
});

// FAQ Accordion Logic
document.querySelectorAll('.faq-button').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const answer = button.nextElementSibling;
        const icon = button.querySelector('i');

        // Close all other open FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').style.maxHeight = null;
                item.querySelector('i').style.transform = 'rotate(0deg)';
                item.classList.remove('bg-white/40'); // Remove active highlight
            }
        });

        // Toggle the clicked FAQ
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
            faqItem.classList.remove('bg-white/40');
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.style.transform = 'rotate(180deg)';
            faqItem.classList.add('bg-white/40'); // Add active highlight
        }
    });
});