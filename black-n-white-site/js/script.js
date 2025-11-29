// script.js - CityShop E-commerce Site
document.addEventListener('DOMContentLoaded', function() {
  
  // Set current year in footer dynamically
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Set active menu item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuLinks = document.querySelectorAll('.sidebar-menu a');
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Form validation for contact page
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const message = document.getElementById('message')?.value.trim() || '';
      
      // Basic validation
      if (!name) {
        alert('Please enter your name');
        return false;
      }
      
      if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
      }
      
      if (!message) {
        alert('Please enter a message');
        return false;
      }
      
      alert('Thank you! Your message has been received.');
      contactForm.reset();
      return false;
    });
  }
});

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
