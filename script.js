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
        billingMonth:  ['May', 'November'],

        status: 'pending'
    },
    {
        id: 5,
        name: 'Sinethemba Vilakazi',
        avatar: 'assets/avatars/sinethemba.jpg',
        billingMonth: ['June', 'December'],

        status: 'paid'
    },
    {
        id: 6,
        name: 'Bhekumuzi Tshabalala',
        avatar: 'assets/avatars/muzi.jpg',
        billingMonth:  ['January', 'July'],

        status: 'pending'
    }
];

const bankingDetails = {
    bankName : "Tyme Bank",
    accountNumber : "51016280903",
    subcriptionAmount : "105"
}

// Carousel state
let currentIndex = 0;
let isTransitioning = false;
let autoAdvanceInterval;


// DOM elements
const carousel = document.getElementById('carousel');
const indicators = document.getElementById('indicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentMonth = document.getElementById('currentMonth');

//  current month name
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const today = new Date();
const monthName = monthNames[today.getMonth()];

const paymentModal = document.getElementById('paymentModal');
const modalOverlay = document.getElementById('modalOverlay');

currentMonth.innerText = monthName;


// Initialize the carousel
function init() {
    createCards();
    createIndicators();
    updateCarousel();
    // updateStats();
    startAutoAdvance();

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Create account cards
function createCards() {
    carousel.innerHTML = '';

    // Get current month name
    const currentMonthName = monthNames[today.getMonth()];

    let orderedAccounts = [...sampleAccounts];
    const currentMonthAccountIndex = orderedAccounts.findIndex(account =>
        account.billingMonth.includes(currentMonthName)
    );

    if (currentMonthAccountIndex !== -1) {
        // If a matching account is found, move it to the beginning
        const currentAccount = orderedAccounts.splice(currentMonthAccountIndex, 1)[0];
        orderedAccounts.unshift(currentAccount);
    }

    orderedAccounts.forEach((account, index) => {
        // Check if current month is in the account's billing months
        const isPaymentMonth = account.billingMonth.includes(currentMonthName);
        const buttonClass = isPaymentMonth ? account.status : 'disabled';
        const buttonText = isPaymentMonth ? 'Pay Now' : 'Not Due';

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
                        <div class="detail-value">${account.billingMonth}</div>
                    </div>
                </div>
                
                <div class="detail-item">
                    <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <div class="detail-content">
                        <div class="detail-label">Amount Due</div>
                        <div class="detail-value amount">R105</div>
                    </div>
                </div>
            </div>
            
            <button class="action-btn ${buttonClass}" ${!isPaymentMonth ? 'disabled' : ''}>
                ${buttonText}
            </button>
        `;

        // Add click event listener to the action button
        const actionBtn = card.querySelector('.action-btn');
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPaymentMonth && account.status !== 'paid') {
                openPaymentModal(account);
            }
        });

        carousel.appendChild(card);
    });
}

function closePaymentModal() {
    paymentModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Resume auto-advance when modal is closed
    startAutoAdvance();
}

function openPaymentModal(account) {
    document.getElementById('modalCustomerName').textContent = account.name;
    document.getElementById('modalBankName').textContent = bankingDetails.bankName;
    document.getElementById('modalAccountNumber').textContent = bankingDetails.accountNumber;
    document.getElementById('modalAmountDue').textContent = `R${bankingDetails.subcriptionAmount}`;

    paymentModal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Stop auto-advance when modal is open
    stopAutoAdvance();
}

// Create indicator dots
function createIndicators() {
    indicators.innerHTML = '';

    sampleAccounts.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
}

// Update carousel positions
function updateCarousel() {
    const cards = carousel.querySelectorAll('.account-card');
    const indicatorDots = indicators.querySelectorAll('.indicator');

    cards.forEach((card, index) => {
        card.classList.remove('left', 'center', 'right');

        if (index === currentIndex) {
            card.classList.add('center');
        } else if (index === getPrevIndex()) {
            card.classList.add('left');
        } else if (index === getNextIndex()) {
            card.classList.add('right');
        }
    });

    // Update indicators
    indicatorDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Navigation functions
function nextSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex + 1) % sampleAccounts.length;
    updateCarousel();

    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function prevSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex - 1 + sampleAccounts.length) % sampleAccounts.length;
    updateCarousel();

    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function goToSlide(index) {
    if (isTransitioning || index === currentIndex) return;

    isTransitioning = true;
    currentIndex = index;
    updateCarousel();

    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// Helper functions
function getPrevIndex() {
    return (currentIndex - 1 + sampleAccounts.length) % sampleAccounts.length;
}

function getNextIndex() {
    return (currentIndex + 1) % sampleAccounts.length;
}

// Auto-advance functionality
function startAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
        if (!isTransitioning) {
            nextSlide();
        }
    }, 5000);
}

function stopAutoAdvance() {
    clearInterval(autoAdvanceInterval);
}

// Update statistics
function updateStats() {
    const totalAmount = sampleAccounts.reduce((sum, account) => sum + account.amountDue, 0);
    const pendingCount = sampleAccounts.filter(account => account.status === 'pending').length;

    document.getElementById('totalAccounts').textContent = sampleAccounts.length;
    document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
    document.getElementById('pendingPayments').textContent = pendingCount;
}

// Pause auto-advance on hover
carousel.addEventListener('mouseenter', stopAutoAdvance);
carousel.addEventListener('mouseleave', startAutoAdvance);


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// CLose Payment Popup
document.getElementById('closeModal').addEventListener('click', closePaymentModal);
