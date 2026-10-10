/* Shared site header. Edit here; every page loads this file. */
(function () {
  var page = location.pathname.split("/").pop().replace(/\.html$/, "") || "index";
  function cur(name) { return page === name ? ' aria-current="page"' : ""; }
  document.write(
    '<header class="topbar">' +
      '<div class="wrap">' +
        '<a class="brand" href="index.html">Satya Vyas</a>' +
        '<nav class="topbar-nav" aria-label="Main">' +
          '<a href="index.html"' + cur("index") + '>Home</a>' +
          '<a href="work.html#talk">Talk to Me</a>' +
          '<a href="work.html#work">Work With Me</a>' +
          '<a href="guides.html"' + cur("guides") + '>Guide</a>' +
          '<a href="about.html"' + cur("about") + '>About</a>' +
        '</nav>' +
        '<a class="btn" href="work.html">Ready to scale</a>' +
      '</div>' +
    '</header>'
  );
})();
