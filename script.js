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
    }, { duration: 150, fill: "forwards" });

    cursorRing2.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 300, fill: "forwards" });

    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            if (entry.target.classList.contains('section-light')) {
                isCurrentSectionLight = true;
                document.body.classList.add('light-section-active');
                header.classList.add('header-light');
            } else if (entry.target.classList.contains('section-dark')) {
                isCurrentSectionLight = false;
                document.body.classList.remove('light-section-active');
                header.classList.remove('header-light');
            }

            const theme = entry.target.closest('section')?.dataset.theme;
            if (theme && theme !== AppData.theme.current) {
                changeTheme(theme);
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(el => observer.observe(el));
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const changeTheme = (themeName) => {
    AppData.theme.current = themeName;
    const color = AppData.theme.colors[themeName];
    document.documentElement.style.setProperty('--theme-color', color);

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
                ctx.fillStyle = '#000000';
                ctx.globalAlpha = 0.05;
            } else {
                ctx.fillStyle = AppData.theme.colors[AppData.theme.current];
                ctx.globalAlpha = 0.3;
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 150; i++) particles.push(new Particle());

    const animate = () => {
        if (isCurrentSectionLight) {
            ctx.fillStyle = 'rgba(248, 250, 252, 0.4)';
        } else {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
        }
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
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
        list.innerHTML = items.split(",").map(d => `
            <li class="flex items-start gap-3">
                <i class="fas fa-angle-right mt-1 text-brand-${AppData.theme.current}"></i>
                <span>${d.trim()}</span>
            </li>
        `).join('');

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
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

const handleFormSubmit = (e) => {
    e.preventDefault();
    const btn1 = document.getElementById('btn-text-1');
    const btn2 = document.getElementById('btn-text-2');
    const form = document.getElementById('contact-form');

    btn2.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    setTimeout(() => {
        btn2.innerHTML = '<i class="fas fa-check"></i> Protocol Sent!';
        btn2.parentElement.classList.remove('bg-black', 'text-white');
        btn2.parentElement.classList.add('bg-green-500', 'text-white');
        form.reset();

        const formData = new FormData(form);
        fetch("https://formspree.io/f/xldqkdvz", {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).catch(err => console.log('Silently handled for demo purposes'));

        setTimeout(() => {
            btn2.innerHTML = 'Initialize <i class="fas fa-paper-plane ml-2"></i>';
            btn2.parentElement.classList.add('bg-black', 'text-white');
            btn2.parentElement.classList.remove('bg-green-500', 'text-white');
        }, 3000);
    }, 1500);
};

window.addEventListener('load', () => {
    const el = document.getElementById('typewriter');
    const text = el.innerText;
    el.innerText = '';
    let i = 0;
    const type = () => {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    };
    setTimeout(type, 500);
});

const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

const refPasswordInput = document.getElementById('ref-password');
const refUnlockBtn = document.getElementById('ref-unlock-btn');
const refLockDiv = document.getElementById('reference-lock');
const refContentDiv = document.getElementById('reference-content');
const refError = document.getElementById('ref-error');

const ACCESS_CODE = "VTT17";

const referenceData = [
    {
        name: "Prof. Dr. Nihal BEKTAŞ",
        title: "Head of Environmental Engineering Department at Gebze Technical University",
        phone: "+90 532 701 97 00",
        email: "nbektas@gtu.edu.tr"
    },
    {
        name: "Prof. Dr. Mehmet Salim ÖNCEL",
        title: "Head of Earth and Marine Science Institute at Gebze Technical University",
        phone: "+90 532 416 06 86",
        email: "soncel@gtu.edu.tr"
    },
    {
        name: "Prof. Dr. Hüseyin Cengiz YATMAZ",
        title: "Lecturer at Environmental Engineering Department at Gebze Technical University",
        phone: "+90 532 778 01 25",
        email: "yatmaz@gtu.edu.tr"
    },
    {
        name: "Assoc. Prof. Meltem KOÇAL ÇELEN",
        title: "Deputy Director of Earth and Marine Science Institute at Gebze Technical University",
        phone: "+90 533 214 56 52",
        email: "mkocal@gtu.edu.tr"
    },
    {
        name: "Prof. Dr. Hatice İNAN",
        title: "Lecturer at Environmental Engineering Department at Gebze Technical University",
        phone: "++90 533 335 00 88",
        email: "inan@gtu.edu.tr"
    },
    {
        name: "Muammer ELMASTAŞ",
        title: "Quality Management Officer at Altınyaldız Space Frame Factory",
        phone: "+90 535 832 45 25",
        email: "muammerelmastas@altinyaldız.com.tr"
    }
];

const renderReferences = () => {
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
    referenceData.forEach(ref => {
        html += `
            <div class="glass-card-light p-8 relative interactive-card group cursor-hover">
                <div class="absolute w-2 h-2 rounded-full bg-brand-${AppData.theme.current} top-8 right-8 theme-bg animate-pulse"></div>
                <h3 class="text-2xl font-bold text-black mb-1 group-hover:text-brand-${AppData.theme.current} transition-colors theme-hover-text">${ref.name}</h3>
                <p class="text-sm font-mono text-gray-600 mb-6 border-b border-black/5 pb-4">${ref.title}</p>
                <div class="space-y-3 font-mono text-sm">
                    <div class="flex items-center gap-3 text-black">
                        <div class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-brand-${AppData.theme.current} theme-text"><i class="fas fa-phone"></i></div>
                        ${ref.phone}
                    </div>
                    <div class="flex items-center gap-3 text-black">
                        <div class="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-brand-${AppData.theme.current} theme-text"><i class="fas fa-envelope"></i></div>
                        <a href="mailto:${ref.email}" class="hover:text-brand-${AppData.theme.current} transition-colors theme-hover-text">${ref.email}</a>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    refContentDiv.innerHTML = html;
};

const handleUnlock = () => {
    if (refPasswordInput.value === ACCESS_CODE) {
        refError.classList.add('opacity-0');
        refLockDiv.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            refLockDiv.style.display = 'none';
            refContentDiv.classList.remove('hidden');
            renderReferences();

            document.querySelectorAll('#reference-content .interactive-card').forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
            });

            void refContentDiv.offsetWidth;
            refContentDiv.classList.remove('opacity-0');
        }, 300);
    } else {
        refError.classList.remove('opacity-0');
        refLockDiv.classList.add('animate-shake');
        setTimeout(() => refLockDiv.classList.remove('animate-shake'), 400);
        refPasswordInput.value = '';
    }
};

refUnlockBtn?.addEventListener('click', handleUnlock);
refPasswordInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUnlock();
});
