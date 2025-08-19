(function(){
  // Progress bar - debounced to prevent layout thrashing
  const bar = document.getElementById('progress-bar');
  let scrollTimeout;
  const onScroll = () => {
    if (!bar) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Dark mode toggle
  const darkToggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const setToggleUI = (isDark) => {
    if (!darkToggle) return;
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    darkToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setToggleUI(isDark);
  };
  const savedTheme = localStorage.getItem('theme');
  const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;
  applyTheme(initialDark);
  if (darkToggle) {
    darkToggle.addEventListener('click', () => applyTheme(!document.documentElement.classList.contains('dark')));
  }

  // Accessibility controls
  const fontInc = document.getElementById('font-inc');
  const fontDec = document.getElementById('font-dec');
  const contrastToggle = document.getElementById('contrast-toggle');
  const motionToggle = document.getElementById('motion-toggle');

  const applyA11y = () => {
    const size = parseFloat(localStorage.getItem('fontScale') || '1');
    const highContrast = localStorage.getItem('highContrast') === '1';
    const reduceMotion = localStorage.getItem('reduceMotion') === '1';
    
    // Apply all changes in a single batch to prevent layout thrashing
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('font-size', (size * 100) + '%');
      document.documentElement.classList.toggle('contrast', highContrast);
      document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    });
  };
  applyA11y();

  if (fontInc) fontInc.addEventListener('click', () => {
    const size = Math.min(1.5, (parseFloat(localStorage.getItem('fontScale') || '1') + 0.1));
    localStorage.setItem('fontScale', String(size));
    applyA11y();
  });
  if (fontDec) fontDec.addEventListener('click', () => {
    const size = Math.max(0.8, (parseFloat(localStorage.getItem('fontScale') || '1') - 0.1));
    localStorage.setItem('fontScale', String(size));
    applyA11y();
  });
  if (contrastToggle) contrastToggle.addEventListener('click', () => {
    const v = localStorage.getItem('highContrast') === '1' ? '0' : '1';
    localStorage.setItem('highContrast', v);
    applyA11y();
  });
  if (motionToggle) motionToggle.addEventListener('click', () => {
    const v = localStorage.getItem('reduceMotion') === '1' ? '0' : '1';
    localStorage.setItem('reduceMotion', v);
    applyA11y();
  });

  // Mobile navigation toggle
  const hamburger = document.getElementById('hamburger');
  const primaryNav = document.getElementById('primary-nav');
  if (hamburger && primaryNav) {
    // Ensure initial aria state
    hamburger.setAttribute('aria-expanded', primaryNav.classList.contains('hidden') ? 'false' : 'true');
    hamburger.addEventListener('click', () => {
      const isHidden = primaryNav.classList.toggle('hidden');
      hamburger.classList.toggle('open', !isHidden);
      hamburger.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    });
  }

  // A11y popover (button + menu)
  const a11yToggle = document.getElementById('a11y-toggle');
  const a11yMenu = document.getElementById('a11y-menu');
  if (a11yToggle && a11yMenu) {
    const closeMenu = () => {
      a11yMenu.classList.add('hidden');
      a11yToggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      a11yMenu.classList.remove('hidden');
      a11yToggle.setAttribute('aria-expanded', 'true');
    };
    a11yToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = a11yMenu.classList.contains('hidden');
      if (isHidden) openMenu(); else closeMenu();
    });
    document.addEventListener('click', (e) => {
      if (!a11yMenu.classList.contains('hidden')) {
        const within = a11yMenu.contains(e.target) || a11yToggle.contains(e.target);
        if (!within) closeMenu();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Font toggle for footer
  const fontToggle = document.getElementById('font-toggle');
  if (fontToggle) {
    const applyFontPref = (enabled) => {
      document.documentElement.classList.toggle('system-fonts', enabled);
      fontToggle.textContent = enabled ? 'Web Fonts' : 'System Fonts';
      fontToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    };

    fontToggle.addEventListener('click', () => {
      const currentlyEnabled = document.documentElement.classList.contains('system-fonts');
      const next = !currentlyEnabled;
      applyFontPref(next);
      localStorage.setItem('systemFonts', next ? '1' : '0');
    });
    
    // Apply saved font preference
    const savedFontPref = localStorage.getItem('systemFonts');
    applyFontPref(savedFontPref === '1');
  }
})();
