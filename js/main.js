/* Main JavaScript - Accessibility & Interactivity */

class MobileMenuHandler {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggle());
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
        }
    }
    
    toggle() {
        const isOpen = this.navMenu.classList.toggle('active');
        this.menuToggle.setAttribute('aria-expanded', isOpen);
    }
    
    close() {
        this.navMenu.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', false);
    }
}

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.formStatus = document.getElementById('form-status');
        this.fields = this.form.querySelectorAll('input, textarea, select');
        
        this.setupValidation();
        this.setupFormSubmission();
    }
    
    setupValidation() {
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('change', () => this.validateField(field));
            
            if (field.id === 'message') {
                field.addEventListener('input', () => this.updateCharacterCount(field));
            }
        });
    }
    
    validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (!errorElement) return;
        
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }
        
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        if (isValid) {
            field.setAttribute('aria-invalid', false);
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        } else {
            field.setAttribute('aria-invalid', true);
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
        
        return isValid;
    }
    
    updateCharacterCount(textarea) {
        const charCount = document.getElementById('message-count');
        const currentLength = textarea.value.length;
        const maxLength = 1000;
        
        charCount.textContent = `${currentLength} / ${maxLength} characters`;
        
        if (currentLength >= maxLength) {
            textarea.value = textarea.value.substring(0, maxLength);
        }
    }
    
    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    isFormValid() {
        let isValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.isFormValid()) {
            this.showStatus('Please correct the errors above.', 'error');
            return;
        }
        
        this.submitForm();
    }
    
    submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        setTimeout(() => {
            this.showStatus('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }, 1500);
    }
    
    showStatus(message, type) {
        this.formStatus.textContent = message;
        this.formStatus.className = `form-status show ${type}`;
        this.formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

class AccessibilityFeatures {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                    menuToggle.focus();
                }
            }
        });
    }
    
    setupFocusManagement() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenuHandler();
    new FormValidator('contact-form');
    new AccessibilityFeatures();
    
    console.log('✓ Accessibility features initialized');
});

// Test accessibility function
window.testAccessibility = function() {
    console.log('=== Accessibility Test Results ===');
    
    const skipLink = document.querySelector('.skip-link');
    console.log('Skip Link:', skipLink ? '✓ Found' : '✗ Missing');
    
    const main = document.querySelector('main');
    console.log('Main Landmark:', main ? '✓ Found' : '✗ Missing');
    
    const nav = document.querySelector('nav');
    console.log('Navigation Landmark:', nav ? '✓ Found' : '✗ Missing');
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log(`Headings Found: ${headings.length}`);
    
    const ariaLabels = document.querySelectorAll('[aria-label]');
    console.log(`ARIA Labels: ${ariaLabels.length}`);
    
    const formFields = document.querySelectorAll('input, select, textarea');
    const labeledFields = Array.from(formFields).filter(field => {
        return document.querySelector(`label[for="${field.id}"]`) || field.getAttribute('aria-label');
    });
    console.log(`Form Fields with Labels: ${labeledFields.length}/${formFields.length}`);
    
    const images = document.querySelectorAll('img');
    const altImages = Array.from(images).filter(img => img.hasAttribute('alt'));
    console.log(`Images with Alt Text: ${altImages.length}/${images.length}`);
    
    console.log('✓ Accessibility test complete.');
};