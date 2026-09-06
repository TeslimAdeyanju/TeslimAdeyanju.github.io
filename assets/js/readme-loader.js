// Fetches and renders a project's live README.md from GitHub on demand.
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

  function loadReadme(toggleBtn) {
    var repo = toggleBtn.getAttribute('data-readme-repo')
    var branch = toggleBtn.getAttribute('data-readme-branch') || 'main'
    var content = toggleBtn.nextElementSibling
    if (!repo || !content) return

    var isHidden = content.hasAttribute('hidden')
    if (!isHidden) {
      content.setAttribute('hidden', '')
      toggleBtn.textContent = 'Show Full README'
      return
    }

    content.removeAttribute('hidden')
    toggleBtn.textContent = 'Hide Full README'

    if (content.getAttribute('data-loaded') === 'true') return

    content.innerHTML = '<p class="readme-loading">Loading README from GitHub…</p>'

    fetch('https://raw.githubusercontent.com/' + repo + '/' + branch + '/README.md')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.text()
      })
      .then(function (md) {
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
        content.setAttribute('data-loaded', 'true')
      })
      .catch(function () {
        content.innerHTML = '<p class="readme-error">Couldn\'t load the README automatically. <a href="https://github.com/' + repo + '" target="_blank" rel="noopener">View it on GitHub ↗</a></p>'
      })
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.readme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () { loadReadme(btn) })
    })
  })
})()
