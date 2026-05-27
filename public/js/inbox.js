// ============================================
// CAMPUSCONNECT - COMPLETE JAVASCRIPT
// For the Dark Theme Landing Page
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. CHECK AUTHENTICATION STATUS
    // ============================================
    
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('cc_session') === 'true';
        const loginBtn = document.querySelector('.login-btn');
        const loginLink = document.querySelector('.login-link a');
        
        if (isLoggedIn) {
            // User is logged in - change buttons to Dashboard
            if (loginBtn) {
                loginBtn.textContent = 'Dashboard';
                loginBtn.onclick = function() {
                    window.location.href = '/pages/dashboard.html';
                };
            }
            if (loginLink) {
                loginLink.textContent = 'Dashboard →';
                loginLink.href = '/pages/dashboard.html';
                loginLink.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = '/pages/dashboard.html';
                };
            }
        } else {
            // User not logged in
            if (loginBtn) {
                loginBtn.onclick = function() {
                    window.location.href = '/pages/login.html';
                };
            }
            if (loginLink) {
                loginLink.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = '/pages/login.html';
                };
            }
        }
    }
    
    // ============================================
    // 2. HANDLE CARD CLICKS (I need something done / I have skills to offer)
    // ============================================
    
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Add ripple effect
            createRippleEffect(e, this);
            
            // Get card title
            const title = this.querySelector('h3').textContent;
            
            if (title.includes('need something done') || title.includes('Seek')) {
                // User wants to FIND a service
                localStorage.setItem('cc_user_intent', 'buyer');
                showNotification('Finding Services', 'Redirecting you to find campus services...', 'info');
                
                setTimeout(() => {
                    window.location.href = '/pages/get-started.html?role=buy';
                }, 500);
            } 
            else if (title.includes('have skills') || title.includes('offer')) {
                // User wants to SELL/Provide a service
                localStorage.setItem('cc_user_intent', 'seller');
                showNotification('Start Earning', 'Redirecting you to list your skills...', 'success');
                
                setTimeout(() => {
                    window.location.href = '/pages/get-started.html?role=sell';
                }, 500);
            }
        });
    });
    
    // ============================================
    // 3. RIPPLE EFFECT ON CLICK
    // ============================================
    
    function createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple animation to styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleAnimation {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ============================================
    // 4. STATS COUNTER ANIMATION
    // ============================================
    
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        let hasAnimated = sessionStorage.getItem('statsAnimated');
        
        if (hasAnimated === 'true') return;
        
        stats.forEach(stat => {
            let target = 0;
            const text = stat.textContent;
            
            // Parse target numbers
            if (text.includes('12K') || text.includes('12,000')) {
                target = 12000;
            } else if (text.includes('4.8K') || text.includes('4,800')) {
                target = 4800;
            } else if (text.includes('35+')) {
                target = 35;
            } else {
                // Extract numbers from text
                const match = text.match(/\d+(?:\.\d+)?/);
                if (match) {
                    target = parseFloat(match[0]);
                    if (text.includes('K') && target < 100) target *= 1000;
                }
            }
            
            let current = 0;
            const suffix = text.includes('K+') ? 'K+' : (text.includes('+') ? '+' : '');
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let step = 0;
            
            const timer = setInterval(() => {
                step++;
                current += increment;
                
                if (step >= steps) {
                    current = target;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                
                if (suffix === 'K+') {
                    displayValue = Math.floor(current / 1000) + 'K+';
                } else if (suffix === '+') {
                    displayValue = Math.floor(current) + '+';
                }
                
                stat.textContent = displayValue;
            }, duration / steps);
        });
        
        sessionStorage.setItem('statsAnimated', 'true');
    }
    
    // Trigger stats animation when visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }
    
    // ============================================
    // 5. NAVIGATION HANDLERS
    // ============================================
    
    // How it works button
    const howItWorksBtn = Array.from(document.querySelectorAll('.nav-links a')).find(a => a.textContent === 'How it works');
    if (howItWorksBtn) {
        howItWorksBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('How it Works', 'Learn how CampusConnect helps you succeed', 'info');
            setTimeout(() => {
                window.location.href = '/pages/how-it-works.html';
            }, 300);
        });
    }
    
    // About button
    const aboutBtn = Array.from(document.querySelectorAll('.nav-links a')).find(a => a.textContent === 'About');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('About Us', 'Learn more about CampusConnect', 'info');
            setTimeout(() => {
                window.location.href = '/pages/about.html';
            }, 300);
        });
    }
    
    // ============================================
    // 6. NOTIFICATION SYSTEM
    // ============================================
    
    window.showNotification = function(title, message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.cc-notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `cc-notification cc-notification-${type}`;
        
        // Set colors based on type
        let bgColor = '#f97316'; // orange default
        if (type === 'success') bgColor = '#10b981'; // green
        if (type === 'error') bgColor = '#ef4444'; // red
        if (type === 'info') bgColor = '#06b6d4'; // cyan
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" style="font-size: 20px;"></i>
                <div>
                    <strong style="display: block; font-size: 14px;">${title}</strong>
                    <span style="font-size: 13px; opacity: 0.9;">${message}</span>
                </div>
            </div>
            <button class="cc-notification-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0 8px;">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 10000;
            background: ${bgColor};
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            min-width: 280px;
            max-width: 380px;
            animation: slideInRight 0.3s ease;
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(10px);
            cursor: pointer;
        `;
        
        const closeBtn = notification.querySelector('.cc-notification-close');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            notification.remove();
        };
        
        notification.onclick = (e) => {
            if (e.target !== closeBtn) {
                notification.remove();
            }
        };
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    };
    
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(animationStyle);
    
    // ============================================
    // 7. SMOOTH SCROLLING
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#/' || href === '#0') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // 8. PARALLAX EFFECT ON HERO IMAGE
    // ============================================
    
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // ============================================
    // 9. TRACK PAGE VIEWS
    // ============================================
    
    function trackPageView() {
        const pageData = {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || 'direct',
            screenWidth: window.innerWidth
        };
        
        let views = JSON.parse(localStorage.getItem('cc_analytics') || '[]');
        views.push(pageData);
        
        // Keep only last 30 views
        if (views.length > 30) views = views.slice(-30);
        localStorage.setItem('cc_analytics', JSON.stringify(views));
    }
    
    trackPageView();
    
    // ============================================
    // 10. FLOATING ANIMATION FOR BACKGROUND ELEMENTS
    // ============================================
    
    const floatingDivs = document.querySelectorAll('.bg-animation div');
    floatingDivs.forEach((div, index) => {
        div.style.animationDelay = `${index * 3}s`;
        div.style.animationDuration = `${20 + index * 5}s`;
    });
    
    // ============================================
    // 11. INITIALIZE ALL
    // ============================================
    
    checkAuthStatus();
    
    // Log to console that JS is loaded
    console.log('CampusConnect - Landing page initialized');
    
    // Add welcome message for returning users
    const lastVisit = localStorage.getItem('cc_last_visit');
    const today = new Date().toDateString();
    
    if (lastVisit && lastVisit !== today) {
        setTimeout(() => {
            showNotification('Welcome back! 👋', 'Great to see you again on CampusConnect', 'info');
        }, 1000);
    }
    
    localStorage.setItem('cc_last_visit', today);
    
});

// ============================================
// 12. EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

window.CampusConnect = {
    showNotification: window.showNotification,
    logout: function() {
        localStorage.removeItem('cc_session');
        localStorage.removeItem('cc_user');
        localStorage.removeItem('cc_user_intent');
        window.location.href = '/';
    },
    getUserIntent: function() {
        return localStorage.getItem('cc_user_intent');
    }
};