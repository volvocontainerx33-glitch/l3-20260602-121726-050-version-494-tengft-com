(function () {
    function each(selector, handler) {
        document.querySelectorAll(selector).forEach(handler);
    }

    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    each('[data-search-form]', function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var keyword = input ? input.value.trim() : '';
            if (keyword) {
                window.location.href = 'search.html?q=' + encodeURIComponent(keyword);
            }
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
            dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
        });
    }

    if (slides.length > 1) {
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5600);
    }

    function initPlayer() {
        var video = document.querySelector('[data-player]');
        if (!video) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var startButton = document.querySelector('[data-player-start]');
        var state = document.querySelector('[data-player-state]');
        var hlsInstance = null;
        var prepared = false;

        function setState(text) {
            if (state) {
                state.textContent = text;
            }
        }

        function prepare() {
            if (prepared || !stream) {
                return;
            }
            prepared = true;
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setState('准备就绪');
                });
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                            setState('网络连接中');
                            hlsInstance.startLoad();
                        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                            setState('媒体恢复中');
                            hlsInstance.recoverMediaError();
                        } else {
                            setState('暂时无法播放');
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                setState('准备就绪');
            } else {
                video.src = stream;
                setState('尝试播放');
            }
        }

        function start() {
            prepare();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    setState('点击播放');
                });
            }
        }

        if (startButton) {
            startButton.addEventListener('click', function () {
                start();
            });
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            if (startButton) {
                startButton.classList.add('is-hidden');
            }
            setState('正在播放');
        });
        video.addEventListener('pause', function () {
            if (startButton) {
                startButton.classList.remove('is-hidden');
            }
            setState('已暂停');
        });
        video.addEventListener('ended', function () {
            if (startButton) {
                startButton.classList.remove('is-hidden');
            }
            setState('播放结束');
        });
        video.addEventListener('loadedmetadata', function () {
            setState('准备就绪');
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    function renderSearch() {
        var target = document.querySelector('[data-search-results]');
        if (!target || !window.MOVIE_INDEX) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var keyword = (params.get('q') || '').trim().toLowerCase();
        var titleNode = document.querySelector('[data-search-title]');
        if (titleNode) {
            titleNode.textContent = keyword ? '搜索：' + params.get('q') : '搜索影片';
        }
        if (!keyword) {
            target.innerHTML = '<div class="search-empty">输入片名、地区、年份或标签，即可查找影片。</div>';
            return;
        }
        var results = window.MOVIE_INDEX.filter(function (item) {
            return [item.title, item.region, item.type, item.year, item.genre, item.tags].join(' ').toLowerCase().indexOf(keyword) !== -1;
        }).slice(0, 80);
        if (!results.length) {
            target.innerHTML = '<div class="search-empty">没有找到匹配影片，换个关键词再试试。</div>';
            return;
        }
        target.innerHTML = '<div class="grid grid-4">' + results.map(function (item) {
            return '<article class="movie-card">' +
                '<a class="poster-link" href="' + item.url + '">' +
                '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '">' +
                '<span class="poster-badge">' + escapeHtml(item.region) + '</span>' +
                '<span class="poster-score">' + escapeHtml(item.year) + '</span>' +
                '</a>' +
                '<div class="card-body">' +
                '<a class="card-title" href="' + item.url + '">' + escapeHtml(item.title) + '</a>' +
                '<div class="card-meta"><span class="meta-pill">' + escapeHtml(item.type) + '</span><span class="meta-pill">' + escapeHtml(item.genre) + '</span></div>' +
                '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' +
                '</div>' +
                '</article>';
        }).join('') + '</div>';
    }

    function escapeHtml(text) {
        return String(text || '').replace(/[&<>"']/g, function (match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }

    initPlayer();
    renderSearch();
})();
