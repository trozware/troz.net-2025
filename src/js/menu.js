// Hamburger nav menu for phones
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle')
  const navLinks = document.querySelector('.nav-links')
  
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'
    menuToggle.setAttribute('aria-expanded', !isExpanded)
    navLinks.classList.toggle('show')
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-brand') && !e.target.closest('.nav-links')) {
      menuToggle.setAttribute('aria-expanded', 'false')
      navLinks.classList.remove('show')
    }
  })
});