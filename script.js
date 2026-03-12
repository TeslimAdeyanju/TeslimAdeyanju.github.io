// ── Dark / Light theme toggle ──────────────────────────────────
const html = document.documentElement
const themeToggle = document.getElementById('theme-toggle')
const savedTheme = localStorage.getItem('theme') || 'light'
html.setAttribute('data-theme', savedTheme)
if (themeToggle) themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙'

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙'
  })
}

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

// ── 3D tilt on hero photo ──────────────────────────────────────
const photoCol = document.querySelector('.hero-photo-col')
const photoFrame = document.querySelector('.photo-frame')
const floatCards = document.querySelectorAll('.float-card')

if (photoCol && photoFrame) {
  photoFrame.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease'
  floatCards.forEach(c => { c.style.transition = 'transform 0.18s ease' })

  photoCol.addEventListener('mousemove', (e) => {
    const rect = photoCol.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5

    photoFrame.style.transform =
      `perspective(700px) rotateX(${y * -14}deg) rotateY(${x * 14}deg) scale(1.04)`

    floatCards.forEach((card, i) => {
      const dir = i === 0 ? 1 : -1
      card.style.transform = `translate(${x * 18 * dir}px, ${y * 14 * dir}px)`
    })
  })

  photoCol.addEventListener('mouseleave', () => {
    photoFrame.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)'
    floatCards.forEach(c => { c.style.transform = '' })
  })
}
