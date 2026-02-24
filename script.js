import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * 
 * Handles: Dynamic Content, Theme Toggling, Parallax Doodles, and Marquee
 */

// --- 1. DATA DEFINITIONS ---

const certifications = [
    { title: "Front End Web Developer Certification", provider: "Infosys | Springboard", color: "bg-[#0F172A] dark:bg-[#0a0f1d]", date: "Dec 31, 2025", verified: true },
    { title: "MongoDB Database Admin Path", provider: "MongoDB University", color: "bg-[#023430] dark:bg-[#012623]", date: "Dec 30, 2025", verified: true },
    { title: "HTML5 - The Language", provider: "Infosys | Springboard", color: "bg-[#431407] dark:bg-[#2d0e05]", date: "Dec 31, 2025", verified: true },
    { title: "JavaScript", provider: "Infosys | Springboard", color: "bg-[#1E1B4B] dark:bg-[#12102e]", date: "Dec 31, 2025", verified: true },
    { title: "CSS3", provider: "Infosys | Springboard", color: "bg-[#2E1065] dark:bg-[#1c0a3d]", date: "Dec 31, 2025", verified: true },
    { title: "The Complete Git Guide", provider: "Infosys | Springboard", color: "bg-[#450A0A] dark:bg-[#2e0707]", date: "Jan 03, 2026", verified: true },
    { title: "Node JS: Advanced Concepts", provider: "Infosys | Springboard", color: "bg-[#064E3B] dark:bg-[#043327]", date: "Dec 31, 2025", verified: true },
    // ADDED: Java Certification Placeholder
    { title: "Java Programming Masterclass", provider: "Software Academy", color: "bg-[#5382a1] dark:bg-[#2c4454]", date: "2026", verified: false }
];

const works = [
    { title: "Serenity App", desc: "A high-performance meditation tool designed for emotional grounding with custom audio visualizations.", tags: ["React", "Audio API"], lightBg: "bg-[#E8F5E9]", darkBg: "dark:bg-[#0d1f11]", accent: "text-[#1B5E20] dark:text-[#00FF9D]" },
    { title: "Cloud Notes", desc: "A distraction-free writing environment with real-time markdown rendering and cloud sync.", tags: ["Next.js", "Firebase"], lightBg: "bg-[#F3E5F5]", darkBg: "dark:bg-[#140d1f]", accent: "text-[#9575CD] dark:text-[#BC00FF]" },
    { title: "Minimalist E-comm", desc: "A refined boutique shopping experience focused on fluid typography and minimal UI.", tags: ["Stripe", "UI Design"], lightBg: "bg-[#FCE4EC]", darkBg: "dark:bg-[#1f0d10]", accent: "text-[#800020] dark:text-[#FF2D55]" },
    { title: "Vibe Player", desc: "A spatial audio music player that adapts its entire UI color palette to the album art.", tags: ["Canvas", "TS"], lightBg: "bg-[#FDF5E6]", darkBg: "dark:bg-[#1f1a0d]", accent: "text-[#3E2723] dark:text-[#FFCC00]" }
];

const socials = [
    { icon: "github", url: "#", color: "group-hover:text-[#181717] dark:group-hover:text-white" },
    { icon: "linkedin", url: "#", color: "group-hover:text-[#0077B5] dark:group-hover:text-[#0A66C2]" },
    { icon: "briefcase", url: "#", color: "group-hover:text-[#29b2fe]" },
    { icon: "instagram", url: "#", color: "group-hover:text-[#E4405F]" },
    { icon: "youtube", url: "#", color: "group-hover:text-[#FF0000]" },
    { icon: "message-square", url: "#", color: "group-hover:text-[#5865F2]" },
    { icon: "music", url: "#", color: "group-hover:text-black dark:group-hover:text-white" }
];

const doodleData = [
    { type: 'brackets', top: '15%', left: '8%', factor: 0.025, color: '#800020', darkColor: '#FF2D55' },
    { type: 'binary', top: '65%', left: '82%', factor: 0.045, color: '#1B5E20', darkColor: '#00FF9D' },
    { type: 'curly', top: '78%', left: '12%', factor: 0.035, color: '#9575CD', darkColor: '#BC00FF' },
    { type: 'hexagon', top: '22%', left: '75%', factor: 0.055, color: '#3E2723', darkColor: '#FFCC00' },
    { type: 'terminal', top: '45%', left: '18%', factor: 0.02, color: '#1B5E20', darkColor: '#00FF9D' },
    { type: 'circle', top: '85%', left: '60%', factor: 0.04, color: '#9575CD', darkColor: '#BC00FF' }
];

// --- 2. INITIALIZATION ---

window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    initSocials();
    initMarquee();
    initWorks();
    initDoodles();
    setupThemeToggle();
    setupParallaxEffect();
    setupContactForm();
});

// --- 3. UI POPULATION FUNCTIONS ---

function initSocials() {
    const container = document.getElementById('social-icons');
    const footerContainer = document.getElementById('footer-socials');
    socials.forEach(s => {
        const anchorHtml = `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="w-14 h-14 flex items-center justify-center rounded-[1.25rem] bg-white dark:bg-white/5 shadow-sm border border-white dark:border-white/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
            <i data-lucide="${s.icon}" class="w-5 h-5 text-gray-300 transition-colors duration-300 ${s.color}"></i>
        </a>`;
        if (container) container.innerHTML += anchorHtml;
        if (footerContainer) footerContainer.innerHTML += anchorHtml;
    });
    lucide.createIcons();
}

function initMarquee() {
    const container = document.getElementById('marquee-list');
    if (!container) return;
    const items = [...certifications, ...certifications];
    items.forEach((c, idx) => {
        container.innerHTML += `
        <div class="flex-shrink-0 w-80 mx-3 group">
            <div class="h-60 rounded-[2.5rem] ${c.color} border border-white/10 p-8 flex flex-col justify-between transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 shadow-lg">
                <div class="flex justify-between items-start">
                    <div class="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10">
                        <i data-lucide="award" class="text-white/80 w-5 h-5"></i>
                    </div>
                    ${c.verified ? `
                    <div class="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                        <i data-lucide="check-circle" class="w-3 h-3 text-green-400"></i>
                        <span class="text-[8px] font-bold text-green-400 uppercase tracking-tighter">Verified</span>
                    </div>` : ''}
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white leading-tight mb-2">${c.title}</h3>
                    <p class="text-[10px] font-bold uppercase text-white/50">${c.provider}</p>
                    <p class="text-[9px] font-medium text-white/30 mt-3 flex items-center gap-1">
                        <i data-lucide="arrow-up-right" class="w-3 h-3"></i> Issued: ${c.date}
                    </p>
                </div>
            </div>
        </div>`;
    });
    lucide.createIcons();
}

function initWorks() {
    const grid = document.getElementById('works-grid');
    if (!grid) return;
    works.forEach((w, idx) => {
        const isOffset = idx % 2 !== 0;
        grid.innerHTML += `
        <div class="group relative ${isOffset ? 'md:mt-12' : ''}">
            <div class="relative overflow-hidden rounded-[3rem] ${w.lightBg} ${w.darkBg} p-8 md:p-12 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2 border border-white/50 dark:border-white/5 h-[450px] flex flex-col justify-end">
                <div class="absolute top-0 right-0 p-12 opacity-10 dark:opacity-5 group-hover:opacity-20 transition-opacity">
                    <i data-lucide="briefcase" class="w-24 h-24 dark:text-white" stroke-width="1"></i>
                </div>
                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-6">
                        <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-sm">
                            <span class="text-sm font-black ${w.accent}">0${idx + 1}</span>
                        </div>
                        <a href="#" class="p-3 bg-white/50 dark:bg-white/10 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white dark:hover:bg-white/20 hover:scale-110">
                            <i data-lucide="arrow-up-right" class="text-gray-700 dark:text-white w-5 h-5"></i>
                        </a>
                    </div>
                    <h3 class="text-3xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">${w.title}</h3>
                    <p class="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 font-light line-clamp-3 group-hover:line-clamp-none transition-all duration-500">${w.desc}</p>
                    <div class="flex flex-wrap gap-2">
                        ${w.tags.map(t => `<span class="text-[9px] font-black uppercase tracking-widest bg-white/80 dark:bg-white/5 px-4 py-2 rounded-full text-gray-400 dark:text-gray-500 border border-white/20 dark:border-white/5">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    });
    lucide.createIcons();
}

function initDoodles() {
    const container = document.getElementById('doodle-container');
    if (!container) return;
    doodleData.forEach((d, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'absolute transition-all duration-700 ease-out pointer-events-none opacity-25 dark:opacity-50 doodle-item';
        wrapper.style.top = d.top;
        wrapper.style.left = d.left;
        wrapper.dataset.factor = d.factor;
        wrapper.innerHTML = `<svg width="60" height="60" viewBox="0 0 24 24" class="doodle-glow transition-colors duration-500"></svg>`;
        container.appendChild(wrapper);
    });
    updateDoodleIcons();
}

function updateDoodleIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.doodle-item').forEach((el, idx) => {
        const data = doodleData[idx];
        const activeColor = isDark ? data.darkColor : data.color;
        const svg = el.querySelector('svg');
        svg.style.color = activeColor;
        let path = "";
        switch (data.type) {
            case 'brackets': path = '<path d="M7 8l-4 4 4 4 M17 8l4 4-4 4" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; break;
            case 'curly': path = '<path d="M8 3c-1 0-2 1-2 2v4c0 1-1 1-1 2s1 1 1 2v4c0 1 1 2 2 2 M16 3c1 0 2 1 2 2v4c0 1 1 1 1 2s-1 1-1 2v4c0 1-1 2-2 2" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; break;
            case 'binary': path = `<text x="0" y="15" fill="currentColor" font-weight="bold" font-family="monospace" font-size="14">01</text>`; break;
            case 'terminal': path = '<path d="M4 17l6-6-6-6 M12 19h8" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; break;
            case 'hexagon': path = '<path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" stroke="currentColor" stroke-width="2" fill="none"/>'; break;
            default: path = '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/>';
        }
        svg.innerHTML = path;
    });
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        updateDoodleIcons();
    });
}

function setupParallaxEffect() {
    window.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = e.clientX - centerX;
        const moveY = e.clientY - centerY;
        document.querySelectorAll('.doodle-item').forEach(el => {
            const factor = parseFloat(el.dataset.factor);
            el.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });
}

// --- 4. FIREBASE INTEGRATION ---

const firebaseConfig = {
    apiKey: "AIzaSyCVZbRxhHCuYC6iWi-fSAo34QMJvADdNtU",
    authDomain: "portfolio-33575.firebaseapp.com",
    projectId: "portfolio-33575",
    storageBucket: "portfolio-33575.firebasestorage.app",
    messagingSenderId: "640492773089",
    appId: "1:640492773089:web:aa9e8a5ea398bbaeef61a0",
    measurementId: "G-FKWYWN1J9E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button');
        const originalContent = submitBtn.innerHTML;

        // Get form data
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const messageInput = form.querySelector('textarea');

        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
            timestamp: serverTimestamp()
        };

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="relative z-10 flex items-center gap-2">Sending... <i data-lucide="loader" class="animate-spin w-4 h-4"></i></span>';
        lucide.createIcons();

        try {
            // Save to Firestore
            await addDoc(collection(db, "portfolio_messages"), formData);

            submitBtn.innerHTML = '<span class="relative z-10">Message Sent Successfully!</span>';
            form.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                lucide.createIcons();
            }, 3000);
        } catch (error) {
            console.error("Error adding document: ", error);
            submitBtn.innerHTML = '<span class="relative z-10">Error Sending. Try Again.</span>';
            submitBtn.classList.add('bg-red-500');

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-red-500');
                lucide.createIcons();
            }, 3000);
        }
    });
}