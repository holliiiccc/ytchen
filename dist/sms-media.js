// Autoplay one visible prototype clip at a time; honor user pause and reduced motion.
(() => {
  const videos = [...document.querySelectorAll('[data-scroll-video]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = new Map(videos.map(video => [video, { ratio: 0, userPaused: false, systemPause: false }]));

  function pauseForSystem(video) {
    if (!video.paused) {
      state.get(video).systemPause = true;
      video.pause();
    }
  }

  function updatePlayback() {
    const candidate = videos
      .filter(video => state.get(video).ratio >= 0.55)
      .sort((a, b) => state.get(b).ratio - state.get(a).ratio)[0];

    videos.forEach(video => {
      const status = state.get(video);
      if (document.hidden || reduced.matches || video !== candidate) {
        pauseForSystem(video);
        return;
      }
      if (!status.userPaused && video.paused) {
        video.muted = true;
        video.loop = true;
        video.play().catch(() => {});
      }
    });
  }

  videos.forEach(video => {
    video.loop = true;
    video.addEventListener('pause', () => {
      const status = state.get(video);
      if (status.systemPause) status.systemPause = false;
      else status.userPaused = true;
    });
    video.addEventListener('play', () => {
      state.get(video).userPaused = false;
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { state.get(entry.target).ratio = entry.intersectionRatio; });
      updatePlayback();
    }, { threshold: [0, 0.25, 0.55, 0.75, 1] });
    videos.forEach(video => observer.observe(video));
  }

  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', updatePlayback);
})();
