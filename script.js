// ============================================
// Navigation & Sayfa Başına Dönüş Sistemi
// ============================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navBackdrop = document.getElementById('navBackdrop');

// Mobil Menü Aç/Kapa Fonksiyonu (Backdrop & Body Scroll Kilidi ile)
function toggleMobileMenu(open) {
    const shouldOpen = (open !== undefined) ? open : !navMenu?.classList.contains('active');
    if (shouldOpen) {
        hamburger?.classList.add('active');
        navMenu?.classList.add('active');
        navBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        navBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
    }
}
window.toggleMobileMenu = toggleMobileMenu;

// Sayfa Başına Yumuşak Dönüş Fonksiyonu (Lenis + Native Scroll)
function sayfaBasaDon(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Mobil menü açıksa kapat
    toggleMobileMenu(false);
}
window.sayfaBasaDon = sayfaBasaDon;

// Navbar & Scroll to Top Button Görünürlük Kontrolü
function handlePageScroll() {
    const currentScrollY = window.scrollY || (window.lenis ? window.lenis.scroll : 0);
    
    // Navbar daima ekranda SABİT (sticky) kalır, kaydırılınca cam & altın vurgulu temaya geçer
    if (currentScrollY > 20) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }

    // Yukarı Çık Butonu (300px aşağı inilince göster)
    const yukariBtn = document.getElementById('yukari-cik-btn');
    if (yukariBtn) {
        if (currentScrollY > 300) {
            yukariBtn.classList.add('goster');
        } else {
            yukariBtn.classList.remove('goster');
        }
    }
}

window.addEventListener('scroll', handlePageScroll, { passive: true });

// Active navigation on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavOnScroll, { passive: true });

// Smooth scroll for all links & Logo clicks
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId) return;

        // #, #home, #top tıklandığında doğrudan en tepeye yumuşak kaydır
        if (targetId === '#' || targetId === '#home' || targetId === '#top') {
            e.preventDefault();
            sayfaBasaDon(e);
            return;
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();
            const offsetTop = targetSection.offsetTop - 80;
            if (window.lenis) {
                window.lenis.scrollTo(offsetTop, { duration: 1.2 });
            } else {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            toggleMobileMenu(false);
        }
    });
});

// Logo tıklamalarında ana sayfaya dönüş
document.querySelectorAll('#site-logo, #footer-logo, .logo, .footer-logo').forEach(logo => {
    logo.addEventListener('click', sayfaBasaDon);
});

// Mobile menu toggle & Backdrop click
if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
}

if (navBackdrop) {
    navBackdrop.addEventListener('click', () => {
        toggleMobileMenu(false);
    });
}

// ============================================
// Filter Functionality
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        const parentSection = button.closest('section');
        const productCards = parentSection.querySelectorAll('.product-card');

        // Update active button
        const sectionFilterBtns = parentSection.querySelectorAll('.filter-btn');
        sectionFilterBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter products
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = '';
                }, 300);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});



// ============================================
// Product Gallery System - Yeni sistem aşağıda (GALERI MODAL LIGHTBOX)
// ============================================

// ============================================
// Product Details
// ============================================
window.handleImageError = function(img) {
    if (img.dataset.errorHandled) return;
    img.dataset.errorHandled = true;
    const svgPlaceholder = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad-err" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e2025;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0e0f13;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#grad-err)"/>
        <text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#666" text-anchor="middle" dominant-baseline="middle">Kılıç Koltuk Mobilya</text>
    </svg>`;
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgPlaceholder)));
};

const detailButtons = document.querySelectorAll('.btn-details');

detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const productCard = btn.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        // Bildirim devre dışı - yakında detay sayfası eklenecek
        // showNotification(`${productTitle} için detay sayfası hazırlanıyor...`, 'info');
    });
});

// ============================================
// Contact Form
// ============================================
const contactForm = document.getElementById('contact-form');

function saveLocalContactMessage(messageData) {
    const defaults = [
        {
            ad: 'Demo Müşteri',
            telefon: '0538 602 90 31',
            email: 'kilicadil2612@gmail.com',
            mesaj: 'Demo iletişim mesajı',
            tarih: new Date().toISOString()
        }
    ];

    try {
        const list = JSON.parse(localStorage.getItem('kilickoltuk_mesajlar') || JSON.stringify(defaults));
        list.unshift({
            ...messageData,
            tarih: new Date().toISOString()
        });
        localStorage.setItem('kilickoltuk_mesajlar', JSON.stringify(list));
    } catch (error) {
        console.warn('Local contact save failed:', error);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const messageData = {
            ad: document.getElementById('contact-name')?.value?.trim() || '',
            telefon: (document.getElementById('contact-form-phone') || document.getElementById('contact-phone'))?.value?.trim() || '',
            email: document.getElementById('contact-email')?.value?.trim() || '',
            mesaj: document.getElementById('contact-message')?.value?.trim() || ''
        };

        if (!messageData.ad || !messageData.telefon || !messageData.email || !messageData.mesaj) {
            showNotification('Lütfen tüm alanları doldurun.', 'warning');
            return;
        }

        const payload = {
            action: 'add_message',
            ...messageData
        };

        showNotification('Mesajınız gönderiliyor...', 'info');

        try {
            const isServer = window.location.protocol.startsWith('http');
            if (isServer) {
                const response = await fetch('api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (response.ok && result && result.status === 'success') {
                    showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                    contactForm.reset();
                    return;
                }

                throw new Error(result && result.message ? result.message : 'Sunucu hatası');
            }

            throw new Error('Local environment');
        } catch (error) {
            saveLocalContactMessage(messageData);
            showNotification('Mesajınız başarıyla iletildi! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
            contactForm.reset();
        }
    });
}

// (Yukarı çık butonu ve sayfa başına dönüş sistemi üst blokta tanımlandı)

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3.7s;
                min-width: 350px;
                max-width: 450px;
                border-left: 4px solid #D4AF37;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
                border-left: 5px solid #047857 !important;
                color: #ffffff !important;
                box-shadow: 0 12px 28px -5px rgba(16, 185, 129, 0.45), 0 8px 12px -6px rgba(16, 185, 129, 0.3) !important;
            }
            
            .notification-info {
                border-left-color: #D4AF37;
            }
            
            .notification-warning {
                border-left-color: #FF9800;
            }
            
            .notification-error {
                border-left-color: #F44336;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.25rem;
            }
            
            .notification-success .notification-content i {
                color: #ffffff !important;
                background: rgba(255, 255, 255, 0.22);
                width: 34px;
                height: 34px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-size: 1.1rem;
            }
            
            .notification-info .notification-content i {
                color: #D4AF37;
            }
            
            .notification-warning .notification-content i {
                color: #FF9800;
            }
            
            .notification-error .notification-content i {
                color: #F44336;
            }
            
            .notification-content span {
                color: #000;
                font-weight: 500;
            }

            .notification-success .notification-content span {
                color: #ffffff !important;
                font-weight: 600;
                font-size: 0.95rem;
                letter-spacing: 0.2px;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
                padding: 0.25rem;
                transition: color 0.2s;
            }
            
            .notification-success .notification-close {
                color: rgba(255, 255, 255, 0.85) !important;
            }

            .notification-success .notification-close:hover {
                color: #ffffff !important;
            }
            
            .notification-close:hover {
                color: #333;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(500px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            @media (max-width: 640px) {
                .notification {
                    min-width: auto;
                    max-width: calc(100vw - 40px);
                    left: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// ============================================
// Scroll Animation
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = '';
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animation
const animateOnScroll = document.querySelectorAll('.product-card, .feature-item, .info-card');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// Placeholder Images
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    generatePlaceholderImages();

    console.log('%c✨ Kılıç Koltuk Mobilya Web Sitesi', 'font-size: 20px; font-weight: bold; color: #D4AF37; background: #000; padding: 10px;');
    console.log('%c🎨 Renk Teması: Altın Sarısı & Siyah', 'font-size: 14px; color: #D4AF37;');
    console.log('%c📋 Kategoriler: Oturma Odası, Yatak Odası, Yemek Odası', 'color: #666;');
    console.log('%c🎯 Renk Katalogları: Sağ tarafta panel - Koltuk ve Yatak Başlıkları için', 'color: #D4AF37; font-weight: bold;');
});

function generatePlaceholderImages() {
    const images = document.querySelectorAll('.product-img, .catalog-image');

    images.forEach((img, index) => {
        // Sadece placeholder.jpg olan görselleri değiştir
        if (img.src.includes('placeholder.jpg') || img.getAttribute('src') === 'placeholder.jpg') {
            const gradients = [
                'linear-gradient(135deg, #1a1a1a, #0c0d0f)',
                'linear-gradient(135deg, #2a2c33, #15161a)',
                'linear-gradient(135deg, #1f2127, #111215)'
            ];

            const gradient = gradients[index % gradients.length];

            const svgPlaceholder = `
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#22242a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0d0e12;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#grad-${index})"/>
            </svg>
        `;

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgPlaceholder)));
        }
    });

    // About image
    const aboutImg = document.getElementById('about-img');
    if (aboutImg && (aboutImg.src.includes('placeholder.jpg') || aboutImg.getAttribute('src') === 'placeholder.jpg')) {
        const svgPlaceholder = `
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-about" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#grad-about)"/>
                <text x="50%" y="50%" font-family="Playfair Display, serif" font-size="40" 
                      font-weight="700" fill="#D4AF37" text-anchor="middle" dominant-baseline="middle">
                    Hakkımızda
                </text>
            </svg>
        `;
        aboutImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgPlaceholder)));
    }
}

// ============================================
// Update Functions
// ============================================
window.updateContactInfo = function (info) {
    if (info.address) document.getElementById('contact-address').textContent = info.address;
    if (info.phone) document.getElementById('contact-phone').textContent = info.phone;
    if (info.email) document.getElementById('contact-email').textContent = info.email;

    showNotification('İletişim bilgileri güncellendi!', 'success');
}

window.updateHeroBackground = function (imageUrl) {
    const heroBackground = document.getElementById('hero-bg');
    heroBackground.style.backgroundImage = `url(${imageUrl})`;
    showNotification('Arka plan görseli güncellendi!', 'success');
}

// ============================================
// Console Help Messages
// ============================================
console.log('\n%c📌 Kullanım Örnekleri:', 'font-size: 16px; font-weight: bold; color: #D4AF37; margin-top: 10px;');
console.log(`
// İletişim bilgilerini güncelle:
updateContactInfo({
    address: "Adresiniz",
    phone: "Telefon numaranız",
    email: "E-posta adresiniz"
});

// Hero arka plan görselini güncelle:
updateHeroBackground("magaza.jpg");
`);

console.log('%c🎨 Renk Katalogları sistemi aktif!', 'color: #D4AF37; font-weight: bold;');
console.log('%c📂 Katalog Görselleri (web sitesi klasörüne ekleyin):', 'color: #666; font-weight: bold;');
console.log('%c   - katalog-koltuk-1.jpg', 'color: #999;');
console.log('%c   - katalog-koltuk-2.jpg', 'color: #999;');
console.log('%c   - katalog-yatak-baslik-1.jpg', 'color: #999;');
console.log('%c✨ Sağ taraftaki "Renk Katalogları" butonuna tıklayarak katalogları görüntüleyebilirsiniz!', 'color: #D4AF37;');

// ============================================
// PRELOADER & HERO MASK REVEAL
// ============================================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden-state')) {
        preloader.classList.add('hidden-state');
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        preloader.style.transform = 'scaleY(0)';
        setTimeout(() => {
            if (preloader.parentNode) preloader.remove();
        }, 600);
    }
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(hidePreloader, 150); });
window.addEventListener('load', () => { hidePreloader(); });
setTimeout(hidePreloader, 600);

// ============================================
// LENIS SMOOTH SCROLL ENTEGRASYONU
// ============================================
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    window.lenis = lenis;

    // Lenis scroll olayını sayfa scroll kontrolcüsüne bağla
    lenis.on('scroll', () => {
        if (typeof handlePageScroll === 'function') {
            handlePageScroll();
        }
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ============================================
// GALERI MODAL (LIGHTBOX)
// ============================================
(function() {
    // Klasör içindeki görselleri tutan yapı
    // Yeni görsel eklenince buraya klasör adını ve dosya adlarını ekleyin
    // ====================================================
    // FOTOĞRAF LİSTESİ - Yeni fotoğraf eklemek için buraya
    // dosya adını yazın. Dosyayı da "web sitesi" klasörüne
    // kopyalamayı unutmayın!
    // ====================================================
    const galeri = {
        // ══════════════════════════════════════════════════════════
        // OTURMA ODASI
        // ══════════════════════════════════════════════════════════

        // 📌 KOLTUK TAKIMLARI
        // Fotoğraf eklemek için: "web sitesi" klasörüne kopyalayın
        // ve dosya adını aşağıya yazın (virgülle ayırın)
        // Örnek: ['koltuk-kapak.jpg', 'koltuk-2.jpg', 'koltuk-3.jpg']
        'koltuk-takimi': [
            'galeri/oturma-odasi/milano-1.jpg',
            'galeri/oturma-odasi/milano-2.jpg',
            'galeri/oturma-odasi/milano-3.jpg',
            'galeri/oturma-odasi/lale-1.jpg',
            'galeri/oturma-odasi/lale-2.jpg',
            'galeri/oturma-odasi/lale-3.jpg',
            'galeri/oturma-odasi/zambak-1.jpg',
            'galeri/oturma-odasi/zambak-2.jpg',
            'galeri/oturma-odasi/zambak-3.jpg',
            'galeri/oturma-odasi/zambak-4.jpg',
            'galeri/oturma-odasi/orkide-1.jpg',
            'galeri/oturma-odasi/orkide-2.jpg',
            'galeri/oturma-odasi/orkide-3.jpg',
            'galeri/oturma-odasi/nergis-1.jpg',
            'galeri/oturma-odasi/nergis-2.jpg',
            'galeri/oturma-odasi/nergis-3.jpg',
            'galeri/oturma-odasi/asya-1.jpg',
            'galeri/oturma-odasi/asya-2.jpg',
            'galeri/oturma-odasi/asya-3.jpg',
            'galeri/oturma-odasi/venedik-1.jpg',
            'galeri/oturma-odasi/venedik-2.jpg',
            'galeri/oturma-odasi/venedik-3.jpg',
            'galeri/oturma-odasi/paris-1.jpg',
            'galeri/oturma-odasi/paris-2.jpg',
            'galeri/oturma-odasi/paris-3.jpg',
            'galeri/oturma-odasi/paris-4.jpg',
            'galeri/oturma-odasi/roma-1.jpg',
            'galeri/oturma-odasi/roma-2.jpg',
            'galeri/oturma-odasi/roma-3.jpg',
            'galeri/oturma-odasi/monaco-1.jpg',
            'galeri/oturma-odasi/monaco-2.jpg',
            'galeri/oturma-odasi/monaco-3.jpg',
            'galeri/oturma-odasi/verona-1.jpg',
            'galeri/oturma-odasi/verona-2.jpg',
            'galeri/oturma-odasi/verona-3.jpg',
            'galeri/oturma-odasi/verona-4.jpg',
            'galeri/oturma-odasi/manolya-1.jpg',
            'galeri/oturma-odasi/manolya-2.jpg',
            'galeri/oturma-odasi/manolya-3.jpg'
        ],

        // 📌 KÖŞE TAKIMLARI - Fotoğraf eklemek için dosya adını yazın
        'kose-takimi': [
            'images/gri-gumus-kose-takimi.jpg',
            'images/bej-u-kose-takimi.jpg',
            'images/krem-gold-kose-takimi.jpg',
            'images/bej-kose-takimi.jpg',
            'images/yeni-kose-takimi.jpg',
            'images/cizgili-kose-takimi.jpg',
            'images/ahsap-kose-takimi.jpg',
            'images/lacivert-kose-takimi.jpg'
        ],

        // 📌 TV ÜNİTELERİ
        'tv-unitesi': [
            'images/tv-unitesi.jpg'
            // 'tv-2.jpg',
        ],

        // ══════════════════════════════════════════════════════════
        // YATAK ODASI
        // ══════════════════════════════════════════════════════════

        'yatak-odasi-koleksiyonu': [
            'images/yatak-odasi-koleksiyonu.jpg'
            // 'yatak-2.jpg',
        ],

        'cift-kisilik-yatak': [
            'images/cift-kisilik-yatak.jpg'
            // 'cift-yatak-2.jpg',
        ],

        'tek-kisilik-yatak': [
            'images/tek-kisilik-yatak.jpg'
        ],

        // ══════════════════════════════════════════════════════════
        // YEMEK ODASI
        // ══════════════════════════════════════════════════════════

        'yemek-masasi': [
            'images/yemek-masasi-1.jpg',
            'images/yemek-masasi-2.jpg',
            'images/yemek-masasi-3.jpg',
            'images/yemek-masasi-4.jpg',
            'images/yemek-masasi-5.jpg',
            'images/yemek-masasi-6.jpg',
            'images/yemek-masasi-7.jpg',
            'images/yemek-masasi-8.jpg',
            'images/yemek-masasi-9.jpg',
            'images/yemek-masasi-10.jpg',
            'images/yemek-masasi-11.jpg',
            'images/yemek-masasi-12.jpg',
            'images/yemek-masasi-13.jpg',
            'images/yemek-masasi-14.jpg',
            'images/yemek-masasi-15.jpg',
            'images/yemek-masasi-16.jpg'
        ]
    };

    const modal      = document.getElementById('gallery-modal');
    const overlay    = document.getElementById('gallery-modal-overlay');
    const closeBtn   = document.getElementById('gallery-modal-close');
    const titleEl    = document.getElementById('gallery-modal-title');
    const bodyEl     = document.getElementById('gallery-modal-body');
    const counter    = document.getElementById('gallery-counter');
    const prevBtn    = document.getElementById('gallery-prev');
    const nextBtn    = document.getElementById('gallery-next');

    let images = [];
    let current = 0;

    function showImage(idx) {
        current = (idx + images.length) % images.length;
        bodyEl.innerHTML = `<img src="${images[current]}" alt="" onerror="handleImageError(this)">`;
        counter.textContent = `${current + 1} / ${images.length}`;
        // Thumbnail güncelle
        document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === current);
        });
    }

    function openModal(key, title, fallbackImg) {
        // Fotoğraf yolları doğrudan kullanılıyor (kök klasör = "web sitesi/")
        let imgs = galeri[key] ? [...galeri[key]] : [];
        // Eğer klasör verisi yoksa tek resimle aç
        if (imgs.length === 0 && fallbackImg) imgs = [fallbackImg];
        if (imgs.length === 0) return;

        images = imgs;
        titleEl.textContent = title;

        // Thumbnail şeridi
        const thumbHtml = images.length > 1 ? `
            <div class="gallery-thumb-strip">
                ${images.map((src, i) => `
                    <div class="gallery-thumb ${i===0?'active':''}" data-idx="${i}">
                        <img src="${src}" alt="" onerror="handleImageError(this)">
                    </div>`).join('')}
            </div>` : '';

        const nav = document.getElementById('gallery-modal-nav');
        const oldStrip = modal.querySelector('.gallery-thumb-strip');
        if (oldStrip) oldStrip.remove();
        nav.insertAdjacentHTML('afterend', thumbHtml);

        // Thumb tıklama
        modal.querySelectorAll('.gallery-thumb').forEach(t => {
            t.addEventListener('click', () => showImage(parseInt(t.dataset.idx)));
        });

        // Nav göster/gizle
        document.getElementById('gallery-modal-nav').style.display = images.length > 1 ? 'flex' : 'none';

        showImage(0);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // KATEGORİ SAYFASI SİSTEMİ (Bellona & İstikbal Tarzı)
    // Admin panelinden veya varsayılan ürünlerden okunur.
    // ============================================
    const varsayilanUrunler = {
        'koltuk-takimi': [
            {
                id: 'milano-curved-koltuk-takimi',
                ad: 'Milano Curved Buklet Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'images/milano-koltuk-takimi.jpg',
                gorseller: [
                    'images/milano-koltuk-takimi.jpg',
                    'images/milano-uclu-krem.jpg',
                    'images/atolye-milano-takim.jpg',
                    'images/atolye-milano-antrasit.jpg'
                ],
                rozetler: ['35 DNS HR Sünger', 'İthal Buklet Kumaş', 'Fırınlanmış Gürgen İskelet', 'Leke Tutmaz'],
                ozellikler: [
                    '1 Adet 3\'lü Krem Buklet Kanepe + 1 Adet 3\'lü Antrasit Gri Kanepe + 2 Adet Tekli Berjer',
                    'Özel Flüt Ayaklı Traverten / Ahşap Desen Sehpa Takımı',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet (10 Yıl İskelet Garantisi)',
                    '35 DNS HR Yüksek Elastikiyetli Sünger (Çökme Yapmayan VIP Oturum)',
                    'İthal Buklet / Teddy Dokulu Leke Tutmaz Silinebilir Kumaş',
                    'Oval Silindirik Kol & Sırt Hatları ile 2026 İtalyan Trend Tasarımı',
                    'Evinizin mimarisine ve salonunuza özel ölçü ve sınırsız kumaş renk seçeneği',
                    'Hatay İmalat, Adrese Güvenli Teslimat ve Profesyonel Montaj'
                ],
                aciklama: '2 Adet 3\'lü (Krem & Antrasit) + 2 Berjer + Flüt Sehpa | İthal Buklet Dokuma | 35 DNS HR Sünger | Fırınlanmış Gürgen İskelet'
            },
            {
                id: 'manolya-koltuk-takimi',
                ad: 'Manolya Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'galeri/oturma-odasi/manolya-1.jpg',
                gorseller: [
                    'galeri/oturma-odasi/manolya-1.jpg',
                    'galeri/oturma-odasi/manolya-2.jpg',
                    'galeri/oturma-odasi/manolya-3.jpg'
                ],
                rozetler: ['32 DNS Soft Sünger', 'Sırtı Açılabilen Yataklı', 'Fırınlanmış Gürgen İskelet', 'Silinebilir Kumaş'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Tekli Berjer (3+3+1+1 Takım)',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet Yapısı',
                    '32 DNS Soft Sünger Oturum Konforu (Çökme Yapmaz)',
                    'Silinebilir Kumaş',
                    'Sırtı açılabilen yataklı tasarım (Sandıksız)',
                    'Ceviz tonlu zarif ahşap kol ve ayak detayları',
                    'Evinizin ölçüsüne özel milimetrik üretim ve renk seçeneği'
                ],
                aciklama: '2 Kanepe + 2 Berjer (3+3+1+1) | Fırınlanmış Gürgen İskelet | 32 DNS Soft Sünger | Silinebilir Kumaş | Sırtı açılabilen yataklı (Sandıksız)'
            },
            {
                id: 'lale-koltuk-takimi',
                ad: 'Lale Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'galeri/oturma-odasi/lale-1.jpg',
                gorseller: [
                    'galeri/oturma-odasi/lale-1.jpg',
                    'galeri/oturma-odasi/lale-2.jpg',
                    'galeri/oturma-odasi/lale-3.jpg'
                ],
                rozetler: ['32 DNS Soft Sünger', 'Boucle Kumaş', 'Fırınlanmış Gürgen İskelet', 'Silinebilir Kumaş'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Tekli Berjer (3+3+1+1 Takım)',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet Yapısı',
                    '32 DNS Soft Sünger Oturum Konforu (Çökme Yapmaz)',
                    'Silinebilir Boucle Kumaş (Krem / Taş Rengi)',
                    'Ceviz tonlu zarif ahşap kol ve taban detayları',
                    'Evinizin ölçüsüne özel milimetrik üretim ve renk seçeneği'
                ],
                aciklama: '2 Kanepe + 2 Berjer (3+3+1+1) | Fırınlanmış Gürgen İskelet | 32 DNS Soft Sünger | Silinebilir Boucle Kumaş | Ceviz Ahşap Detaylar'
            },
            {
                id: 'zambak-koltuk-takimi',
                ad: 'Zambak Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'galeri/oturma-odasi/zambak-1.jpg',
                gorseller: [
                    'galeri/oturma-odasi/zambak-1.jpg',
                    'galeri/oturma-odasi/zambak-2.jpg',
                    'galeri/oturma-odasi/zambak-3.jpg',
                    'galeri/oturma-odasi/zambak-4.jpg'
                ],
                rozetler: ['32 DNS Soft Sünger', 'Sırtı Açılabilen Yataklı', 'Fırınlanmış Gürgen İskelet', 'Silinebilir Kumaş'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Tekli Berjer (3+3+1+1 Takım)',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet Yapısı',
                    '32 DNS Soft Sünger Oturum Konforu (Çökme Yapmaz)',
                    'Silinebilir Kumaş (Krem / Bej Rengi)',
                    'Sırtı açılabilen yataklı tasarım (Sandıksız)',
                    'Ceviz tonlu özel ahşap kol tutamak detaylı',
                    'Derin kapitone dikili premium sirt yastıkları',
                    'Evinizin ölçüsüne özel milimetrik üretim ve renk seçeneği'
                ],
                aciklama: '2 Kanepe + 2 Berjer (3+3+1+1) | Fırınlanmış Gürgen İskelet | 32 DNS Soft Sünger | Silinebilir Kumaş | Sırtı Açılabilen Yataklı'
            },
            {
                id: 'orkide-koltuk-takimi',
                ad: 'Orkide Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'galeri/oturma-odasi/orkide-1.jpg',
                gorseller: [
                    'galeri/oturma-odasi/orkide-1.jpg',
                    'galeri/oturma-odasi/orkide-2.jpg',
                    'galeri/oturma-odasi/orkide-3.jpg'
                ],
                rozetler: ['Altın Metal Çerçeve', 'VIP Premium', 'Fırınlanmış Gürgen İskelet', 'Silinebilir Kumaş'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Tekli Berjer (3+3+1+1 Takım)',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet Yapısı',
                    '32 DNS Soft Sünger Oturum Konforu (Çökme Yapmaz)',
                    'Premium Krem / Ekru Rengi Silinebilir Kumaş',
                    'Altın kaplama paslanmaz çelik kol ve ayak çerçevesi',
                    'Elmas desenli özel kapitone dikiş detaylı',
                    'VIP lüks oturma odası konsepti',
                    'Evinizin ölçüsüne özel milimetrik üretim ve renk seçeneği'
                ],
                aciklama: '2 Kanepe + 2 Berjer (3+3+1+1) | Altın Metal Çerçeve | 32 DNS Soft Sünger | Premium Silinebilir Kumaş | VIP Lüks Tasarım'
            },
            {
                id: 'nergis-koltuk-takimi',
                ad: 'Nergis Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'galeri/oturma-odasi/nergis-1.jpg',
                gorseller: [
                    'galeri/oturma-odasi/nergis-1.jpg',
                    'galeri/oturma-odasi/nergis-2.jpg',
                    'galeri/oturma-odasi/nergis-3.jpg'
                ],
                rozetler: ['32 DNS Soft Sünger', 'Boucle Kumaş', 'Fırınlanmış Gürgen İskelet', 'Silinebilir Kumaş'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Yuvarlak Tekli Berjer (3+3+1+1 Takım)',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet Yapısı',
                    '32 DNS Soft Sünger Oturum Konforu (Çökme Yapmaz)',
                    'Silinebilir Boucle Kumaş (Krem / Ekru Rengi)',
                    'Ceviz tonlu doğal ahşap kol sehpa detaylı',
                    'Modern yuvarlak berjer tasarımı',
                    'Evinizin ölçüsüne özel milimetrik üretim ve renk seçeneği'
                ],
                aciklama: '2 Kanepe + 2 Yuvarlak Berjer (3+3+1+1) | Fırınlanmış Gürgen İskelet | 32 DNS Soft Sünger | Silinebilir Boucle Kumaş'
            },
            {
                id: 'asya-koltuk-takimi',
                ad: 'Asya Modern Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'images/asya-koltuk-takimi.jpg',
                gorseller: [
                    'images/asya-koltuk-takimi.jpg',
                    'galeri/oturma-odasi/asya-1.jpg',
                    'galeri/oturma-odasi/asya-2.jpg',
                    'galeri/oturma-odasi/asya-3.jpg'
                ],
                rozetler: ['35 DNS HR Sünger', 'Sırtı Açılabilen Yataklı', 'Gürgen İskelet', 'Leke Tutmaz'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Yüksek Konforlu Berjer (3+3+1+1 Takım)',
                    '1. Sınıf Fırınlanmış Gürgen Ağacı İskelet Yapısı',
                    '35 DNS HR Yüksek Elastikiyetli Çökme Yapmayan Sünger',
                    'Özel Dikim İthal Kumaş (Krem / Bej Tonları)',
                    'Doğal Ahşap Ayak ve Sehpa Kombinasyonu',
                    'Özel Ölçü ve İstenilen Kumaş Seçeneği ile İmalat'
                ],
                aciklama: '2 Adet 3\'lü + 2 Berjer (3+3+1+1) | Fırınlanmış Gürgen İskelet | 35 DNS HR Sünger | Sırtı Açılabilen Yataklı'
            },
            {
                id: 'venedik-koltuk-takimi',
                ad: 'Venedik Gece Mavisi Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'images/venedik-koltuk-takimi.jpg',
                gorseller: [
                    'images/venedik-koltuk-takimi.jpg',
                    'galeri/oturma-odasi/venedik-1.jpg',
                    'galeri/oturma-odasi/venedik-2.jpg',
                    'galeri/oturma-odasi/venedik-3.jpg'
                ],
                rozetler: ['Lüks Kadife Doku', 'Metal Ayak & Aksesuar', '32 DNS Soft', 'Silinebilir Kumaş'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe (Gece Mavisi / Antrasit) + 2 Adet Berjer (Açık Gri)',
                    'Paslanmaz Parlak Krom / Gold Metal Ayak Tasarımı',
                    'Kollarda Özel Kristal Halka Nakış Detayı',
                    '1. Sınıf Fırınlanmış Gürgen İskelet',
                    'Silinebilir ve Leke Tutmaz İthal Dokuma Kumaş'
                ],
                aciklama: '2 Adet 3\'lü + 2 Berjer (3+3+1+1) | Gece Mavisi & Gri Kombinasyonu | Metal Krom Ayaklar'
            },
            {
                id: 'paris-koltuk-takimi',
                ad: 'Paris Kiremit & Krem Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'images/paris-koltuk-takimi.jpg',
                gorseller: [
                    'images/paris-koltuk-takimi.jpg',
                    'galeri/oturma-odasi/paris-1.jpg',
                    'galeri/oturma-odasi/paris-2.jpg',
                    'galeri/oturma-odasi/paris-3.jpg',
                    'galeri/oturma-odasi/paris-4.jpg'
                ],
                rozetler: ['Çift Renk Kombin', '35 DNS HR Sünger', 'Gürgen İskelet', 'Ergonomik Sırt'],
                ozellikler: [
                    '1 Adet 3\'lü Sıcak Kiremit/Kahve Kanepe + 1 Adet 3\'lü Krem Kanepe + 2 Berjer',
                    'Modern Geometrik Orta Sehpa Seti ile Tam Takım',
                    'Geniş ve Derin Oturum Alanı, Ergonomik Sırt Desteği',
                    'Fırınlanmış Gürgen Ağacı İskelet (10 Yıl Garanti)'
                ],
                aciklama: 'Kiremit & Krem Çift Renk Konsepti | 3+3+1+1 Takım | 35 DNS HR Sünger'
            },
            {
                id: 'roma-koltuk-takimi',
                ad: 'Roma Kapitoneli Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'galeri/oturma-odasi/roma-1.jpg',
                gorseller: [
                    'galeri/oturma-odasi/roma-1.jpg',
                    'galeri/oturma-odasi/roma-2.jpg',
                    'galeri/oturma-odasi/roma-3.jpg'
                ],
                rozetler: ['İtalyan Kapitone', 'Keten Dokulu', '32 DNS Soft', 'Silinebilir'],
                ozellikler: [
                    '2 Adet 3\'lü Kanepe + 2 Adet Döner Berjer (3+3+1+1 Takım)',
                    'Kollarda ve Sırtta Özel Bölmeli El İşçiliği Dikişler',
                    'Desenli Dekoratif VIP Kırlentler',
                    '1. Sınıf Fırınlanmış Gürgen İskelet'
                ],
                aciklama: 'Özel Kapitoneli Dikiş Detayları | 2 Adet 3\'lü + 2 Adet Berjer | Fırınlanmış Gürgen İskelet'
            },
            {
                id: 'monaco-koltuk-takimi',
                ad: 'Monaco Petrol Mavisi Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'images/monaco-koltuk-takimi.jpg',
                gorseller: [
                    'images/monaco-koltuk-takimi.jpg',
                    'galeri/oturma-odasi/monaco-1.jpg',
                    'galeri/oturma-odasi/monaco-2.jpg',
                    'galeri/oturma-odasi/monaco-3.jpg'
                ],
                rozetler: ['Dikey Dilimli Sırt', 'Dahili Sehpa', 'Buklet Berjer', '35 DNS HR'],
                ozellikler: [
                    '2 Adet 3\'lü Petrol Mavisi Kanepe + 2 Adet Yuvarlak Döner Buklet Berjer',
                    'Kanepenin Yanında Dahili Entegre Metal Servis Sehpası',
                    'Dikey Dilimli Özel Sünger Dolgulu Kol ve Sırt Yapısı',
                    '1. Sınıf Fırınlanmış Gürgen İskelet'
                ],
                aciklama: 'Petrol Mavisi & Ekru Buklet Berjer | Dahili Yan Sehpalı Kanepeler | 35 DNS HR Sünger'
            },
            {
                id: 'verona-koltuk-takimi',
                ad: 'Verona Hardal & Vizon Koltuk Takımı',
                kategori: 'Koltuk Takımları',
                foto: 'images/verona-koltuk-takimi.jpg',
                gorseller: [
                    'images/verona-koltuk-takimi.jpg',
                    'galeri/oturma-odasi/verona-1.jpg',
                    'galeri/oturma-odasi/verona-2.jpg',
                    'galeri/oturma-odasi/verona-3.jpg',
                    'galeri/oturma-odasi/verona-4.jpg'
                ],
                rozetler: ['Hardal & Vizon', 'Yumuşak Dokuma', 'Gürgen İskelet', 'Silinebilir'],
                ozellikler: [
                    '1 Adet 3\'lü Canlı Hardal Kanepe + 1 Adet 3\'lü Vizon Kanepe + 2 Vizon Berjer',
                    'Geniş ve Rahat Oturumlu Oval Kol Hatları',
                    'Ahşap Ceviz Ayak Yapısı ve Sağlam Gürgen İskelet',
                    'Leke Tutmayan Kolay Temizlenen Dokuma Kumaş'
                ],
                aciklama: 'Hardal & Vizon Renk Uyumu | 2 Adet 3\'lü + 2 Berjer | 1. Sınıf Gürgen İskelet'
            }
        ],
        'kose-takimi': [
            {
                id: 'kose-takimi',
                ad: 'Lüks Köşe Koltuk Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/kose-takimi.jpg',
                gorseller: ['images/kose-takimi.jpg', 'images/kose-hero-lux.jpg'],
                rozetler: ['Modüler Köşe', '32 DNS Sünger', 'Fırınlanmış Gürgen', 'Silinebilir Kumaş'],
                ozellikler: [
                    'L ve U Şeklinde Modüler Köşe Koltuk Çözümleri',
                    '1. Sınıf Fırınlanmış Dayanıklı Gürgen İskelet',
                    'Yüksek Konforlu 32 DNS Soft Oturum Süngeri',
                    'Leke Tutmaz VIP Silinebilir Dokuma Kumaş',
                    'Salona Özel Ölçü İmalat Ayrıcalığı'
                ],
                aciklama: 'Salona Özel Ölçü İmalatı | L Şekilli Köşe Koltuk | Fırınlanmış Gürgen İskelet | VIP Dokuma Kumaş'
            },
            {
                id: 'lacivert-kose-takimi',
                ad: 'Lacivert Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/lacivert-kose-takimi.jpg',
                gorseller: ['images/lacivert-kose-takimi.jpg'],
                rozetler: ['Silinebilir Kumaş', 'Fırınlanmış Gürgen', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği ile kolay temizlik imkanı',
                    'Fırınlanmış gürgen ağaç iskelet',
                    'Evinizin ölçüsüne uyumlu özel tasarım',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen Ağaç | Evinize Özel Ölçü'
            },
            {
                id: 'ahsap-kose-takimi',
                ad: 'Ahşap Detaylı Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/ahsap-kose-takimi.jpg',
                gorseller: ['images/ahsap-kose-takimi.jpg'],
                rozetler: ['Silinebilir Kumaş', 'Fırınlanmış Gürgen', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği ile pratik kullanım',
                    'Fırınlanmış gürgen ağaç ahşap iskelet',
                    'Evinizin ölçüsüne uyumlu özel tasarım imkanı',
                    'Fiyat için WhatsApp\'tan detaylı bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen Ağaç | Evinize Özel Ölçü'
            },
            {
                id: 'cizgili-kose-takimi',
                ad: 'Çizgili Yastıklı Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/cizgili-kose-takimi.jpg',
                gorseller: ['images/cizgili-kose-takimi.jpg'],
                rozetler: ['Silinebilir Kumaş', 'Fırınlanmış Gürgen', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği',
                    'Fırınlanmış gürgen ağaç iskelet',
                    'Evinizin ölçüsüne uyumlu',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen | Evinize Özel Ölçü'
            },
            {
                id: 'yeni-kose-takimi',
                ad: 'Özel Tasarım Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/yeni-kose-takimi.jpg',
                gorseller: ['images/yeni-kose-takimi.jpg'],
                rozetler: ['Silinebilir Kumaş', 'Fırınlanmış Gürgen', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği ile rahat kullanım',
                    'Fırınlanmış gürgen ağaç iskelet',
                    'Evinizin ölçüsüne uyumlu tasarım',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen | Evinize Özel Ölçü'
            },
            {
                id: 'bej-kose-takimi',
                ad: 'Bej Renk Lüks Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/bej-kose-takimi.jpg',
                gorseller: ['images/bej-kose-takimi.jpg'],
                rozetler: ['Silinebilir Kumaş', 'Fırınlanmış Gürgen', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği ile kolay temizlik',
                    'Fırınlanmış gürgen ağaç iskelet',
                    'Evinizin ölçüsüne uyumlu',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen | Evinize Özel Ölçü'
            },
            {
                id: 'krem-gold-kose-takimi',
                ad: 'Krem Gold Detaylı Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/krem-gold-kose-takimi.jpg',
                gorseller: ['images/krem-gold-kose-takimi.jpg'],
                rozetler: ['Silinebilir Kumaş', 'Fırınlanmış Gürgen', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği ve gold (altın) detaylar',
                    'Fırınlanmış gürgen ağaç sağlam iskelet',
                    'Evinizin ölçüsüne uyumlu özel imalat',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen | Evinize Özel Ölçü'
            },
            {
                id: 'bej-u-kose-takimi',
                ad: 'Bej Renk U Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/bej-u-kose-takimi.jpg',
                gorseller: ['images/bej-u-kose-takimi.jpg'],
                rozetler: ['Geniş U Tasarım', 'Silinebilir Kumaş', 'Özel Ölçü'],
                ozellikler: [
                    'Geniş salonlar için özel U tipi tasarım',
                    'Silinebilir kumaş özelliği ve rahat oturum',
                    'Fırınlanmış gürgen ağaç iskelet',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen | Evinize Özel Ölçü'
            },
            {
                id: 'gri-gumus-kose-takimi',
                ad: 'Gri Gümüş Detaylı Köşe Takımı',
                kategori: 'Köşe Takımları',
                foto: 'images/gri-gumus-kose-takimi.jpg',
                gorseller: ['images/gri-gumus-kose-takimi.jpg'],
                rozetler: ['Gümüş Detaylar', 'Silinebilir Kumaş', 'Özel Ölçü'],
                ozellikler: [
                    'Silinebilir kumaş özelliği ve gümüş (silver) halka detayları',
                    'Fırınlanmış gürgen ağaç dayanıklı iskelet',
                    'Evinizin ölçüsüne uyumlu özel üretim imkanı',
                    'Fiyat için WhatsApp\'tan bilgi alabilirsiniz'
                ],
                aciklama: 'Silinebilir Kumaş | Fırınlanmış Gürgen | Evinize Özel Ölçü'
            }
        ],
        'tv-unitesi': [
            {
                id: 'tv-unitesi',
                ad: 'Modern Ahşap TV Ünitesi',
                kategori: 'TV Üniteleri',
                foto: 'images/tv-unitesi.jpg',
                gorseller: ['images/tv-unitesi.jpg'],
                rozetler: ['Doğal Ahşap', 'Frenli Ray Sistem', 'Özel Tasarım'],
                ozellikler: [
                    '1. Sınıf Doğal Ahşap Kaplama ve MDF Malzeme',
                    'Sessiz Kapanan Frenli Menteşe ve Ray Sistemleri',
                    'Geniş Depolama Alanı ve Kablo Kanalları'
                ],
                aciklama: 'Doğal Ahşap Kaplama | Frenli Ray Sistemleri | Şık ve Fonksiyonel Depolama'
            }
        ],
        'yatak-odasi-koleksiyonu': [
            {
                id: 'yatak-odasi-koleksiyonu',
                ad: 'Lüks Yatak Odası Koleksiyonu',
                kategori: 'Yatak Odası',
                foto: 'images/yatak-odasi-koleksiyonu.jpg',
                gorseller: ['images/yatak-odasi-koleksiyonu.jpg'],
                rozetler: ['Tam Takım', 'Aynalı Gardırop', 'Baza & Başlık'],
                ozellikler: [
                    '6 Kapaklı / Sürgülü Aynalı Gardırop Tasarımı',
                    'Çift Kişilik Yatak, Sandıklı Baza ve Silinebilir Kumaş Başlık',
                    'Aynalı Makyaj Masası, Komodin ve Şifonyer Takımı'
                ],
                aciklama: 'Gardırop + Baza + Başlık + Makyaj Masası | Özel İmalat Kalitesi'
            }
        ],
        'cift-kisilik-yatak': [
            {
                id: 'cift-kisilik-yatak',
                ad: 'Çift Kişilik Baza & Yatak Başlığı',
                kategori: 'Yatak & Baza',
                foto: 'images/cift-kisilik-yatak.jpg',
                gorseller: ['images/cift-kisilik-yatak.jpg'],
                rozetler: ['Geniş İç Hacim', 'Çelik Profil Baza', 'Ortopedik Yatak'],
                ozellikler: [
                    'Geniş Depolama Alanlı Çelik Profil İskelet Baza',
                    'Kapitoneli veya Düz Özel VIP Dokuma Kumaş Başlık',
                    'Ortopedik ve Omurga Destekli Yatak Yapısı'
                ],
                aciklama: 'Çelik İskelet Sandıklı Baza | Özel Tasarım Kumaş Başlık | Ortopedik Konfor'
            }
        ],
        'tek-kisilik-yatak': [
            {
                id: 'tek-kisilik-yatak',
                ad: 'Tek Kişilik Baza & Yatak Takımı',
                kategori: 'Yatak & Baza',
                foto: 'images/tek-kisilik-yatak.jpg',
                gorseller: ['images/tek-kisilik-yatak.jpg'],
                rozetler: ['Sandıklı Baza', 'Dayanıklı İskelet', 'Ergonomik'],
                ozellikler: [
                    'Sandıklı Geniş İç Hacimli Baza',
                    'Silinebilir Kumaş Döşeme Başlık',
                    'Ergonomik Uyku Konforu'
                ],
                aciklama: 'Ergonomik Yatak Konforu | Sandıklı Baza ve Şık Başlık'
            }
        ],
        'yemek-masasi': [
            {
                id: 'yemek-masasi-1',
                ad: 'Lüks Açılır Yemek Masası (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-1.jpg',
                gorseller: ['images/yemek-masasi-1.jpg', 'images/yemek-masasi-2.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Mekanizma', 'Ergonomik Sandalye'],
                ozellikler: [
                    'Açılabilir Ray Mekanizmalı Genişletilebilir Masa',
                    '6 Adet Ergonomik Döşemeli Sandalye',
                    'Çizilmeye Karşı Dayanıklı Özel Yüzey'
                ],
                aciklama: 'Açılabilir Mekanizmalı Masa + 6 Sandalye | Lüks Ahşap Ayaklar'
            },
            {
                id: 'yemek-masasi-2',
                ad: 'Kompakt Yemek Masası (4 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-2.jpg',
                gorseller: ['images/yemek-masasi-2.jpg'],
                rozetler: ['4 Kişilik', 'Kompakt Şık Tasarım', 'Ahşap Ayak'],
                ozellikler: [
                    'Mutfak ve Salon İçi Kompakt Ölçü Tasarımı',
                    '4 Adet Konforlu Döşemeli Sandalye'
                ],
                aciklama: '4 Kişilik Mutfak & Salon Yemek Masası Takımı'
            },
            {
                id: 'yemek-masasi-3',
                ad: 'Traverten Desen Açılır Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-3.jpg',
                gorseller: ['images/yemek-masasi-3.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Masa', 'Antrasit Sandalye'],
                ozellikler: [
                    'Açılabilir Mekanizmalı Traverten / Taş Desen Masa Tablası',
                    '6 Adet Dikey Fitilli Ergonomik Antrasit Kumaş Sandalye',
                    'Beyaz Konik Ahşap Ayaklar',
                    'Kolay Temizlenebilir, Leke Tutmaz Kumaş Yüzeyi'
                ],
                aciklama: 'Açılabilir Traverten Masa + 6 Adet Antrasit Sandalye | Beyaz Ahşap Ayak'
            },
            {
                id: 'yemek-masasi-4',
                ad: 'Oval Mermer Tasarım Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-4.jpg',
                gorseller: ['images/yemek-masasi-4.jpg'],
                rozetler: ['6 Kişilik', 'Oval Mermer', 'Kavisli Sandalye'],
                ozellikler: [
                    'Özel Kesim Oval Beyaz Mermer Desen Tabla',
                    '6 Adet Kavisli İskeletli Füme Antrasit Sandalye',
                    'Beyaz Fırın Boyalı Masif Ahşap Ayaklar',
                    'Kolay Silinebilir, Leke Tutmaz Kumaş ve Pürüzsüz Yüzey'
                ],
                aciklama: 'Oval Mermer Desen Masa + 6 Adet Kavisli Sandalye | Beyaz Ayaklar'
            },
            {
                id: 'yemek-masasi-5',
                ad: 'Oniks Mermer Desen Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-5.jpg',
                gorseller: ['images/yemek-masasi-5.jpg'],
                rozetler: ['6 Kişilik', 'Oniks Mermer', 'Siyah Ayak'],
                ozellikler: [
                    'Doğal Damarlı Sıcak Oniks Mermer Desen Masa Tablası',
                    '6 Adet Dikey Dikişli Ergonomik Antrasit Kadife Sandalye',
                    'Siyah Masif Ahşap Dayanıklı Ayak Yapısı',
                    'Çizilmeye Karşı Dayanıklı Parlak Koruyucu Yüzey'
                ],
                aciklama: 'Sıcak Oniks Desen Masa + 6 Adet Antrasit Sandalye | Siyah Masif Ayaklar'
            },
            {
                id: 'yemek-masasi-6',
                ad: 'Ceviz Desen Açılır Ahşap Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-6.jpg',
                gorseller: ['images/yemek-masasi-6.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Ceviz Masa', 'Keten Camel Sandalye'],
                ozellikler: [
                    'Doğal Ceviz Ağaç Dokulu Açılabilir Masa Tablası',
                    '6 Adet Ergonomik Dikey Fitilli Camel / Bej Kumaş Sandalye',
                    'Fırınlanmış Masif Ceviz Ahşap Ayaklar',
                    'Genişletilebilir Akıcı Ray Mekanizması'
                ],
                aciklama: 'Açılır Doğal Ceviz Masa + 6 Adet Camel Sandalye | Masif Ahşap İskelet'
            },
            {
                id: 'yemek-masasi-7',
                ad: 'Oval Traverten Lüks Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-7.jpg',
                gorseller: ['images/yemek-masasi-7.jpg'],
                rozetler: ['6 Kişilik', 'Oval Traverten', 'Vizon Sandalye'],
                ozellikler: [
                    'Özel Oval Kesim Parlak Açık Traverten Mermer Desen Tabla',
                    '6 Adet Kavisli Krem Ahşap İskeletli Vizon / Mocha Sandalye',
                    'Fırın Boyalı Krem Lake Masif Ahşap Ayaklar',
                    'Leke Tutmaz Dokulu Kumaş ve Pürüzsüz Dayanıklı Yüzey'
                ],
                aciklama: 'Oval Traverten Desen Masa + 6 Adet Vizon Sandalye | Krem Ahşap Ayaklar'
            },
            {
                id: 'yemek-masasi-8',
                ad: 'Oval Meşe Ahşap Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-8.jpg',
                gorseller: ['images/yemek-masasi-8.jpg'],
                rozetler: ['6 Kişilik', 'Oval Meşe', 'Bukle Sandalye'],
                ozellikler: [
                    'Doğal Meşe Ahşap Doku ve Beyaz Fitilli Özel Kenar Tasarımı',
                    'Beyaz Yivli Sütun Ayak Kaidesi ile Yüksek Denge',
                    '6 Adet Kavisli Beyaz İskeletli Ekru Bukle Sandalye',
                    'Leke Tutmaz, Silinebilir Yumuşak Dokulu Bukle Kumaş'
                ],
                aciklama: 'Oval Meşe Masa + 6 Adet Ekru Bukle Sandalye | Beyaz Lake İskelet'
            },
            {
                id: 'yemek-masasi-9',
                ad: 'Oval Parlak Lake Beyaz Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-9.jpg',
                gorseller: ['images/yemek-masasi-9.jpg'],
                rozetler: ['6 Kişilik', 'Parlak Lake', 'Gri Dokulu Sandalye'],
                ozellikler: [
                    'Ultra Parlak Çizilmez Beyaz Lake Oval Masa Tablası',
                    'Beyaz Yivli Dekoratif Sütun Ayak Tasarımı',
                    '6 Adet Kavisli Beyaz Lake İskeletli Açık Gri Kumaş Sandalye',
                    'Kolay Temizlenebilir Leke Tutmaz Kumaş ve Pürüzsüz Yüzey'
                ],
                aciklama: 'Oval Parlak Lake Masa + 6 Adet Gri Sandalye | Beyaz Yivli Ayak'
            },
            {
                id: 'yemek-masasi-10',
                ad: 'Doğal Ceviz & Meşe Ahşap Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-10.jpg',
                gorseller: ['images/yemek-masasi-10.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Mekanizma', 'Masif Ahşap Sandalye'],
                ozellikler: [
                    'Zarif Ceviz Dokulu Açılır Mekanizmalı Masa Tablası',
                    '6 Adet Masif Ahşap Kavisli Kollu Grej / Vizon Sandalye',
                    'Fırınlanmış Doğal Masif Ahşap Gövde ve Ayaklar',
                    'Ergonomik Sırt Desteği ve Leke Tutmaz Silinebilir Kumaş'
                ],
                aciklama: 'Açılır Ahşap Masa + 6 Adet Kavisli Ahşap Sandalye | Masif İskelet'
            },
            {
                id: 'yemek-masasi-11',
                ad: 'Beyaz Açılır Yemek Masası & Gold Şeritli Antrasit Takım (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-11.jpg',
                gorseller: ['images/yemek-masasi-11.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Beyaz Masa', 'Gold Şerit Detay'],
                ozellikler: [
                    'Pürüzsüz Beyaz İpek Mat Yüzeyli Açılabilir Masa Tablası',
                    '6 Adet Sırtı Gold Metal Şeritli Antrasit Kadife Sandalye',
                    'Beyaz Fırın Boyalı Masif Ahşap Dayanıklı Ayaklar',
                    'Akıcı Ray Mekanizması ile Kolay Genişletilebilir'
                ],
                aciklama: 'Açılır Beyaz Masa + 6 Adet Gold Detaylı Antrasit Sandalye | Beyaz Ayaklar'
            },
            {
                id: 'yemek-masasi-12',
                ad: 'Siyah Mermer Tasarım Oval Yemek Masası Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-12.jpg',
                gorseller: ['images/yemek-masasi-12.jpg'],
                rozetler: ['6 Kişilik', 'Siyah Mermer', 'Kollu Bukle Sandalye'],
                ozellikler: [
                    'Doğal Beyaz Damarlı Parlak Siyah Mermer Desen Oval Tabla',
                    'Siyah Yivli Çift Sütun Ayak Kaidesi ile Üstün Stabilite',
                    '6 Adet Geometrik Siyah Ahşap İskeletli Ekru Sandalye',
                    'Silinebilir Premium Bukle Kumaş ve Konforlu Kolçaklar'
                ],
                aciklama: 'Oval Siyah Mermer Masa + 6 Adet Kollu Ekru Sandalye | Siyah İskelet'
            },
            {
                id: 'yemek-masasi-13',
                ad: 'Ceviz Açılır Ahşap Masa & Krem Bukle Sandalye Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-13.jpg',
                gorseller: ['images/yemek-masasi-13.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Masa', 'Ahşap Kollu Sandalye'],
                ozellikler: [
                    'Akıcı Ray Mekanizmalı Doğal Ceviz Desen Açılır Masa Tablası',
                    '6 Adet Sıcak Ahşap Kavisli Gövdeli Krem Bukle Sandalye',
                    'Fırınlanmış Doğal Masif Ahşap Konik Ayaklar',
                    'Leke Tutmaz, Silinebilir Yumuşak Dokulu Bukle Kumaş'
                ],
                aciklama: 'Açılır Ceviz Masa + 6 Adet Krem Bukle Sandalye | Masif Ahşap Ayaklar'
            },
            {
                id: 'yemek-masasi-14',
                ad: 'Doğal Ceviz Masa & Kiremit Terakota Sandalye Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-14.jpg',
                gorseller: ['images/yemek-masasi-14.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Mekanizma', 'Kiremit Sandalye'],
                ozellikler: [
                    'Doğal Ceviz Ağaç Desenli Açılabilir Fonksiyonel Masa',
                    '6 Adet Sıcak Kiremit / Terakota Dokulu Ahşap Kollu Sandalye',
                    'Fırınlanmış Masif Ahşap Gövde ve Dayanıklı Ayaklar',
                    'Leke Tutmaz, Kolay Silinebilir Yumuşak Dokuma Kumaş'
                ],
                aciklama: 'Açılır Ceviz Masa + 6 Adet Kiremit Sandalye | Masif Ahşap İskelet'
            },
            {
                id: 'yemek-masasi-15',
                ad: 'Parlak Ceviz Açılır Masa & Krem Fitilli Sandalye Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-15.jpg',
                gorseller: ['images/yemek-masasi-15.jpg'],
                rozetler: ['6 Kişilik', 'Parlak Ceviz Masa', 'Siyah Ahşap Ayak'],
                ozellikler: [
                    'Özel Parlak Koruyucu Cilalı Ceviz Ağaç Desenli Açılır Masa',
                    'Siyah Kavisli Kenar Detaylı Modern Masa Gövdesi',
                    '6 Adet Dikey Fitilli İnci Bej Kadife Kumaş Sandalye',
                    'Fırınlanmış Siyah Masif Ahşap Konik Ayaklar'
                ],
                aciklama: 'Parlak Ceviz Masa + 6 Adet Bej Fitilli Sandalye | Siyah Masif Ayaklar'
            },
            {
                id: 'yemek-masasi-16',
                ad: 'Masif Ceviz Açılır Masa & Keten Gri Sandalye Takımı (6 Kişilik)',
                kategori: 'Yemek Odası',
                foto: 'images/yemek-masasi-16.jpg',
                gorseller: ['images/yemek-masasi-16.jpg'],
                rozetler: ['6 Kişilik', 'Açılır Ahşap Masa', 'Ahşap Kavisli Sandalye'],
                ozellikler: [
                    'Doğal Ceviz Kaplama Açılabilir Akıcı Raylı Masa Tablası',
                    '6 Adet Masif Ahşap Kavisli Gövdeli Açık Gri Keten Sandalye',
                    'Fırınlanmış Masif Gürgen / Meşe Ağaç Dayanıklı Ayaklar',
                    'Leke Tutmaz, Nefes Alan Dokuma Kumaş Döşeme'
                ],
                aciklama: 'Açılır Ceviz Masa + 6 Adet Açık Gri Sandalye | Masif Ahşap Ayaklar'
            }
        ]
    };

    // Kategori düzeltme kontrolü (Lale isimli yatak/baza yanlışlıkla başka kategoriye eklendiyse otomatik taşı)
    function laleKategoriDuzelt(targetObj) {
        if (!targetObj || typeof targetObj !== 'object') return false;
        let degisti = false;
        ['yemek-masasi', 'koltuk-takimi', 'kose-takimi', 'tv-unitesi'].forEach(kat => {
            if (Array.isArray(targetObj[kat])) {
                const laleIdx = targetObj[kat].findIndex(u => u && u.ad && u.ad.toLowerCase().trim() === 'lale');
                if (laleIdx !== -1) {
                    const item = targetObj[kat].splice(laleIdx, 1)[0];
                    item.kategori = 'Çift Kişilik Yatak & Baza';
                    if (!targetObj['cift-kisilik-yatak']) targetObj['cift-kisilik-yatak'] = [];
                    targetObj['cift-kisilik-yatak'].unshift(item);
                    degisti = true;
                }
            }
        });
        return degisti;
    }

    // Admin panelinden kayıtlı ürünleri oku (IndexedDB + LocalStorage + API / products.json)
    let adminUrunler = {};
    try { 
        adminUrunler = JSON.parse(localStorage.getItem('kilickoltuk_urunler') || '{}'); 
        if (laleKategoriDuzelt(adminUrunler)) {
            localStorage.setItem('kilickoltuk_urunler', JSON.stringify(adminUrunler));
        }
    } catch(e) {}

    const urunler = {};
    function urunleriBirlestir(ekstra) {
        if (ekstra) laleKategoriDuzelt(ekstra);
        laleKategoriDuzelt(adminUrunler);
        Object.keys(varsayilanUrunler).forEach(k => {
            const adminEklentileri = (ekstra && ekstra[k]) || (adminUrunler && adminUrunler[k]) || [];
            urunler[k] = [...adminEklentileri, ...varsayilanUrunler[k]];
        });
        if (ekstra) {
            Object.keys(ekstra).forEach(k => {
                if (!urunler[k]) urunler[k] = ekstra[k];
            });
        }
    }
    urunleriBirlestir(adminUrunler);

    // 1. IndexedDB'den yükle (Kotaya takılmayan, kalıcı büyük görseller)
    if (window.indexedDB) {
        try {
            const req = indexedDB.open('kilickoltuk_db', 1);
            req.onsuccess = () => {
                const db = req.result;
                if (db.objectStoreNames.contains('urunler_store')) {
                    const tx = db.transaction('urunler_store', 'readonly');
                    const getReq = tx.objectStore('urunler_store').get('kilickoltuk_urunler');
                    getReq.onsuccess = () => {
                        if (getReq.result && typeof getReq.result === 'object') {
                            const idbData = getReq.result;
                            if (laleKategoriDuzelt(idbData)) {
                                try {
                                    const txWrite = db.transaction('urunler_store', 'readwrite');
                                    txWrite.objectStore('urunler_store').put(idbData, 'kilickoltuk_urunler');
                                    localStorage.setItem('kilickoltuk_urunler', JSON.stringify(idbData));
                                } catch(e) {}
                            }
                            adminUrunler = Object.assign({}, adminUrunler, idbData);
                            urunleriBirlestir(adminUrunler);
                        }
                    };
                }
            };
        } catch(e) {}
    }

    // 2. Firebase Firestore'dan ürünleri yükle (Bulut Senkronizasyonu)
    if (window.db) {
        window.db.collection('site_data').doc('products').get().then(doc => {
            if (doc.exists && doc.data()) {
                const fsData = doc.data();
                if (laleKategoriDuzelt(fsData)) {
                    window.db.collection('site_data').doc('products').set(fsData).catch(()=>{});
                }
                adminUrunler = Object.assign({}, adminUrunler, fsData);
                urunleriBirlestir(adminUrunler);
            }
        }).catch(() => {});
    }

    // 3. Sunucu veya products.json dosyasından yükle
    if (window.location.protocol.startsWith('http')) {
        fetch('api.php?action=get_products')
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && res.data) {
                    adminUrunler = Object.assign({}, adminUrunler, res.data);
                    urunleriBirlestir(adminUrunler);
                }
            }).catch(() => {
                fetch('products.json')
                    .then(r => r.json())
                    .then(data => {
                        if (data && typeof data === 'object') {
                            adminUrunler = Object.assign({}, adminUrunler, data);
                            urunleriBirlestir(adminUrunler);
                        }
                    }).catch(() => {});
            });
    }

    const katSayfasi   = document.getElementById('kategori-sayfasi');
    const katBaslik    = document.getElementById('kat-baslik');
    const katGrid      = document.getElementById('kat-grid');
    const katSayisi    = document.getElementById('kat-urun-sayisi');
    const katGeriBtn   = document.getElementById('kat-geri-btn');

    function katSayfasiAc(key, title) {
        urunleriBirlestir(adminUrunler);
        const liste = urunler[key] || [];
        katBaslik.textContent = title;
        katSayisi.textContent = liste.length + ' ürün';

        if (liste.length === 0) {
            katGrid.innerHTML = `
                <div class="kat-bos">
                    <i class="fas fa-image"></i>
                    <p>Bu kategoriye henüz ürün fotoğrafı eklenmemiş.</p>
                </div>`;
        } else {
            katGrid.innerHTML = liste.map((urun, i) => {
                const gorseller = (urun.gorseller && urun.gorseller.length > 0) ? urun.gorseller : [urun.foto];
                const hasMultiple = gorseller.length > 1;

                return `
                <div class="kat-kart" data-key="${key}" data-idx="${i}" data-img-idx="0">
                    <div class="kat-kart-img-wrap">
                        <span class="kat-badge-tag"><i class="fas fa-sparkles"></i> Yeni Ürün</span>
                        <img class="kat-kart-img" src="${gorseller[0]}" alt="${urun.ad}" loading="lazy" onerror="handleImageError(this)">
                        ${hasMultiple ? `
                            <button class="kat-card-nav kat-card-prev" data-dir="-1" title="Önceki Fotoğraf"><i class="fas fa-chevron-left"></i></button>
                            <button class="kat-card-nav kat-card-next" data-dir="1" title="Sonraki Fotoğraf"><i class="fas fa-chevron-right"></i></button>
                            <div class="kat-card-dots">
                                ${gorseller.map((_, idx) => `<span class="kat-dot ${idx===0?'active':''}"></span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="kat-kart-overlay-btn"><i class="fas fa-search-plus"></i> ÜRÜNÜ İNCELE</div>
                    </div>
                    <div class="kat-kart-bilgi">
                        <h3 class="kat-kart-ad">${urun.ad}</h3>
                        <p class="kat-kart-aciklama">${urun.aciklama}</p>
                        <div class="kat-kart-footer">
                            <span class="kat-kart-fiyat">${urun.fiyat || 'Fiyat İçin İletişime Geçin'}</span>
                            <span class="kat-kart-link"><i class="fab fa-whatsapp"></i> Bilgi Al</span>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        katSayfasi.classList.add('aktif');
        document.body.style.overflow = 'hidden';
    }
    window.katSayfasiAc = katSayfasiAc;

    // ============================================
    // BELLONA / İSTİKBAL TARZI LÜKS ÜRÜN DETAY MODALI MOTORU
    // ============================================
    function openProductDetailModal(urun) {
        const modal = document.getElementById('pdm-modal');
        if (!modal) return;

        const mainImg = document.getElementById('pdm-main-img');
        const katTag = document.getElementById('pdm-kat-tag');
        const titleEl = document.getElementById('pdm-title');
        const pillsEl = document.getElementById('pdm-pills');
        const descEl = document.getElementById('pdm-desc-text');
        const specsList = document.getElementById('pdm-specs-list');
        const thumbStrip = document.getElementById('pdm-thumb-strip');
        const waBtn = document.getElementById('pdm-wa-btn');

        const gorseller = (urun.gorseller && urun.gorseller.length > 0) ? urun.gorseller : [urun.foto];
        let currentIdx = 0;

        function setMainImg(idx) {
            currentIdx = (idx + gorseller.length) % gorseller.length;
            mainImg.style.opacity = '0.3';
            setTimeout(() => {
                mainImg.src = gorseller[currentIdx];
                mainImg.style.opacity = '1';
            }, 120);

            thumbStrip.querySelectorAll('.pdm-exact-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === currentIdx);
            });
        }

        // Metin Temizleyici (VIP ve Yataklı ifadelerini kesin olarak süzgeçten geçirir)
        const cleanStr = (str) => {
            if (!str) return '';
            return str
                .replace(/VIP\s*/gi, '')
                .replace(/Sırt Mekanizmalı Yatak/gi, 'Sırtı Açılabilen Yataklı')
                .replace(/\bYataklı\b/gi, 'Sırtı açılabilen yataklı')
                .replace(/\s+/g, ' ')
                .trim();
        };

        // Breadcrumb & Metin İçerikleri
        const bcKat = document.getElementById('pdm-bc-kat');
        const bcTitle = document.getElementById('pdm-bc-title');
        if (bcKat) bcKat.textContent = cleanStr(urun.kategori || 'Oturma Odası');
        if (bcTitle) bcTitle.textContent = cleanStr(urun.ad);
        titleEl.textContent = cleanStr(urun.ad);
        if (descEl) descEl.textContent = cleanStr(urun.aciklama || '');

        // Rozetler (Pills)
        if (pillsEl) {
            const rawRozetler = urun.rozetler || ['32 DNS Soft Sünger', 'Sırtı Açılabilen Yataklı', 'Fırınlanmış Gürgen İskelet', 'Silinebilir Kumaş'];
            const rozetler = rawRozetler.map(r => cleanStr(r));
            pillsEl.innerHTML = rozetler.map(r => `<span class="pdm-pill"><i class="fas fa-check"></i> ${r}</span>`).join('');
        }

        // Teknik Özellikler Listesi
        if (specsList) {
            const rawOzellikler = urun.ozellikler || [
                '2 Adet 3\'lü Kanepe + 2 Adet Tekli Berjer (3+3+1+1)',
                '1. Sınıf Fırınlanmış Dayanıklı Gürgen İskelet',
                '32 DNS Soft Sünger Oturum Konforu',
                'Silinebilir Kumaş',
                'Sırtı açılabilen yataklı tasarım (Sandıksız)'
            ];
            const ozellikler = rawOzellikler.map(o => cleanStr(o));
            specsList.innerHTML = ozellikler.map(o => `<li><i class="fas fa-check-circle"></i> <span>${o}</span></li>`).join('');
        }

        // Birebir Görsel Thumbnails (Küçük Resim Kartları - Alt sırada sarı/altın çerçeveli)
        if (gorseller.length > 1) {
            thumbStrip.style.display = 'flex';
            thumbStrip.innerHTML = gorseller.map((src, i) => `
                <div class="pdm-exact-thumb ${i===0?'active':''}" data-idx="${i}" title="Görsel ${i+1}">
                    <img src="${src}" alt="${urun.ad} Görsel ${i+1}" onerror="handleImageError(this)">
                </div>
            `).join('');

            thumbStrip.querySelectorAll('.pdm-exact-thumb').forEach(t => {
                t.addEventListener('click', () => setMainImg(parseInt(t.dataset.idx)));
            });
        } else {
            thumbStrip.style.display = 'none';
        }

        // WhatsApp Butonu - Ürün adını ve fiyat sorusunu içeren otomatik mesaj
        if (waBtn) {
            const waMsg = `Merhaba Ali Bey 👋\n\nSitenizden *${urun.ad}* modelini inceledim.\n\n📋 *Ürün Bilgileri:*\n${(urun.rozetler || []).map(r => `• ${r}`).join('\n')}\n\nBu ürünün *fiyatı* hakkında bilgi alabilir miyim?\n\nTeşekkürler 🙏`;
            const waEncoded = encodeURIComponent(waMsg);
            waBtn.href = `https://wa.me/905386029031?text=${waEncoded}`;
        }

        // Sağa / Sola Oklar (Varsa)
        document.getElementById('pdm-prev-btn')?.addEventListener('click', (e) => { e.stopPropagation(); setMainImg(currentIdx - 1); });
        document.getElementById('pdm-next-btn')?.addEventListener('click', (e) => { e.stopPropagation(); setMainImg(currentIdx + 1); });

        setMainImg(0);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePdmModal() {
        const modal = document.getElementById('pdm-modal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('pdm-close')?.addEventListener('click', closePdmModal);
    document.getElementById('pdm-overlay')?.addEventListener('click', closePdmModal);

    // Kart Tıklama & Kart İçi Görsel Kaydırma Motoru
    document.addEventListener('click', (e) => {
        // Ok butonuna tıklandıysa (kart içinde resim kaydırma)
        const navBtn = e.target.closest('.kat-card-nav');
        if (navBtn) {
            e.stopPropagation();
            const kart = navBtn.closest('.kat-kart');
            if (!kart) return;

            const key = kart.dataset.key;
            const idx = parseInt(kart.dataset.idx);
            const urun = urunler[key]?.[idx];
            if (!urun) return;

            const gorseller = (urun.gorseller && urun.gorseller.length > 0) ? urun.gorseller : [urun.foto];
            let imgIdx = parseInt(kart.dataset.imgIdx || '0');
            const dir = parseInt(navBtn.dataset.dir);

            imgIdx = (imgIdx + dir + gorseller.length) % gorseller.length;
            kart.dataset.imgIdx = imgIdx;

            const imgEl = kart.querySelector('.kat-kart-img');
            if (imgEl) {
                imgEl.style.opacity = '0.3';
                setTimeout(() => {
                    imgEl.src = gorseller[imgIdx];
                    imgEl.style.opacity = '1';
                }, 120);
            }

            const dots = kart.querySelectorAll('.kat-dot');
            dots.forEach((dot, dIdx) => {
                dot.classList.toggle('active', dIdx === imgIdx);
            });
            return;
        }

        // Karta tıklandıysa -> Detay Modalı Açılır
        const kart = e.target.closest('.kat-kart');
        if (kart) {
            const key = kart.dataset.key;
            const idx = parseInt(kart.dataset.idx);
            if (urunler[key] && urunler[key][idx]) {
                openProductDetailModal(urunler[key][idx]);
            }
        }
    });

    katGeriBtn.addEventListener('click', () => {
        katSayfasi.classList.remove('aktif');
        document.body.style.overflow = '';
    });

    // Cat-tile tıklaması
    document.addEventListener('click', (e) => {
        const tile = e.target.closest('.cat-tile');
        if (!tile) return;
        const key   = tile.dataset.gallery;
        const title = tile.dataset.title || 'Ürünler';
        katSayfasiAc(key, title);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => showImage(current - 1));
    nextBtn.addEventListener('click', () => showImage(current + 1));

    // Klavye ile gezinme
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showImage(current - 1);
        if (e.key === 'ArrowRight') showImage(current + 1);
    });
})();

// ============================================
// MÜŞTERİ YORUMLARI & INSTAGRAM VİTRİNİ DİNAMİK MOTORU
// ============================================
(function() {
    const isServer = window.location.protocol.startsWith('http');
    let secilenYildiz = 5;

    // ── YILDIZ SEÇİCİ ETKİLEŞİMİ ──
    const yildizSecici = document.getElementById('yildiz-secici');
    if (yildizSecici) {
        const yildizlar = yildizSecici.querySelectorAll('.yildiz-btn');
        yildizlar.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = parseInt(btn.dataset.val);
                secilenYildiz = val;
                yildizlar.forEach(y => {
                    y.classList.toggle('aktif', parseInt(y.dataset.val) <= val);
                });
            });
        });
    }

    // ── YORUM GÖNDERME İŞLEMİ ──
    window.yorumGonder = function(event) {
        event.preventDefault();
        
        const ad = document.getElementById('yorum-ad').value.trim();
        const text = document.getElementById('yorum-metin').value.trim();
        
        if (!ad || !text) {
            showNotification('⚠️ Lütfen tüm alanları doldurun!', 'warning');
            return;
        }

        const newReview = {
            ad: ad,
            stars: secilenYildiz,
            text: text
        };

        if (isServer) {
            fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add_review',
                    ad: ad,
                    stars: secilenYildiz,
                    text: text
                })
            })
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success') {
                    showNotification('✅ Yorumunuz gönderildi ve yayına alındı!', 'success');
                    const form = document.getElementById('yorum-yaz-form');
                    if (form) form.reset();
                    sifirlaYildizSecici();
                    yorumlarıYukle();
                } else {
                    showNotification('❌ Hata: ' + res.message, 'error');
                }
            })
            .catch(() => {
                // Hata durumunda local'e kaydet (fallback)
                localReviewKaydet(newReview);
            });
        } else {
            localReviewKaydet(newReview);
        }
    };

    function localReviewKaydet(newReview) {
        const defaultReviews = [
            { ad: "Adil Öztürk", stars: 5, text: "Ali Bey ve ekibine çok teşekkür ederiz. Salonumuz için özel ölçü koltuk takımı yaptırdık. Tam istediğimiz ebatlarda, kumaş kalitesi ve dikişleri mükemmel şekilde Hatay'daki evimize teslim ettiler. Güvenle alışveriş yapabilirsiniz." },
            { ad: "Mehmet Kemal Aslan", stars: 5, text: "Atölyeden teslimata kadar her süreç çok şeffaftı. Kumaş seçiminde sundukları renk kartelası ve VIP özel tasarım desteği sayesinde salonumuz adeta baştan yaratıldı. İskelet kalitesi gerçekten çok sağlam." },
            { ad: "Selma Yıldız", stars: 5, text: "Çift kişilik yatak ve baza siparişi vermiştik. Hem yatak konforu hem de bazanın depolama alanı inanılmaz geniş me kullanışlı. Hatay Antakya'daki yeni evimize getirip kurulumunu da kendileri yaptılar. Çok memnunuz." }
        ];
        const list = JSON.parse(localStorage.getItem('kilickoltuk_yorumlar') || JSON.stringify(defaultReviews));
        list.unshift(newReview);
        localStorage.setItem('kilickoltuk_yorumlar', JSON.stringify(list));
        showNotification('✅ Yorumunuz gönderildi! (Lokal Belleğe Kaydedildi)', 'success');
        const form = document.getElementById('yorum-yaz-form');
        if (form) form.reset();
        sifirlaYildizSecici();
        yorumlarıYukle();
    }

    function sifirlaYildizSecici() {
        secilenYildiz = 5;
        if (yildizSecici) {
            yildizSecici.querySelectorAll('.yildiz-btn').forEach(y => y.classList.add('aktif'));
        }
    }

    // ── YORUMLARI SUNUCUDAN/LOKALDEN YÜKLEME ──
    let slideInterval = null;
    let currentIdx = 0;
    
    function yorumlarıYukle() {
        if (isServer) {
            fetch('api.php?action=get_reviews')
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success') {
                    renderYorumlar(res.data);
                }
            })
            .catch(() => {
                renderYorumlar(getLocalReviewsList());
            });
        } else {
            renderYorumlar(getLocalReviewsList());
        }
    }

    function getLocalReviewsList() {
        const defaultReviews = [
            { ad: "Adil Öztürk", stars: 5, text: "Ali Bey ve ekibine çok teşekkür ederiz. Salonumuz için özel ölçü koltuk takımı yaptırdık. Tam istediğimiz ebatlarda, kumaş kalitesi ve dikişleri mükemmel şekilde Hatay'daki evimize teslim ettiler. Güvenle alışveriş yapabilirsiniz." },
            { ad: "Mehmet Kemal Aslan", stars: 5, text: "Atölyeden teslimata kadar her süreç çok şeffaftı. Kumaş seçiminde sundukları renk kartelası ve VIP özel tasarım desteği sayesinde salonumuz adeta baştan yaratıldı. İskelet kalitesi gerçekten çok sağlam." },
            { ad: "Selma Yıldız", stars: 5, text: "Çift kişilik yatak ve baza siparişi vermiştik. Hem yatak konforu hem de bazanın depolama alanı inanılmaz geniş ve kullanışlı. Hatay Antakya'daki yeni evimize getirip kurulumunu da kendileri yaptılar. Çok memnunuz." }
        ];
        return JSON.parse(localStorage.getItem('kilickoltuk_yorumlar') || JSON.stringify(defaultReviews));
    }

    function renderYorumlar(list) {
        const carousel = document.getElementById('testimonials-carousel');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!carousel) return;

        if (list.length === 0) {
            carousel.innerHTML = `<div class="testimonial-card active"><p class="testimonial-text">Henüz yorum yazılmamış. İlk yorumu siz yazın!</p></div>`;
            if (dotsContainer) dotsContainer.innerHTML = '';
            return;
        }

        // Yorum Kartlarını Render Et
        carousel.innerHTML = list.map((item, i) => {
            let starsHtml = '';
            for(let s=0; s<item.stars; s++) {
                starsHtml += '<i class="fas fa-star"></i>';
            }
            
            // Baş harfler
            const initials = item.ad.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            return `
                <div class="testimonial-card ${i === 0 ? 'active' : ''}">
                    <div class="testimonial-stars">${starsHtml}</div>
                    <p class="testimonial-text">"${item.text}"</p>
                    <div class="testimonial-user">
                        <div class="user-avatar">${initials}</div>
                        <div class="user-info">
                            <h4 class="user-name">${item.ad}</h4>
                            <span class="user-status"><i class="fas fa-check-circle"></i> Doğrulanmış Müşteri</span>
                        </div>
                    </div>
                </div>`;
        }).join('');

        // Dots Render Et
        if (dotsContainer) {
            dotsContainer.innerHTML = list.map((_, i) => `
                <span class="dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`
            ).join('');

            // Dots Tıklama Eventleri
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const idx = parseInt(dot.dataset.idx);
                    showSlide(idx);
                    startAutoSlide();
                });
            });
        }

        // Carousel Slider Mantığı
        const cards = carousel.querySelectorAll('.testimonial-card');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        currentIdx = 0;

        function showSlide(idx) {
            if (cards.length === 0) return;
            currentIdx = (idx + cards.length) % cards.length;

            cards.forEach((card, i) => {
                card.classList.toggle('active', i === currentIdx);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIdx);
            });
        }

        function nextSlide() {
            showSlide(currentIdx + 1);
        }

        function prevSlide() {
            showSlide(currentIdx - 1);
        }

        function startAutoSlide() {
            stopAutoSlide();
            if (cards.length > 1) {
                slideInterval = setInterval(nextSlide, 5000);
            }
        }

        function stopAutoSlide() {
            if (slideInterval) clearInterval(slideInterval);
        }

        if (nextBtn) {
            nextBtn.onclick = () => { nextSlide(); startAutoSlide(); };
        }
        if (prevBtn) {
            prevBtn.onclick = () => { prevSlide(); startAutoSlide(); };
        }

        // Otomatik kaymayı başlat
        startAutoSlide();

        carousel.onmouseenter = stopAutoSlide;
        carousel.onmouseleave = startAutoSlide;
    }

    // ── INSTAGRAM GÖRSELLERİNİ YÜKLEME ──
    function instagramYukle() {
        if (isServer) {
            fetch('api.php?action=get_instagram')
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success') {
                    renderInstagramGrid(res.data);
                }
            })
            .catch(() => {
                renderInstagramGrid(getLocalInstagramList());
            });
        } else {
            renderInstagramGrid(getLocalInstagramList());
        }
    }

    function getLocalInstagramList() {
        const defaultInstagram = [
            { foto: "images/milano-koltuk-takimi.jpg", likes: 284, comments: 24 },
            { foto: "images/asya-koltuk-takimi.jpg", likes: 312, comments: 29 },
            { foto: "images/venedik-koltuk-takimi.jpg", likes: 275, comments: 19 },
            { foto: "images/paris-koltuk-takimi.jpg", likes: 248, comments: 22 },
            { foto: "images/monaco-koltuk-takimi.jpg", likes: 290, comments: 27 },
            { foto: "images/verona-koltuk-takimi.jpg", likes: 265, comments: 21 },
            { foto: "galeri/oturma-odasi/asya-1.jpg", likes: 195, comments: 18 },
            { foto: "galeri/oturma-odasi/venedik-1.jpg", likes: 184, comments: 14 }
        ];
        return JSON.parse(localStorage.getItem('kilickoltuk_atolye') || JSON.stringify(defaultInstagram));
    }

    function renderInstagramGrid(list) {
        const grid = document.querySelector('.instagram-grid');
        if (!grid) return;

        if (list.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#888;padding:2rem;">Vitrin fotoğrafı bulunmuyor.</div>';
            return;
        }

        // Tüm modellerin görsellerini sergileyelim (vitrin)
        const displayList = list.slice(0, 8);

        grid.innerHTML = displayList.map(item => `
            <div class="instagram-item">
                <div class="insta-img-wrapper">
                    <img src="${item.foto}" alt="Kılıç Koltuk Tasarımları" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23eee\\'/></svg>'">
                    <div class="insta-overlay">
                        <div class="insta-icons">
                            <span><i class="fas fa-heart"></i> ${item.likes}</span>
                            <span><i class="fas fa-comment"></i> ${item.comments}</span>
                        </div>
                        <i class="fab fa-instagram insta-icon-bg"></i>
                    </div>
                </div>
            </div>`).join('');

        // Giriş animasyonlarını yenile
        const items = grid.querySelectorAll('.instagram-item');
        if (typeof observer !== 'undefined') {
            items.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
                observer.observe(el);
            });
        }
    }

    // Başlangıç Yüklemeleri
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('testimonials-carousel')) yorumlarıYukle();
        instagramYukle();
    });
})();

// ============================================
// LUXURY 3-SLIDE HERO SLIDER SİSTEMİ
// (Oturma Odası, Yatak Odası, Yemek Odası)
// ============================================
(function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slides-track .hero-slide');
    const tabs = document.querySelectorAll('.hero-pagination-tab');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const heroWrapper = document.querySelector('.hero-slider-wrapper');

    if (!slides || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideDuration = 5500; // 5.5 saniye
    let progressStartTime = null;
    let progressAnimFrame = null;
    let isPaused = false;

    function activateSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;

        // Slaytları güncelle
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Tab göstergelerini güncelle
        tabs.forEach((tab, i) => {
            const progressBar = tab.querySelector('.tab-progress-bar');
            if (i === currentSlide) {
                tab.classList.add('active');
                if (progressBar) progressBar.style.width = '0%';
            } else {
                tab.classList.remove('active');
                if (progressBar) progressBar.style.width = '0%';
            }
        });

        resetTimer();
    }

    function updateProgressBar(timestamp) {
        if (!progressStartTime) progressStartTime = timestamp;
        if (!isPaused) {
            const elapsed = timestamp - progressStartTime;
            const percentage = Math.min((elapsed / slideDuration) * 100, 100);
            
            const activeTab = tabs[currentSlide];
            if (activeTab) {
                const bar = activeTab.querySelector('.tab-progress-bar');
                if (bar) bar.style.width = percentage + '%';
            }

            if (elapsed >= slideDuration) {
                nextSlide();
                return;
            }
        }
        progressAnimFrame = requestAnimationFrame(updateProgressBar);
    }

    function nextSlide() {
        activateSlide(currentSlide + 1);
    }

    function prevSlide() {
        activateSlide(currentSlide - 1);
    }

    function resetTimer() {
        if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);
        progressStartTime = null;
        progressAnimFrame = requestAnimationFrame(updateProgressBar);
    }

    // Buton Eventleri
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
        });
    }

    // Tab tıklamaları
    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            activateSlide(idx);
        });
    });

    // Hover'da duraklatma
    if (heroWrapper) {
        heroWrapper.addEventListener('mouseenter', () => { isPaused = true; });
        heroWrapper.addEventListener('mouseleave', () => { isPaused = false; });

        // Touch Swipe (Mobil Kaydırma Desteği)
        let touchStartX = 0;
        let touchEndX = 0;
        heroWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isPaused = true;
        }, { passive: true });

        heroWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            isPaused = false;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 45) {
                if (diffX < 0) {
                    nextSlide(); // Sola kaydırma -> Sonraki
                } else {
                    prevSlide(); // Sağa kaydırma -> Önceki
                }
            }
        }, { passive: true });
    }

    // Klavye Yön Tuşları Desteği
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && window.scrollY < 600) {
            nextSlide();
        } else if (e.key === 'ArrowLeft' && window.scrollY < 600) {
            prevSlide();
        }
    });

    // Başlat
    activateSlide(0);
})();

// ============================================
// BUTON & KART TIKLAMA HİSSİYATI VE ANİMASYONLARI
// (Ripple Effect, Spring Bounce, Haptic Vibration)
// ============================================
(function initTactileInteractions() {
    // Ripple Effect & Tactile Bounce Handler
    function createRipple(e) {
        const target = e.currentTarget;
        if (!target) return;

        // Mobil haptic dokunma titreşimi
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(12); } catch (err) {}
        }

        // Basma sınıfları
        target.classList.add('is-pressed');
        setTimeout(() => {
            target.classList.remove('is-pressed');
        }, 180);

        // Ripple dalgası
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-wave');

        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${clientX - rect.left - radius}px`;
        ripple.style.top = `${clientY - rect.top - radius}px`;

        // Eski ripple'ı temizle
        const existingRipple = target.querySelector('.ripple-wave');
        if (existingRipple) {
            existingRipple.remove();
        }

        target.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 650);
    }

    // Hedef elemanlar: butonlar, kartlar, filtreler, tablar
    const interactiveSelectors = [
        '.btn',
        '.nav-cta-btn',
        '.nav-kumas-btn',
        '.filter-btn',
        '.order-btn',
        '.btn-details',
        '.hero-slider-arrow',
        '.hero-pagination-tab',
        '.showcase-card',
        '.product-card',
        '.editorial-pillar-card',
        '.cat-tile',
        '.gallery-item'
    ];

    function attachTactileListeners() {
        const elements = document.querySelectorAll(interactiveSelectors.join(', '));
        elements.forEach(el => {
            if (!el.dataset.tactileAttached) {
                el.dataset.tactileAttached = 'true';
                el.addEventListener('pointerdown', createRipple, { passive: true });
            }
        });
    }

    // DOM yüklendiğinde ve dinamik içerik eklendiğinde bağla
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachTactileListeners);
    } else {
        attachTactileListeners();
    }

    // MutationObserver ile sonradan gelen kartlara da otomatik bağla
    const observer = new MutationObserver(() => {
        attachTactileListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// SCROLL REVEAL (Intersection Observer)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-fade-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Optional: Run once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
});


// ============================================
// PREMIUM SECTION REVEAL — reveal-section
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal-section').forEach(el => sectionObserver.observe(el));

    // TIKLAMA ANİMASYONU — Altın Ripple ve Page Flash
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    document.body.appendChild(overlay);

    function addClickRipple(el) {
        if (el.dataset.rippleAdded) return;
        el.dataset.rippleAdded = '1';
        el.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-wave';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.4;
            ripple.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(e.clientX - rect.left - size/2)+'px;top:'+(e.clientY - rect.top - size/2)+'px;pointer-events:none;';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());

            const px = ((e.clientX / window.innerWidth) * 100).toFixed(1) + '%';
            const py = ((e.clientY / window.innerHeight) * 100).toFixed(1) + '%';
            overlay.style.setProperty('--ox', px);
            overlay.style.setProperty('--oy', py);
            overlay.classList.remove('flash');
            void overlay.offsetWidth;
            overlay.classList.add('flash');
            overlay.addEventListener('animationend', () => overlay.classList.remove('flash'), { once: true });
        });
    }

    document.querySelectorAll('.btn,.btn-primary,.btn-outline,.hero-btn,.hero-btn-whatsapp,.nav-cta-btn,.showcase-card,.cat-tile,.hero-pagination-tab,.hero-slider-arrow,.nav-link').forEach(addClickRipple);

    new MutationObserver(() => {
        document.querySelectorAll('.btn,.kat-urun-card,.pdm-btn').forEach(addClickRipple);
    }).observe(document.body, { childList: true, subtree: true });
});

// ============================================================
// FIREBASE FIRESTORE — Iletisim Formu Kaydi
// ============================================================
(function patchContactFormFirebase() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Mevcut handler'i kaldirip yenisini ekle
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);

    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const messageData = {
            ad:     (document.getElementById('contact-name')?.value    || '').trim(),
            telefon:(document.getElementById('contact-form-phone')?.value
                  || document.getElementById('contact-phone')?.value   || '').trim(),
            email:  (document.getElementById('contact-email')?.value   || '').trim(),
            mesaj:  (document.getElementById('contact-message')?.value || '').trim()
        };

        if (!messageData.ad || !messageData.telefon || !messageData.email || !messageData.mesaj) {
            if (typeof showNotification === 'function')
                showNotification('Lutfen tum alanlari doldurun.', 'warning');
            return;
        }

        if (typeof showNotification === 'function')
            showNotification('Mesajiniz gonderiliyor...', 'info');

        // --- Firebase Firestore kaydet ---
        if (window.db) {
            try {
                await window.db.collection('mesajlar').add({
                    ...messageData,
                    tarih: firebase.firestore.FieldValue.serverTimestamp(),
                    okundu: false,
                    kaynak: 'web-iletisim-formu'
                });
                if (typeof showNotification === 'function')
                    showNotification('Mesajınız başarıyla iletildi! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
                newForm.reset();
                return;
            } catch (err) {
                console.warn('Firestore kayit hatasi:', err);
            }
        }

        // Fallback — localStorage
        try {
            const list = JSON.parse(localStorage.getItem('kilickoltuk_mesajlar') || '[]');
            list.unshift({ ...messageData, tarih: new Date().toISOString() });
            localStorage.setItem('kilickoltuk_mesajlar', JSON.stringify(list));
        } catch(_) {}
        if (typeof showNotification === 'function')
            showNotification('Mesajınız başarıyla iletildi! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
        newForm.reset();
    });
})();

// ============================================================
// NAVBAR MANYETIK PILL GOSTERGESI — Yay Fizigi
// ============================================================
(function initNavPill() {
    const pill    = document.getElementById('nav-pill');
    const navMenu = document.getElementById('nav-menu');
    if (!pill || !navMenu) return;

    const links = navMenu.querySelectorAll('a.nav-link');
    if (!links.length) return;

    let curX = 0, curW = 0, tarX = 0, tarW = 0, vX = 0, vW = 0;
    const STIFF = 0.16, DAMP = 0.72;
    let raf;

    function snap(el) {
        const mr = navMenu.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        return { x: er.left - mr.left, w: er.width };
    }

    function spring() {
        vX = vX * DAMP + (tarX - curX) * STIFF;
        vW = vW * DAMP + (tarW - curW) * STIFF;
        curX += vX; curW += vW;
        pill.style.transform = `translateX(${curX}px)`;
        pill.style.width     = `${curW}px`;
        if (Math.abs(tarX - curX) > 0.1 || Math.abs(tarW - curW) > 0.1)
            raf = requestAnimationFrame(spring);
    }

    function moveTo(el) {
        const s = snap(el);
        tarX = s.x; tarW = s.w;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(spring);
    }

    // Baslangic: aktif linke git
    setTimeout(() => {
        const active = navMenu.querySelector('a.nav-link.active');
        if (active) {
            const s = snap(active);
            curX = tarX = s.x; curW = tarW = s.w;
            pill.style.transform = `translateX(${curX}px)`;
            pill.style.width     = `${curW}px`;
            pill.style.opacity   = '1';
        }
    }, 200);

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            pill.style.opacity = '1';
            moveTo(link);
        });
    });

    navMenu.addEventListener('mouseleave', () => {
        const active = navMenu.querySelector('a.nav-link.active');
        if (active) moveTo(active);
    });

    // Tiklayinca aktif degistir
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
})();

// ============================================================
// SOL SIDE DRAWER TOGGLE
// ============================================================
(function initSideDrawer() {
    const toggle  = document.getElementById('side-drawer-toggle');
    const drawer  = document.getElementById('side-drawer');
    const overlay = document.getElementById('side-drawer-overlay');
    const closeBtn= document.getElementById('side-drawer-close');
    if (!toggle || !drawer) return;

    function open()  { drawer.classList.add('drawer-open');    document.body.style.overflow = 'hidden'; }
    function close() { drawer.classList.remove('drawer-open'); document.body.style.overflow = ''; }

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay)  overlay.addEventListener('click', close);
    drawer.querySelectorAll('.side-drawer-link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ============================================================
// MAGAZA & TESLIMAT GALERI SEKMELERI (ADMIN & API ENTEGRASYONLU)
// ============================================================
(function initGalleryTabs() {
    const isServer = window.location.protocol.startsWith('http');

    // Gruplandırılmış çoklu fotoğraflı teslimatlar (Kısa başlık ve slogan açıklamalar)
    const varsayilanTeslimat = [
        {
            id: 'teslimat-gulderen-toki-nervurlu',
            ilce: 'Hatay / Gülderen TOKİ',
            baslik: 'Nervürlü Koltuk Takımı',
            aciklama: 'Siz de evinize konfor ve şıklık katmak istiyorsanız, özel ölçü üretimlerimiz için WhatsApp\'tan hemen fiyat alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-gulderen-toki-1.jpg',
            fotolar: [
                'images/teslimat-gulderen-toki-1.jpg',
                'images/teslimat-gulderen-toki-2.jpg',
                'images/teslimat-gulderen-toki-3.jpg'
            ]
        },
        {
            id: 'teslimat-iskenderun-genis-l',
            ilce: 'Hatay / İskenderun',
            baslik: 'Geniş L Koltuk Takımı',
            aciklama: 'Siz de evinize şıklık ve konfor katmak istiyorsanız, özel ölçü ve kumaş seçenekleri için WhatsApp\'tan bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-iskenderun-1.jpg',
            fotolar: [
                'images/teslimat-iskenderun-1.jpg',
                'images/teslimat-iskenderun-2.jpg',
                'images/teslimat-iskenderun-3.jpg'
            ]
        },
        {
            id: 'teslimat-altinozu-fitilli',
            ilce: 'Hatay / Altınözü',
            baslik: 'Fitilli Krem Buklet Koltuk',
            aciklama: 'Siz de evinize modern bir şıklık katmak istiyorsanız, özel kumaş kartelası ve detaylar için WhatsApp\'tan bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-altinozu-1.jpg',
            fotolar: [
                'images/teslimat-altinozu-1.jpg',
                'images/teslimat-altinozu-2.jpg'
            ]
        },
        {
            id: 'teslimat-samandag',
            ilce: 'Hatay / Samandağ',
            baslik: 'Özel Ölçü Salon Koltuk Takımı & Zigon Sehpa',
            aciklama: 'Siz de salonunuza şıklık katmak istiyorsanız, beğendiğiniz modeller için WhatsApp\'tan hızlıca fiyat alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-samandag-1.jpg',
            fotolar: [
                'images/teslimat-samandag-1.jpg',
                'images/teslimat-samandag-2.jpg'
            ]
        },
        {
            id: 'teslimat-kirkhan-toki',
            ilce: 'Hatay / Kırıkhan TOKİ',
            baslik: 'Salon Takımı, Yatak Odası & Genç Odası',
            aciklama: 'Siz de evinize şıklık ve ferahlık katmak istiyorsanız, oda ölçülerinize özel üretim için WhatsApp\'tan bize ulaşabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-kirkhan-toki-1.jpg',
            fotolar: [
                'images/teslimat-kirkhan-toki-1.jpg',
                'images/teslimat-kirkhan-toki-2.jpg',
                'images/teslimat-kirkhan-toki-3.jpg'
            ]
        },
        {
            id: 'teslimat-payas',
            ilce: 'Hatay / Payas',
            baslik: 'Şömineli TV Ünitesi, Salon & Oval Yemek Masası',
            aciklama: 'Siz de yaşam alanınıza şıklık katmak istiyorsanız, özel tasarım mobilyalarımız için WhatsApp\'tan detaylı bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-payas-1.jpg',
            fotolar: [
                'images/teslimat-payas-1.jpg',
                'images/teslimat-payas-2.jpg'
            ]
        },
        {
            id: 'teslimat-dikmece-toki',
            ilce: 'Hatay / Dikmece TOKİ',
            baslik: 'Vizon Salon Koltuk Takımı & Boy Aynası',
            aciklama: 'Siz de evinize konfor ve şıklık katmak istiyorsanız, özel ölçü üretimlerimiz için WhatsApp\'tan hemen fiyat alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-dikmece-toki-1.jpg',
            fotolar: [
                'images/teslimat-dikmece-toki-1.jpg',
                'images/teslimat-dikmece-toki-2.jpg'
            ]
        },
        {
            id: 'teslimat-reyhanli-kose',
            ilce: 'Hatay / Reyhanlı',
            baslik: 'Özel Ölçü Geniş U-Köşe Salon Takımı',
            aciklama: 'Siz de salonunuza şıklık ve geniş oturum katmak istiyorsanız, özel ölçü köşe takımları için WhatsApp\'tan bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-reyhanli-kose-1.jpg',
            fotolar: [
                'images/teslimat-reyhanli-kose-1.jpg',
                'images/teslimat-reyhanli-kose-2.jpg'
            ]
        },
        {
            id: 'teslimat-reyhanli-salon-yatak',
            ilce: 'Hatay / Reyhanlı',
            baslik: 'Antrasit Salon Takımı & LED Aynalı Yatak Odası',
            aciklama: 'Siz de evinize şıklık katmak istiyorsanız, hayalinizdeki mobilyalar için WhatsApp\'tan kolayca bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-reyhanli-salon-1.jpg',
            fotolar: [
                'images/teslimat-reyhanli-salon-1.jpg',
                'images/teslimat-reyhanli-salon-2.jpg',
                'images/teslimat-reyhanli-yatak-1.jpg'
            ]
        },
        {
            id: 'teslimat-antakya',
            ilce: 'Hatay / Antakya',
            baslik: 'Şömineli TV Konsolu & Krem Salon Takımı',
            aciklama: 'Siz de evinize şıklık katmak istiyorsanız, özel imalat koltuk takımlarımız için WhatsApp\'tan detaylı bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-antakya-1.jpg',
            fotolar: [
                'images/teslimat-antakya-1.jpg'
            ]
        },
        {
            id: 'teslimat-gulderen-toki-klasik',
            ilce: 'Hatay / Gülderen TOKİ',
            baslik: 'Özel Ölçü Salon Koltuk Takımı & Sehpa',
            aciklama: 'Siz de evinize şıklık ve konfor katmak istiyorsanız, atölyemizden doğrudan fiyat için WhatsApp\'tan bilgi alabilirsiniz.',
            tarih: '24 Eylül 2026',
            foto: 'images/teslimat-gulderen-toki-1.jpg',
            fotolar: [
                'images/teslimat-gulderen-toki-1.jpg',
                'images/teslimat-gulderen-toki-2.jpg'
            ]
        }
    ];

    // Statik varsayılan mağaza / atölye fotoğrafları
    const varsayilanMagaza = [
        'images/magaza-fabrika.jpg',
        'images/atolye-milano-takim.jpg'
    ];

    const display = document.getElementById('gallery-tab-display');
    const emptyEl = document.getElementById('gallery-tab-empty');
    const tabBtns = document.querySelectorAll('.gallery-tab-btn');
    const districtFilterBar = document.getElementById('delivery-district-filter-bar');
    const districtBtns = document.querySelectorAll('.delivery-filter-btn');
    if (!display) return;

    let aktifSekme = 'teslimat';
    let aktifIlce = 'all';

    function getDinamikTeslimatlar() {
        try {
            const kayitli = JSON.parse(localStorage.getItem('kilickoltuk_teslimatlar_v4') || '[]');
            if (Array.isArray(kayitli) && kayitli.length > 0) return kayitli;
        } catch(e) {}
        return varsayilanTeslimat;
    }

    function getDinamikMagaza() {
        let list = [];
        try {
            const atolye = JSON.parse(localStorage.getItem('kilickoltuk_atolye') || '[]');
            if (Array.isArray(atolye) && atolye.length > 0) {
                list = atolye.map(item => item.foto || item);
            }
        } catch(e) {}
        return list.length > 0 ? list : varsayilanMagaza;
    }

    let teslimatExpanded = false;
    const INITIAL_VISIBLE_COUNT = 6;

    window.toggleTumTeslimatlar = function() {
        teslimatExpanded = !teslimatExpanded;
        const extraCards = display.querySelectorAll('.delivery-extra-card');
        const btn = document.getElementById('btn-toggle-deliveries');
        const total = display.querySelectorAll('.pinterest-card').length;

        extraCards.forEach(c => {
            if (teslimatExpanded) {
                c.style.display = 'block';
                setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 30);
            } else {
                c.style.opacity = '0';
                c.style.transform = 'translateY(15px)';
                setTimeout(() => { c.style.display = 'none'; }, 200);
            }
        });

        if (btn) {
            btn.innerHTML = teslimatExpanded
                ? '<i class="fas fa-chevron-up"></i> <span>Daha Az Göster</span>'
                : `<i class="fas fa-chevron-down"></i> <span>Daha Fazla Teslimat Göster (${total - INITIAL_VISIBLE_COUNT} Teslimat Daha)</span>`;
        }

        if (!teslimatExpanded) {
            const vitrinEl = document.getElementById('teslimat-vitrini');
            if (vitrinEl) vitrinEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Teslimat kartlarını oluştur (Pinterest Tarzı Parallax Masonry Wall - Görseldeki Tasarım)
    function renderGallery() {
        display.innerHTML = '';

        let teslimatlar = getDinamikTeslimatlar();

        if (!teslimatlar || !teslimatlar.length) {
            if (emptyEl) {
                emptyEl.style.display = 'flex';
                emptyEl.innerHTML = `
                    <i class="fas fa-truck-loading"></i>
                    <h3>Teslimatlarımız Hazırlanıyor</h3>
                    <p>Müşteri teslimat fotoğraflarımız hazırlanıyor.</p>
                `;
            }
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';

        // 3 Sütunlu Pinterest Parallax Konteyner
        const wall = document.createElement('div');
        wall.className = 'pinterest-masonry-wall';
        wall.id = 'pinterestWall';

        const col0 = document.createElement('div'); col0.className = 'pinterest-col';
        const col1 = document.createElement('div'); col1.className = 'pinterest-col';
        const col2 = document.createElement('div'); col2.className = 'pinterest-col';
        const cols = [col0, col1, col2];

        // Sütun ve satıra göre şaşırtmalı Pinterest yükseklikleri (Görseldeki gibi: 1. sütun kısa, 2. sütun uzun dikey, 3. sütun orta)
        const heightMatrix = [
            ['h-short', 'h-tall', 'h-med', 'h-tall'], // Sütun 0
            ['h-tall', 'h-short', 'h-med', 'h-tall'],  // Sütun 1
            ['h-med', 'h-tall', 'h-short', 'h-med']    // Sütun 2
        ];

        teslimatlar.forEach((item, i) => {
            const photos = (Array.isArray(item.fotolar) && item.fotolar.length > 0)
                ? item.fotolar
                : (item.foto ? [item.foto] : (typeof item === 'string' ? [item] : []));

            const kapakFoto = photos[0] || 'images/magaza-fabrika.jpg';
            let ilce = item.ilce || 'Hatay';
            const cleanIlce = ilce.replace(/^Hatay\s*\/\s*/i, '').trim();
            const baslik = item.baslik || 'Özel İmalat Koltuk Takımı';
            const count = photos.length;
            const waText = encodeURIComponent(`Merhaba, web sitenizdeki "${cleanIlce} — ${baslik}" teslimatınızdaki mobilya takımı hakkında bilgi ve fiyat almak istiyorum.`);

            const colIndex = i % 3;
            const rowIndex = Math.floor(i / 3);
            const hClass = heightMatrix[colIndex][rowIndex % 4];

            const card = document.createElement('div');
            card.className = `pinterest-card ${hClass}`;
            card.setAttribute('title', `${cleanIlce} — ${baslik}`);

            // 6'dan sonraki kartlar açılır/kapanır
            if (i >= 6) {
                card.classList.add('delivery-extra-card');
                if (!teslimatExpanded) {
                    card.style.display = 'none';
                }
            }

            card.innerHTML = `
                <div class="pinterest-img-wrap">
                    <img class="pinterest-img" src="${kapakFoto}" alt="${cleanIlce} — ${baslik}" loading="lazy">
                    <div class="pinterest-overlay">
                        <div class="pinterest-info">
                            <span class="pinterest-location"><i class="fas fa-location-dot"></i> ${cleanIlce}</span>
                            <h4 class="pinterest-title">${baslik}</h4>
                            <a href="https://wa.me/905386029031?text=${waText}" target="_blank" class="pinterest-price-btn" onclick="event.stopPropagation()">
                                <span>Fiyat Sor</span>
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                        ${count > 1 ? `<span class="pinterest-count-badge"><i class="fas fa-images"></i> ${count} Fotoğraf</span>` : ''}
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                window.openDeliveryLightbox(photos, 0, baslik, cleanIlce);
            });

            // Round-robin 3 sütuna dağıt
            cols[colIndex].appendChild(card);
        });

        cols.forEach(col => wall.appendChild(col));
        display.appendChild(wall);

        // Buton görünürlüğü ve metni güncelle
        const toggleContainer = document.getElementById('delivery-toggle-container');
        const toggleBtn = document.getElementById('btn-toggle-deliveries');
        if (toggleContainer && toggleBtn) {
            if (teslimatlar.length <= 6) {
                toggleContainer.style.display = 'none';
            } else {
                toggleContainer.style.display = 'block';
                toggleBtn.innerHTML = teslimatExpanded
                    ? '<i class="fas fa-chevron-up"></i> <span>Daha Az Göster</span>'
                    : `<i class="fas fa-chevron-down"></i> <span>Daha Fazla Teslimat Göster (${teslimatlar.length - 6} Teslimat Daha)</span>`;
            }
        }
    }

    // Parallax Scroll (Kullanıcı kaydırdıkça 3 sütun birbirinden farklı hızlarda akıcı hareket eder)
    let isParallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!isParallaxTicking) {
            requestAnimationFrame(() => {
                const wall = document.getElementById('pinterestWall');
                if (wall && window.innerWidth > 950) {
                    const rect = wall.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const scrollDist = windowHeight - rect.top;
                        const cols = wall.querySelectorAll('.pinterest-col');
                        if (cols.length === 3) {
                            // 1. Sütun: Normal hız (hafif yukarı)
                            cols[0].style.transform = `translateY(${-(scrollDist * 0.03)}px)`;
                            // 2. Sütun: Daha hızlı / ofsetli hareket
                            cols[1].style.transform = `translateY(${scrollDist * 0.04}px)`;
                            // 3. Sütun: Farklı hızda gecikmeli hareket
                            cols[2].style.transform = `translateY(${-(scrollDist * 0.05)}px)`;
                        }
                    }
                }
                isParallaxTicking = false;
            });
            isParallaxTicking = true;
        }
    }, { passive: true });

    // Firebase Firestore'dan teslimatları ve vitrini çek
    if (window.db) {
        window.db.collection('site_data').doc('teslimatlar').get().then(doc => {
            if (doc.exists && doc.data() && Array.isArray(doc.data().items) && doc.data().items.length > 0) {
                localStorage.setItem('kilickoltuk_teslimatlar_v4', JSON.stringify(doc.data().items));
                if (aktifSekme === 'teslimat') renderGallery('teslimat');
            }
        }).catch(() => {});

        window.db.collection('site_data').doc('atolye').get().then(doc => {
            if (doc.exists && doc.data() && Array.isArray(doc.data().items) && doc.data().items.length > 0) {
                localStorage.setItem('kilickoltuk_atolye', JSON.stringify(doc.data().items));
                if (aktifSekme === 'magaza') renderGallery('magaza');
            }
        }).catch(() => {});
    }

    // Sunucu varsa API'den teslimatları ve vitrini taze çekip güncelle
    if (isServer) {
        fetch('api.php?action=get_teslimatlar')
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                    localStorage.setItem('kilickoltuk_teslimatlar_v4', JSON.stringify(res.data));
                    if (aktifSekme === 'teslimat') renderGallery('teslimat');
                }
            }).catch(() => {});

        fetch('api.php?action=get_instagram')
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                    localStorage.setItem('kilickoltuk_atolye', JSON.stringify(res.data));
                    if (aktifSekme === 'magaza') renderGallery('magaza');
                }
            }).catch(() => {});
    }

    // Başlangıç: Teslimatlar sekmesini yükle
    renderGallery('teslimat');

    // ============================================================
    // GELİŞMİŞ TESLİMAT ALBÜMÜ LIGHTBOX (TAM EKRAN SLIDER & GALERİ)
    // ============================================================
    window.openDeliveryLightbox = function(photos, startIndex, title, location) {
        if (!Array.isArray(photos) || photos.length === 0) return;
        let currentIndex = (typeof startIndex === 'number' && startIndex >= 0 && startIndex < photos.length) ? startIndex : 0;
        const total = photos.length;

        // Mevcut açık lightbox varsa kaldır
        const existing = document.getElementById('delivery-lightbox-modal');
        if (existing) existing.remove();

        const cleanLoc = (location || 'Hatay').replace(/^Hatay\s*\/\s*/i, '').trim();
        const displayTitle = title || 'Kılıç Koltuk Müşteri Teslimatı';
        const waText = encodeURIComponent(`Merhaba, web sitenizdeki "${cleanLoc} — ${displayTitle}" teslimatınızdaki mobilya takımı hakkında bilgi ve fiyat almak istiyorum.`);

        const overlay = document.createElement('div');
        overlay.id = 'delivery-lightbox-modal';
        overlay.className = 'delivery-lightbox-overlay';

        overlay.innerHTML = `
            <div class="delivery-lightbox-header">
                <div class="delivery-lightbox-info">
                    <div class="delivery-lightbox-title">${displayTitle}</div>
                    <div class="delivery-lightbox-meta">
                        <span><i class="fas fa-location-dot" style="color: #f43f5e;"></i> ${cleanLoc}</span>
                        <span id="lb-counter" style="color: rgba(255,255,255,0.7);"><i class="fas fa-camera"></i> Fotoğraf ${currentIndex + 1} / ${total}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <a href="https://wa.me/905386029031?text=${waText}" target="_blank" class="delivery-lightbox-wa-btn" title="WhatsApp Teklif Al">
                        <i class="fab fa-whatsapp"></i>
                        <span>WhatsApp Teklif Al</span>
                    </a>
                    <div class="delivery-lightbox-close" title="Kapat (ESC)"><i class="fas fa-times"></i></div>
                </div>
            </div>
            <div class="delivery-lightbox-body">
                ${total > 1 ? `<div class="delivery-lightbox-nav delivery-lightbox-prev" title="Önceki Fotoğraf (←)"><i class="fas fa-chevron-left"></i></div>` : ''}
                <img id="lb-main-image" class="delivery-lightbox-main-img" src="${photos[currentIndex]}" alt="${title}">
                ${total > 1 ? `<div class="delivery-lightbox-nav delivery-lightbox-next" title="Sonraki Fotoğraf (→)"><i class="fas fa-chevron-right"></i></div>` : ''}
            </div>
            ${total > 1 ? `
            <div class="delivery-lightbox-footer">
                <div class="delivery-lightbox-thumbs">
                    ${photos.map((src, idx) => `
                        <div class="delivery-lightbox-thumb ${idx === currentIndex ? 'active' : ''}" data-idx="${idx}">
                            <img src="${src}" alt="Önizleme ${idx + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const mainImg = overlay.querySelector('#lb-main-image');
        const counter = overlay.querySelector('#lb-counter');
        const thumbEls = overlay.querySelectorAll('.delivery-lightbox-thumb');
        const prevBtn = overlay.querySelector('.delivery-lightbox-prev');
        const nextBtn = overlay.querySelector('.delivery-lightbox-next');
        const closeBtn = overlay.querySelector('.delivery-lightbox-close');

        function updateImage(newIdx) {
            currentIndex = (newIdx + total) % total;
            if (mainImg) {
                mainImg.style.opacity = '0.3';
                mainImg.style.transform = 'scale(0.97)';
                setTimeout(() => {
                    mainImg.src = photos[currentIndex];
                    mainImg.style.opacity = '1';
                    mainImg.style.transform = 'scale(1)';
                }, 120);
            }
            if (counter) {
                counter.innerHTML = `<i class="fas fa-camera"></i> Fotoğraf ${currentIndex + 1} / ${total}`;
            }
            thumbEls.forEach((th, idx) => {
                th.classList.toggle('active', idx === currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateImage(currentIndex - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateImage(currentIndex + 1);
            });
        }

        thumbEls.forEach(th => {
            th.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(th.dataset.idx, 10);
                updateImage(idx);
            });
        });

        function closeModal() {
            document.removeEventListener('keydown', handleKeyDown);
            overlay.remove();
            document.body.style.overflow = '';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('delivery-lightbox-body')) {
                closeModal();
            }
        });

        // Klavye kontrolü
        function handleKeyDown(e) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft' && total > 1) updateImage(currentIndex - 1);
            if (e.key === 'ArrowRight' && total > 1) updateImage(currentIndex + 1);
        }
        document.addEventListener('keydown', handleKeyDown);

        // Dokunmatik kaydırma (Swipe)
        let touchStartX = 0;
        let touchEndX = 0;
        overlay.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        overlay.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50 && total > 1) {
                updateImage(currentIndex + 1); // sola kaydırdı -> sonraki
            } else if (touchEndX - touchStartX > 50 && total > 1) {
                updateImage(currentIndex - 1); // sağa kaydırdı -> önceki
            }
        }, { passive: true });
    };

    // Geriye dönük uyumluluk için tekil lightbox
    window.openPhotoLightbox = function(src) {
        window.openDeliveryLightbox([src], 0, 'Kılıç Koltuk Mobilya', 'Hatay');
    };
})();

// ============================================
// CANLI ÇALIŞMA SAATLERİ KONTROLÜ (09:00 - 18:00 | Pazar Kapalı)
// ============================================
(function() {
    function guncelleCalismaDurumu() {
        const statusPill = document.getElementById('live-store-status');
        const statusText = document.getElementById('live-store-text');
        if (!statusPill || !statusText) return;

        // Türkiye yerel saati
        const now = new Date();
        const gun = now.getDay(); // 0 = Pazar, 1 = Pzt, ..., 6 = Cmt
        const saat = now.getHours();
        const dakika = now.getMinutes();
        const toplamDakika = saat * 60 + dakika;

        const acilisDakika = 9 * 60;   // 09:00
        const kapanisDakika = 18 * 60; // 18:00

        if (gun === 0) {
            // Pazar günü kapalı
            statusPill.className = 'live-status-pill closed';
            statusText.textContent = 'ŞU AN KAPALI (Pazar)';
        } else if (toplamDakika >= acilisDakika && toplamDakika < kapanisDakika) {
            // Pazartesi - Cumartesi 09:00 - 18:00 arası açık
            statusPill.className = 'live-status-pill open';
            statusText.textContent = 'ŞU AN AÇIK (18:00\'e Kadar)';
        } else if (toplamDakika < acilisDakika) {
            statusPill.className = 'live-status-pill closed';
            statusText.textContent = 'ŞU AN KAPALI (09:00\'da Açılacak)';
        } else {
            const yarinMetin = gun === 6 ? 'Pazartesi 09:00' : 'Yarın 09:00';
            statusPill.className = 'live-status-pill closed';
            statusText.textContent = `ŞU AN KAPALI (${yarinMetin})`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', guncelleCalismaDurumu);
    } else {
        guncelleCalismaDurumu();
    }

    // Her 2 dakikada bir durumu kontrol et
    setInterval(guncelleCalismaDurumu, 120000);
})();

// ============================================
// Çift Dil Desteği (TR | EN Multi-Language System)
// ============================================
(function initLanguageSystem() {
    const translations = {
        tr: {
            navHome: "Ana Sayfa",
            navLiving: "Oturma Odası",
            navBedroom: "Yatak Odası",
            navDining: "Yemek Odası",
            navDeliveries: "Teslimatlar",
            navAbout: "Hakkımızda",
            navContact: "İletişim",
            heroTag1: "2004'TEN BERİ • ÖZEL ÖLÇÜ İMALAT",
            heroTitle1: "Her detayı huzur, her çizgisi konfor için tasarlandı.",
            heroBtn1: "Koleksiyonu İncele",
            heroTag2: "LÜKS BAZA • SİLİNEBİLİR BAŞLIK",
            heroTitle2: "Rüyalarınıza layık, usta ellerden çıkan benzersiz dokunuş.",
            heroBtn2: "Yatak Odasını Keşfet",
            heroTag3: "DOĞAL AHŞAP • ÖMÜRLÜK MEKANİZMALAR",
            heroTitle3: "Ailenizle en güzel anılara eşlik edecek lüks sofralar.",
            heroBtn3: "Yemek Odasını İncele",
            directionsBtn: "Canlı Yol Tarifi Al",
            viewMoreDeliveries: "Daha Fazla Teslimat Göster",
            collapseDeliveries: "Daha Az Göster"
        },
        en: {
            navHome: "Home",
            navLiving: "Living Room",
            navBedroom: "Bedroom",
            navDining: "Dining Room",
            navDeliveries: "Deliveries",
            navAbout: "About Us",
            navContact: "Contact",
            heroTag1: "SINCE 2004 • BESPOKE CRAFTSMANSHIP",
            heroTitle1: "Crafted for serenity in every detail, comfort in every contour.",
            heroBtn1: "Explore Collection",
            heroTag2: "LUXURY BASES • BESPOKE HEADBOARDS",
            heroTitle2: "Unmatched elegance shaped by master craftsmen for peaceful dreams.",
            heroBtn2: "Discover Bedrooms",
            heroTag3: "SOLID WOOD • TIMELESS MECHANISMS",
            heroTitle3: "Prestigious dining collections tailored for memorable moments.",
            heroBtn3: "Discover Dining",
            directionsBtn: "Get Live Directions",
            viewMoreDeliveries: "Show More Deliveries",
            collapseDeliveries: "Show Less"
        }
    };

    function setLanguage(lang) {
        if (!translations[lang]) lang = 'tr';
        localStorage.setItem('kilic_mobilya_lang', lang);
        document.documentElement.lang = lang;

        // Buton aktiflik sınıfları
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const t = translations[lang];

        // Navbar linkleri
        const linkMap = {
            '#home': t.navHome,
            '#oturma-odasi': t.navLiving,
            '#yatak-odasi': t.navBedroom,
            '#yemek-odasi': t.navDining,
            '#teslimat-vitrini': t.navDeliveries,
            '#hakkimizda': t.navAbout,
            '#iletisim': t.navContact
        };

        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (linkMap[href]) {
                link.textContent = linkMap[href];
            }
        });

        // Hero slayt içerikleri
        const slides = document.querySelectorAll('.hero-slide');
        if (slides[0]) {
            const tag = slides[0].querySelector('.hero-editorial-tag');
            const title = slides[0].querySelector('.hero-editorial-title');
            const btnSpan = slides[0].querySelector('.hero-editorial-btn span');
            if (tag) tag.textContent = t.heroTag1;
            if (title) title.textContent = t.heroTitle1;
            if (btnSpan) btnSpan.textContent = t.heroBtn1;
        }
        if (slides[1]) {
            const tag = slides[1].querySelector('.hero-editorial-tag');
            const title = slides[1].querySelector('.hero-editorial-title');
            const btnSpan = slides[1].querySelector('.hero-editorial-btn span');
            if (tag) tag.textContent = t.heroTag2;
            if (title) title.textContent = t.heroTitle2;
            if (btnSpan) btnSpan.textContent = t.heroBtn2;
        }
        if (slides[2]) {
            const tag = slides[2].querySelector('.hero-editorial-tag');
            const title = slides[2].querySelector('.hero-editorial-title');
            const btnSpan = slides[2].querySelector('.hero-editorial-btn span');
            if (tag) tag.textContent = t.heroTag3;
            if (title) title.textContent = t.heroTitle3;
            if (btnSpan) btnSpan.textContent = t.heroBtn3;
        }

        // Canlı Yol Tarifi Butonu
        const mapsBtnSpan = document.querySelector('.live-maps-btn span');
        if (mapsBtnSpan) {
            mapsBtnSpan.textContent = t.directionsBtn;
        }
    }

    // Event listener tanımla
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('.lang-btn');
        if (!langBtn) return;
        const selectedLang = langBtn.dataset.lang;
        if (selectedLang) {
            setLanguage(selectedLang);
        }
    });

    // Sayfa açılışında kayıtlı dili veya varsayılan Türkçe'yi yükle
    const savedLang = localStorage.getItem('kilic_mobilya_lang') || 'tr';
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setLanguage(savedLang));
    } else {
        setLanguage(savedLang);
    }
})();

// ============================================
// 3D ARC / KAVİSLİ SİLİNDİR CAROUSEL (COVERFLOW)
// ============================================
(function initArcCoverflowSystem() {
    function setupArc() {
        const stage = document.getElementById('arcStage');
        const track = document.getElementById('arcTrack');
        const cards = Array.from(document.querySelectorAll('.arc-card'));
        const dots = Array.from(document.querySelectorAll('.arc-dot'));
        const prevBtn = document.getElementById('arcPrevBtn');
        const nextBtn = document.getElementById('arcNextBtn');

        if (!stage || !track || cards.length === 0) return;

        let currentIndex = 0;
        const totalCards = cards.length;

        function updateArc() {
            const isMobile = window.innerWidth <= 768;
            const xStep1 = isMobile ? 150 : 250;
            const xStep2 = isMobile ? 260 : 420;
            const zStep1 = isMobile ? -50 : -60;
            const zStep2 = isMobile ? -130 : -160;
            const rotStep1 = isMobile ? 18 : 25;
            const rotStep2 = isMobile ? 28 : 36;

            cards.forEach((card, idx) => {
                let diff = idx - currentIndex;
                // Dairesel döngü için wrap-around
                if (diff > totalCards / 2) diff -= totalCards;
                if (diff < -totalCards / 2) diff += totalCards;

                card.classList.remove('active-card');
                card.style.display = 'block';

                if (diff === 0) {
                    // Merkez Aktif Kart
                    card.classList.add('active-card');
                    card.style.transform = `translateX(0px) translateZ(85px) rotateY(0deg) scale(1.06)`;
                    card.style.zIndex = '10';
                    card.style.opacity = '1';
                    card.style.filter = 'none';
                    card.style.pointerEvents = 'auto';
                } else if (diff === 1) {
                    // Sağ 1
                    card.style.transform = `translateX(${xStep1}px) translateZ(${zStep1}px) rotateY(-${rotStep1}deg) scale(0.89)`;
                    card.style.zIndex = '6';
                    card.style.opacity = '0.75';
                    card.style.filter = 'brightness(0.72) blur(0.4px)';
                    card.style.pointerEvents = 'auto';
                } else if (diff === -1) {
                    // Sol 1
                    card.style.transform = `translateX(-${xStep1}px) translateZ(${zStep1}px) rotateY(${rotStep1}deg) scale(0.89)`;
                    card.style.zIndex = '6';
                    card.style.opacity = '0.75';
                    card.style.filter = 'brightness(0.72) blur(0.4px)';
                    card.style.pointerEvents = 'auto';
                } else if (diff === 2) {
                    // Sağ 2
                    card.style.transform = `translateX(${xStep2}px) translateZ(${zStep2}px) rotateY(-${rotStep2}deg) scale(0.76)`;
                    card.style.zIndex = '3';
                    card.style.opacity = '0.4';
                    card.style.filter = 'brightness(0.5) blur(1.2px)';
                    card.style.pointerEvents = 'auto';
                } else if (diff === -2) {
                    // Sol 2
                    card.style.transform = `translateX(-${xStep2}px) translateZ(${zStep2}px) rotateY(${rotStep2}deg) scale(0.76)`;
                    card.style.zIndex = '3';
                    card.style.opacity = '0.4';
                    card.style.filter = 'brightness(0.5) blur(1.2px)';
                    card.style.pointerEvents = 'auto';
                } else {
                    // Gizli kartlar
                    card.style.transform = `translateX(0px) translateZ(-250px) scale(0.5)`;
                    card.style.zIndex = '1';
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';
                }
            });

            // Alt indikatör noktalarını güncelle
            dots.forEach((dot, dIdx) => {
                dot.classList.toggle('active', dIdx === currentIndex);
            });

            // Dinamik WhatsApp CTA güncelle
            const activeCard = cards[currentIndex];
            const waBtn = document.getElementById('arcWhatsAppCta');
            const waLabel = document.getElementById('arcWaCtaLabel');
            if (waBtn && waLabel && activeCard) {
                const msg = activeCard.getAttribute('data-wa-msg') || '';
                const label = activeCard.getAttribute('data-wa-label') || 'WhatsApp\'tan Bilgi Al';
                waBtn.href = `https://wa.me/905386029031?text=${msg}`;
                waLabel.textContent = label;
            }
        }

        function goTo(idx) {
            currentIndex = (idx + totalCards) % totalCards;
            updateArc();
        }

        function next() { goTo(currentIndex + 1); }
        function prev() { goTo(currentIndex - 1); }

        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); next(); });
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prev(); });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => goTo(idx));
        });

        cards.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                if (currentIndex !== idx) {
                    e.preventDefault();
                    goTo(idx);
                }
            });
        });

        // Mobil Dokunmatik Kaydırma (Touch Swipe)
        let touchStartX = 0;
        let touchEndX = 0;
        stage.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        stage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) next();
                else prev();
            }
        }, { passive: true });

        // Masaüstü Mouse Drag
        let isMouseDown = false;
        let mouseStartX = 0;

        stage.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            isMouseDown = true;
            mouseStartX = e.clientX;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            const diffX = mouseStartX - e.clientX;
            if (Math.abs(diffX) > 45) {
                if (diffX > 0) next();
                else prev();
            }
        });

        window.addEventListener('resize', updateArc, { passive: true });

        // İlk başlatma
        updateArc();
    }

    // Koleksiyonu İncele butonu köprüsü
    window.openArcCategory = function(key) {
        const titles = {
            'koltuk-takimi': 'Koltuk Takımları',
            'kose-takimi': 'Köşe Takımları',
            'yatak-odasi-koleksiyonu': 'Yatak Odası Koleksiyonu',
            'cift-kisilik-yatak': 'Çift Kişilik Yatak & Baza',
            'yemek-masasi': 'Yemek Masaları & Sandalyeler',
            'tv-unitesi': 'TV Üniteleri'
        };

        const title = titles[key] || 'Ürün Koleksiyonu';

        // Mevcut kategori overlay'ini aç
        const overlay = document.getElementById('kategori-sayfasi');
        const baslikEl = document.getElementById('kat-baslik');
        if (overlay && baslikEl && typeof window.katSayfasiAc === 'function') {
            window.katSayfasiAc(key, title);
        } else {
            // İlgili kategori bölümüne yumuşak kaydır
            const targetSectionMap = {
                'koltuk-takimi': '#oturma-odasi',
                'kose-takimi': '#oturma-odasi',
                'yatak-odasi-koleksiyonu': '#yatak-odasi',
                'cift-kisilik-yatak': '#yatak-odasi',
                'yemek-masasi': '#yemek-odasi',
                'tv-unitesi': '#oturma-odasi'
            };
            const targetEl = document.querySelector(targetSectionMap[key] || '#oturma-odasi');
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const tile = targetEl.querySelector(`[data-gallery="${key}"]`);
                    if (tile) tile.click();
                }, 400);
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupArc);
    } else {
        setupArc();
    }
})();



