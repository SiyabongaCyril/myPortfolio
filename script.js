// ============================================
// HTML SECTION INCLUDES
// ============================================
async function loadSections() {
  const includeTargets = document.querySelectorAll('[data-include]');
  if (!includeTargets.length) return;

  await Promise.all([...includeTargets].map(async (target) => {
    const path = target.getAttribute('data-include');
    if (!path) return;

    try {
      const response = await fetch(path);
      if (!response.ok) {
        target.innerHTML = `<section><p>Failed to load: ${path}</p></section>`;
        return;
      }
      target.innerHTML = await response.text();
    } catch (error) {
      target.innerHTML = `<section><p>Failed to load: ${path}</p></section>`;
      console.error('Include load error:', path, error);
    }
  }));
}

// ============================================
// MENU TOGGLE FUNCTIONALITY
// ============================================
function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (!menu || !icon) return;

  const isOpen = menu.classList.toggle('open');
  icon.classList.toggle('open');
  icon.setAttribute('aria-expanded', isOpen);
}

function initMenuAndScroll() {
  document.addEventListener('click', function (e) {
    const nav = document.querySelector('.hamburger-menu');
    const icon = document.querySelector('.hamburger-icon');
    const menu = document.querySelector('.menu-links');

    if (nav && !nav.contains(e.target) && menu && icon && menu.classList.contains('open')) {
      menu.classList.remove('open');
      icon.classList.remove('open');
      icon.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const menu = document.querySelector('.menu-links');
      if (menu && menu.classList.contains('open')) toggleMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const animated = document.querySelectorAll('[data-animate="fade-up"]');
  const staggerGroups = document.querySelectorAll('[data-stagger]');

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animated.forEach(el => observer.observe(el));

    // Stagger groups: assign delay to each child then observe parent
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          for (let i = 0; i < children.length; i++) {
            children[i].style.transitionDelay = `${i * 0.08}s`;
          }
          entry.target.classList.add('visible');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    staggerGroups.forEach(el => staggerObserver.observe(el));
  } else {
    animated.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    staggerGroups.forEach(el => {
      [...el.children].forEach(child => {
        child.style.opacity = '1';
        child.style.transform = 'none';
      });
    });
  }
}

// ============================================
// ACTIVE NAV + SCROLL EFFECTS
// ============================================
function initActiveNavAndTopButton() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#desktop-nav .nav-links a');
  const desktopNav = document.querySelector('#desktop-nav');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  function onScroll() {
    const scrollY = window.pageYOffset;

    if (desktopNav) desktopNav.classList.toggle('scrolled', scrollY > 60);
    if (scrollToTopBtn) scrollToTopBtn.classList.toggle('visible', scrollY > 350);

    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 120) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    scrollToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// ============================================
// CURRENT YEAR IN FOOTER
// ============================================
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================
// CONTACT FORM — AJAX SUBMIT VIA FORMSPREE
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const labelNormal = form.querySelector('.submit-label');
  const labelSending = form.querySelector('.submit-sending');
  const successMsg = form.querySelector('.form-success');
  const errorMsg = form.querySelector('.form-error');
  const defaultErrorText = errorMsg ? errorMsg.textContent.trim() : '';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let willFallbackToNativeSubmit = false;

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('input-error');
      if (!field.value.trim()) {
        field.classList.add('input-error');
        valid = false;
      }
    });
    if (!valid) return;

    submitBtn.disabled = true;
    labelNormal.hidden = true;
    labelSending.hidden = false;
    successMsg.hidden = true;
    errorMsg.hidden = true;
    if (errorMsg && defaultErrorText) errorMsg.textContent = defaultErrorText;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        successMsg.hidden = false;
        form.reset();
      } else {
        let serverMessage = '';
        try {
          const data = await response.json();
          serverMessage = data?.error || data?.message || '';
        } catch {
          // Keep a generic fallback message if the API does not return JSON.
        }

        // If AJAX is blocked in Formspree settings, submit natively as a fallback.
        if (response.status === 403 && /submit via AJAX/i.test(serverMessage)) {
          willFallbackToNativeSubmit = true;
          HTMLFormElement.prototype.submit.call(form);
          return;
        }

        if (errorMsg) {
          errorMsg.textContent = serverMessage || defaultErrorText || 'Something went wrong. Try emailing directly instead.';
          errorMsg.hidden = false;
        }
      }
    } catch {
      if (errorMsg) errorMsg.hidden = false;
    } finally {
      if (willFallbackToNativeSubmit) return;
      submitBtn.disabled = false;
      labelNormal.hidden = false;
      labelSending.hidden = true;
    }
  });

  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('input-error'));
  });
}

/**
 * Image/Project Card Modal Logic
 */
function initProjectModal() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const captionText = document.getElementById('modal-caption');
  const closeBtn = document.querySelector('.modal-close');

  if (!modal || !modalImg || !closeBtn) return;

  function openModal(imgSrc, altText, caption) {
    modal.style.display = 'flex';
    // Small timeout to allow display:flex to take effect before opacity transition
    setTimeout(() => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }, 10);
    modalImg.src = imgSrc;
    modalImg.alt = altText;
    captionText.textContent = caption || altText;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
    // Wait for transition before hiding
    setTimeout(() => {
      if (!modal.classList.contains('open')) {
        modal.style.display = 'none';
      }
    }, 300);
  }

  // Use event delegation for dynamically loaded sections
  document.addEventListener('click', (e) => {
    // Ensure we don't trigger modal for links, buttons or interactive elements inside the card
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.modal-close')) return;

    // Check if clicked element or its parent is a project-image-wrap or project-card
    const imageWrap = e.target.closest('.project-image-wrap');
    const projectCard = e.target.closest('.project-card:not(.coming-soon-card)');

    if (imageWrap || projectCard) {
      // Find the image within this card
      const target = imageWrap || projectCard;
      const img = target.querySelector('.project-img');
      const title = target.querySelector('h3')?.textContent || '';

      if (img && img.src) {
        openModal(img.src, img.alt, title);
      }
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-content-wrapper')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

async function initApp() {
  await loadSections();
  initMenuAndScroll();
  initScrollAnimations();
  initActiveNavAndTopButton();
  initCurrentYear();
  initContactForm();
  initProjectModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
