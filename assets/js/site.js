(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav-links]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
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
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
            var bar = dot.querySelector('span');
            if (bar) {
                bar.style.transition = 'none';
                bar.style.width = '0%';
                if (dotIndex === current) {
                    window.requestAnimationFrame(function () {
                        window.requestAnimationFrame(function () {
                            bar.style.transition = 'width 5.5s linear';
                            bar.style.width = '100%';
                        });
                    });
                }
            }
        });
    }

    if (slides.length) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5600);
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });
    }

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', function () {
            var keyword = searchInput.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                card.classList.toggle('hidden-card', keyword && haystack.indexOf(keyword) === -1);
            });
        });
    }
}());
