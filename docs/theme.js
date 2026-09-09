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
      button.textContent = next === "dark" ? "Dark mode" : "Light mode";
      button.setAttribute("aria-label", "Switch to " + next + " mode");
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
