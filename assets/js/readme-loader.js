// Fetches and renders a project's live README.md from GitHub on demand.
//
// Resilience:
//  - shows a skeleton while loading (not a bare "Loading…" line)
//  - caches the last good README in sessionStorage, so repeat visits are instant
//    and the live copy is then re-checked in the background
//  - if GitHub is unreachable, falls back to the committed snapshot next to the
//    page (projects/<page>.md) instead of showing an error
// After every render it fires a `readme:loaded` event on the container, which
// project-page.js uses to build the contents menu, copy buttons and read time.
(function () {
  function stripLeadingHeading(md) {
    // The repo's own H1 duplicates this page's hero title — drop it.
    return md.replace(/^\s+/, '').replace(/^#\s+[^\n]*\n?/, '')
  }

  function rewriteRelativeUrls(md, repo, branch) {
    var rawBase = 'https://raw.githubusercontent.com/' + repo + '/' + branch + '/'
    var blobBase = 'https://github.com/' + repo + '/blob/' + branch + '/'

    // Markdown image/link syntax: ![alt](path) / [text](path)
    md = md.replace(/!\[([^\]]*)\]\((?!https?:\/\/|data:)([^)]+)\)/g, function (m, alt, path) {
      return '![' + alt + '](' + rawBase + path + ')'
    })
    md = md.replace(/(^|[^!])\[([^\]]*)\]\((?!https?:\/\/|#|mailto:)([^)]+)\)/g, function (m, pre, text, path) {
      return pre + '[' + text + '](' + blobBase + path + ')'
    })

    // Raw HTML embedded in the markdown: <img src="..."> / <a href="...">
    md = md.replace(/(<img\s[^>]*?src=["'])(?!https?:\/\/|data:)([^"']+)(["'])/gi, function (m, pre, path, post) {
      return pre + rawBase + path + post
    })
    md = md.replace(/(<a\s[^>]*?href=["'])(?!https?:\/\/|#|mailto:)([^"']+)(["'])/gi, function (m, pre, path, post) {
      return pre + blobBase + path + post
    })

    return md
  }

  function slugify(text) {
    return text.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  function assignHeadingIds(container) {
    var seen = {}
    container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function (h) {
      var base = slugify(h.textContent) || 'section'
      var slug = base
      if (seen[base] != null) {
        seen[base] += 1
        slug = base + '-' + seen[base]
      } else {
        seen[base] = 0
      }
      h.id = slug
    })
  }

  function skeleton() {
    var bars = ''
    for (var i = 0; i < 7; i++) bars += '<span class="readme-skel-bar" style="width:' + (i % 3 === 2 ? 62 : 100 - (i % 2) * 14) + '%"></span>'
    return '<div class="readme-skeleton" role="status" aria-live="polite" aria-label="Loading write-up">' + bars + '</div>'
  }

  function cacheKey(repo, branch) { return 'readme:' + repo + ':' + branch }
  function readCache(key) { try { return sessionStorage.getItem(key) } catch (e) { return null } }
  function writeCache(key, val) { try { sessionStorage.setItem(key, val) } catch (e) { /* storage full or blocked */ } }

  function snapshotUrl(content) {
    var explicit = content.getAttribute('data-readme-snapshot')
    if (explicit) return explicit
    // projects/foo.html -> foo.md (the committed README snapshot beside the page)
    var file = location.pathname.split('/').pop() || ''
    return file.replace(/\.html?$/, '') ? file.replace(/\.html?$/, '.md') : null
  }

  function render(content, md, repo, branch, note) {
    md = stripLeadingHeading(md)
    md = rewriteRelativeUrls(md, repo, branch)
    if (window.marked) {
      content.innerHTML = window.marked.parse(md, { gfm: true, breaks: false })
      assignHeadingIds(content)
    } else {
      var pre = document.createElement('pre')
      pre.textContent = md
      content.innerHTML = ''
      content.appendChild(pre)
    }
    if (note) {
      var n = document.createElement('p')
      n.className = 'readme-note'
      n.innerHTML = note
      content.insertBefore(n, content.firstChild)
    }
    content.setAttribute('data-loaded', 'true')
    content.dispatchEvent(new CustomEvent('readme:loaded', { bubbles: true, detail: { words: md.split(/\s+/).length } }))
  }

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.text()
    })
  }

  function fetchAndRender(content, repo, branch) {
    var key = cacheKey(repo, branch)
    var cached = readCache(key)
    if (cached) render(content, cached, repo, branch)
    else content.innerHTML = skeleton()

    fetchText('https://raw.githubusercontent.com/' + repo + '/' + branch + '/README.md')
      .then(function (md) {
        writeCache(key, md)
        if (md !== cached) render(content, md, repo, branch)
      })
      .catch(function () {
        if (cached) return // already showing the last good copy
        var snap = snapshotUrl(content)
        var repoLink = 'https://github.com/' + repo
        if (!snap) return showError(content, repoLink)
        fetchText(snap)
          .then(function (md) {
            render(content, md, repo, branch,
              'Showing a saved copy because GitHub could not be reached. <a href="' + repoLink + '" target="_blank" rel="noopener">Open the live version</a>')
          })
          .catch(function () { showError(content, repoLink) })
      })
  }

  function showError(content, repoLink) {
    content.innerHTML = '<p class="readme-error">Couldn\'t load the write-up automatically. <a href="' + repoLink + '" target="_blank" rel="noopener">View it on GitHub</a></p>'
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.readme-content[data-readme-autoload]').forEach(function (content) {
      var repo = content.getAttribute('data-readme-repo')
      var branch = content.getAttribute('data-readme-branch') || 'main'
      if (repo) fetchAndRender(content, repo, branch)
    })
  })
})()
