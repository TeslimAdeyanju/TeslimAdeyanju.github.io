// ── Sticky header shadow on scroll ──────────────────────────────
const header = document.getElementById('site-header')
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10)
})

// ── Mobile hamburger menu toggle ─────────────────────────────────
const menuToggle = document.getElementById('menu-toggle')
const navLinks = document.getElementById('nav-links')

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active')
  })
  // Close menu when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'))
  })
}

// ── Theme toggle ─────────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle')

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    applyTheme(next)
  })
  // Sync icon to current theme on load
  applyTheme(document.documentElement.getAttribute('data-theme') || 'light')
}

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

// ── Scroll-triggered reveal for below-the-fold sections ─────────
const scrollRevealEls = document.querySelectorAll('.scroll-reveal')
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view')
      scrollRevealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' })

scrollRevealEls.forEach(el => { scrollRevealObserver.observe(el) })

// ── Typed hero tagline loop ──────────────────────────────────────
const typedEl = document.getElementById('typed-text')
if (typedEl) {
  const typedPhrases = ["Hi, I'm Teslim Adeyanju", 'Financial Data Analyst | ACA', 'Power BI, Finance & Data Automation']
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    typedEl.textContent = typedPhrases[0]
  } else {
    let phraseIndex = 0
    let charIndex = 0
    let deleting = false

    const typeLoop = () => {
      const current = typedPhrases[phraseIndex]
      if (!deleting) {
        charIndex++
        typedEl.textContent = current.slice(0, charIndex)
        if (charIndex === current.length) {
          deleting = true
          setTimeout(typeLoop, 1400)
          return
        }
        setTimeout(typeLoop, 55)
      } else {
        charIndex--
        typedEl.textContent = current.slice(0, charIndex)
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % typedPhrases.length
          setTimeout(typeLoop, 300)
          return
        }
        setTimeout(typeLoop, 30)
      }
    }
    typeLoop()
  }
}
