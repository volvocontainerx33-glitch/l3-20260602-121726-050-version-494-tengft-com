(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mainNav = document.querySelector('[data-main-nav]');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const searchInput = document.querySelector('[data-search-input]');
  const typeFilter = document.querySelector('[data-filter-type]');
  const yearFilter = document.querySelector('[data-filter-year]');
  const resultCount = document.querySelector('[data-result-count]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function updateFilters() {
    if (!cards.length) {
      return;
    }

    const query = normalize(searchInput && searchInput.value);
    const typeValue = normalize(typeFilter && typeFilter.value);
    const yearValue = normalize(yearFilter && yearFilter.value);
    let visible = 0;

    cards.forEach(function (card) {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.type,
        card.dataset.tags,
        card.dataset.region,
        card.dataset.category
      ].join(' '));
      const typeOk = !typeValue || normalize(card.dataset.type) === typeValue;
      const yearOk = !yearValue || normalize(card.dataset.year) === yearValue;
      const queryOk = !query || haystack.includes(query);
      const show = typeOk && yearOk && queryOk;

      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = '当前显示 ' + visible + ' 部影片';
    }
  }

  [searchInput, typeFilter, yearFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', updateFilters);
      control.addEventListener('change', updateFilters);
    }
  });

  updateFilters();
})();
