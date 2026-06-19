document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  var nextButton = document.querySelector('[data-hero-next]');
  var prevButton = document.querySelector('[data-hero-prev]');

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      showSlide(current + 1);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', function () {
      showSlide(current - 1);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length) {
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var keyword = filterPanel.querySelector('[data-filter-keyword]');
    var year = filterPanel.querySelector('[data-filter-year]');
    var type = filterPanel.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var counter = document.querySelector('[data-filter-count]');

    function runFilter() {
      var q = (keyword.value || '').trim().toLowerCase();
      var y = year.value;
      var t = type.value;
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-type') || ''
        ].join(' ').toLowerCase();
        var ok = true;

        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }

        if (y && card.getAttribute('data-year') !== y) {
          ok = false;
        }

        if (t && card.getAttribute('data-type') !== t) {
          ok = false;
        }

        card.style.display = ok ? '' : 'none';

        if (ok) {
          shown += 1;
        }
      });

      if (counter) {
        counter.textContent = String(shown);
      }
    }

    filterPanel.addEventListener('input', runFilter);
    filterPanel.addEventListener('change', runFilter);
    filterPanel.addEventListener('submit', function (event) {
      event.preventDefault();
      runFilter();
    });
    runFilter();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (box) {
    var button = box.querySelector('[data-play-button]');
    var video = box.querySelector('video');
    var url = box.getAttribute('data-source');
    var hlsInstance = null;

    function loadHlsJs(callback) {
      if (window.Hls) {
        callback();
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.onload = callback;
      script.onerror = function () {
        var note = box.parentElement.querySelector('[data-player-note]');
        if (note) {
          note.textContent = '播放器组件加载失败，请检查网络或使用支持 HLS 的浏览器。';
        }
      };
      document.head.appendChild(script);
    }

    function startPlayer() {
      if (!video || !url) {
        return;
      }

      box.classList.add('playing');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
        return;
      }

      loadHlsJs(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
          video.play();
        } else {
          video.src = url;
          video.play();
        }
      });
    }

    if (button) {
      button.addEventListener('click', startPlayer);
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
});
