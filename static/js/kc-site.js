const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    menuButton?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
  }
});

nav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
});

// Micro.blog's Sidebar.js returns links on the account's service address.
// Keep every public-facing news link on the Kings Centre custom domain.
const canonicalNewsHost = 'https://news.kingscentresouthall.org.uk';
const rewriteNewsLinks = () => {
  document.querySelectorAll('a[href^="https://davemarsden.micro.blog"], a[href^="https://kcteam.micro.blog"]').forEach((link) => {
    link.href = link.href
      .replace('https://davemarsden.micro.blog', canonicalNewsHost)
      .replace('https://kcteam.micro.blog', canonicalNewsHost);
    if (['davemarsden.micro.blog', 'kcteam.micro.blog'].includes(link.textContent.trim())) {
      link.textContent = 'news.kingscentresouthall.org.uk';
    }
  });
};

rewriteNewsLinks();
new MutationObserver(rewriteNewsLinks).observe(document.body, { childList: true, subtree: true });
