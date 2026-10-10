/* Shared site header. Edit here; every page loads this file. */
(function () {
  var src = document.currentScript.src;
  var base = src.substring(0, src.lastIndexOf("/") + 1);
  var path = location.pathname;
  var page = path.split("/").pop().replace(/\.html$/, "") || "index";
  var inGuides = /\/guides\//.test(path);
  function cur(name) { return page === name || (name === "guides" && inGuides) ? ' aria-current="page"' : ""; }
  document.write(
    '<header class="topbar">' +
      '<div class="wrap">' +
        '<a class="brand" href="' + base + 'index.html">Satya Vyas</a>' +
        '<nav class="topbar-nav" aria-label="Main">' +
          '<a href="' + base + 'index.html"' + cur("index") + '>Home</a>' +
          '<a href="' + base + 'work.html#talk">Talk to Me</a>' +
          '<a href="' + base + 'work.html#work">Work With Me</a>' +
          '<a href="' + base + 'guides.html"' + cur("guides") + '>Guide</a>' +
          '<a href="' + base + 'about.html"' + cur("about") + '>About</a>' +
        '</nav>' +
        '<a class="btn" href="' + base + 'work.html">Ready to scale</a>' +
      '</div>' +
    '</header>'
  );
})();
