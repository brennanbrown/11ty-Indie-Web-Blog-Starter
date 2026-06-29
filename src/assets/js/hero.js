// assets/js/hero.js
//
// Progressive enhancement for the dismissible hero banner (see
// partials/hero.njk). With this file loaded, a visitor can dismiss the
// hero and it stays dismissed (via localStorage) across visits; a "Show
// intro" link in the footer brings it back. Without JavaScript, the hero
// always shows and there's no dismiss button. See the `no-js`
// handling in assets/css/14-progressive-enhancement.css.

(function () {
  var HERO_ID = "hero-section";
  var STORAGE_KEY = "heroDismissed";

  // The anti-flash-of-hero snippet (hiding it before first paint if
  // already dismissed) lives inline in partials/head.njk, since it has
  // to run before the hero renders. By the time this file loads, that's
  // already happened. This file defines the dismiss/restore actions.

  window.dismissHero = function () {
    var hero = document.getElementById(HERO_ID);
    if (hero) {
      hero.style.display = "none";
      localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  window.restoreHero = function () {
    var hero = document.getElementById(HERO_ID);
    if (hero) {
      hero.style.display = "";
      localStorage.removeItem(STORAGE_KEY);
      hero.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
})();
