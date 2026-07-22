// UDSG — comportamiento compartido del sitio (menú, reloj, revelado en scroll)
(function () {
  // reloj UTC en el header
  const clock = document.getElementById('clock');
  if (clock) {
    const tick = () => {
      const d = new Date();
      clock.textContent =
        String(d.getUTCHours()).padStart(2, '0') + ':' +
        String(d.getUTCMinutes()).padStart(2, '0') + ':' +
        String(d.getUTCSeconds()).padStart(2, '0') + 'Z';
    };
    tick();
    setInterval(tick, 1000);
  }

  // menú móvil
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // resaltar el enlace de la página actual
  const here = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a[href]').forEach(a => {
    const target = a.getAttribute('href').replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    if (target === here) a.classList.add('on');
  });

  // revelado de secciones al hacer scroll (progressive enhancement:
  // el contenido es visible por defecto; solo se oculta si esto logra correr)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
    // red de seguridad: si algo queda sin revelar (ej. entra sin scroll de por medio), lo mostramos igual
    setTimeout(() => reveals.forEach(el => el.classList.add('in')), 4000);
  }

  // paralaje sutil del diagrama del hero al mover el mouse (solo escritorio, respeta reduced-motion)
  const schematic = document.querySelector('.hero-schematic');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (schematic && !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      schematic.style.transform = `translate(${x * -14}px, calc(-50% + ${y * -14}px))`;
    });
    hero.addEventListener('mouseleave', () => {
      schematic.style.transform = '';
    });
  }
})();
