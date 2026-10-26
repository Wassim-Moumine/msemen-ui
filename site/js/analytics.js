var _paq = (window._paq = window._paq || []);
(function () {
  var parts = location.hostname.split(".");
  if (parts.length < 2 || /^\d+(\.\d+){3}$/.test(location.hostname)) return;
  var u = location.protocol + "//analytics." + parts.slice(1).join(".") + (location.port ? ":" + location.port : "") + "/";
  _paq.push(["disableCookies"]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "1"]);
  var g = document.createElement("script");
  g.async = true;
  g.src = u + "matomo.js";
  document.head.appendChild(g);
})();
