/* ============================================================
   ACT COLLECTIBLES — Main JavaScript
   Handles: nav, search overlay, scroll reveals, back-to-top,
            category filters, search filtering, newsletter form,
            contact form, price ticker animations.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile menu ────────────────────────────────────────── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ── Active nav link ────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  /* ── Search overlay ─────────────────────────────────────── */
  const searchBtn     = document.querySelector('.search-btn');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput   = document.querySelector('.search-overlay input');
  const searchResults = document.querySelector('.search-results');

  // Sample article data for search
  const articles = [
    { title: 'Top 10 Most Valuable Sports Cards in the U.S.', cat: 'Sports Cards', badge: 'badge-sports', href: 'article.html' },
    { title: "Beginner's Guide to Collecting Pokémon Cards",  cat: 'TCG',          badge: 'badge-tcg',    href: 'article.html' },
    { title: 'How Card Grading Works in America (PSA & BGS)', cat: 'Guides',       badge: 'badge-guides', href: 'article.html' },
    { title: 'Is Collecting Sports Cards a Good Investment?', cat: 'Investment',   badge: 'badge-invest', href: 'article.html' },
    { title: 'Rare Vintage Baseball Cards Worth Finding',     cat: 'Vintage',      badge: 'badge-vintage',href: 'article.html' },
    { title: 'NBA Rookie Card Guide: Best Buys for 2024',     cat: 'Sports Cards', badge: 'badge-sports', href: 'article.html' },
    { title: 'Yu-Gi-Oh! Market Trends & Valuable Cards',      cat: 'TCG',          badge: 'badge-tcg',    href: 'article.html' },
    { title: 'How to Store and Protect Your Card Collection', cat: 'Guides',       badge: 'badge-guides', href: 'article.html' },
  ];

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput && searchInput.focus(), 50);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
  }

  if (searchBtn)     searchBtn.addEventListener('click', openSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (!q) return;
      const matches = articles.filter(a => a.title.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q));
      if (matches.length === 0) {
        searchResults.innerHTML = '<p style="padding:.5rem .75rem;color:var(--text-muted);font-size:.85rem;">No results found.</p>';
        return;
      }
      matches.slice(0, 5).forEach(a => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `<span class="badge ${a.badge}">${a.cat}</span><span style="font-size:.88rem;font-weight:500;">${a.title}</span>`;
        div.addEventListener('click', () => { window.location.href = a.href; });
        searchResults.appendChild(div);
      });
    });
  }

  /* ── Back-to-top button ─────────────────────────────────── */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll-reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Category filter pills (articles page) ──────────────── */
  const catPills   = document.querySelectorAll('.cat-pill');
  const articleItems = document.querySelectorAll('.article-list-item, .article-card');
  const noResults  = document.querySelector('.no-results');

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      let visible = 0;
      articleItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
          visible++;
        } else {
          item.style.display = 'none';
        }
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  /* ── Page search bar (articles page) ───────────────────── */
  const pageSearchInput = document.querySelector('.search-input-group input');
  const pageSearchBtn   = document.querySelector('.search-input-group button');

  function filterArticleList(q) {
    q = q.trim().toLowerCase();
    let visible = 0;
    articleItems.forEach(item => {
      const title = (item.querySelector('h3')?.textContent || '').toLowerCase();
      const text  = (item.querySelector('p')?.textContent  || '').toLowerCase();
      if (!q || title.includes(q) || text.includes(q)) {
        item.style.display = '';
        visible++;
      } else {
        item.style.display = 'none';
      }
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  if (pageSearchInput) {
    pageSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') filterArticleList(pageSearchInput.value); });
  }
  if (pageSearchBtn) {
    pageSearchBtn.addEventListener('click', () => filterArticleList(pageSearchInput?.value || ''));
  }

  /* ── Newsletter form ────────────────────────────────────── */
  document.querySelectorAll('.newsletter-form, .newsletter-band-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;
      const btn = form.querySelector('button');
      if (btn) {
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'var(--accent)';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
          btn.style.color = '';
          input.value = '';
        }, 3000);
      }
    });
  });

  /* ── Contact form ───────────────────────────────────────── */
  const contactForm    = document.querySelector('.contact-form');
  const formSuccess    = document.querySelector('.form-success');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }

  /* ── Animated price ticker ──────────────────────────────── */
  const priceItems = document.querySelectorAll('.price-item .price');
  if (priceItems.length) {
    setInterval(() => {
      priceItems.forEach(el => {
        const base = parseFloat(el.dataset.base || el.textContent.replace(/[^0-9.]/g, ''));
        if (!el.dataset.base) el.dataset.base = base;
        const change = (Math.random() - 0.48) * base * 0.03;
        const newVal = base + change;
        el.textContent = '$' + newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const changeEl = el.closest('.price-item')?.querySelector('.change');
        if (changeEl) {
          const pct = ((change / base) * 100).toFixed(2);
          changeEl.textContent = (change >= 0 ? '▲ +' : '▼ ') + Math.abs(pct) + '%';
          changeEl.className = 'change ' + (change >= 0 ? 'up' : 'down');
        }
      });
    }, 3000);
  }

  /* ── Sort dropdown (articles page) ──────────────────────── */
  const sortSelect = document.querySelector('.filter-sort select');
  const articleList = document.querySelector('.article-list');
  if (sortSelect && articleList) {
    sortSelect.addEventListener('change', () => {
      const items = Array.from(articleList.querySelectorAll('.article-list-item'));
      items.sort((a, b) => {
        if (sortSelect.value === 'newest') return -1; // already ordered newest
        if (sortSelect.value === 'oldest') return  1;
        if (sortSelect.value === 'popular') return Math.random() - .5; // simulate
        return 0;
      });
      items.forEach(item => articleList.appendChild(item));
    });
  }

  /* ── Reading progress bar ───────────────────────────────── */
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

});
