import { H as Hls } from './hls-vendor-dru42stk.js';

function attachHls(video) {
  const source = video.dataset.hls;

  if (!source) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return;
  }

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    video._hlsInstance = hls;
    return;
  }

  video.src = source;
}

function setupOverlay(video) {
  const shell = video.closest('.player-shell');
  const overlay = shell ? shell.querySelector('.video-play-overlay') : null;

  if (!overlay) {
    return;
  }

  function hideOverlay() {
    overlay.classList.add('is-hidden');
  }

  overlay.addEventListener('click', function () {
    hideOverlay();
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  });

  video.addEventListener('play', hideOverlay);
}

document.querySelectorAll('video[data-hls]').forEach(function (video) {
  attachHls(video);
  setupOverlay(video);
});
