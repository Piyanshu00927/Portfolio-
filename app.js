/**
 * Car Pathshala Portfolio - Main JavaScript
 * Handles navigation, form submission, filtering, and animations
 */

// ============================================================================
// Mobile Navigation
// ============================================================================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ============================================================================
// Navbar Scroll Effect
// ============================================================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
});

// ============================================================================
// Work Filter
// ============================================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        workItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ============================================================================
// Contact Form Handling
// ============================================================================
function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Show success message
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
    }, 1500);
}

// ============================================================================
// Newsletter Form Handling
// ============================================================================
function handleNewsletter(event) {
    event.preventDefault();

    const input = event.target.querySelector('input');
    const email = input.value;

    // Simulate subscription
    showToast(`Thanks for subscribing with ${email}!`, 'success');
    input.value = '';
}

// ============================================================================
// Toast Notifications
// ============================================================================
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.4s ease;
    `;

    document.body.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Add toast animations to head
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(toastStyles);

// ============================================================================
// Intersection Observer for Scroll Animations
// ============================================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.about-text p, .about-highlights li, .work-item, .contact-item, .footer-content > div').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// ============================================================================
// Smooth Scroll with Offset for Fixed Navbar
// ============================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================================================
// Stats Counter Animation (Optional Enhancement)
// ============================================================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = counter.textContent.replace(/\D/g, '');
        const suffix = counter.textContent.replace(/\d/g, '').replace(/[K]/g, 'K');
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current + suffix;
        }, 16);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Initialize counter animation when hero is visible
animateCounters();

// ============================================================================
// Keyboard Navigation Support
// ============================================================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ============================================================================
// Performance: Preload Critical Images
// ============================================================================
function preloadImages() {
    const images = [
        'https://via.placeholder.com/600x400/2563eb/ffffff?text=Driving+Tips+Video',
        'https://via.placeholder.com/600x400/10b981/ffffff?text=Buying+Guide',
        'https://via.placeholder.com/600x400/f59e0b/ffffff?text=Automotive+Facts',
        'https://via.placeholder.com/600x400/ef4444/ffffff?text=Safety+Tips',
        'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Car+Maintenance',
        'https://via.placeholder.com/600x400/06b6d4/ffffff?text=Industry+News'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Preload on load
window.addEventListener('load', preloadImages);

console.log('🚗 Car Pathshala Portfolio Loaded Successfully!');
console.log('📊 Stats: 1.2K Facebook | 3.9K Instagram | 9.2K YouTube');