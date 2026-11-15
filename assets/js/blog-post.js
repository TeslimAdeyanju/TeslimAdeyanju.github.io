/* Blog post helper: table of contents, read time, share links. Loaded by every blog/*.html post. */
(function () {
  var art = document.querySelector('.post-article');
  if (!art) return;

  // Read time (about 200 words a minute, minimum 1)
  var words = (art.textContent || '').trim().split(/\s+/).length;
  var mins = Math.max(1, Math.round(words / 200));
  document.querySelectorAll('[data-read-time]').forEach(function (el) { el.textContent = mins + ' min read'; });

  // Heading ids and the auto table of contents (shown when the post has three or more sections)
  var used = {};
  var heads = art.querySelectorAll('h2, h3');
  heads.forEach(function (h) {
    if (h.id) return;
    var id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    while (used[id]) id += '-2';
    used[id] = true; h.id = id;
  });
  var h2s = art.querySelectorAll('h2');
  var slot = art.querySelector('[data-toc]');
  if (slot && h2s.length >= 3) {
    var d = document.createElement('details'); d.className = 'post-toc'; d.open = window.innerWidth > 700;
    var html = '<summary>On this page</summary><ol>';
    h2s.forEach(function (h) { html += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>'; });
    d.innerHTML = html + '</ol>';
    slot.replaceWith(d);
  } else if (slot) { slot.remove(); }

  // Share links use the page's own address
  var url = encodeURIComponent((document.querySelector('link[rel="canonical"]') || {}).href || location.href);
  var li = document.querySelector('[data-share="linkedin"]');
  var fb = document.querySelector('[data-share="facebook"]');
  var cp = document.querySelector('[data-share="copy"]');
  if (li) li.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
  if (fb) fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
  if (cp) cp.addEventListener('click', function () {
    var link = decodeURIComponent(url), orig = cp.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () {
      cp.textContent = 'Link copied'; setTimeout(function () { cp.textContent = orig; }, 1800);
    }).catch(function () { window.prompt('Copy this link', link); });
  });
})();
