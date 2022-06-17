(function() {
  if (window.__embedworks) return;

  window.addEventListener('message', function (event) {
    if (event.origin === 'https://embed-works.nim579.ru') {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.contentWindow === event.source) {
          iframe.style.height = `${data.params.height}px`;
        }
      });
    }
  });

  window.__embedworks = true;
})();
