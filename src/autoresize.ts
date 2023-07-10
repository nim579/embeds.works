import { onAutoresize } from './utils.js';

declare global {
  interface Window { __embedsworks?: () => void; }
}

(function() {
  if (window.__embedsworks) return;

  window.addEventListener('message', onAutoresize);

  window.__embedsworks = () => {
    window.removeEventListener('message', onAutoresize);
    delete window.__embedsworks;
  };
})();
