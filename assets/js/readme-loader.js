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

  function fetchAndRender(content, repo, branch) {
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
    document.querySelectorAll('.readme-content[data-readme-autoload]').forEach(function (content) {
      var repo = content.getAttribute('data-readme-repo')
      var branch = content.getAttribute('data-readme-branch') || 'main'
      if (repo) fetchAndRender(content, repo, branch)
    })
  })
})()
