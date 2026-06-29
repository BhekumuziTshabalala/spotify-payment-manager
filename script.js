document.addEventListener('DOMContentLoaded', () => {
    // Sample account data
    const sampleAccounts = [
        {
            id: 1,
            name: 'Bhekumuzi Tshabalala',
            avatar: 'assets/avatars/muzi.jpg',
            billingMonth: ['February', 'August'],
            status: 'pending'
        },
        {
            id: 2,
            name: 'Marc-Anthony Jones',
            avatar: 'assets/avatars/marc.jpg',
            billingMonth: ['March', 'September'],
            status: 'paid'
        },
        {
            id: 3,
            name: 'Keabetswe Motloung',
            avatar: 'assets/avatars/kea.jpg',
            billingMonth: ['April', 'October'],
            status: 'overdue'
        },
        {
            id: 4,
            name: 'Gabrielle Chitamu',
            avatar: 'assets/avatars/gabby.jpg',
            billingMonth: ['May', 'November'],
            status: 'pending'
        },
        {
            id: 5,
            name: 'Sinethemba Vilakazi',
            avatar: 'assets/avatars/sinethemba.jpg',
            billingMonth: ['June', 'December'],
            status: 'pending'
        },
        { 
            id: 6,
            name: 'Amanda Mayinje',
            avatar: 'assets/avatars/amanda.jpg',
            billingMonth: ['January', 'July'],
            status: 'pending'
        }
    ];

    const bankingDetails = {
        bankName: "Vodacom",
        accountNumber: "+27726611792",
        subscriptionAmount: "125.00"
    };

    // Carousel state
    let currentIndex = 0;
    let isTransitioning = false;
    let autoAdvanceInterval;
    let selectedAccountForPayment = null;

    // DOM elements
    const carousel = document.getElementById('carousel');
    const indicators = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentMonthEl = document.getElementById('currentMonth');
    
    // Modal elements
    const paymentModal = document.getElementById('paymentModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

    // Theme elements
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeToggleText = document.getElementById('themeToggleText');

    // Month Names mapping
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const today = new Date();
    const monthName = monthNames[today.getMonth()];

    if (currentMonthEl) {
        currentMonthEl.innerText = monthName;
    }

    // ==========================================================================
    // Theme Management (Light / Dark / System Preferences)
    // ==========================================================================
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeToggleText) themeToggleText.textContent = 'Dark';
        } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeToggleText) themeToggleText.textContent = 'Light';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'system');
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (themeToggleText) themeToggleText.textContent = `System (${systemIsDark ? 'Dark' : 'Light'})`;
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        applyTheme(savedTheme);

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'system';
                if (currentTheme === 'system') {
                    applyTheme('light');
                } else if (currentTheme === 'light') {
                    applyTheme('dark');
                } else {
                    applyTheme('system');
                }
            });
        }

        // Listen for OS system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const currentTheme = localStorage.getItem('theme') || 'system';
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        });
    }

    // ==========================================================================
    // Carousel Core Logic
    // ==========================================================================
    function createCards() {
        if (!carousel) return;
        carousel.innerHTML = '';

        const currentMonthName = monthNames[today.getMonth()];

        // Generate 12 cards, one for each month
        monthNames.forEach((month, index) => {
            // Find the account responsible for this month
            const account = sampleAccounts.find(acc => acc.billingMonth.includes(month));

            if (!account) return;

            const isPaymentMonth = month === currentMonthName;
            const buttonClass = isPaymentMonth ? account.status : 'disabled';
            let buttonText = 'Not Due';
            if (isPaymentMonth) {
                buttonText = account.status === 'paid' ? 'Paid' : 'Pay Now';
            }

            // Create account card structure
            const card = document.createElement('div');
            card.className = 'account-card';
            
            // Build card inner HTML
            card.innerHTML = `
                <div class="avatar-section">
                    <div class="avatar-container">
                        <img src="${account.avatar}" alt="${account.name}" class="avatar">
                        <div class="avatar-badge">
                            <svg stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <h3 class="card-name">${account.name}</h3>
                <div class="billing-details">
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label">Billing Period</div>
                            <div class="detail-value">${month}</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label">Amount Due</div>
                            <div class="detail-value amount">R${bankingDetails.subscriptionAmount}</div>
                        </div>
                    </div>
                </div>
                <button class="action-btn ${buttonClass}" ${(!isPaymentMonth || account.status === 'paid') ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            `;

            // Support click on side cards to focus them
            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                if (index !== currentIndex) {
                    goToSlide(index);
                    startAutoAdvance(); // Reset timer
                }
            });

            // Action button logic
            const actionBtn = card.querySelector('.action-btn');
            if (actionBtn) {
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isPaymentMonth && account.status !== 'paid') {
                        openPaymentModal(account);
                    }
                });
            }
            carousel.appendChild(card);
        });

        // Set initial index to current month
        currentIndex = today.getMonth();
        updateCarousel();
    }

    function updateCarousel() {
        if (!carousel || !indicators) return;
        const cards = carousel.querySelectorAll('.account-card');
        const indicatorDots = indicators.querySelectorAll('.indicator');
        const totalCards = cards.length;

        cards.forEach((card, index) => {
            // Calculate relative position in the circle
            let offset = (index - currentIndex) % totalCards;
            if (offset < -totalCards / 2) offset += totalCards;
            if (offset > totalCards / 2) offset -= totalCards;

            // Apply transition speed variables and settings
            card.style.transition = isTransitioning ? 'all var(--transition-speed) var(--transition-curve)' : 'none';

            if (offset === 0) {
                // Center Active Card
                card.style.transform = 'translateX(0) translateZ(0) scale(1)';
                card.style.zIndex = '30';
                card.style.opacity = '1';
                card.style.filter = 'blur(0)';
                card.style.pointerEvents = 'auto';
                card.classList.add('active');
            } else if (offset === 1) {
                // Next Card (Right)
                card.style.transform = 'translateX(var(--card-translate-x)) translateZ(-100px) scale(var(--card-scale-side))';
                card.style.zIndex = '20';
                card.style.opacity = 'var(--card-opacity-side)';
                card.style.filter = 'blur(var(--card-blur-side))';
                card.style.pointerEvents = 'auto';
                card.classList.remove('active');
            } else if (offset === -1) {
                // Prev Card (Left)
                card.style.transform = 'translateX(calc(-1 * var(--card-translate-x))) translateZ(-100px) scale(var(--card-scale-side))';
                card.style.zIndex = '20';
                card.style.opacity = 'var(--card-opacity-side)';
                card.style.filter = 'blur(var(--card-blur-side))';
                card.style.pointerEvents = 'auto';
                card.classList.remove('active');
            } else if (offset === 2) {
                // Far Right Card
                card.style.transform = 'translateX(calc(1.6 * var(--card-translate-x))) translateZ(-200px) scale(calc(var(--card-scale-side) - 0.1))';
                card.style.zIndex = '10';
                card.style.opacity = '0';
                card.style.filter = 'blur(calc(var(--card-blur-side) + 1px))';
                card.style.pointerEvents = 'none';
                card.classList.remove('active');
            } else if (offset === -2) {
                // Far Left Card
                card.style.transform = 'translateX(calc(-1.6 * var(--card-translate-x))) translateZ(-200px) scale(calc(var(--card-scale-side) - 0.1))';
                card.style.zIndex = '10';
                card.style.opacity = '0';
                card.style.filter = 'blur(calc(var(--card-blur-side) + 1px))';
                card.style.pointerEvents = 'none';
                card.classList.remove('active');
            } else {
                // Hidden completely
                card.style.transform = 'translateX(0) translateZ(-300px) scale(0.5)';
                card.style.zIndex = '0';
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
                card.classList.remove('active');
            }
        });

        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function createIndicators() {
        if (!indicators) return;
        indicators.innerHTML = '';
        monthNames.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => {
                goToSlide(index);
                startAutoAdvance(); // Reset timer
            });
            indicators.appendChild(indicator);
        });
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex + 1) % monthNames.length;
        updateCarousel();
        setTimeout(() => { isTransitioning = false; }, 500);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex - 1 + monthNames.length) % monthNames.length;
        updateCarousel();
        setTimeout(() => { isTransitioning = false; }, 500);
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        currentIndex = index;
        updateCarousel();
        setTimeout(() => { isTransitioning = false; }, 500);
    }

    // ==========================================================================
    // Payment Modal Controls
    // ==========================================================================
    function updateBillingPeriod() {
        const billingPeriodElement = document.querySelector("#paymentModal .billing-period");
        if (billingPeriodElement) {
            const currentDate = new Date();
            const options = { year: "numeric", month: "long" };
            const formattedDate = currentDate.toLocaleDateString("en-US", options);
            billingPeriodElement.textContent = `Payment for ${formattedDate}`;
        }
    }

    function openPaymentModal(account) {
        selectedAccountForPayment = account;
        document.getElementById('modalCustomerName').textContent = account.name;
        document.getElementById('modalBankName').textContent = bankingDetails.bankName;
        document.getElementById('modalAccountNumber').textContent = bankingDetails.accountNumber;
        document.getElementById('modalAmountDue').textContent = `R${bankingDetails.subscriptionAmount}`;
        updateBillingPeriod();

        if (paymentModal && modalOverlay) {
            paymentModal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            stopAutoAdvance();
        }
    }

    function closePaymentModal() {
        selectedAccountForPayment = null;
        if (paymentModal && modalOverlay) {
            paymentModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            startAutoAdvance();
        }
    }

    function processPayment() {
        if (!selectedAccountForPayment) return;

        // Update the account status
        selectedAccountForPayment.status = 'paid';

        // Close the modal
        closePaymentModal();


        // Re-generate the carousel cards to reflect new status
        // Keep the current slide index
        const saveIndex = currentIndex;
        createCards();
        currentIndex = saveIndex;
        updateCarousel();
    }

    // ==========================================================================
    // Auto-Advance Timer Controls
    // ==========================================================================
    function startAutoAdvance() {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(() => {
            if (!isTransitioning) nextSlide();
        }, 5000);
    }

    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }

    // ==========================================================================
    // Initialization
    // ==========================================================================
    function init() {
        if (!carousel) return;

        // Initialize Theme, Cards, and Indicators
        initTheme();
        createCards();
        createIndicators();
        updateCarousel();
        startAutoAdvance();

        // Event listeners - Navigation
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoAdvance();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoAdvance();
        });

        // Event listeners - Modal
        if (closeBtn) closeBtn.addEventListener('click', closePaymentModal);
        if (cancelPaymentBtn) cancelPaymentBtn.addEventListener('click', closePaymentModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closePaymentModal);
        if (confirmPaymentBtn) confirmPaymentBtn.addEventListener('click', processPayment);

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
                closePaymentModal();
            } else if (e.key === 'ArrowRight' && !paymentModal.classList.contains('active')) {
                nextSlide();
                startAutoAdvance();
            } else if (e.key === 'ArrowLeft' && !paymentModal.classList.contains('active')) {
                prevSlide();
                startAutoAdvance();
            }
        });

        // Touch swipe gestures
        let startX = 0;
        carousel.addEventListener('touchstart', (e) => { 
            startX = e.touches[0].clientX; 
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoAdvance(); // Reset timer on manual swipe
            }
        }, { passive: true });

        // Hover auto-advance suspension
        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);
    }

    init();
});