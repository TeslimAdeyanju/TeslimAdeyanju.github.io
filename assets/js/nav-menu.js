// Mobile menu behaviour shared by every page. The pages' own scripts open and close the menu by toggling
// `.active` on #nav-links; this file keeps the button state in step and closes the menu when it is no longer wanted.
(function () {
  var toggle = document.getElementById('menu-toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  var openedAt = 0;

  function isOpen() { return links.classList.contains('active'); }
  function close() { links.classList.remove('active'); }

  function sync() {
    var open = isOpen();
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-controls', 'nav-links');
    toggle.textContent = open ? '✕' : '☰';
    if (open) openedAt = window.scrollY;
  }
  sync();
  new MutationObserver(sync).observe(links, { attributes: true, attributeFilter: ['class'] });

  // tap anywhere outside the header, or press Escape
  document.addEventListener('click', function (e) {
    if (isOpen() && !e.target.closest('.nav')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { close(); toggle.focus(); }
  });
  // scrolling the page away from where the menu was opened closes it
  window.addEventListener('scroll', function () {
    if (isOpen() && Math.abs(window.scrollY - openedAt) > 40) close();
  }, { passive: true });
  // widening the window to the desktop menu resets it
  window.addEventListener('resize', function () {
    if (window.innerWidth > 920 && isOpen()) close();
  });

  // Back to top button on every page, shown after scrolling down
  {
    var up = document.createElement('button');
    up.type = 'button'; up.className = 'to-top'; up.setAttribute('aria-label', 'Back to top'); up.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(up);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    window.addEventListener('scroll', function () { up.classList.toggle('is-shown', window.scrollY > 700); }, { passive: true });
  }
})();
