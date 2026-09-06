// Fetches and renders a project's live README.md from GitHub on demand.
(function () {
  function rewriteRelativeUrls(md, repo, branch) {
    var rawBase = 'https://raw.githubusercontent.com/' + repo + '/' + branch + '/'
    var blobBase = 'https://github.com/' + repo + '/blob/' + branch + '/'
    md = md.replace(/!\[([^\]]*)\]\((?!https?:\/\/|data:)([^)]+)\)/g, function (m, alt, path) {
      return '![' + alt + '](' + rawBase + path + ')'
    })
    md = md.replace(/(^|[^!])\[([^\]]*)\]\((?!https?:\/\/|#|mailto:)([^)]+)\)/g, function (m, pre, text, path) {
      return pre + '[' + text + '](' + blobBase + path + ')'
    })
    return md
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
        md = rewriteRelativeUrls(md, repo, branch)
        content.innerHTML = window.marked ? window.marked.parse(md) : '<pre></pre>'
        if (!window.marked) content.querySelector('pre').textContent = md
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
