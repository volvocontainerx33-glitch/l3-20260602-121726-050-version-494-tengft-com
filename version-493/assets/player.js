import { H as Hls } from "./hls-vendor-dru42stk.js";

function setupPlayer(video) {
  const shell = video.closest(".player-shell");
  const button = shell ? shell.querySelector(".player-overlay") : null;
  const stream = video.getAttribute("data-stream");
  let ready = false;

  function bindSource() {
    if (!stream || ready) {
      return;
    }

    ready = true;

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(stream);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    }
  }

  function playVideo() {
    bindSource();

    const attempt = video.play();

    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener("click", playVideo);
  }

  video.addEventListener("click", playVideo);
  video.addEventListener("play", function () {
    if (button) {
      button.classList.add("is-hidden");
    }
  });
  video.addEventListener("pause", function () {
    if (button && video.currentTime === 0) {
      button.classList.remove("is-hidden");
    }
  });
  video.addEventListener("loadedmetadata", function () {
    if (button) {
      button.classList.remove("is-hidden");
    }
  });
}

document.querySelectorAll(".m3u8-player").forEach(setupPlayer);
