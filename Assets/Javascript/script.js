// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeMenuBtn = document.querySelector('.mobile-menu .close-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.mobile-menu-links a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Video Modal Elements
const videoModal = document.querySelector('.video-modal');
const videoModalClose = document.querySelector('.video-modal-close');
const modalVideo = document.querySelector('.video-modal-content video');

// Enhanced Video Playback with Pop-out Effect
function setupVideoPlayback() {
    document.querySelectorAll('.product-img video, .gallery-item video').forEach(video => {
        const parent = video.closest('.product-img') || video.closest('.gallery-item');
        const playIcon = parent.querySelector('.play-icon');

        // Ensure videos start paused
        video.pause();

        // Add click event to play video
        parent.addEventListener('click', (e) => {
            // Don't trigger if clicking on add-to-cart button
            if (e.target.closest('.add-to-cart-btn')) return;

            e.stopPropagation();

            // Pause all other videos
            document.querySelectorAll('.product-img video, .gallery-item video').forEach(v => {
                if (v !== video) {
                    v.pause();
                    v.closest('.product-img, .gallery-item').classList.remove('playing');
                    const otherPlayIcon = v.closest('.product-img, .gallery-item').querySelector('.play-icon');
                    if (otherPlayIcon) {
                        otherPlayIcon.innerHTML = '<i class="fas fa-play-circle"></i>';
                    }
                }
            });

            // Toggle play/pause for clicked video
            if (video.paused) {
                video.play();
                parent.classList.add('playing');
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-pause-circle"></i>';
                }
            } else {
                video.pause();
                parent.classList.remove('playing');
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-play-circle"></i>';
                }
            }
        });

        // Update icon when video ends
        video.addEventListener('ended', () => {
            parent.classList.remove('playing');
            if (playIcon) {
                playIcon.innerHTML = '<i class="fas fa-play-circle"></i>';
            }
        });
    });

    // Double-click to open in modal
    document.querySelectorAll('.product-img, .gallery-item').forEach(item => {
        item.addEventListener('dblclick', (e) => {
            const video = item.querySelector('video');
            if (video) {
                // Pause the thumbnail video
                video.pause();
                item.classList.remove('playing');
                const playIcon = item.querySelector('.play-icon');
                if (playIcon) {
                    playIcon.innerHTML = '<i class="fas fa-play-circle"></i>';
                }

                // Open in modal
                const videoSource = video.querySelector('source').src;
                modalVideo.querySelector('source').src = videoSource;
                modalVideo.load();
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                modalVideo.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
    });
}

// Modal functionality
videoModalClose.addEventListener('click', () => {
    videoModal.classList.remove('active');
    modalVideo.pause();
    document.body.style.overflow = 'auto';
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('active');
        modalVideo.pause();
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        videoModal.classList.remove('active');
        modalVideo.pause();
        document.body.style.overflow = 'auto';
    }
});

// Cart Functionality
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartSummary = document.getElementById('cartSummary');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShopping = document.getElementById('continueShopping');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSuccess = document.getElementById('checkoutSuccess');
const closeCartAfterOrder = document.getElementById('closeCartAfterOrder');
const orderForm = document.getElementById('orderForm');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        cartItems.querySelectorAll('.cart-item').forEach(item => item.remove());
    } else {
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        cartItems.querySelectorAll('.cart-item').forEach(item => item.remove());

        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    ${item.isVideo ?
                    `<video muted loop><source src="${item.image}" type="video/mp4"></video>` :
                    `<img src="${item.image}" alt="${item.name}">`
                }
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <div class="quantity-btn" data-index="${index}" data-action="decrease">-</div>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                        <div class="quantity-btn" data-index="${index}" data-action="increase">+</div>
                    </div>
                    <div class="cart-item-remove" data-index="${index}">Remove</div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `R${total.toFixed(2)}`;

        // Add event listeners to cart buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                const action = this.dataset.action;

                if (action === 'increase') {
                    cart[index].quantity++;
                } else if (action === 'decrease' && cart[index].quantity > 1) {
                    cart[index].quantity--;
                }
                updateCart();
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
}

// Add to Cart functionality
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const id = this.dataset.id;
        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        const image = this.dataset.image;
        const isVideo = image.endsWith('.mp4');

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                isVideo,
                quantity: 1
            });
        }

        updateCart();
        cartModal.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Cart modal controls
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', closeCartModal);
cartOverlay.addEventListener('click', closeCartModal);
continueShopping.addEventListener('click', closeCartModal);

function closeCartModal() {
    cartModal.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    checkoutForm.style.display = 'none';
    checkoutSuccess.style.display = 'none';
    if (orderForm) orderForm.reset();
}

// Checkout process
checkoutBtn.addEventListener('click', () => {
    cartSummary.style.display = 'none';
    checkoutForm.style.display = 'block';
});

if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        checkoutForm.style.display = 'none';
        checkoutSuccess.style.display = 'block';
        cart = [];
        updateCart();
    });
}

closeCartAfterOrder.addEventListener('click', closeCartModal);

// Contact Form
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Newsletter Form
if (document.querySelector('.newsletter-form')) {
    document.querySelector('.newsletter-form').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
    updateCart();
    setupVideoPlayback();
});