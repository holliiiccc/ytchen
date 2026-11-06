// Keep previously shared Nielsen section links working from the new homepage.
const nielsenSections={overview:'overview',problem:'problem',research:'research',selection:'selection',outcome:'outcome',scope:'selection',analysis:'selection','first-iteration':'problem'};
function restoreNielsenLink(){
  const destination=nielsenSections[location.hash.slice(1)];
  if((location.pathname.endsWith('/')||location.pathname.endsWith('/index.html'))&&destination) location.replace('nielsen-planning.html#'+destination);
}
addEventListener('hashchange',restoreNielsenLink);
restoreNielsenLink();

// A short welcome gesture, replayed on arrival (including browser Back).
const welcomeMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pinEntrances = [];
function welcomePins() {
  pinEntrances.forEach(animation => animation.cancel());
  pinEntrances = [];
  if (welcomeMotion.matches) return;
  document.querySelectorAll('.home-intro-pins .enamel-pin').forEach((pin, index) => {
    if (!pin.animate) return;
    const direction = index === 0 ? -1 : 1;
    const animation = pin.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: `translateY(-9px) rotate(${direction * 5}deg)`, offset: .4 },
      { transform: `translateY(-2px) rotate(${-direction}deg)`, offset: .75 },
      { transform: 'translateY(0) rotate(0deg)' }
    ], { duration: 850, delay: 120 + index * 160, easing: 'ease-in-out' });
    pinEntrances.push(animation);
    const cancel = () => animation.cancel();
    pin.addEventListener('pointerenter', cancel, { once: true });
    pin.addEventListener('focus', cancel, { once: true });
    animation.finished.catch(() => {}).finally(() => {
      pin.removeEventListener('pointerenter', cancel);
      pin.removeEventListener('focus', cancel);
    });
  });
}
window.addEventListener('pageshow', welcomePins);
welcomeMotion.addEventListener('change', () => {
  if (welcomeMotion.matches) pinEntrances.forEach(animation => animation.cancel());
});
