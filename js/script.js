// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // You would typically send this data to your server
        // For now, just log the data and show a success message
        console.log({ name, email, subject, message });
        
        // Clear form
        contactForm.reset();
        
        // Show success message
        showNotification('Your message has been sent successfully!', 'success');
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}

// Function to get URL parameters (for courses.html)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Handle course filtering on courses.html page
const coursesContainer = document.querySelector('.courses-grid');
if (window.location.pathname.includes('courses.html') && coursesContainer) {
    const category = getUrlParameter('category');
    
    if (category) {
        // Add active class to category filter
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            if (filter.dataset.category === category) {
                filter.classList.add('active');
            }
        });
        
        // Filter courses based on category
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Course Buy Button Handler
const buyButtons = document.querySelectorAll('.btn-buy');
buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get course information
        const courseCard = button.closest('.course-card');
        const courseTitle = courseCard.querySelector('h3').textContent;
        const coursePrice = courseCard.querySelector('.discounted-price').textContent;
        
        // Store course info in localStorage for the checkout page
        localStorage.setItem('selectedCourse', JSON.stringify({
            title: courseTitle,
            price: coursePrice,
            id: button.getAttribute('href').split('=')[1]
        }));
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });
});

// Payment Method Selection on Checkout Page
const paymentOptions = document.querySelectorAll('.payment-method-option');
if (paymentOptions.length > 0) {
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            option.classList.add('active');
            
            // Show the payment details for the selected method
            const methodId = option.dataset.method;
            const paymentDetails = document.querySelectorAll('.payment-details');
            
            paymentDetails.forEach(detail => {
                if (detail.dataset.method === methodId) {
                    detail.classList.add('active');
                } else {
                    detail.classList.remove('active');
                }
            });
        });
    });
}

// Load selected course info on checkout page
const checkoutCourseInfo = document.querySelector('.checkout-course-info');
if (checkoutCourseInfo) {
    const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse'));
    
    if (selectedCourse) {
        const courseTitle = document.querySelector('.checkout-course-title');
        const coursePrice = document.querySelector('.checkout-course-price');
        
        courseTitle.textContent = selectedCourse.title;
        coursePrice.textContent = selectedCourse.price;
    }
}

// Authentication Form Validation
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Basic validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // In a real application, you would send this data to your server for authentication
        // For this demo, we'll simulate a successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        // In a real application, you would send this data to your server to create a new user
        // For this demo, we'll simulate a successful registration
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ name, email }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Check if user is logged in and update UI accordingly
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtonsContainer = document.querySelector('.auth-buttons');
    
    if (isLoggedIn && authButtonsContainer) {
        const user = JSON.parse(localStorage.getItem('user'));
        authButtonsContainer.innerHTML = `
            <div class="user-dropdown">
                <button class="btn btn-login user-dropdown-toggle">
                    <i class="fas fa-user"></i> ${user.name || user.email}
                </button>
                <div class="user-dropdown-menu">
                    <a href="profile.html">Profile</a>
                    <a href="my-courses.html">My Courses</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            </div>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
        
        // Add dropdown toggle functionality
        const dropdownToggle = document.querySelector('.user-dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', () => {
                document.querySelector('.user-dropdown-menu').classList.toggle('show');
            });
        }
    }
}

// Call the function to update the UI based on auth state
updateAuthUI();

// Social Login Buttons
const googleLoginBtn = document.getElementById('google-login');
const facebookLoginBtn = document.getElementById('facebook-login');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real application, you would implement Google OAuth
        // For this demo, we'll simulate a successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ 
            name: 'Google User', 
            email: 'google.user@example.com',
            authProvider: 'google'
        }));
        
        window.location.href = 'index.html';
    });
}

if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real application, you would implement Facebook OAuth
        // For this demo, we'll simulate a successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ 
            name: 'Facebook User', 
            email: 'facebook.user@example.com',
            authProvider: 'facebook'
        }));
        
        window.location.href = 'index.html';
    });
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: #fff;
        border-left: 4px solid #4f46e5;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left-color: #10b981;
    }
    
    .notification.error {
        border-left-color: #ef4444;
    }
    
    .notification.warning {
        border-left-color: #f59e0b;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #6b7280;
        margin-left: 10px;
    }
    
    .user-dropdown {
        position: relative;
    }
    
    .user-dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 180px;
        display: none;
        z-index: 100;
    }
    
    .user-dropdown-menu.show {
        display: block;
    }
    
    .user-dropdown-menu a {
        display: block;
        padding: 10px 15px;
        color: var(--dark-color);
        transition: background-color 0.3s;
    }
    
    .user-dropdown-menu a:hover {
        background-color: #f3f4f6;
    }
`;

document.head.appendChild(notificationStyles); 