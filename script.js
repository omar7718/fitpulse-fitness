// Mobile Menu Toggle
        document.getElementById('mobile-menu').addEventListener('click', function() {
            document.getElementById('main-nav').classList.toggle('show');
        });

        // Simple Page Navigation
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + pageId) {
                    link.classList.add('active');
                }
            });
            
            // Close mobile menu
            document.getElementById('main-nav').classList.remove('show');
            
            // Scroll to top of page
            window.scrollTo(0, 0);
        }

        // Handle all navigation clicks
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const pageId = link.getAttribute('href').substring(1);
                showPage(pageId);
            }
        });

        // Testimonial Slider
        let currentSlide = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.slider-dot');

        function showTestimonial(n) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = n;
            testimonials[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });

        setInterval(() => {
            showTestimonial((currentSlide + 1) % testimonials.length);
        }, 5000);

        // Class Schedule Filter - SIMPLE FIX
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        const classTypes = document.querySelectorAll('.class-type');
        
        // Always show all table cells and rows
        document.querySelectorAll('.schedule-table td, .schedule-table tr').forEach(element => {
            element.style.display = '';
        });
        
        // Only hide the class type spans, not the table cells
        classTypes.forEach(type => {
            if (filter === 'all' || type.classList.contains(filter)) {
                type.style.display = 'inline-block';
            } else {
                type.style.display = 'none';
            }
        });
    });
});

        // Auth Tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');

        authTabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                this.classList.add('active');
                authForms[index].classList.add('active');
            });
        });

        // Form Submissions
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });

        // Form Submissions
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn');
    const originalText = btn.textContent;
    
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Set user as logged in
        localStorage.setItem('userLoggedIn', 'true');
        
        alert('Login successful!');
        this.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        showPage('schedule'); // Go to schedule page after login
        
        // Update registered classes display
        if (window.classBookingSystem) {
            window.classBookingSystem.updateRegisteredClassesDisplay();
        }
    }, 1500);
});

        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Creating Account...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Account created successfully!');
                this.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                authTabs[0].click();
            }, 1500);
        });

        // Class Booking System
function setupClassBooking() {
    let registeredClasses = JSON.parse(localStorage.getItem('registeredClasses')) || [];
    
    // Function to update the registered classes display
    function updateRegisteredClassesDisplay() {
        const registeredContainer = document.querySelector('.registered-classes-grid');
        const emptyState = document.querySelector('.empty-state');
        const registeredSection = document.querySelector('.registered-classes');
        
        if (!registeredContainer) return;
        
        registeredContainer.innerHTML = '';
        
        if (registeredClasses.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }
        
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        registeredClasses.forEach((classItem, index) => {
            const classCard = document.createElement('div');
            classCard.className = 'registered-class-card';
            classCard.innerHTML = `
                <div class="class-header">
                    <h4>${classItem.name}</h4>
                    <span class="class-type-badge ${classItem.type}">${classItem.type}</span>
                </div>
                <div class="class-details">
                    <div class="class-detail-item">
                        <i class="fas fa-calendar-day"></i>
                        <span>Day: ${classItem.day}</span>
                    </div>
                    <div class="class-detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Time: ${classItem.time}</span>
                    </div>
                    <div class="class-detail-item">
                        <i class="fas fa-dumbbell"></i>
                        <span>Intensity: ${getClassIntensity(classItem.type)}</span>
                    </div>
                </div>
                <div class="class-actions">
                    <button class="cancel-btn" data-index="${index}">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            `;
            registeredContainer.appendChild(classCard);
        });
        
        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cancelClass(index);
            });
        });
    }
    
    // Function to get class intensity based on type
    function getClassIntensity(type) {
        const intensities = {
            'yoga': 'Low',
            'pilates': 'Low',
            'cardio': 'Medium',
            'strength': 'High',
            'hiit': 'Very High',
            'cycling': 'High'
        };
        return intensities[type] || 'Medium';
    }
    
    // Function to register a class
    function registerClass(className, classType, day, time) {
        const classItem = {
            name: className,
            type: classType,
            day: day,
            time: time,
            id: Date.now() // Unique identifier
        };
        
        registeredClasses.push(classItem);
        localStorage.setItem('registeredClasses', JSON.stringify(registeredClasses));
        updateRegisteredClassesDisplay();
        
        // Show success message
        showNotification(`Successfully registered for ${className} on ${day} at ${time}`, 'success');
    }
    
    // Function to cancel a class
    function cancelClass(index) {
        const classItem = registeredClasses[index];
        if (confirm(`Are you sure you want to cancel your ${classItem.name} class on ${classItem.day} at ${classItem.time}?`)) {
            registeredClasses.splice(index, 1);
            localStorage.setItem('registeredClasses', JSON.stringify(registeredClasses));
            updateRegisteredClassesDisplay();
            showNotification(`Cancelled ${classItem.name} class`, 'info');
        }
    }
    
    // Function to show notifications
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: var(--shadow-hover);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Handle class type clicks
    document.querySelectorAll('.class-type').forEach(classType => {
        classType.addEventListener('click', function() {
            const className = this.textContent;
            const classTypeValue = Array.from(this.classList)
                .find(cls => cls !== 'class-type');
            const timeCell = this.closest('tr').querySelector('td:first-child');
            const classTime = timeCell ? timeCell.textContent : 'unknown time';
            const dayHeader = this.closest('table').querySelector('thead th:nth-child(' + (this.closest('td').cellIndex + 1) + ')');
            const classDay = dayHeader ? dayHeader.textContent : 'unknown day';
            
            // Check if user is logged in (you can implement proper authentication)
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                showLoginRequiredMessage();
                return;
            }
            
            if (confirm(`Register for ${className} class on ${classDay} at ${classTime}?`)) {
                registerClass(className, classTypeValue, classDay, classTime);
            }
        });
    });
    
    // Handle "Book a Class Now" button
    const bookClassBtn = document.querySelector('a[data-page="login"]');
    if (bookClassBtn) {
        bookClassBtn.addEventListener('click', function(e) {
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!isLoggedIn) {
                e.preventDefault();
                showPage('login');
                showNotification('Please login to book classes', 'info');
            }
        });
    }
    
    // Function to show login required message
    function showLoginRequiredMessage() {
        const scheduleSection = document.querySelector('.schedule');
        let loginMessage = scheduleSection.querySelector('.login-required');
        
        if (!loginMessage) {
            loginMessage = document.createElement('div');
            loginMessage.className = 'login-required';
            loginMessage.innerHTML = `
                <h4>Login Required</h4>
                <p>Please login to register for classes</p>
                <a href="#login" class="btn" data-page="login">Login Now</a>
            `;
            scheduleSection.appendChild(loginMessage);
        }
        
        // Add click event to login button
        const loginBtn = loginMessage.querySelector('a[data-page="login"]');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('login');
            });
        }
    }
    
    // Initialize the display
    updateRegisteredClassesDisplay();
    
    return {
        registerClass,
        cancelClass,
        updateRegisteredClassesDisplay
    };
}

        // Membership Plan Selection
        function setupMembershipPlans() {
            document.querySelectorAll('.plan-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (!e.target.closest('.btn')) {
                        document.querySelectorAll('.plan-card').forEach(c => {
                            c.classList.remove('selected');
                        });
                        this.classList.add('selected');
                    }
                });
            });
        }

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
    
    // Reset registered classes on page load
    localStorage.removeItem('registeredClasses');
    localStorage.setItem('userLoggedIn', 'false');
    
    window.classBookingSystem = setupClassBooking();
    setupMembershipPlans();
    setupMembershipOnboarding(); // Add this line
    setupTrainers();
    document.querySelector('.filter-btn[data-filter="all"]').click();
});

// Enhanced Trainers Functionality
function setupTrainers() {
    const trainerModal = document.getElementById('trainerModal');
    const modalClose = document.getElementById('modalClose');
    const bookSessionBtns = document.querySelectorAll('.book-session-btn');
    const modalBookBtn = document.getElementById('modalBookBtn');
    const modalScheduleBtn = document.getElementById('modalScheduleBtn');

    // Trainer data
    const trainersData = {
        marcus: {
            name: "Marcus Johnson",
            specialty: "Strength & Conditioning Specialist",
            stats: [
                { value: "12+ Years", label: "Experience" },
                { value: "500+ Clients", label: "Trained" },
                { value: "95% Success", label: "Rate" }
            ],
            bio: "With over 12 years of experience in strength training and functional fitness, Marcus specializes in helping clients build muscle, increase strength, and improve overall athletic performance. His evidence-based approach combines scientific principles with practical application.",
            achievements: [
                "2022 National Powerlifting Champion",
                "Certified Strength Coach (CSCS)",
                "Precision Nutrition Level 2 Certified",
                "NASM Certified Personal Trainer"
            ],
            expertise: ["Powerlifting", "Bodybuilding", "Athletic Performance", "Injury Prevention", "Nutrition Planning"]
        },
        sophia: {
            name: "Sophia Martinez",
            specialty: "Yoga & Mindfulness Expert",
            stats: [
                { value: "8+ Years", label: "Experience" },
                { value: "300+ Clients", label: "Transformed" },
                { value: "98% Satisfaction", label: "Rate" }
            ],
            bio: "Sophia brings a holistic approach to fitness, combining ancient yoga practices with modern mindfulness techniques. Her classes focus on building strength, flexibility, and mental clarity through intentional movement and breath work.",
            achievements: [
                "International Yoga Alliance Certified (RYT-500)",
                "Mindfulness Meditation Teacher",
                "Published Author: 'Mindful Movement'",
                "Trauma-Informed Yoga Specialist"
            ],
            expertise: ["Vinyasa Flow", "Yin Yoga", "Meditation", "Stress Relief", "Flexibility Training"]
        },
        omar: {
            name: "Omar Murra",
            specialty: "HIIT & Cardio Specialist",
            stats: [
                { value: "6+ Years", label: "Experience" },
                { value: "650+ Clients", label: "Transformed" },
                { value: "12k+ Lbs", label: "Total Weight Lost" }
            ],
            bio: "Omar's high-energy workouts are scientifically designed to maximize calorie burn and improve cardiovascular health. His dynamic training style keeps workouts engaging while delivering measurable results in record time.",
            achievements: [
                "Transformation Specialist of the Year 2023",
                "Functional Training Certified",
                "Group Fitness Instructor Expert",
                "ACE Certified Personal Trainer"
            ],
            expertise: ["HIIT", "Fat Loss", "Metabolic Conditioning", "Endurance Training", "Circuit Training"]
        }
    };

    // Open modal when book session button is clicked
    bookSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const trainerId = this.getAttribute('data-trainer');
            openTrainerModal(trainerId);
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeTrainerModal);
    trainerModal.addEventListener('click', function(e) {
        if (e.target === trainerModal) {
            closeTrainerModal();
        }
    });

    // Modal button actions
    modalBookBtn.addEventListener('click', function() {
        const trainerName = document.getElementById('modalTrainerName').textContent;
        showNotification(`Redirecting to book a session with ${trainerName}`, 'success');
        closeTrainerModal();
        showPage('schedule');
    });

    modalScheduleBtn.addEventListener('click', function() {
        showNotification('Showing trainer availability schedule', 'info');
        closeTrainerModal();
        showPage('schedule');
    });

    function openTrainerModal(trainerId) {
        const trainer = trainersData[trainerId];
        if (!trainer) return;

        // Populate modal content
        document.getElementById('modalTrainerName').textContent = trainer.name;
        document.getElementById('modalTrainerSpecialty').textContent = trainer.specialty;
        document.getElementById('modalBio').textContent = trainer.bio;

        // Populate stats
        const statsContainer = document.getElementById('modalStats');
        statsContainer.innerHTML = trainer.stats.map(stat => `
            <div class="modal-stat">
                <span class="modal-stat-value">${stat.value}</span>
                <span class="modal-stat-label">${stat.label}</span>
            </div>
        `).join('');

        // Populate achievements
        const achievementsContainer = document.getElementById('modalAchievements');
        achievementsContainer.innerHTML = `
            <div class="achievements-title">
                <i class="fas fa-trophy"></i>
                <span>Key Achievements</span>
            </div>
            <div class="achievements-list">
                ${trainer.achievements.map(achievement => `
                    <div class="achievement-item">
                        <i class="fas fa-award"></i>
                        <span>${achievement}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Populate expertise
        const expertiseContainer = document.getElementById('modalExpertise');
        expertiseContainer.innerHTML = `
            <div class="expertise-title">
                <i class="fas fa-dumbbell"></i>
                <span>Areas of Expertise</span>
            </div>
            <div class="expertise-tags">
                ${trainer.expertise.map(skill => `
                    <span class="expertise-tag">${skill}</span>
                `).join('')}
            </div>
        `;

        // Show modal
        trainerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTrainerModal() {
        trainerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && trainerModal.classList.contains('active')) {
            closeTrainerModal();
        }
    });
}

// Update the DOMContentLoaded to include trainers setup
document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
    
    // Reset registered classes on page load
    localStorage.removeItem('registeredClasses');
    localStorage.setItem('userLoggedIn', 'false');
    
    window.classBookingSystem = setupClassBooking();
    setupMembershipPlans();
    setupTrainers(); // Add this line
    document.querySelector('.filter-btn[data-filter="all"]').click();
});

function setupMembershipOnboarding() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        const getStartedBtn = card.querySelector('.btn[data-page="login"]');
        
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            const planName = card.querySelector('.plan-header h3').textContent;
            
            // SIMPLE FIX: Get only the dollar amount text
const planPriceElement = card.querySelector('.plan-price');
let planPrice = planPriceElement.textContent.split('/')[0].trim();
            
            const isPopular = card.classList.contains('popular');
            
            if (isLoggedIn) {
                startMembershipOnboarding(planName, planPrice, isPopular);
            } else {
                showPage('login');
                showNotification('Please login to select a membership plan', 'info');
            }
        });
    });
}

function startMembershipOnboarding(planName, planPrice, isPopular) {
    // Step 1: Plan Confirmation
    showPlanConfirmationStep(planName, planPrice, isPopular);
}

function showPlanConfirmationStep(planName, planPrice, isPopular) {
    const modalHTML = `
        <div class="onboarding-modal active" id="onboardingModal">
            <div class="modal-content">
                <div class="onboarding-header">
                    <h2>🎉 Perfect Choice!</h2>
                    <p>You're one step away from starting your fitness journey</p>
                </div>
                
                <div class="plan-summary">
                    <div class="selected-plan ${isPopular ? 'popular-plan' : ''}">
                        <h3>${planName} Plan</h3>
                        <div class="plan-price">${planPrice}/month</div>
                        ${isPopular ? '<div class="popular-badge">Most Popular</div>' : ''}
                    </div>
                    
                    <div class="plan-benefits">
                        <h4>What you get:</h4>
                        <ul>
                            ${getPlanBenefits(planName)}
                        </ul>
                    </div>
                </div>
                
                <div class="onboarding-actions">
                    <button class="btn btn-secondary" id="cancelOnboarding">
                        <i class="fas fa-arrow-left"></i>
                        Back to Plans
                    </button>
                    <button class="btn" id="confirmPlan">
                        Continue to Goals 
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Event listeners for this step
    document.getElementById('confirmPlan').addEventListener('click', function() {
        removeOnboardingModal();
        showGoalSettingStep(planName, planPrice);
    });
    
    document.getElementById('cancelOnboarding').addEventListener('click', function() {
    removeOnboardingModal();
    showPage('membership'); // This will redirect to membership page
});
}

function showGoalSettingStep(planName, planPrice) {
    const modalHTML = `
        <div class="onboarding-modal active" id="onboardingModal">
            <div class="modal-content">
                <div class="onboarding-header">
                    <h2>🎯 Define Your Goals</h2>
                    <p>Help us personalize your experience</p>
                </div>
                
                <div class="goal-selection">
                    <h4>What's your main fitness goal?</h4>
                    <div class="goal-options">
                        <div class="goal-option" data-goal="weight-loss">
                            <div class="goal-icon">
                                <i class="fas fa-weight-scale"></i>
                            </div>
                            <h5>Weight Loss</h5>
                            <p>Shed pounds and improve health</p>
                        </div>
                        
                        <div class="goal-option" data-goal="muscle-gain">
                            <div class="goal-icon">
                                <i class="fas fa-dumbbell"></i>
                            </div>
                            <h5>Build Muscle</h5>
                            <p>Gain strength and size</p>
                        </div>
                        
                        <div class="goal-option" data-goal="toning">
                            <div class="goal-icon">
                                <i class="fas fa-heart-pulse"></i>
                            </div>
                            <h5>Get Toned</h5>
                            <p>Define muscles and improve shape</p>
                        </div>
                        
                        <div class="goal-option" data-goal="fitness">
                            <div class="goal-icon">
                                <i class="fas fa-person-running"></i>
                            </div>
                            <h5>General Fitness</h5>
                            <p>Stay active and healthy</p>
                        </div>
                    </div>
                </div>
                
                <div class="onboarding-actions">
                    <button class="btn btn-secondary" id="backToPlan">
                        <i class="fas fa-arrow-left"></i>
                        Back
                    </button>
                    <button class="btn" id="confirmGoal" disabled>
                        Continue 
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    let selectedGoal = null;
    
    // Goal selection logic
    document.querySelectorAll('.goal-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.goal-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedGoal = this.getAttribute('data-goal');
            document.getElementById('confirmGoal').disabled = false;
        });
    });
    
    // Event listeners for this step
    document.getElementById('confirmGoal').addEventListener('click', function() {
        if (selectedGoal) {
            removeOnboardingModal();
            showWelcomeStep(planName, planPrice, selectedGoal);
        }
    });
    
    document.getElementById('backToPlan').addEventListener('click', function() {
        removeOnboardingModal();
        showPlanConfirmationStep(planName, planPrice, planName === 'Premium');
    });
}

function showWelcomeStep(planName, planPrice, selectedGoal) {
    const goalText = {
        'weight-loss': 'weight loss',
        'muscle-gain': 'muscle building', 
        'toning': 'body toning',
        'fitness': 'general fitness'
    }[selectedGoal];
    
    const modalHTML = `
        <div class="onboarding-modal active" id="onboardingModal">
            <div class="modal-content">
                <div class="onboarding-header success">
                    <h2>🚀 Welcome to Fitpulse!</h2>
                    <p>Your ${planName} plan is activated</p>
                </div>
                
                <div class="welcome-content">
                    <div class="success-check">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    
                    <div class="next-steps">
                        <h4>Here's what happens next:</h4>
                        <div class="step-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Welcome email sent</strong>
                                <p>Check your inbox for login details and resources</p>
                            </div>
                        </div>
                        
                        <div class="step-item">
                            <i class="fas fa-dumbbell"></i>
                            <div>
                                <strong>Personalized ${goalText} plan created</strong>
                                <p>Your customized workout plan is ready</p>
                            </div>
                        </div>
                        
                        ${planName !== 'Basic' ? `
                        <div class="step-item">
                            <i class="fas fa-calendar-check"></i>
                            <div>
                                <strong>Trainer session scheduled</strong>
                                <p>Your complimentary orientation is booked for this week</p>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="step-item">
                            <i class="fas fa-mobile-alt"></i>
                            <div>
                                <strong>Download our app</strong>
                                <p>Track workouts and book classes on the go</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="onboarding-actions centered">
                    <button class="btn" id="finishOnboarding">
                        Start My Journey! 
                        <i class="fas fa-rocket"></i>
                    </button>
                </div>
                
                <div class="app-download">
                    <p>Get the Fitpulse app:</p>
                    <div class="download-buttons">
                        <button class="app-btn ios">
                            <i class="fab fa-apple"></i>
                            App Store
                        </button>
                        <button class="app-btn android">
                            <i class="fab fa-google-play"></i>
                            Google Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('finishOnboarding').addEventListener('click', function() {
        removeOnboardingModal();
        showPage('schedule');
        showNotification(`Welcome to your ${planName} plan! Your fitness journey begins now.`, 'success');
        
        // Save user's plan and goal to localStorage
        localStorage.setItem('userPlan', planName);
        localStorage.setItem('userGoal', selectedGoal);
        localStorage.setItem('userPlanActive', 'true');
    });
}

// Helper functions
function getPlanBenefits(planName) {
    const benefits = {
        'Basic': [
            'Unlimited gym access',
            'Locker room facilities',
            'Basic fitness assessment',
            'Mobile app access'
        ],
        'Premium': [
            'All Basic plan benefits',
            'Unlimited group classes',
            '2 personal training sessions/month',
            'Progress tracking',
            'Priority booking'
        ],
        'Elite': [
            'All Premium plan benefits', 
            '5 personal training sessions/month',
            'Customized nutrition plan',
            'Advanced body composition analysis',
            '24/7 gym access',
            'Bring a friend monthly'
        ]
    };
    
    return benefits[planName].map(benefit => `<li><i class="fas fa-check"></i> ${benefit}</li>`).join('');
}

function removeOnboardingModal() {
    const existingModal = document.getElementById('onboardingModal');
    if (existingModal) {
        existingModal.remove();
    }
}

