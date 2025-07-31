// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// Theme Switcher
const themeSwitcher = document.querySelector('.theme-switcher');
const themeIcon = themeSwitcher.querySelector('i');
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

// Apply theme on page load
if (isDarkTheme) {
    document.body.classList.add('dark-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeSwitcher.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('darkTheme', isDarkTheme);
    document.body.classList.toggle('dark-theme');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Project Card Flip with touch support
projectCards.forEach(card => {
    let touchStartX = 0;
    let touchEndX = 0;

    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });

    // Touch events for mobile
    card.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    card.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            card.classList.toggle('flipped');
        }
    }
});

// Enhanced Skill Bars Animation
const skillBars = document.querySelectorAll('.skill-progress');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Trigger skill bars animation when section is in view
const skillsSection = document.querySelector('.skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(skillsSection);

// Custom Notification System
function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon;
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            icon = 'fas fa-info-circle';
    }
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <div class="progress">
            <div class="progress-bar"></div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Direct CV Download Handler
document.getElementById('download-cv').addEventListener('click', async (e) => {
    e.preventDefault();
    const link = e.target.closest('a');
    
    try {
        showNotification('Starting download...', 'info');
        
        const response = await fetch(link.href);
        if (!response.ok) {
            throw new Error('CV file not found');
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = downloadUrl;
        tempLink.download = link.getAttribute('download');
        document.body.appendChild(tempLink);
        
        // Trigger download
        tempLink.click();
        
        // Cleanup
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(tempLink);
        
        showNotification('CV downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Unable to download CV. Please try again later.', 'error');
    }
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Validate all fields are filled
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'warning');
        return;
    }

    // Submit form
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.success) {
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            throw new Error(result.message || 'Error sending message');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Error sending message. Please try again later.', 'error');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// CV Download Functionality
const cvButtons = document.querySelectorAll('.cv-option');
cvButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const link = e.target.closest('a');
        
        try {
            showNotification('Preparing your CV for download...', 'info');
            
            const response = await fetch(link.href);
            if (!response.ok) {
                throw new Error('CV file not found');
            }
            
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.href = downloadUrl;
            tempLink.download = link.getAttribute('download');
            document.body.appendChild(tempLink);
            
            // Trigger download
            tempLink.click();
            
            // Cleanup
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(tempLink);
            
            showNotification('CV downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            showNotification('Unable to download CV. Please try again later.', 'error');
        }
    });
});

// Typing effect for the hero title
const heroTitle = document.querySelector('.hero-text h1');
const text = heroTitle.textContent;
heroTitle.innerHTML = '';
let i = 0;

function typeWriter() {
    if (i < text.length) {
        heroTitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing effect when page loads
window.addEventListener('load', typeWriter);

// Service Modal Functionality
const modal = document.getElementById('serviceModal');
const modalBody = modal.querySelector('.modal-body');
const closeModal = document.querySelector('.close-modal');

const serviceDetails = {
    web: {
        title: 'Web Development Services',
        description: 'Professional web development services tailored to your needs.',
        features: [
            'Custom Website Development',
            'E-commerce Solutions',
            'API Integration',
            'Performance Optimization',
            'SEO-friendly Code',
            'Responsive Design',
            'Database Design',
            'Web Security'
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'PHP', 'MySQL'],
        process: [
            'Requirements Gathering',
            'Design Planning',
            'Development',
            'Testing',
            'Deployment',
            'Maintenance'
        ]
    },
    design: {
        title: 'UI/UX Design Services',
        description: 'Create beautiful and intuitive user experiences that engage your audience.',
        features: [
            'User Interface Design',
            'User Experience Design',
            'Responsive Design',
            'Prototyping',
            'Design Systems',
            'Usability Testing',
            'Interactive Mockups',
            'Design Consultation'
        ],
        technologies: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'],
        process: [
            'User Research',
            'Wireframing',
            'UI Design',
            'Prototyping',
            'User Testing',
            'Design Implementation'
        ]
    },
    mobile: {
        title: 'Mobile App Development',
        description: 'Build powerful and engaging mobile applications for iOS and Android.',
        features: [
            'iOS Development',
            'Android Development',
            'Cross-platform Apps',
            'App Store Optimization',
            'Push Notifications',
            'Offline Support',
            'Analytics Integration',
            'App Maintenance'
        ],
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        process: [
            'App Planning',
            'UI/UX Design',
            'Development',
            'Testing',
            'App Store Submission',
            'Maintenance'
        ]
    }
};

function openServiceModal(serviceType) {
    const service = serviceDetails[serviceType];
    if (!service) return;

    modalBody.innerHTML = `
        <h2>${service.title}</h2>
        <p class="service-description">${service.description}</p>
        
        <div class="service-details">
            <div class="service-section">
                <h3>Key Features</h3>
                <ul>
                    ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="service-section">
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    ${service.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="service-section">
                <h3>Development Process</h3>
                <div class="process-steps">
                    ${service.process.map((step, index) => `
                        <div class="process-step">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-text">${step}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="service-cta">
                <a href="#contact" class="cta-btn" onclick="closeServiceModal()">
                    Get Started
                </a>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

closeModal.addEventListener('click', closeServiceModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeServiceModal();
    }
});
