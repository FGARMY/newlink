/**
 * Newlink Tour & Tourism - Interactive Script
 * Handles navigation, animations, FAQ accordion, counter animations,
 * scroll effects, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Sticky navbar with blur
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (scrollY > 600) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // Scroll to top click
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Keyboard support for hamburger
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburger.click();
    }
  });


  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  // ===== COUNTER ANIMATION =====
  const animateCounter = (element, target, suffix = '+') => {
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);

      if (target >= 1000) {
        element.textContent = current.toLocaleString() + suffix;
      } else {
        element.textContent = current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };


  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  const statElements = document.querySelectorAll('.stat-number, .hero-stat-value');
  const animatedStats = new Set();

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Check for counter elements within the revealed section
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(counter => {
          if (!animatedStats.has(counter)) {
            animatedStats.add(counter);
            const target = parseInt(counter.dataset.count);
            animateCounter(counter, target);
          }
        });

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Observe stat counters separately
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats.has(entry.target)) {
        animatedStats.add(entry.target);
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => {
    if (el.dataset.count) {
      statObserver.observe(el);
    }
  });


  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const content = item.querySelector('.faq-answer-content');

    // Set initial state
    if (item.classList.contains('active')) {
      answer.style.maxHeight = content.scrollHeight + 'px';
    }

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked item if it was closed
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  // ===== BOOKING FORM =====
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');

    if (pickupDate) pickupDate.min = today;
    if (returnDate) returnDate.min = today;

    // Update return date min when pickup date changes
    pickupDate?.addEventListener('change', () => {
      if (returnDate) {
        returnDate.min = pickupDate.value;
        if (returnDate.value && returnDate.value < pickupDate.value) {
          returnDate.value = pickupDate.value;
        }
      }
    });

    // Form submission
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const pickup = document.getElementById('pickup-location').value;
      const dropoff = document.getElementById('dropoff-location').value;
      const pickDate = pickupDate.value;
      const retDate = returnDate.value;
      const carType = document.getElementById('car-type').value;

      // Construct WhatsApp message
      let message = `Hi Newlink! I'd like to book a car.\n\n`;
      if (pickup) message += `📍 Pickup: ${pickup}\n`;
      if (dropoff) message += `📍 Drop-off: ${dropoff}\n`;
      if (pickDate) message += `📅 Pickup Date: ${formatDate(pickDate)}\n`;
      if (retDate) message += `📅 Return Date: ${formatDate(retDate)}\n`;
      if (carType) message += `🚗 Car Type: ${carType.charAt(0).toUpperCase() + carType.slice(1)}\n`;

      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Format date helper
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }


  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value;

      if (email) {
        // Show success feedback
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#22c55e';
        input.value = '';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      }
    });
  }


  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  // ===== PARALLAX EFFECT ON HERO =====
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }


  // ===== LOADING ANIMATION =====
  // Trigger hero animations after page load
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // ===== VEHICLE MODAL LOGIC =====
  const carData = {
    dzire: {
      name: 'Swift Dzire',
      category: 'Sedan',
      image: 'images/car-dzire.jpg',
      features: ['Air Conditioning', 'Bluetooth Audio', 'Spacious Trunk', 'Power Windows', 'USB Charging', 'GPS Navigation (Optional)'],
      specs: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Seats', value: '4' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Transmission', value: 'Manual' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Fuel', value: 'Petrol' }
      ],
      selfDrivePrice: '₹1,500',
      chauffeurPrice: '₹2,200'
    },
    creta: {
      name: 'Hyundai Creta',
      category: 'SUV',
      image: 'images/car-creta.jpg',
      features: ['Climate Control', 'Sunroof', 'Touchscreen Infotainment', 'Reverse Camera', 'Cruise Control', 'Leather Seats'],
      specs: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Seats', value: '5' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Transmission', value: 'Automatic' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Fuel', value: 'Diesel' }
      ],
      selfDrivePrice: '₹2,500',
      chauffeurPrice: '₹3,200'
    },
    carens: {
      name: 'Kia Carens',
      category: 'MPV',
      image: 'images/car-carens.jpg',
      features: ['7-Seater', 'Rear AC Vents', 'Ambient Lighting', 'Premium Sound System', 'Spacious Cabin', 'Multiple Airbags'],
      specs: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Seats', value: '7' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Transmission', value: 'Manual' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Fuel', value: 'Diesel' }
      ],
      selfDrivePrice: '₹2,800',
      chauffeurPrice: '₹3,500'
    },
    innova: {
      name: 'Toyota Innova Crysta',
      category: 'MPV',
      image: 'images/car-innova.jpg',
      features: ['Captain Seats', 'Premium Upholstery', 'Dual Zone AC', 'Excellent Ride Quality', 'Reliable Performance', 'Ample Legroom'],
      specs: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Seats', value: '7' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Transmission', value: 'Automatic' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Fuel', value: 'Diesel' }
      ],
      selfDrivePrice: '₹3,500',
      chauffeurPrice: '₹4,500'
    },
    xuv700: {
      name: 'Mahindra XUV700',
      category: 'SUV',
      image: 'images/car-xuv700.jpg',
      features: ['Panoramic Sunroof', 'Advanced Driver Assistance (ADAS)', 'Dual Screens', 'Powerful Engine', 'Luxurious Interiors', 'Smart Connectivity'],
      specs: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Seats', value: '7' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Transmission', value: 'Automatic' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Fuel', value: 'Diesel' }
      ],
      selfDrivePrice: '₹3,800',
      chauffeurPrice: '₹4,800'
    },
    fortuner: {
      name: 'Toyota Fortuner',
      category: 'Luxury SUV',
      image: 'images/car-fortuner.jpg',
      features: ['4x4 Capabilities', 'Rugged Build', 'Ventilated Seats', 'Premium Audio', 'Commanding Road Presence', 'Ultimate Comfort'],
      specs: [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Seats', value: '7' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Transmission', value: 'Automatic' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Fuel', value: 'Diesel' }
      ],
      selfDrivePrice: '₹5,500',
      chauffeurPrice: '₹6,500'
    }
  };

  const vehicleModal = document.getElementById('vehicleModal');
  const closeModal = document.getElementById('closeModal');
  const detailBtns = document.querySelectorAll('.view-details-btn');

  if (vehicleModal && closeModal) {
    detailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const carId = btn.getAttribute('data-car');
        const car = carData[carId];
        if (car) {
          document.getElementById('modalCarImage').src = car.image;
          document.getElementById('modalCarCategory').textContent = car.category;
          document.getElementById('modalCarName').textContent = car.name;
          document.getElementById('modalSelfDrivePrice').innerHTML = `${car.selfDrivePrice}<span>/day</span>`;
          document.getElementById('modalChauffeurPrice').innerHTML = `${car.chauffeurPrice}<span>/day</span>`;
          
          document.getElementById('modalCarFeatures').innerHTML = car.features.map(f => `
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${f}
            </li>
          `).join('');

          document.getElementById('modalCarSpecs').innerHTML = car.specs.map(s => `
            <div class="modal-spec-item">
              <div class="modal-spec-icon">${s.icon}</div>
              <span class="modal-spec-label">${s.label}</span>
              <span class="modal-spec-value">${s.value}</span>
            </div>
          `).join('');

          document.getElementById('modalBookBtn').href = `https://wa.me/919876543210?text=Hi!%20I%20want%20to%20book%20a%20${encodeURIComponent(car.name)}`;

          vehicleModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    closeModal.addEventListener('click', () => {
      vehicleModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    vehicleModal.addEventListener('click', (e) => {
      if (e.target === vehicleModal) {
        vehicleModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
