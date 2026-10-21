/* Shared site header. Edit here; every page loads this file. */
(function () {
  var src = document.currentScript.src;
  var base = src.substring(0, src.lastIndexOf("/") + 1);
  var path = location.pathname;
  var page = path.split("/").pop().replace(/\.html$/, "") || "index";
  var inGuides = /\/guides\//.test(path);
  function cur(name) { return page === name || (name === "guides" && inGuides) ? ' aria-current="page"' : ""; }
  var onFile = location.protocol === "file:";
  var grHref = onFile ? base + "readiness.html" : "/readiness";
  /* Remember UTM parameters for the Growth Readiness Test. */
  try {
    var m, keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"], found = {}, any = false, j;
    for (j = 0; j < keys.length; j++) {
      m = new RegExp("[?&]" + keys[j] + "=([^&#]*)").exec(location.search);
      if (m) { found[keys[j]] = decodeURIComponent(m[1].replace(/\+/g, " ")); any = true; }
    }
    if (any) { sessionStorage.setItem("gr_utm", JSON.stringify(found)); }
  } catch (e) { /* storage may be blocked */ }
  document.addEventListener("DOMContentLoaded", function () {
    var links = document.querySelectorAll("a[data-gr]");
    for (var k = 0; k < links.length; k++) { links[k].setAttribute("href", grHref); }
    if (onFile) {
      var idea = document.querySelectorAll("a[data-idea]");
      for (var n = 0; n < idea.length; n++) { idea[n].setAttribute("href", base + "idea-readiness.html"); }
    }
  });
  document.write(
    '<header class="topbar">' +
      '<div class="wrap">' +
        '<a class="brand" href="' + base + 'index.html">Satya Vyas</a>' +
        '<nav class="topbar-nav" aria-label="Main">' +
          '<a href="' + base + 'index.html"' + cur("index") + '>Home</a>' +
          '<a href="' + base + 'guides.html"' + cur("guides") + '>Guide</a>' +
          '<a href="' + base + 'work.html#talk">Talk to Me</a>' +
          '<a href="' + base + 'about.html"' + cur("about") + '>About</a>' +
          '<a href="' + base + 'investments.html"' + cur("investments") + '>My investments</a>' +
          '<span class="topbar-soon">Invest with me <small>Soon</small></span>' +
        '</nav>' +
        '<a class="btn" data-gr href="' + grHref + '">Ready to Grow</a>' +
      '</div>' +
    '</header>'
  );
})();
