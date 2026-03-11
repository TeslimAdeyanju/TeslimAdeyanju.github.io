// Sticky header shadow on scroll
const header = document.getElementById('site-header')
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10)
})
