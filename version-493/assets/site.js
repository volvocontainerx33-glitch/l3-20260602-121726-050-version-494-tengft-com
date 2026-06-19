(function () {
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  let heroIndex = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === heroIndex);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(heroIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      if (timer) {
        window.clearInterval(timer);
      }

      showSlide(index);
      startHero();
    });
  });

  showSlide(0);
  startHero();

  const searchPage = document.querySelector('[data-page="search"]');

  if (searchPage) {
    const params = new URLSearchParams(window.location.search);
    const keyword = (params.get("q") || "").trim().toLowerCase();
    const input = document.getElementById("searchInput");
    const title = document.getElementById("searchResultTitle");
    const cards = Array.from(document.querySelectorAll(".movie-card"));

    if (input) {
      input.value = keyword;
    }

    if (keyword) {
      let matched = 0;

      cards.forEach(function (card) {
        const text = (card.getAttribute("data-search") || "").toLowerCase();
        const visible = text.indexOf(keyword) !== -1;
        card.classList.toggle("hidden-card", !visible);
        if (visible) {
          matched += 1;
        }
      });

      if (title) {
        title.textContent = "搜索结果：" + keyword + "（" + matched + "）";
      }
    }
  }
})();
