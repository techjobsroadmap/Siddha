
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu functionality
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarContainer = document.querySelector('.navbar-container');

  if (menuToggle && navbarContainer) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navbarContainer.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      const isClickInsideMenu = navbarContainer.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle && navbarContainer.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navbarContainer.classList.remove('active');
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {

  // --- Intersection Observer for Scroll Animations ---
  const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');

  if (sectionsToAnimate.length > 0) { // Check if elements exist
    const observerOptions = {
      root: null, // relative to document viewport
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionsToAnimate.forEach(section => {
      observer.observe(section);
    });
  }

  // --- Add other JavaScript functionalities below ---
  // e.g., Mobile menu toggle, accordion logic, etc.

});
// End DOMContentLoaded

// --- WhatsApp Consultation Logic ---

const DOCTOR_PHONE = "919659475910"; // Updated doctor's number

function sendToWhatsapp(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const mobile = document.getElementById('mobile').value;
  const location = document.getElementById('location').value;
  const symptoms = document.getElementById('symptoms').value;

  // Log the data that would be sent
  console.log("Form Submitted:", { name, age, gender, mobile, location, symptoms });

  // Change button to "Submitted"
  const submitBtn = document.querySelector('.btn-whatsapp');
  if (submitBtn) {
    submitBtn.innerHTML = '<span class="icon">✅</span> Submitted';
    submitBtn.style.backgroundColor = '#4CAF50'; // Green color
    submitBtn.disabled = true;
  }

  // NOTE: Silent sending to WhatsApp is not possible from a static client-side page.
  // The redirect is disabled as requested.
  // const message = `*New Consultation Request*%0A%0A*Name:* ${name}%0A*Age:* ${age}%0A*Gender:* ${gender}%0A*Mobile:* ${mobile}%0A*Location:* ${location}%0A*Symptoms:* ${symptoms}`;
  // const whatsappUrl = `https://wa.me/${DOCTOR_PHONE}?text=${message}`;
  // window.open(whatsappUrl, '_blank');
}

function openWhatsAppChat() {
  const message = "Hello, I would like to chat with a doctor regarding a consultation.";
  const whatsappUrl = `https://wa.me/${DOCTOR_PHONE}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

function openWhatsAppCall() {
  // WhatsApp doesn't have a direct deep link for calls, so we open the chat with a specific message
  const message = "Hello, I would like to request a video/audio call consultation.";
  const whatsappUrl = `https://wa.me/${DOCTOR_PHONE}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

function applyCoupon() {
  const couponInput = document.getElementById('coupon-code');
  const couponMessage = document.getElementById('coupon-message');
  const couponCode = couponInput.value.trim();

  if (couponCode === 'sanamsiddhamfreecare') {
    // Valid coupon - enable 2 minute access
    couponMessage.textContent = '✅ Coupon applied! 2-minute access granted.';
    couponMessage.style.color = '#2e7d32';

    // Enable consultation with 2 minutes (120 seconds)
    enableConsultationWithDuration(2 * 60 * 1000); // 2 minutes in milliseconds

    // Clear input
    couponInput.value = '';
  } else {
    // Invalid coupon
    couponMessage.textContent = '❌ Invalid coupon code.';
    couponMessage.style.color = '#d32f2f';
  }
}

function enableConsultationWithDuration(durationMs) {
  const paymentGate = document.getElementById('payment-gate');
  const connectButtons = document.getElementById('connect-buttons');
  const timerMessage = document.getElementById('timer-message');

  if (paymentGate && connectButtons) {
    paymentGate.style.display = 'none';

    // Enable buttons
    const buttons = connectButtons.querySelectorAll('.btn-connect');
    buttons.forEach(btn => btn.classList.remove('disabled'));

    // Show timer
    if (timerMessage) timerMessage.style.display = 'inline-block';

    // Set expiry
    const expiryTime = Date.now() + durationMs;
    localStorage.setItem('consultationExpiry', expiryTime);

    startTimer(expiryTime);
  }
}

function initiatePayment() {
  const upiId = "9659475910@upi";
  const name = "Siddha Doctor";
  const amount = "50";
  const currency = "INR";

  // Get selected payment app
  const selectedApp = document.querySelector('input[name="payApp"]:checked').value;

  // Construct UPI Deep Link based on selection
  let upiLink = "";
  const params = `pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=${currency}`;

  if (selectedApp === 'gpay') {
    upiLink = `tez://upi/pay?${params}`;
  } else if (selectedApp === 'paytm') {
    upiLink = `paytmmp://pay?${params}`;
  } else {
    upiLink = `upi://pay?${params}`;
  }

  // Try to open UPI app
  window.location.href = upiLink;

  // Since we can't detect if the app opened or payment succeeded on a static site,
  // we'll ask the user for confirmation after a short delay.
  setTimeout(() => {
    const userConfirmed = confirm("Did you complete the payment of ₹50?");
    if (userConfirmed) {
      enableConsultation();
    }
  }, 2000);
}

function enableConsultation() {
  // Enable consultation with 30 minutes for payment
  enableConsultationWithDuration(30 * 60 * 1000); // 30 minutes in milliseconds
}

function startTimer(expiryTime) {
  const timeDisplay = document.getElementById('time-remaining');

  const interval = setInterval(() => {
    const now = Date.now();
    const distance = expiryTime - now;

    if (distance < 0) {
      clearInterval(interval);
      localStorage.removeItem('consultationExpiry');
      location.reload(); // Reload to reset state
      return;
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timeDisplay) {
      timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }, 1000);
}

function checkConsultationStatus() {
  const expiryTime = localStorage.getItem('consultationExpiry');
  if (expiryTime) {
    if (Date.now() < parseInt(expiryTime)) {
      enableConsultation(); // Re-enable if valid
    } else {
      localStorage.removeItem('consultationExpiry'); // Clear if expired
    }
  }
}

// Check status on load
document.addEventListener('DOMContentLoaded', checkConsultationStatus);

// ===== GOOGLE FORMS CONFIGURATION =====
// IMPORTANT: Replace these values with your actual Google Form details
const GOOGLE_FORM_CONFIG = {
  // The "action" URL from your Google Form (ends with /formResponse)
  ACTION_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfRmHqNCB35nuDAsezE_bmykFlJ9X5TmNwvKI9Q2kJeoT3_uA/formResponse",

  // The "entry.ID" for each field in your form
  ENTRY_IDS: {
    NAME: "entry.1529762607",
    AGE: "entry.416760020",
    GENDER: "entry.1725382361",
    MOBILE: "entry.1317455506",
    LOCATION: "entry.1921532573",
    SYMPTOMS: "entry.1643616751",
    EMAIL: "entry.1962684364"
  }
};

// Attach event listener if form exists
const consultForm = document.getElementById('consultForm');
if (consultForm) {
  // We'll handle this in initConsultPage now
  // consultForm.addEventListener('submit', sendToWhatsapp); 
}

// ===== PAGE-SPECIFIC FUNCTIONS =====

// --- Google Forms AJAX Submission ---
async function submitToGoogleForms(formData) {
  const formBody = new URLSearchParams();

  // Map our form data to Google Form entry IDs
  formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.NAME, formData.name);
  formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.AGE, formData.age);
  formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.GENDER, formData.gender);
  formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.MOBILE, formData.mobile);
  formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.LOCATION, formData.location);
  formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.SYMPTOMS, formData.symptoms);

  // Only append email if it exists and we have an ID for it
  if (formData.email && GOOGLE_FORM_CONFIG.ENTRY_IDS.EMAIL !== "entry.YOUR_EMAIL_ID") {
    formBody.append(GOOGLE_FORM_CONFIG.ENTRY_IDS.EMAIL, formData.email);
  }

  try {
    const response = await fetch(GOOGLE_FORM_CONFIG.ACTION_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Forms
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    });

    // With no-cors, we can't check response.ok, so we assume success if no error is thrown
    return true;
  } catch (error) {
    console.error('Error submitting to Google Forms:', error);
    return false;
  }
}

// --- Consult Page: Form Handling ---
function initConsultPage() {
  const form = document.getElementById('consultForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // --- VALIDATION ---
    let isValid = true;

    // Helper to show error
    const showError = (input, message) => {
      const errorSpan = input.parentElement.querySelector('.error-message');
      if (errorSpan) {
        errorSpan.innerText = message;
        errorSpan.style.display = 'block';
      }
      input.style.borderColor = 'red';
      isValid = false;
    };

    // Helper to clear error
    const clearError = (input) => {
      const errorSpan = input.parentElement.querySelector('.error-message');
      if (errorSpan) {
        errorSpan.style.display = 'none';
      }
      input.style.borderColor = '#ccc'; // Reset to default
    };

    // 1. Name: Alphabets only
    const nameInput = document.getElementById('name');
    clearError(nameInput);
    if (!/^[A-Za-z\s]+$/.test(nameInput.value.trim())) {
      showError(nameInput, "Name must contain only alphabets.");
    }

    // 2. Age: Numbers only, > 0
    const ageInput = document.getElementById('age');
    clearError(ageInput);
    const ageValue = parseInt(ageInput.value.trim());
    if (isNaN(ageValue) || ageValue <= 0) {
      showError(ageInput, "Please enter a valid age.");
    }

    // 3. City: Alphabets only
    const locationInput = document.getElementById('location');
    clearError(locationInput);
    if (!/^[A-Za-z\s]+$/.test(locationInput.value.trim())) {
      showError(locationInput, "City must contain only alphabets.");
    }

    // 4. Mobile: Numbers only, min 10 digits
    const mobileInput = document.getElementById('mobile');
    clearError(mobileInput);
    if (!/^\d{10,}$/.test(mobileInput.value.trim().replace(/\s/g, ''))) {
      showError(mobileInput, "Enter valid mobile number (min 10 digits).");
    }

    if (!isValid) return; // Stop submission if validation fails

    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerText;

    // 5. Collect Data
    const formData = {
      name: nameInput.value,
      age: ageInput.value,
      gender: document.getElementById('gender').value,
      mobile: mobileInput.value,
      location: locationInput.value,
      symptoms: document.getElementById('symptoms').value,
      email: document.getElementById('email').value // Optional
    };

    // 6. Show Loading State
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting...';

    // 7. Submit to Google Forms
    const success = await submitToGoogleForms(formData);

    // 8. Handle Result
    submitBtn.disabled = false;
    submitBtn.innerText = originalBtnText;

    if (success) {
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.style.cssText = 'background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center; border: 1px solid #c3e6cb;';
      successMsg.innerHTML = `
        <strong>Thank you!</strong><br>
        Your details have been submitted successfully.<br>
        Our doctor will review your information and contact you shortly.
      `;

      // Remove any existing success message
      const existingMsg = form.parentElement.querySelector('.success-message');
      if (existingMsg) existingMsg.remove();

      form.parentElement.appendChild(successMsg);
      form.reset();

      // Optional: Scroll to message
      successMsg.scrollIntoView({ behavior: 'smooth' });

      // Remove message after 5 seconds
      setTimeout(() => {
        successMsg.remove();
      }, 8000);
    } else {
      alert('There was an error submitting your form. Please try again or contact us directly via WhatsApp.');
    }
  });
}

// --- Remedies Page: Disclaimer Checkbox ---
function initRemediesPage() {
  const checkbox = document.getElementById('agree-checkbox');
  const remedyContent = document.getElementById('accordion');
  const note = document.getElementById('note');

  if (checkbox && remedyContent && note) {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        remedyContent.classList.add('enabled');
        note.style.display = 'none';
      } else {
        remedyContent.classList.remove('enabled');
        note.style.display = 'block';
      }
    });
  }

  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const content = accordionItem.querySelector('.accordion-content');

        // Close all other open accordion contents
        document.querySelectorAll('.accordion-item').forEach(item => {
          if (item !== accordionItem) {
            item.querySelector('.accordion-content').classList.remove('active');
            item.querySelector('.accordion-header').classList.remove('open');
          }
        });

        // Toggle the clicked one
        content.classList.toggle('active');
        header.classList.toggle('open');
      });
    });
  }
}

// --- About Page: Language Toggle ---
function initAboutPage() {
  let currentLang = 'english';
  let manualSwitch = false;
  const introSection = document.getElementById('introduction');
  const englishEl = introSection ? introSection.querySelector('.lang-content .english') : null;
  const tamilEl = introSection ? introSection.querySelector('.lang-content .tamil') : null;
  let intervalId = null;

  function toggleLang() {
    if (!englishEl || !tamilEl) return;
    if (currentLang === 'english') {
      englishEl.classList.remove('active');
      tamilEl.classList.add('active');
      currentLang = 'tamil';
    } else {
      tamilEl.classList.remove('active');
      englishEl.classList.add('active');
      currentLang = 'english';
    }
  }

  function toggleLangManual() {
    toggleLang();
    manualSwitch = true;
    clearInterval(intervalId);
  }

  function startAutoSwitch() {
    clearInterval(intervalId);
    if (englishEl && tamilEl) {
      intervalId = setInterval(() => {
        if (!manualSwitch) {
          toggleLang();
        }
      }, 6000);
    }
  }

  if (englishEl) {
    englishEl.classList.add('active');
    startAutoSwitch();
  }
}

// --- Contact Page: Form Validation ---
function initContactPage() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('invalid');
    });

    // Validate fields
    if (!name.value.trim()) {
      name.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (!email.value.trim() || !email.value.includes('@')) {
      email.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (!subject.value) {
      subject.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (!message.value.trim()) {
      message.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (isValid) {
      // Form is valid, you can submit or process
      console.log('Form submitted:', {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
      });
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    }
  });
}

// ===== STORE PAGE LOGIC =====

const PRODUCTS = [
  { id: 1, name: "Triphala Churnam", price: 150, category: "churnam", image: "../img/store1.png", desc: "A classic blend for digestion, detoxification, and eye health." },
  { id: 2, name: "Neelibringadi Tailam", price: 250, category: "tailam", image: "../img/store2.png", desc: "Traditional hair oil for promoting growth and preventing hair fall." },
  { id: 3, name: "Ashwagandha Lehyam", price: 300, category: "lehyam", image: "../img/store3.png", desc: "Rejuvenating tonic to combat stress, boost energy and vitality." },
  { id: 4, name: "Amla Powder", price: 120, category: "churnam", image: "../img/store4.png", desc: "Rich source of Vitamin C, boosts immunity and promotes healthy skin." },
  { id: 5, name: "Nilavembu Kudineer", price: 180, category: "kashayam", image: "../img/store5.png", desc: "Traditional polyherbal decoction powder for fevers and immunity." },
  { id: 6, name: "Pinda Thailam", price: 220, category: "tailam", image: "../img/store6.png", desc: "Cooling and soothing oil used for joint pain and inflammation." }
];

let cart = JSON.parse(localStorage.getItem('siddhaCart')) || [];

function initStorePage() {
  // 1. Setup Cart Icon
  const cartIcon = document.getElementById('cart-icon');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCart = document.getElementById('close-cart');
  const cartOverlay = document.getElementById('cart-overlay');

  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('active');
      renderCart();
    });
  }

  if (closeCart) {
    closeCart.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
      document.getElementById('product-modal').classList.remove('active');
      document.getElementById('checkout-modal').classList.remove('active');
      const trackingModal = document.getElementById('tracking-modal');
      if (trackingModal) trackingModal.classList.remove('active');
    });
  }

  // 2. Setup Product Cards (Click to Open Modal)
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-order-request')) {
        e.preventDefault();
      }
      const id = parseInt(card.getAttribute('data-id'));
      openProductModal(id);
    });
  });

  // 3. Setup Product Modal
  const productModal = document.getElementById('product-modal');
  const closeProductModal = document.getElementById('close-product-modal');
  const addToCartBtn = document.getElementById('btn-add-to-cart');

  if (closeProductModal) {
    closeProductModal.addEventListener('click', () => {
      productModal.classList.remove('active');
      cartOverlay.classList.remove('active');
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const id = parseInt(addToCartBtn.getAttribute('data-id'));
      const qty = parseInt(document.getElementById('modal-qty').value);
      addToCart(id, qty);
      productModal.classList.remove('active');
      cartOverlay.classList.remove('active');
      setTimeout(() => {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
        renderCart();
      }, 300);
    });
  }

  // 4. Setup Checkout
  const checkoutBtn = document.getElementById('btn-checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');
  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      cartDrawer.classList.remove('open');
      checkoutModal.classList.add('active');
      document.getElementById('checkout-total').innerText = document.getElementById('cart-total-price').innerText;
    });
  }

  if (closeCheckoutModal) {
    closeCheckoutModal.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      cartOverlay.classList.remove('active');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processCheckout();
    });
  }

  // 5. Setup Tracking
  const trackBtn = document.getElementById('btn-track-order');
  if (trackBtn) {
    trackBtn.addEventListener('click', trackOrder);
  }

  // 6. Setup Tracking Modal Close
  const trackingModal = document.getElementById('tracking-modal');
  const closeTrackingModal = document.getElementById('close-tracking-modal');

  if (closeTrackingModal) {
    closeTrackingModal.addEventListener('click', () => {
      trackingModal.classList.remove('active');
      cartOverlay.classList.remove('active');
    });
  }

  updateCartCount();
}

function openProductModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  document.getElementById('modal-title').innerText = product.name;
  document.getElementById('modal-desc').innerText = product.desc;
  document.getElementById('modal-price').innerText = '₹' + product.price;
  document.getElementById('modal-img').src = product.image;
  document.getElementById('modal-qty').value = 1;
  document.getElementById('btn-add-to-cart').setAttribute('data-id', id);

  document.getElementById('product-modal').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
}

function addToCart(id, qty) {
  const product = PRODUCTS.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ ...product, qty: qty });
  }

  saveCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

function updateCartQty(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      renderCart();
      updateCartCount();
    }
  }
}

function saveCart() {
  localStorage.setItem('siddhaCart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.innerText = count;
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    document.getElementById('cart-total-price').innerText = '₹0';
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.price} x ${item.qty}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
          <span class="remove-btn" onclick="removeFromCart(${item.id})">Remove</span>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById('cart-total-price').innerText = '₹' + total;
}

const ORDER_FORM_CONFIG = {
  ACTION_URL: "https://docs.google.com/forms/d/e/1FAIpQLSelisrKxJqEiRLBhAeKQYbjJ3kOYpReun2uUeg3F70zM9DUyg/formResponse",
  ENTRY_IDS: {
    ORDER_ID: "entry.491404385",
    NAME: "entry.408490124",
    PHONE: "entry.281803406",
    ADDRESS: "entry.829896428",
    EMAIL: "entry.1986962434",
    PRODUCTS: "entry.257107171",
    TOTAL: "entry.1050736563"
  }
};

async function processCheckout() {
  const name = document.getElementById('checkout-name').value;
  const email = document.getElementById('checkout-email').value;
  const phone = document.getElementById('checkout-phone').value;
  const address = document.getElementById('checkout-address').value;
  const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);

  // Format Product Details
  const productDetails = cart.map(item => `${item.name} (${item.qty} x ₹${item.price})`).join(', ');

  // Calculate Total
  const totalValue = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalString = `₹${totalValue}`;

  // Prepare Form Data for Google Forms
  const formData = {};
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.ORDER_ID] = orderId;
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.NAME] = name;
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.PHONE] = phone;
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.ADDRESS] = address;
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.EMAIL] = email;
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.PRODUCTS] = productDetails;
  formData[ORDER_FORM_CONFIG.ENTRY_IDS.TOTAL] = totalString;

  // Show Loading State
  const checkoutBtn = document.querySelector('#checkout-form button[type="submit"]');
  const originalBtnText = checkoutBtn.innerText;
  checkoutBtn.disabled = true;
  checkoutBtn.innerText = 'Placing Order...';

  try {
    // Submit to Google Forms
    await fetch(ORDER_FORM_CONFIG.ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData)
    });

    // Save mock order locally as well
    const order = {
      id: orderId,
      name: name,
      email: email,
      phone: phone,
      address: address,
      items: cart,
      date: new Date().toLocaleDateString(),
      status: "Processing"
    };

    const orders = JSON.parse(localStorage.getItem('siddhaOrders')) || [];
    orders.push(order);
    localStorage.setItem('siddhaOrders', JSON.stringify(orders));

    // Clear Cart
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();

    // Close Modal & Show Success
    document.getElementById('checkout-modal').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
    alert(`Order Placed Successfully!\nYour Order ID is: ${orderId}\n\nUse this ID to track your order status.`);
    document.getElementById('checkout-form').reset();

  } catch (error) {
    console.error('Error submitting order:', error);
    alert('There was an error placing your order. Please try again.');
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.innerText = originalBtnText;
  }
}

async function trackOrder() {
  const orderIdInput = document.getElementById('track-order-id');
  const orderId = orderIdInput.value.trim();
  const trackBtn = document.getElementById('btn-track-order');
  const trackingModal = document.getElementById('tracking-modal');
  const trackingText = document.getElementById('tracking-modal-text');
  const cartOverlay = document.getElementById('cart-overlay');

  if (!orderId) {
    alert('Please enter an Order ID.');
    return;
  }

  // Show loading
  trackBtn.disabled = true;
  trackBtn.innerText = 'Tracking...';

  try {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbxbaerKfTI7izw0KPLLAlIWu_-_WR-mdxrQ-vuhfAB76Q6Dfxf9M5gGG7E5UrLsK1askw/exec?id=${encodeURIComponent(orderId)}`);
    const data = await response.json();

    if (data.status === 'Order ID Not Found. Please check the ID and try again.') {
      trackingText.innerHTML = `<p style="color: #d9534f;">${data.status}</p>`;
      // Hide timeline for error
      const timeline = document.querySelector('.order-timeline');
      if (timeline) timeline.style.display = 'none';

      trackingModal.classList.add('active');
      cartOverlay.classList.add('active');
    } else {
      // Success - Show timeline
      const timeline = document.querySelector('.order-timeline');
      if (timeline) timeline.style.display = 'block';

      // Map status to stage index
      const statusMap = {
        'Processing': 0,
        'Confirmed & Ready to Ship': 1,
        'Confirmed and Ready to Ship': 1,
        'Ready to Ship': 1,
        'Shipped': 2,
        'Out for Delivery': 3,
        'Delivered': 4
      };

      const currentStage = statusMap[data.status] !== undefined ? statusMap[data.status] : 0;

      // Update message
      const message = `Dear Customer, your order <strong>${orderId}</strong> is in <strong>${data.status}</strong> status.`;
      trackingText.innerHTML = `<p>${message}</p>`;

      // Show modal first
      trackingModal.classList.add('active');
      cartOverlay.classList.add('active');

      // Animate timeline after a short delay
      setTimeout(() => {
        animateTimeline(currentStage);
      }, 300);
    }

  } catch (error) {
    console.error('Tracking error:', error);
    alert('Error tracking order. Please try again later.');
  } finally {
    trackBtn.disabled = false;
    trackBtn.innerText = 'Track';
  }
}

function animateTimeline(currentStage) {
  const stages = document.querySelectorAll('.timeline-stage');
  const progressBar = document.getElementById('timeline-progress');
  const scooterContainer = document.getElementById('scooter-container');

  // Reset all stages
  stages.forEach(stage => {
    stage.classList.remove('active', 'completed');
  });

  // Mark completed and active stages
  stages.forEach((stage, index) => {
    if (index < currentStage) {
      stage.classList.add('completed');
    } else if (index === currentStage) {
      stage.classList.add('active');
    }
  });

  // Calculate progress percentage (0%, 25%, 50%, 75%, 100%)
  const progressPercent = (currentStage / 4) * 100;

  // Animate progress bar
  setTimeout(() => {
    progressBar.style.width = progressPercent + '%';
  }, 100);

  // Animate scooter to current position
  setTimeout(() => {
    scooterContainer.style.left = progressPercent + '%';
  }, 100);
}

// Expose functions to global scope
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;

// --- Initialize page-specific functions on DOM load ---
document.addEventListener('DOMContentLoaded', function () {
  // Check which page we're on and initialize accordingly
  if (document.getElementById('cart-icon')) {
    initStorePage();
  }

  if (document.getElementById('agree-checkbox')) {
    initRemediesPage();
  }

  if (document.getElementById('introduction')) {
    initAboutPage();
  }

  if (document.getElementById('contactForm') && !document.getElementById('consultForm')) {
    initContactPage();
  }

  if (document.getElementById('consultForm')) {
    initConsultPage();
  }
});
