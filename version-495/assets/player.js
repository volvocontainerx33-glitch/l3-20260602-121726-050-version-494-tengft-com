(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function ensureHls() {
    if (window.Hls) {
      return window.Hls;
    }

    await loadScript('https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js');
    return window.Hls;
  }

  async function startPlayer(player) {
    const video = player.querySelector('video');
    const layer = player.querySelector('[data-player-trigger]');
    const source = player.dataset.videoSrc;

    if (!video || !source) {
      return;
    }

    if (layer) {
      layer.classList.add('is-hidden');
    }

    try {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        const Hls = await ensureHls();
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      video.controls = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          video.controls = true;
        });
      }
    } catch (error) {
      video.src = source;
      video.controls = true;
    }
  }

  document.querySelectorAll('[data-static-player]').forEach(function (player) {
    const layer = player.querySelector('[data-player-trigger]');
    if (layer) {
      layer.addEventListener('click', function () {
        startPlayer(player);
      });
    }
  });
})();
