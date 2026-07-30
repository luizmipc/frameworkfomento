// Scrollspy compartilhado: destaca no nav.toc a seção visível no momento.
// No-op silencioso em páginas sem nav.toc (ex.: docs/index.html).
const links = document.querySelectorAll("nav.toc a[href^='#']");

if (links.length) {
  const sections = [...links]
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  function onScroll() {
    let current = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= 96) current = s;
    }
    links.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === `#${current?.id}`)
    );
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
