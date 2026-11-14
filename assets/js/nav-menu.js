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
})();
