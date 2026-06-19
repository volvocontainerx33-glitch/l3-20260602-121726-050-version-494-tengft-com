(function () {
  var mobileButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dots button'));
    var index = 0;
    var setSlide = function (next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    var prev = carousel.querySelector('.hero-control.prev');
    var next = carousel.querySelector('.hero-control.next');
    if (prev) prev.addEventListener('click', function () { setSlide(index - 1); });
    if (next) next.addEventListener('click', function () { setSlide(index + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { setSlide(i); });
    });
    setSlide(0);
    window.setInterval(function () { setSlide(index + 1); }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-text]'));
  var empty = document.querySelector('.empty-state');
  var applyFilter = function () {
    var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var visible = 0;
    filterCards.forEach(function (card) {
      var text = card.getAttribute('data-text') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var cardType = card.getAttribute('data-type') || '';
      var ok = (!q || text.indexOf(q) !== -1) && (!year || cardYear === year) && (!type || cardType === type);
      card.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    });
    if (empty) empty.style.display = visible ? 'none' : 'block';
  };
  if (filterInput) filterInput.addEventListener('input', applyFilter);
  if (yearSelect) yearSelect.addEventListener('change', applyFilter);
  if (typeSelect) typeSelect.addEventListener('change', applyFilter);

  var params = new URLSearchParams(window.location.search);
  var qParam = params.get('q');
  if (filterInput && qParam) {
    filterInput.value = qParam;
    applyFilter();
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var src = player.getAttribute('data-url');
    var started = false;
    var start = function () {
      if (!video || !src) return;
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ lowLatencyMode: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
        started = true;
      }
      if (overlay) overlay.classList.add('is-hidden');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    };
    if (overlay) overlay.addEventListener('click', start);
    var startButton = player.querySelector('.player-start');
    if (startButton) startButton.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!started || video.paused) start();
    });
  }
})();
