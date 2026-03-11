// ── Sticky header shadow on scroll ──────────────────────────────
const header = document.getElementById('site-header')
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10)
})

// ── Animated count-up for hero stat numbers ──────────────────────
function countUp(el, target, suffix = '', duration = 1800) {
  const start = performance.now()
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.floor(eased * target) + suffix
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.textContent = target + suffix
    }
  }
  requestAnimationFrame(update)
}

// Trigger count-up when hero stats come into view
const statNums = document.querySelectorAll('.hs-num[data-count]')
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target
      const target = parseInt(el.dataset.count)
      const suffix = el.dataset.suffix || ''
      countUp(el, target, suffix)
      observer.unobserve(el)
    }
  })
}, { threshold: 0.5 })

statNums.forEach(el => observer.observe(el))
