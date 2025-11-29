// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. Image Slider for Gallery
    // ============================================
    const sliderImages = document.querySelectorAll('.slider-image');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const sliderDots = document.querySelectorAll('.slider-dot');
    
    let currentSlide = 0;
    
    function showSlide(n) {
        if (sliderImages.length === 0) return;
        
        // Wrap around
        if (n >= sliderImages.length) currentSlide = 0;
        if (n < 0) currentSlide = sliderImages.length - 1;
        
        // Hide all slides
        sliderImages.forEach(img => {
            img.style.display = 'none';
            img.classList.remove('active');
        });
        
        // Remove active class from dots
        sliderDots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        if (sliderImages[currentSlide]) {
            sliderImages[currentSlide].style.display = 'block';
            sliderImages[currentSlide].classList.add('active');
        }
        
        // Highlight current dot
        if (sliderDots[currentSlide]) {
            sliderDots[currentSlide].classList.add('active');
        }
    }
    
    // Previous/Next controls
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentSlide--;
            showSlide(currentSlide);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentSlide++;
            showSlide(currentSlide);
        });
    }
    
    // Dot controls
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-advance slider every 5 seconds
    if (sliderImages.length > 0) {
        showSlide(currentSlide);
        setInterval(function() {
            currentSlide++;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // ============================================
    // 2. Shopping Cart Counter
    // ============================================
    let cartCount = 0;
    const cartBadge = document.querySelector('.cart-count');
    
    // ============================================
    // 3. Notification System
    // ============================================
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const bgColor = type === 'success' ? '#2563eb' : '#ef4444';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // 4. Smooth Scroll for Anchor Links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    

    // ============================================
    // 7. Navigation Active State
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ============================================
    // 8. Contact Form Submission
    // ============================================
    const contactFormEnhanced = document.getElementById('contactForm');
    if (contactFormEnhanced) {
        contactFormEnhanced.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const subject = document.getElementById('subject')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show success message
            showNotification('Thank you for your message!', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // ============================================
    // 9. Add to Cart Buttons (Products Page)
    // ============================================
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card') || this.closest('tr');
            const productName = productCard?.querySelector('h3')?.textContent || 
                               productCard?.querySelector('div[style*="font-weight: 700"]')?.textContent ||
                               productCard?.querySelector('strong')?.textContent || 
                               'Product';
            
            // Increment cart counter
            cartCount++;
            
            // Update cart badge
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.style.display = 'inline-block';
            }
            
            // Visual feedback on button
            const originalText = this.textContent;
            const originalBg = this.style.backgroundColor;
            
            // Add animation
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            this.textContent = 'Added! ✓';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = originalBg;
            }, 1500);
            
            // Show notification
            showNotification(`${productName} added to cart! 🛒`, 'success');
        });
    });
    
    // ============================================
    // 9. Pricing Calculator (Pricing Page)
    // ============================================
    window.calculateSavings = function() {
        const budget = parseFloat(document.getElementById('budget')?.value) || 0;
        const orderValue = parseFloat(document.getElementById('orderValue')?.value) || 0;
        
        const ordersPerMonth = budget / orderValue;
        const annualSpend = budget * 12;
        
        // Free Plan Savings (baseline)
        const freeSavings = 0;
        
        // Smart Saver Plan (5% discount + $5 birthday)
        const basicDiscount = annualSpend * 0.05;
        const basicShipping = ordersPerMonth * 12 * (orderValue >= 50 ? 6 : 0);
        const basicTotal = basicDiscount + basicShipping + 5 - (9.99 * 12);
        
        // VIP Elite Plan (15% discount + $25 birthday)
        const premiumDiscount = annualSpend * 0.15;
        const premiumShipping = ordersPerMonth * 12 * 6;
        const premiumTotal = premiumDiscount + premiumShipping + 25 - (29.99 * 12);
        
        // Display results
        const freeSavingsEl = document.getElementById('freeSavings');
        const basicSavingsEl = document.getElementById('basicSavings');
        const premiumSavingsEl = document.getElementById('premiumSavings');
        const savingsResultEl = document.getElementById('savingsResult');
        
        if (freeSavingsEl) freeSavingsEl.textContent = '$' + Math.round(freeSavings);
        if (basicSavingsEl) basicSavingsEl.textContent = (basicTotal > 0 ? '+$' : '-$') + Math.abs(Math.round(basicTotal));
        if (premiumSavingsEl) premiumSavingsEl.textContent = (premiumTotal > 0 ? '+$' : '-$') + Math.abs(Math.round(premiumTotal));
        
        if (savingsResultEl) savingsResultEl.classList.add('show');
    };
    
    // ============================================
    // Console Log - Script Loaded
    // ============================================
    console.log('CityShop JavaScript loaded successfully!');
    console.log('Active Features: Image slider, cart system, notifications, contact form, navigation');
});

// ============================================
// Add CSS Animations
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
