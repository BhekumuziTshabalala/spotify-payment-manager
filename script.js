document.addEventListener('DOMContentLoaded', () => {
    // Sample account data
    const sampleAccounts = [
        {
            id: 1,
            name: 'Amanda Mayinje',
            avatar: 'assets/avatars/amanda.jpg',
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
            name: 'Bhekumuzi Tshabalala',
            avatar: 'assets/avatars/muzi.jpg',
            billingMonth: ['January', 'July'],
            status: 'pending'
        }
    ];

    const bankingDetails = {
        bankName: "Telkom",
        accountNumber: "+27680546214",
        subscriptionAmount: "125.00"
    };

    // Carousel state
    let currentIndex = 0;
    let isTransitioning = false;
    let autoAdvanceInterval;

    // DOM elements
    const carousel = document.getElementById('carousel');
    const indicators = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentMonthEl = document.getElementById('currentMonth');
    const paymentModal = document.getElementById('paymentModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');

    //  current month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const today = new Date();
    const monthName = monthNames[today.getMonth()];

    if (currentMonthEl) {
        currentMonthEl.innerText = monthName;
    }

    // Create account cards
    function createCards() {
        if (!carousel) return;
        carousel.innerHTML = '';

        const currentMonthName = monthNames[today.getMonth()];

        let orderedAccounts = [...sampleAccounts];
        const currentMonthAccountIndex = orderedAccounts.findIndex(account =>
            account.billingMonth.includes(currentMonthName)
        );

        if (currentMonthAccountIndex > 0) {
            const currentAccount = orderedAccounts.splice(currentMonthAccountIndex, 1)[0];
            orderedAccounts.unshift(currentAccount);
        }

        orderedAccounts.forEach((account) => {
            const isPaymentMonth = account.billingMonth.includes(currentMonthName);
            const buttonClass = isPaymentMonth ? account.status : 'disabled';
            let buttonText = 'Not Due';
            if (isPaymentMonth) {
                buttonText = account.status === 'paid' ? 'Paid' : 'Pay Now';
            }

            const card = document.createElement('div');
            card.className = 'account-card';
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label">Billing Period</div>
                            <div class="detail-value">${account.billingMonth.join(', ')}</div>
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
        updateCarousel();
    }

    function closePaymentModal() {
        if (paymentModal && modalOverlay) {
            paymentModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            startAutoAdvance();
        }
    }

    function updateBillingPeriod() {
        // Find the billing period element specifically inside the payment modal
        const billingPeriodElement = document.querySelector("#paymentModal .billing-period");
        if (billingPeriodElement) {
            const currentDate = new Date();
            const options = { year: "numeric", month: "long" };
            const formattedDate = currentDate.toLocaleDateString("en-US", options);
            billingPeriodElement.textContent = `Payment for ${formattedDate}`;
        }
    }

    function openPaymentModal(account) {
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

    function createIndicators() {
        if (!indicators) return;
        indicators.innerHTML = '';
        sampleAccounts.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(indicator);
        });
    }

    function updateCarousel() {
        if (!carousel || !indicators) return;
        const cards = carousel.querySelectorAll('.account-card');
        const indicatorDots = indicators.querySelectorAll('.indicator');

        cards.forEach((card, index) => {
            card.classList.remove('left', 'center', 'right');
            if (index === currentIndex) {
                card.classList.add('center');
            } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('left');
            } else if (index === (currentIndex + 1) % cards.length) {
                card.classList.add('right');
            }
        });

        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex + 1) % sampleAccounts.length;
        updateCarousel();
        setTimeout(() => { isTransitioning = false; }, 500);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex - 1 + sampleAccounts.length) % sampleAccounts.length;
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

    function startAutoAdvance() {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(() => {
            if (!isTransitioning) nextSlide();
        }, 5000);
    }

    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }

    // Initialize the application
    function init() {
        if (!carousel) return;
        createCards();
        createIndicators();
        updateCarousel();
        startAutoAdvance();

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (closeBtn) closeBtn.addEventListener('click', closePaymentModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closePaymentModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
                closePaymentModal();
            }
        });

        let startX = 0;
        carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        });

        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);
    }

    init();
});