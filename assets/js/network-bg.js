// ── Site-wide network background ─────────────────────────────────
// A fixed, full-window canvas of drifting dots that link up when close and
// reach toward the mouse. It sits behind all page content (z-index -1), so it
// stays visible while scrolling wherever sections are transparent.
// Loaded by every page. Colours come from --net-* custom properties in
// styles.css, so they follow the light/dark theme.
(function () {
  const canvas = document.createElement('canvas')
  canvas.id = 'site-network'
  canvas.setAttribute('aria-hidden', 'true')
  if (!canvas.getContext) return
  document.body.prepend(canvas)
  const ctx = canvas.getContext('2d')

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const LINK = 150
  const MOUSE_LINK = LINK * 1.3
  let w = 0, h = 0, dots = [], running = false, rafId = 0
  let colors = [], lineRGB = '148,163,184', mouseRGB = '56,189,248'
  const mouse = { x: -9999, y: -9999 }

  const readColors = () => {
    const cs = getComputedStyle(document.documentElement)
    const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback
    colors = [v('--net-dot-1', '#38BDF8'), v('--net-dot-2', '#818CF8'), v('--net-dot-3', '#94A3B8')]
    lineRGB = v('--net-line', lineRGB)
    mouseRGB = v('--net-mouse', mouseRGB)
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.round(Math.min(130, Math.max(36, (w * h) / 12000)))
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
      c: Math.floor(Math.random() * 3)
    }))
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    ctx.lineWidth = 0.8
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i]
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(' + lineRGB + ',' + (0.32 * (1 - d / LINK)).toFixed(3) + ')'
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y)
      if (md < MOUSE_LINK) {
        ctx.strokeStyle = 'rgba(' + mouseRGB + ',' + (0.5 * (1 - md / MOUSE_LINK)).toFixed(3) + ')'
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
      }
    }
    for (const p of dots) {
      ctx.fillStyle = colors[p.c]
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
    }
  }

  const step = () => {
    for (const p of dots) {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) p.vy *= -1
    }
    draw()
    if (running) rafId = requestAnimationFrame(step)
  }
  const start = () => { if (!running && !reduce && !document.hidden) { running = true; rafId = requestAnimationFrame(step) } }
  const stop = () => { running = false; cancelAnimationFrame(rafId) }

  readColors(); resize(); draw()

  // Start drifting only after page-load fade-ins have finished (~1.2s);
  // a busy animation loop from the first frame also stalls CSS animations
  // in headless Chrome screenshots.
  let ready = false
  setTimeout(() => { ready = true; start() }, 1200)

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => { resize(); draw() }, 150)
  })
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY
    if (reduce) draw()
  }, { passive: true })
  document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; if (reduce) draw() })
  document.addEventListener('visibilitychange', () => { if (ready) document.hidden ? stop() : start() })
  new MutationObserver(() => { readColors(); draw() })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})()
