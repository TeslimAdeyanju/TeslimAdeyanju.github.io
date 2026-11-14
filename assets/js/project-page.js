// Project case-study page experience. Loaded by every projects/*.html page.
//  - reading progress bar
//  - "On this page" contents menu with scroll highlighting (built from the README headings)
//  - heading anchor links and copy buttons on code blocks
//  - estimated read time
//  - next / previous project links
(function () {
  // Order matches the homepage grid. Add new case studies here.
  var PROJECTS = [
    { slug: 'fda-toolkit', title: 'FDA Toolkit' },
    { slug: 'nhs-financial-analytics', title: 'NHS Trust Financial Analytics' },
    { slug: 'financial-forecasting-variance', title: 'Financial Forecasting & Variance Analysis' },
    { slug: 'stock-market-analysis', title: 'Stock Market Risk Analysis' },
    { slug: 'advanced-sql-analytics', title: 'Advanced SQL Analytics' },
    { slug: 'financial-performance-analytics-powerbi', title: 'Financial Performance Analytics Model' },
    { slug: 'financial-report-intelligence-system', title: 'Financial Report Intelligence System' },
    { slug: 'hmrc-tax-rag-assistant', title: 'HMRC Tax RAG Assistant' }
  ]

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ── Reading progress ─────────────────────────────────────── */
  function initProgress() {
    var bar = document.createElement('div')
    bar.className = 'pp-progress'
    bar.setAttribute('aria-hidden', 'true')
    document.body.appendChild(bar)
    var ticking = false
    function update() {
      var h = document.documentElement
      var max = h.scrollHeight - h.clientHeight
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ')'
      ticking = false
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }, { passive: true })
    update()
  }

  /* ── Contents menu ────────────────────────────────────────── */
  var spy = null
  function buildToc(content) {
    var box = content.closest('.readme-box')
    if (!box) return
    var old = box.querySelector('.pp-toc')
    if (old) old.remove()
    if (spy) { spy.disconnect(); spy = null }

    var heads = Array.prototype.slice.call(content.querySelectorAll('h2'))
    if (heads.length < 3) { box.classList.remove('has-toc'); return }

    var nav = document.createElement('nav')
    nav.className = 'pp-toc'
    nav.setAttribute('aria-label', 'On this page')
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'pp-toc-toggle'
    btn.setAttribute('aria-expanded', 'false')
    btn.innerHTML = '<span>On this page</span><span class="pp-toc-chev" aria-hidden="true">▾</span>'
    var list = document.createElement('ol')
    list.className = 'pp-toc-list'
    var links = {}
    heads.forEach(function (h) {
      var li = document.createElement('li')
      var a = document.createElement('a')
      a.href = '#' + h.id
      a.textContent = h.textContent
      a.addEventListener('click', function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false') })
      li.appendChild(a)
      list.appendChild(li)
      links[h.id] = a
    })
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open')
      btn.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
    nav.appendChild(btn)
    nav.appendChild(list)
    box.insertBefore(nav, content)
    box.classList.add('has-toc')

    if ('IntersectionObserver' in window) {
      spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            Object.keys(links).forEach(function (id) { links[id].classList.remove('is-active') })
            if (links[e.target.id]) links[e.target.id].classList.add('is-active')
          }
        })
      }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 })
      heads.forEach(function (h) { spy.observe(h) })
    }
  }

  /* ── Anchors and copy buttons ─────────────────────────────── */
  function enhanceContent(content) {
    content.querySelectorAll('h2, h3').forEach(function (h) {
      if (h.querySelector('.pp-anchor')) return
      var a = document.createElement('a')
      a.className = 'pp-anchor'
      a.href = '#' + h.id
      a.setAttribute('aria-label', 'Link to this section')
      a.textContent = '#'
      h.appendChild(a)
    })
    content.querySelectorAll('pre').forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('pp-code')) return
      var wrap = document.createElement('div')
      wrap.className = 'pp-code'
      pre.parentNode.insertBefore(wrap, pre)
      wrap.appendChild(pre)
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'pp-copy'
      b.textContent = 'Copy'
      b.addEventListener('click', function () {
        var text = pre.innerText
        var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy' }, 1600) }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {})
        else done()
      })
      wrap.appendChild(b)
    })
    // Tables get a keyboard-focusable scroll region on narrow screens
    content.querySelectorAll('table').forEach(function (t) { t.setAttribute('tabindex', '0') })
  }

  function setReadTime(words) {
    var mins = Math.max(1, Math.round(words / 200))
    document.querySelectorAll('[data-read-time]').forEach(function (el) {
      el.textContent = mins + ' min read'
      el.hidden = false
    })
  }

  /* ── Next / previous ──────────────────────────────────────── */
  function initPager() {
    var file = (location.pathname.split('/').pop() || '').replace(/\.html?$/, '')
    var i = PROJECTS.findIndex(function (p) { return p.slug === file })
    if (i < 0) return
    var prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length]
    var next = PROJECTS[(i + 1) % PROJECTS.length]
    var sec = document.createElement('section')
    sec.className = 'about-section pp-pager-wrap'
    sec.innerHTML =
      '<div class="container"><nav class="pp-pager" aria-label="More case studies">' +
      '<a class="pp-pager-link pp-prev" href="' + prev.slug + '.html"><span class="pp-pager-dir">← Previous case study</span><span class="pp-pager-title"></span></a>' +
      '<a class="pp-pager-link pp-next" href="' + next.slug + '.html"><span class="pp-pager-dir">Next case study →</span><span class="pp-pager-title"></span></a>' +
      '</nav></div>'
    // titles set via textContent so "&" in names is never parsed as markup
    sec.querySelector('.pp-prev .pp-pager-title').textContent = prev.title
    sec.querySelector('.pp-next .pp-pager-title').textContent = next.title
    // sits just above the closing contact block
    var connect = document.getElementById('connect')
    if (connect) { connect.parentNode.insertBefore(sec, connect); return }
    var sections = document.querySelectorAll('body > section')
    var last = sections[sections.length - 1]
    if (last) last.parentNode.insertBefore(sec, last.nextSibling)
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  document.addEventListener('readme:loaded', function (e) {
    var content = e.target
    if (!content || !content.classList || !content.classList.contains('readme-content')) return
    buildToc(content)
    enhanceContent(content)
    setReadTime((e.detail && e.detail.words) || 0)
    // honour a deep link such as #key-findings once the content exists
    if (location.hash && !content.dataset.hashHandled) {
      content.dataset.hashHandled = '1'
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  })

  document.addEventListener('DOMContentLoaded', function () {
    initProgress()
    initPager()
  })
})()
