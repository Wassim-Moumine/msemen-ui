var _paq = (window._paq = window._paq || []);
_paq.push(["disableCookies"]);
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "//analytics.localhost/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "1"]);
  var g = document.createElement("script");
  g.async = true;
  g.src = u + "matomo.js";
  document.head.appendChild(g);
})();
