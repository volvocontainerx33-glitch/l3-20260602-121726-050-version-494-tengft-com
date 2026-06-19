(function () {
    var menuToggle = document.getElementById('menuToggle');
    var mobilePanel = document.getElementById('mobilePanel');
    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (slides.length > 1) {
        var current = 0;
        var showSlide = function (index) {
            current = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });
        setInterval(function () {
            showSlide((current + 1) % slides.length);
        }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');
    var applySearch = function (value) {
        var q = String(value || '').trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-type'),
                card.textContent
            ].join(' ').toLowerCase();
            var matched = !q || haystack.indexOf(q) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('show', visible === 0);
        }
    };
    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            applySearch(input.value);
        });
    });
    if (searchInputs.length && window.URLSearchParams) {
        var params = new URLSearchParams(window.location.search);
        var preset = params.get('q');
        if (preset) {
            searchInputs.forEach(function (input) {
                input.value = preset;
            });
            applySearch(preset);
        }
    }

    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-year-filter]'));
    if (chips.length && cards.length) {
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (item) {
                    item.classList.remove('active');
                });
                chip.classList.add('active');
                var value = chip.getAttribute('data-year-filter');
                var visible = 0;
                cards.forEach(function (card) {
                    var year = parseInt(card.getAttribute('data-year') || '0', 10);
                    var matched = value === 'all' || (value === 'new' && year >= 2024) || (value === 'classic' && year < 2024);
                    card.style.display = matched ? '' : 'none';
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            });
        });
    }

    var player = document.querySelector('[data-player]');
    if (player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('.player-cover');
        var button = player.querySelector('.play-button');
        var stream = player.getAttribute('data-stream');
        var ready = false;
        var start = function () {
            if (!video || !stream) {
                return;
            }
            if (!ready) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                ready = true;
            }
            if (cover) {
                cover.classList.add('hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        };
        if (cover) {
            cover.addEventListener('click', start);
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                start();
            });
        }
        video.addEventListener('click', start);
    }
})();
