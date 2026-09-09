/* Apply the saved theme before the page paints. No dependencies. */
(function () {
  "use strict";
  const key = "shree-portfolio-theme";
  const root = document.documentElement;
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  let saved = null;
  let button;
  try { saved = localStorage.getItem(key); } catch (_) { /* Storage may be blocked. */ }
  if (saved !== "light" && saved !== "dark") saved = null;

  function apply(theme) {
    root.dataset.theme = theme;
    if (button) {
      const next = theme === "dark" ? "light" : "dark";
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        (next === "dark"
          ? '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>'
          : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>') +
        '</svg>';
      button.setAttribute("aria-label", "Switch to " + next + " mode");
      button.title = "Switch to " + next + " mode";
    }
  }
  apply(saved || (preference.matches ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", function () {
    button = document.querySelector(".theme-toggle");
    if (!button) return;
    button.hidden = false;
    apply(root.dataset.theme);
    button.addEventListener("click", function () {
      saved = root.dataset.theme === "dark" ? "light" : "dark";
      apply(saved);
      try { localStorage.setItem(key, saved); } catch (_) { /* Toggle still works. */ }
    });
  });
  preference.addEventListener("change", function (event) {
    if (!saved) apply(event.matches ? "dark" : "light");
  });
})();
