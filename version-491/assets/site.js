(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMobileNavigation() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const panel = document.querySelector('.mobile-nav-panel');

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  }

  function setupHeroCarousel() {
    const carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const previousButton = carousel.querySelector('[data-hero-prev]');
    const nextButton = carousel.querySelector('[data-hero-next]');
    let activeIndex = slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    });

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    function showSlide(nextIndex) {
      slides[activeIndex].classList.remove('active');
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides[activeIndex].classList.add('active');
    }

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        showSlide(activeIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(activeIndex + 1);
      });
    }

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5000);
    }
  }

  function yearMatches(cardYear, selectedBucket) {
    if (!selectedBucket) {
      return true;
    }

    const year = Number(cardYear);

    if (!year) {
      return false;
    }

    if (selectedBucket === '2020') {
      return year >= 2020;
    }

    if (selectedBucket === '2010') {
      return year >= 2010 && year <= 2019;
    }

    if (selectedBucket === '2000') {
      return year >= 2000 && year <= 2009;
    }

    if (selectedBucket === '1990') {
      return year < 1990;
    }

    return true;
  }

  function setupFilters() {
    const toolbars = Array.from(document.querySelectorAll('[data-filter-toolbar]'));

    toolbars.forEach(function (toolbar) {
      const root = toolbar.closest('.section-stack') || document;
      const cards = Array.from(root.querySelectorAll('[data-filter-card]'));
      const searchInput = toolbar.querySelector('[data-filter-search]');
      const regionSelect = toolbar.querySelector('[data-filter-region]');
      const typeSelect = toolbar.querySelector('[data-filter-type]');
      const yearSelect = toolbar.querySelector('[data-filter-year]');
      const countOutput = toolbar.querySelector('[data-filter-count]');
      const emptyState = root.querySelector('[data-filter-empty]');

      function update() {
        const query = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
        const region = regionSelect ? regionSelect.value : '';
        const type = typeSelect ? typeSelect.value : '';
        const yearBucket = yearSelect ? yearSelect.value : '';
        let visibleCount = 0;

        cards.forEach(function (card) {
          const terms = (card.dataset.terms || '').toLowerCase();
          const title = (card.dataset.title || '').toLowerCase();
          const matchesQuery = !query || terms.includes(query) || title.includes(query);
          const matchesRegion = !region || card.dataset.region === region;
          const matchesType = !type || (card.dataset.type || '').includes(type);
          const matchesYear = yearMatches(card.dataset.year, yearBucket);
          const shouldShow = matchesQuery && matchesRegion && matchesType && matchesYear;

          card.hidden = !shouldShow;

          if (shouldShow) {
            visibleCount += 1;
          }
        });

        if (countOutput) {
          countOutput.textContent = '当前显示 ' + visibleCount + ' / ' + cards.length + ' 部影片';
        }

        if (emptyState) {
          emptyState.hidden = visibleCount !== 0;
        }
      }

      [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', update);
          control.addEventListener('change', update);
        }
      });

      update();
    });
  }

  function hideBrokenImages() {
    document.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.style.opacity = '0';
        image.closest('.poster, .category-entry, .poster-card, .hero-slide')?.classList.add('image-fallback');
      });
    });
  }

  ready(function () {
    setupMobileNavigation();
    setupHeroCarousel();
    setupFilters();
    hideBrokenImages();
  });
})();
