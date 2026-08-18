// Initialize app (works whether script is deferred or loaded at end)
function initApp() {
  // Theme init: check saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const isLightInit = document.documentElement.classList.contains('light-theme');
    themeToggle.textContent = isLightInit ? '🌞' : '🌙';
    themeToggle.setAttribute('aria-pressed', isLightInit ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', isLightInit ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? '🌞' : '🌙';
      themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }
  // --- i18n setup using external locale files ---
  // Make `resources` available to functions outside the loader (fallback safety)
  let resources = {};
  const langEnBtn = document.getElementById('lang-en');
  const langHiBtn = document.getElementById('lang-hi');
  const themeToggleBtn = document.getElementById('theme-toggle');
  console.log('langEnBtn', !!langEnBtn, 'langHiBtn', !!langHiBtn, 'themeToggle', !!themeToggleBtn);

  const savedLang = localStorage.getItem('lang') || 'en';

  (async function loadLocalesAndInit(){
    // Try multiple candidate paths for locales: relative up-levels and absolute root
    async function tryFetchJson(url) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Status ' + resp.status);
        return await resp.json();
      } catch (e) {
        return null;
      }
    }

    try {
      const candidates = [];
      // relative lookups: current folder, one level up, two levels up
      candidates.push('locales/en.json');
      candidates.push('../locales/en.json');
      candidates.push('../../locales/en.json');
      candidates.push('/locales/en.json');
      let enJson = null;
      for (const c of candidates) {
        enJson = await tryFetchJson(c);
        if (enJson) { console.log('Loaded en.json from', c); break; }
        else console.log('en.json not at', c);
      }

      const candidatesHi = [];
      candidatesHi.push('locales/hi.json');
      candidatesHi.push('../locales/hi.json');
      candidatesHi.push('../../locales/hi.json');
      candidatesHi.push('/locales/hi.json');
      let hiJson = null;
      for (const c of candidatesHi) {
        hiJson = await tryFetchJson(c);
        if (hiJson) { console.log('Loaded hi.json from', c); break; }
        else console.log('hi.json not at', c);
      }

      if (!enJson || !hiJson) {
        console.warn('Could not load locales from expected locations; falling back to keys only');
        resources = { en: { translation: {} }, hi: { translation: {} } };
      } else {
        resources = { en: enJson, hi: hiJson };
      }

      if (window.i18next && enJson && hiJson) {
        i18next.init({ lng: savedLang, resources }, () => {
          localizeAll();
          initTyped();
          updateLangButtons(savedLang);
          document.documentElement.lang = savedLang;
        });
      } else {
        // fallback simple loader (works even if i18next present but locales missing)
        window._i18 = { t: (k) => {
          try {
            const parts = k.split('.');
            let v = (localStorage.getItem('lang') === 'hi' ? resources.hi.translation : resources.en.translation);
            for (const p of parts) { if (v && v[p] !== undefined) v = v[p]; else return k; }
            return v;
          } catch (e) { return k; }
        }, changeLanguage: (l, cb) => { localStorage.setItem('lang', l); if (cb) cb(); } };
        localizeAll();
        initTyped();
        updateLangButtons(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch (e) {
      console.error('i18n load failed', e);
      // ensure a safe fallback so localization functions don't crash
      resources = { en: { translation: {} }, hi: { translation: {} } };
      window._i18 = { t: (k) => k, changeLanguage: (l, cb) => { localStorage.setItem('lang', l); if (cb) cb(); } };
      localizeAll(); initTyped(); updateLangButtons(savedLang); document.documentElement.lang = savedLang;
    }
  })();

  function localizeAll() {
    let t;
    if (window.i18next && typeof window.i18next.t === 'function') t = window.i18next.t.bind(window.i18next);
    else if (window._i18 && typeof window._i18.t === 'function') t = window._i18.t.bind(window._i18);
    else t = (k) => {
      try {
        const parts = k.split('.');
        let v = resources[localStorage.getItem('lang') || 'en'].translation;
        for (const p of parts) { if (v && v[p] !== undefined) v = v[p]; else return k; }
        return v;
      } catch (e) { return k; }
    };
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const tr = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.type === 'submit' || el.type === 'button') el.value = tr;
        else el.value = tr;
      } else {
        if (typeof tr === 'string' && /<[a-z][\s\S]*>/i.test(tr)) {
          el.innerHTML = tr;
        } else {
          el.textContent = tr;
        }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });
    // set alt/title/src attributes for images and elements
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      const tr = t(key);
      if (el.tagName === 'IMG') el.alt = tr;
      else el.setAttribute('alt', tr);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });
    document.querySelectorAll('[data-i18n-src]').forEach(el => {
      const key = el.getAttribute('data-i18n-src');
      const val = t(key);
      if (val) el.src = val;
    });
  }

  function initTyped() {
    const getTypedStrings = () => {
      if (window.i18next) return i18next.t('typed', { returnObjects: true });
      try {
        return resources[localStorage.getItem('lang') || 'en'].translation.typed;
      } catch (e) {
        console.warn('Typed strings not found in resources, falling back to simple array', e);
        return ['Web Developer', 'Designer', 'Learner'];
      }
    };
    // destroy existing typed if present
    if (window._typedInstance) {
      try { window._typedInstance.destroy(); } catch (e) {}
    }
    try {
      window._typedInstance = new Typed('.multiText', {
        strings: getTypedStrings(),
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
      });
    } catch (e) {
      console.error('Failed to initialize Typed.js', e);
    }
  }

  function updateLangButtons(active) {
    if (langEnBtn) langEnBtn.setAttribute('aria-pressed', active === 'en' ? 'true' : 'false');
    if (langHiBtn) langHiBtn.setAttribute('aria-pressed', active === 'hi' ? 'true' : 'false');
  }

  function setLanguage(l) {
    localStorage.setItem('lang', l);
    if (window.i18next) {
      i18next.changeLanguage(l, () => { localizeAll(); initTyped(); updateLangButtons(l); });
    } else {
      localizeAll(); initTyped(); updateLangButtons(l);
      document.documentElement.lang = l;
    }
  }

  if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
  if (langHiBtn) langHiBtn.addEventListener('click', () => setLanguage('hi'));
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', () => console.log('themeToggle clicked'));

  // Main landing page specific initialization (particles, cube tilt, card tilt & mobile nav)
  const isMainLanding = !!document.querySelector('.hero');
  if (isMainLanding) {
    // 1. Particle System with Cyan Neon Aesthetic
    if (typeof window.particlesJS === 'function') {
      particlesJS("particles-js", {
        particles: {
          number: { value: 70, density: { enable: true, value_area: 800 } },
          color: { value: "#00abf0" },
          shape: { type: "circle" },
          opacity: { value: 0.45, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 140,
            color: "#00abf0",
            opacity: 0.35,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.8,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 150, line_linked: { opacity: 0.6 } },
            push: { particles_nb: 3 },
          },
        },
        retina_detect: true,
      });
    }

    // 2. Mobile Navbar Toggle
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    if (menuIcon && navbar) {
      menuIcon.onclick = () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
      };

      document.querySelectorAll(".navbar a").forEach((link) => {
        link.addEventListener("click", () => {
          menuIcon.classList.remove("bx-x");
          navbar.classList.remove("active");
        });
      });

      document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
          menuIcon.classList.remove("bx-x");
          navbar.classList.remove("active");
        }
      });
    }

    // 3. 3D Tilt Effect for Glass Cards
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const tiltCards = document.querySelectorAll("[data-tilt]");
      tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
      });
    }

    // 4. Interactive 3D Cube Mouse Tilt
    const cubeScene = document.getElementById("cubeScene");
    const heroCube = document.getElementById("heroCube");
    if (cubeScene && heroCube && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      cubeScene.addEventListener("mousemove", (e) => {
        const rect = cubeScene.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroCube.style.animationPlayState = "paused";
        heroCube.style.transform = `rotateY(${x * 180}deg) rotateX(${-y * 180}deg)`;
      });

      cubeScene.addEventListener("mouseleave", () => {
        heroCube.style.animationPlayState = "running";
        heroCube.style.transform = "";
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
