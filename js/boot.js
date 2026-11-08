/* GenCode® — runs in <head> before first paint. Role entries (?role=clinician|patient)
   must not flash the built-in demo dashboard while the app module loads. */
(function () {
  try {
    if (/[?&]role=(clinician|patient)\b/.test(location.search)) {
      var html = document.documentElement;
      html.classList.add('gc-booting');
      // Safety net: never leave the page blank if the app fails to start
      setTimeout(function () { html.classList.remove('gc-booting'); }, 5000);
    }
  } catch (e) { /* ignore */ }
})();
