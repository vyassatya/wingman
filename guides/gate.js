/* Shared email gate for guide pages. Plain ES5, no dependencies.
   A page opts in with two include lines and one marker where the gate starts:
     <div data-gate data-pdf="File.pdf"></div>
   The report text stays in the HTML. This script hides everything after the marker only once it runs, so if it fails
   (or JavaScript is off) the whole report shows. The form is the page's existing Beehiiv embed, moved into the gate.
   Set GATE_ENABLED to false to switch every gate off. */
var GATE_ENABLED = true;

(function () {
  "use strict";
  if (!GATE_ENABLED) { return; }

  var KEY = "sv_gate_unlocked";
  var FAIL_OPEN_MS = 4000;

  var marker = document.querySelector("[data-gate]");
  var holder = document.querySelector(".get-pdf");
  var embed = holder ? holder.querySelector(".beehiiv-embed") : null;
  if (!marker || !marker.parentNode || !holder || !embed) { return; } /* nothing to gate with: leave the page as it is */

  var pdf = marker.getAttribute("data-pdf");
  var eyebrow = holder.querySelector(".eyebrow");
  var eyebrowHtml = eyebrow ? eyebrow.innerHTML : "";

  function remembered() {
    try { return window.localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function remember() {
    try { window.localStorage.setItem(KEY, "1"); } catch (e) { /* storage may be blocked */ }
  }
  function warn(status) {
    try { if (window.console && console.warn) { console.warn("gate subscribe failed", status); } } catch (e) { /* ignore */ }
  }

  /* After an unlock, and for returning visitors: link to the PDF itself. */
  function showPdfLink() {
    if (!pdf || holder.querySelector(".gate-pdf")) { return; }
    var p = document.createElement("p");
    p.className = "gate-pdf";
    var a = document.createElement("a");
    a.className = "btn";
    a.href = pdf;
    a.setAttribute("download", "");
    a.appendChild(document.createTextNode("Download the PDF"));
    p.appendChild(a);
    holder.appendChild(p);
  }

  if (remembered()) { showPdfLink(); return; }

  /* ---- Lock ---- */
  var rest = [];
  for (var n = marker.nextElementSibling; n; n = n.nextElementSibling) { rest.push(n); }
  var i;
  for (i = 0; i < rest.length; i++) { rest[i].className += (rest[i].className ? " " : "") + "gate-hidden"; }

  var panel = document.createElement("section");
  panel.className = "gate-panel";
  panel.id = "gate";
  panel.setAttribute("aria-labelledby", "gate-h");
  panel.innerHTML = '<h2 id="gate-h">Read the full report</h2>' +
    '<p>Enter your email to unlock the rest. It is free.</p>' +
    '<div class="gate-slot"></div>' +
    '<p class="gate-skip">Already subscribed, or the form is not showing? <button type="button">Show the report</button></p>';
  marker.parentNode.insertBefore(panel, marker.nextSibling);

  var slot = panel.querySelector(".gate-slot");
  var skip = panel.querySelector(".gate-skip button");

  /* The embed moves into the gate; a placeholder keeps its original spot. */
  var spot = document.createComment("gate-embed");
  embed.parentNode.insertBefore(spot, embed);
  slot.appendChild(embed);

  /* "Get the PDF" near the title scrolls to the gate while locked. */
  var jump = null;
  if (eyebrow) {
    eyebrow.innerHTML = '<a href="#gate">Get the PDF</a>';
    jump = eyebrow.firstChild;
    jump.onclick = function (e) {
      if (e && e.preventDefault) { e.preventDefault(); }
      try { panel.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (err) { panel.scrollIntoView(); }
    };
  }

  var done = false, timer = null;

  function unlock(saveIt) {
    if (done) { return; }
    done = true;
    if (timer) { window.clearTimeout(timer); }
    if (window.removeEventListener) { window.removeEventListener("message", onMessage, false); }
    for (var k = 0; k < rest.length; k++) {
      rest[k].className = (" " + rest[k].className + " ").replace(" gate-hidden ", " ").replace(/^\s+|\s+$/g, "");
    }
    if (spot.parentNode) { spot.parentNode.insertBefore(embed, spot); spot.parentNode.removeChild(spot); }
    if (panel.parentNode) { panel.parentNode.removeChild(panel); }
    if (eyebrow) { eyebrow.innerHTML = eyebrowHtml; }
    showPdfLink();
    if (saveIt) { remember(); }
  }

  function failOpen(status) { warn(status); unlock(false); }

  /* The Beehiiv form runs in an iframe, so its result arrives as a message from beehiiv.com. */
  function onMessage(e) {
    var host = "";
    try { host = String(e.origin).replace(/^https?:\/\//, "").split("/")[0].split(":")[0]; } catch (err) { return; }
    if (!/(^|\.)beehiiv\.com$/.test(host)) { return; }
    var text = "";
    try { text = typeof e.data === "string" ? e.data : JSON.stringify(e.data); } catch (err2) { return; }
    if (!text) { return; }
    if (/error|fail|invalid/i.test(text)) { failOpen("embed-error"); return; }
    if (/success|subscribed|submitted|thank|complete/i.test(text)) { unlock(true); }
  }
  if (window.addEventListener) { window.addEventListener("message", onMessage, false); }

  skip.onclick = function () { unlock(true); };

  /* Fail open: if the form script is blocked or the form never renders, nobody stays gated. */
  var tag = embed.querySelector("script");
  if (tag) { tag.onerror = function () { failOpen("embed-load"); }; }
  timer = window.setTimeout(function () {
    if (!embed.querySelector("iframe")) { failOpen("embed-timeout"); }
  }, FAIL_OPEN_MS);
})();
