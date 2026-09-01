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
  if (themeToggle) themeToggle.innerHTML = theme === 'dark' ? '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>' : '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>'
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    applyTheme(next)
  })
  // Sync icon to current theme on load
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark')
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
