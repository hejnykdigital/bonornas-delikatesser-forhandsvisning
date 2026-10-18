(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobilmeny
  const setNav = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  // Sidhuvudet blir ljust när man lämnat bilden högst upp
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.hash)).filter(Boolean);
  // Positioner mäts en gång (och vid storleksändring) så att scroll inte tvingar fram omräkningar
  let offsets = [];
  const measure = () => { offsets = sections.map((sec) => sec.getBoundingClientRect().top + window.scrollY); };
  let scrolled = null, active = null, ticking = false, hidden = false, lastY = window.scrollY;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const isScrolled = y > 40;
    if (isScrolled !== scrolled) { scrolled = isScrolled; header.classList.toggle('is-scrolled', isScrolled); }

    // Sidhuvudet glider undan när man scrollar ner och kommer tillbaka när man scrollar upp
    const delta = y - lastY;
    if (Math.abs(delta) > 6) {
      const hide = delta > 0 && y > window.innerHeight * 0.6 && !nav.classList.contains('is-open');
      if (hide !== hidden) { hidden = hide; header.classList.toggle('is-hidden', hide); }
      lastY = y;
    }
    if (y <= 0) { hidden = false; header.classList.remove('is-hidden'); }
    const line = y + window.innerHeight * 0.4;
    let current = -1;
    offsets.forEach((top, i) => { if (top <= line) current = i; });
    if (current !== active) {
      active = current;
      links.forEach((a, i) => a.classList.toggle('is-active', i === current));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });
  window.addEventListener('load', () => { measure(); onScroll(); });

  // Mjuka in-animationer
  if ('IntersectionObserver' in window && !reduceMotion) {
    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.section-head, .story-teaser-inner, .category-media, .category-copy, .occasions-grid article, .visit-teaser-grid, .intro-media, .intro-copy, .story-copy, .timeline, .item, .menu-card, .statement blockquote p, .sources, .gifts-media, .gifts-copy, .gallery img, .faq-list, .visit-copy, .map, .contact-form, .footer-welcome, .recipe-head, .recipe-ingredients, .recipe-steps, .archive-card, .tip')
      .forEach((el, i) => {
        el.classList.add('reveal');
        if (el.matches('.item, .gallery img')) el.style.transitionDelay = `${(i % 4) * 120}ms`;
        reveal.observe(el);
      });
  }

  // Karta laddas först när besökaren klickar
  const mapBtn = document.querySelector('.map-consent');
  mapBtn?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = mapBtn.dataset.src;
    iframe.title = 'Karta till Bönornas Delikatesser, Bagaregatan 31C i Nyköping';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapBtn.replaceWith(iframe);
  });

  // Kontaktformulär: ämnesknappar, tips i meddelanderutan och datum vid presenter
  const form = document.getElementById('contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const topics = [...form.querySelectorAll('input[name="amne"]')];
    const message = form.querySelector('#f-message');
    const dateField = form.querySelector('.field-date');
    const topicBox = form.querySelector('.topic');

    const onTopic = () => {
      const chosen = topics.find((t) => t.checked);
      if (!chosen) return;
      message.placeholder = chosen.dataset.hint;
      dateField.hidden = !chosen.dataset.date;
      topicBox.classList.remove('is-invalid');
    };
    topics.forEach((t) => t.addEventListener('change', onTopic));

    // Förvalt ämne via länk, till exempel kontakt.html?amne=presentkorg
    if (new URLSearchParams(location.search).get('amne') === 'presentkorg') {
      topics[0].checked = true;
      onTopic();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      if (!topics.some((t) => t.checked)) { topicBox.classList.add('is-invalid'); firstInvalid = topics[0]; }
      form.querySelectorAll('input[required]:not([type="radio"]), textarea[required]').forEach((field) => {
        const ok = field.checkValidity() && field.value.trim() !== '';
        field.setAttribute('aria-invalid', String(!ok));
        if (!ok && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        status.textContent = 'Hoppsan, något saknas. Fyll i de markerade fälten så är du nästan klar.';
        status.className = 'form-status field-full is-error';
        firstInvalid.focus();
        return;
      }
      const d = new FormData(form);
      const rows = [d.get('meddelande'), '', `Hälsningar ${d.get('namn')}`, d.get('epost')];
      if (d.get('telefon')) rows.push(`Telefon: ${d.get('telefon')}`);
      if (!dateField.hidden && d.get('datum')) rows.push(`Önskat datum: ${d.get('datum')}`);
      window.location.href = 'mailto:info@bonornasdelikatesser.se'
        + '?subject=' + encodeURIComponent(`${d.get('amne')} via hemsidan`)
        + '&body=' + encodeURIComponent(rows.join('\n'));
      status.textContent = 'Tack! Nu öppnas ditt mejlprogram, tryck bara på skicka. Vi ser fram emot att läsa.';
      status.className = 'form-status field-full is-ok';
    });
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) e.target.setAttribute('aria-invalid', 'false');
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
