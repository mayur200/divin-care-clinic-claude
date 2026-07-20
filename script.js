/* =====================================================================
   DIVINE CARE CLINIC — Complete Family Health
   script.js — Vanilla JS interactions
   ---------------------------------------------------------------------
   Contents:
     1. Sticky header shadow on scroll
     2. Scrollspy — highlight active nav link
     3. Mobile nav auto-close on link click
     4. Scroll-reveal animations (IntersectionObserver)
     5. Back-to-top button
     6. Gallery filtering
     7. Gallery lightbox (open / close / prev / next / keyboard)
     8. Appointment form validation + WhatsApp submission
     9. Footer year auto-update
   ===================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------------
     1. STICKY HEADER SHADOW ON SCROLL
     ------------------------------------------------------------------- */
  var header = document.getElementById('dcc-header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* -------------------------------------------------------------------
     2. SCROLLSPY — HIGHLIGHT ACTIVE NAV LINK BASED ON SECTION IN VIEW
     ------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.dcc-nav .nav-link'));
  var sections = navLinks
    .map(function (link) {
      var hash = link.getAttribute('href');
      if (!hash || hash.charAt(0) !== '#') return null;
      var target = document.querySelector(hash);
      return target ? { link: link, target: target } : null;
    })
    .filter(Boolean);

  function handleScrollSpy() {
    var scrollPos = window.scrollY + 140; /* offset for sticky header */
    var current = sections[0];

    sections.forEach(function (item) {
      if (item.target.offsetTop <= scrollPos) {
        current = item;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
    });

    if (current) {
      current.link.classList.add('active');
    }
  }

  if (sections.length) {
    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
  }


  /* -------------------------------------------------------------------
     3. MOBILE NAV — CLOSE COLLAPSE AFTER TAPPING A LINK
     ------------------------------------------------------------------- */
  var navCollapseEl = document.getElementById('dccNav');
  if (navCollapseEl) {
    navCollapseEl.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navCollapseEl.classList.contains('show') && window.bootstrap) {
          var collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
          collapseInstance.hide();
        }
      });
    });
  }


  /* -------------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     ------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: reveal everything immediately */
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* -------------------------------------------------------------------
     5. BACK TO TOP BUTTON
     ------------------------------------------------------------------- */
  var backToTopBtn = document.getElementById('backToTop');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 480) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  if (backToTopBtn) {
    handleBackToTop();
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* -------------------------------------------------------------------
     6. GALLERY FILTERING
     ------------------------------------------------------------------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.gallery-filter-btn'));
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      galleryItems.forEach(function (item) {
        var category = item.getAttribute('data-filter');
        var show = filter === 'all' || category === filter;
        if (show) {
          item.style.display = '';
          item.style.opacity = '1';
          item.style.pointerEvents = '';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });


  /* -------------------------------------------------------------------
     7. GALLERY LIGHTBOX
     ------------------------------------------------------------------- */
  var lightbox = document.getElementById('dccLightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCat = document.getElementById('lightboxCat');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentLightboxIndex = -1;

  function getVisibleGalleryItems() {
    return galleryItems.filter(function (item) {
      return item.style.display !== 'none';
    });
  }

  function openLightbox(index) {
    var visibleItems = getVisibleGalleryItems();
    if (!visibleItems.length) return;

    /* keep index within bounds (wrap around) */
    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;

    currentLightboxIndex = index;
    var item = visibleItems[index];
    var img = item.querySelector('img');
    var cat = item.querySelector('.g-cat');
    var title = item.querySelector('.g-title');

    if (lightboxImg && img) {
      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.getAttribute('alt') || '';
    }
    if (lightboxCat) {
      lightboxCat.textContent = cat ? cat.textContent : '';
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = title ? title.textContent : '';
    }

    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    currentLightboxIndex = -1;
  }

  function showNextImage(direction) {
    if (currentLightboxIndex === -1) return;
    openLightbox(currentLightboxIndex + direction);
  }

  galleryItems.forEach(function (item) {
    /* Open lightbox on click */
    item.addEventListener('click', function () {
      var visibleItems = getVisibleGalleryItems();
      var index = visibleItems.indexOf(item);
      openLightbox(index);
    });

    /* Keyboard accessibility */
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image in lightbox');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var visibleItems = getVisibleGalleryItems();
        var index = visibleItems.indexOf(item);
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showNextImage(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { showNextImage(1); });

  if (lightbox) {
    /* Close when clicking the dark backdrop (but not the image/figure) */
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  /* Keyboard navigation: Esc to close, arrows to navigate */
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showNextImage(-1);
    if (e.key === 'ArrowRight') showNextImage(1);
  });


  /* -------------------------------------------------------------------
     8. APPOINTMENT FORM — VALIDATION + WHATSAPP SUBMISSION
     ------------------------------------------------------------------- */
  var appointmentForm = document.getElementById('appointmentForm');
  var formSuccessMsg = document.getElementById('formSuccessMsg');
  var CLINIC_WHATSAPP_NUMBER = '918591233993';

  function setFieldValidity(field, isValid) {
    if (!field) return;
    if (isValid) {
      field.classList.remove('is-invalid');
    } else {
      field.classList.add('is-invalid');
    }
  }

  function validateAppointmentForm(form) {
    var isValid = true;

    var nameField = form.querySelector('#apptName');
    var phoneField = form.querySelector('#apptPhone');
    var emailField = form.querySelector('#apptEmail');
    var doctorField = form.querySelector('#apptDoctor');

    /* Name: at least 2 characters */
    var nameValid = nameField.value.trim().length >= 2;
    setFieldValidity(nameField, nameValid);
    if (!nameValid) isValid = false;

    /* Phone: 10-digit Indian mobile number starting 6-9 */
    var phonePattern = /^[6-9][0-9]{9}$/;
    var phoneValid = phonePattern.test(phoneField.value.trim());
    setFieldValidity(phoneField, phoneValid);
    if (!phoneValid) isValid = false;

    /* Email: simple format check */
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var emailValid = emailPattern.test(emailField.value.trim());
    setFieldValidity(emailField, emailValid);
    if (!emailValid) isValid = false;

    /* Preferred doctor: must be selected */
    var doctorValid = doctorField.value.trim().length > 0;
    setFieldValidity(doctorField, doctorValid);
    if (!doctorValid) isValid = false;

    return isValid;
  }

  if (appointmentForm) {
    /* Restrict phone input to digits only while typing */
    var phoneInput = appointmentForm.querySelector('#apptPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '').slice(0, 10);
      });
      phoneInput.addEventListener('paste', function (e) {
        setTimeout(function () {
          phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '').slice(0, 10);
        }, 0);
      });
    }

    /* Live validation: clear invalid state once corrected */
    ['#apptName', '#apptPhone', '#apptEmail', '#apptDoctor'].forEach(function (sel) {
      var field = appointmentForm.querySelector(sel);
      if (!field) return;
      field.addEventListener('input', function () {
        field.classList.remove('is-invalid');
      });
      field.addEventListener('change', function () {
        field.classList.remove('is-invalid');
      });
    });

    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (formSuccessMsg) {
        formSuccessMsg.classList.remove('show');
      }

      if (!validateAppointmentForm(appointmentForm)) {
        /* Focus the first invalid field for accessibility */
        var firstInvalid = appointmentForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = appointmentForm.querySelector('#apptName').value.trim();
      var phone = appointmentForm.querySelector('#apptPhone').value.trim();
      var email = appointmentForm.querySelector('#apptEmail').value.trim();
      var doctorSelect = appointmentForm.querySelector('#apptDoctor');
      var doctor = doctorSelect.options[doctorSelect.selectedIndex].text;
      var message = appointmentForm.querySelector('#apptMessage').value.trim();

      /* Build a pre-filled WhatsApp message for the clinic */
      var waText = 'New Appointment Request — Divine Care Clinic%0A%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Phone: ' + encodeURIComponent(phone) + '%0A' +
        'Email: ' + encodeURIComponent(email) + '%0A' +
        'Preferred Doctor: ' + encodeURIComponent(doctor) +
        (message ? '%0AMessage: ' + encodeURIComponent(message) : '');

      var waUrl = 'https://wa.me/' + CLINIC_WHATSAPP_NUMBER + '?text=' + waText;

      /* Show success message */
      if (formSuccessMsg) {
        formSuccessMsg.classList.add('show');
      }

      /* Open WhatsApp with the pre-filled message in a new tab */
      window.open(waUrl, '_blank', 'noopener');

      /* Reset form for the next entry */
      appointmentForm.reset();
    });
  }


  /* -------------------------------------------------------------------
     9. FOOTER YEAR AUTO-UPDATE
     ------------------------------------------------------------------- */
  var footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

})();
