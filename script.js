// ============================================
// MENU TOGGLE FUNCTIONALITY
// ============================================
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const isOpen = menu.classList.toggle("open");
  icon.classList.toggle("open");
  
  // Update ARIA attributes for accessibility
  icon.setAttribute("aria-expanded", isOpen);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const menuLinks = document.querySelector('.menu-links');
  
  if (hamburgerMenu && !hamburgerMenu.contains(event.target) && menuLinks.classList.contains('open')) {
    menuLinks.classList.remove('open');
    hamburgerIcon.classList.remove('open');
    hamburgerIcon.setAttribute("aria-expanded", "false");
  }
});

// ============================================
// SMOOTH SCROLL ENHANCEMENT
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Close mobile menu if open
      const menuLinks = document.querySelector('.menu-links');
      if (menuLinks && menuLinks.classList.contains('open')) {
        toggleMenu();
      }
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Stagger skill tags animation
      if (entry.target.hasAttribute('data-animate-children')) {
        const children = entry.target.children;
        Array.from(children).forEach((child, index) => {
          setTimeout(() => {
            child.style.animation = `fadeInUp 0.5s ease-out forwards`;
            child.style.opacity = '1';
          }, index * 50); // 50ms delay between each
        });
      }
      
      // Don't observe again after animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections with animation attributes
document.querySelectorAll('[data-animate="fade-in"]').forEach(section => {
  section.style.opacity = '0';
  observer.observe(section);
});

// Observe skill tags for stagger animation
document.querySelectorAll('[data-animate-children="stagger"]').forEach(container => {
  Array.from(container.children).forEach(child => {
    child.style.opacity = '0';
  });
  observer.observe(container);
});

// ============================================
// PROJECT CARDS STAGGER ANIMATION
// ============================================
const projectCardsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.project-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.animation = `fadeInUp 0.6s ease-out forwards`;
          card.style.opacity = '1';
        }, index * 100);
      });
      projectCardsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const projectsGrid = document.querySelector('[data-animate-children="cards"]');
if (projectsGrid) {
  const cards = projectsGrid.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.style.opacity = '0';
  });
  projectCardsObserver.observe(projectsGrid);
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add shadow on scroll
  if (currentScroll > 50) {
    nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
  } else {
    nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
  }
  
  lastScroll = currentScroll;
});

// ============================================
// ADD ACTIVE STATE TO NAVIGATION
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.fontWeight = '400';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.fontWeight = '600';
    }
  });
});

// ============================================
// PARALLAX EFFECT ON PROFILE PICTURE
// ============================================
const profilePic = document.querySelector('.profile-pic-wrapper');
if (profilePic) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    if (scrolled < 800) {
      profilePic.style.transform = `translateY(${rate}px)`;
    }
  });
}

// ============================================
// SMOOTH HOVER EFFECT FOR ICONS
// ============================================
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// ============================================
// CURRENT YEAR IN FOOTER
// ============================================
(function(){
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();

// ============================================
// PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
// ============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.animation = 'none';
    el.style.opacity = '1';
  });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

// Smooth scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Keyboard accessibility
scrollToTopBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
});
