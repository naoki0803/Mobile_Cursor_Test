// Legacy script.js - Maintained for backward compatibility
// New functionality is handled by assets/js/app.js

console.log('Legacy script.js loaded - redirecting to new app architecture');

// If the new app hasn't loaded yet, provide basic navigation
if (typeof window.app === 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Basic navigation for sections that might not have been converted yet
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active states
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        // Basic smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    });
}

// Note: This file is kept for compatibility but most functionality
// has been moved to the new SPA architecture in assets/js/app.js