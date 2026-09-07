/* =========================================================
   FIXPOINT HOME SERVICES — SCRIPT
   1. Mobile nav toggle
   2. Contact form validation (Full Name, Phone, Message)
   3. On submit: build a pre-formatted WhatsApp message and redirect
   (The "Call Directly" buttons need no JS — they're plain tel: links in the HTML)
   ========================================================= */

const WHATSAPP_NUMBER = '918639641523'; // country code + number, no "+" or spaces

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Mobile nav toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2 & 3. Contact form validation + WhatsApp redirect ---------- */
  const form = document.getElementById('contactForm');

  const fields = {
    fullName: document.getElementById('fullName'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message'),
  };

  const errors = {
    fullName: document.getElementById('fullNameError'),
    phone: document.getElementById('phoneError'),
    message: document.getElementById('messageError'),
  };

  function isEmpty(value) {
    return value.trim().length === 0;
  }

  function isValidPhone(value) {
    // Accepts a 10-digit Indian mobile number, optionally prefixed with +91 / 91 / 0
    const digitsOnly = value.replace(/[\s-]/g, '');
    return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(digitsOnly);
  }

  function setFieldError(field, msg) {
    fields[field].classList.add('field-invalid');
    errors[field].textContent = msg;
  }

  function clearFieldError(field) {
    fields[field].classList.remove('field-invalid');
    errors[field].textContent = '';
  }

  function validateField(field) {
    const value = fields[field].value;

    if (field === 'fullName' && isEmpty(value)) {
      setFieldError(field, 'Please enter your full name.');
      return false;
    }
    if (field === 'phone' && (isEmpty(value) || !isValidPhone(value))) {
      setFieldError(field, 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (field === 'message' && isEmpty(value)) {
      setFieldError(field, 'Please describe what needs fixing.');
      return false;
    }

    clearFieldError(field);
    return true;
  }

  Object.keys(fields).forEach((field) => {
    fields[field].addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    // Prevent the default form submission before anything else
    event.preventDefault();

    const results = Object.keys(fields).map((field) => validateField(field));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      const firstInvalid = Object.keys(fields).find((field) => !validateField(field));
      if (firstInvalid) fields[firstInvalid].focus();
      return;
    }

    const fullName = fields.fullName.value.trim();
    const phone = fields.phone.value.trim();
    const message = fields.message.value.trim();

    // Pre-format the WhatsApp message with the submitted details
    const whatsappText =
      `Hi FixPoint, I'd like to book a repair.\n\n` +
      `Name: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Details: ${message}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

    // Redirect to WhatsApp with the message pre-filled
    window.location.href = whatsappUrl;
  });
});
