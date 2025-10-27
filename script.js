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

// Smooth scroll enhancement
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

(function(){
          document.getElementById('current-year').textContent = new Date().getFullYear();
        })();
