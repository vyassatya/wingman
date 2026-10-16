/* Growth Readiness Test.
   Scoring is deterministic and lives in the first half of this file (no DOM).
   The second half is the UI. Plain ES5 so it runs in in-app browsers. */
(function (root) {
  "use strict";

  /* ---------- Content ---------- */

  var PILLARS = [
    { key: "founder", name: "Founder Capacity", weight: 15 },
    { key: "people", name: "People", weight: 20 },
    { key: "process", name: "Process", weight: 20 },
    { key: "metrics", name: "Metrics", weight: 10 },
    { key: "mis", name: "MIS", weight: 10 },
    { key: "controls", name: "Controls", weight: 15 },
    { key: "tech", name: "Tech & Automation", weight: 10 }
  ];

  var QUESTIONS = [
    { pillar: "founder", weight: 8, text: "If you disappeared from the business for 7 days, what would happen?",
      options: [["Business would run almost normally", 4], ["A few decisions would wait for me", 3], ["Important things would slow down", 2], ["Operations would start breaking", 1], ["Most things depend on me", 0]] },
    { pillar: "founder", weight: 7, text: "How much of your working week is planned around your priorities rather than reacting to things?",
      options: [["80%+ is planned around priorities", 4], ["60–80%", 3], ["40–60%", 2], ["20–40%", 1], ["Most of my week is firefighting", 0]] },
    { pillar: "people", weight: 10, text: "For every critical function, do you have a clear owner with targets and authority to make decisions?",
      options: [["Yes, across the business", 4], ["Across most functions", 3], ["Across some functions", 2], ["Very few functions", 1], ["Most important decisions still come to me", 0]] },
    { pillar: "people", weight: 10, text: "If one key manager or employee left tomorrow, what would happen?",
      options: [["We have documented handovers and backups", 4], ["There would be a short disruption", 3], ["There would be meaningful disruption", 2], ["A major part of the business would struggle", 1], ["We are heavily dependent on specific people", 0]] },
    { pillar: "process", weight: 10, text: "How documented and repeatable are your critical operating processes?",
      options: [["Documented, trained and consistently followed", 4], ["Most critical processes are documented", 3], ["Some important processes are documented", 2], ["Most depend on people’s experience", 1], ["Most processes live inside people’s heads", 0]] },
    { pillar: "process", weight: 10, text: "If orders, customers or revenue doubled next month, what would happen operationally?",
      options: [["Our systems could handle it with minor strain", 4], ["We would need some additional capacity", 3], ["Several processes would need fixing", 2], ["Quality or service would probably suffer", 1], ["Operations would start breaking", 0]] },
    { pillar: "metrics", weight: 10, text: "How clearly defined are the most important metrics for your business?",
      options: [["Clear metrics, targets and owners", 4], ["Metrics and targets exist, but ownership is inconsistent", 3], ["We track several metrics but targets are unclear", 2], ["We mostly track revenue and basic numbers", 1], ["We do not have a structured KPI system", 0]] },
    { pillar: "mis", weight: 10, text: "How does management review business performance?",
      options: [["Reliable MIS is reviewed weekly/monthly and drives decisions", 4], ["We have regular MIS but some of it is manual", 3], ["Reports exist but reviews are inconsistent", 2], ["We mostly use spreadsheets and ad-hoc reports", 1], ["We have no structured MIS", 0]] },
    { pillar: "controls", weight: 8, text: "What happens when an important metric goes outside the acceptable range?",
      options: [["A threshold triggers an alert, owner and corrective action", 4], ["Thresholds exist and are usually acted on", 3], ["Problems are discussed when somebody notices them", 2], ["The founder usually discovers and fixes the issue", 1], ["There are no clearly defined controls", 0]] },
    { pillar: "controls", weight: 7, text: "How strong are your financial and operational controls?",
      options: [["Clear approvals, reconciliations and periodic checks", 4], ["Strong controls with a few gaps", 3], ["Controls exist but are inconsistently followed", 2], ["We mostly rely on trust and manual checking", 1], ["Very limited formal controls", 0]] },
    { pillar: "tech", weight: 5, text: "How much of your important business data flows automatically from the tools you use?",
      options: [["Most important data flows automatically", 4], ["More than half", 3], ["Some", 2], ["Very little", 1], ["Most data is manually entered or maintained in Excel", 0]] },
    { pillar: "tech", weight: 5, text: "How much repetitive work in your business has been automated?",
      options: [["Most recurring workflows are automated", 4], ["Several important workflows are automated", 3], ["We have a few basic automations", 2], ["Very little is automated", 1], ["Almost nothing is automated", 0]] }
  ];

  var BANDS = [
    { min: 90, label: "STRONG SCALE FOUNDATION", text: "Your systems appear well prepared for more volume. Your next challenge is deciding where and how to grow." },
    { min: 75, label: "SCALE READY — WITH GAPS", text: "You have a strong operating foundation. Fix the highlighted gaps before deploying major growth capital." },
    { min: 60, label: "ALMOST SCALE READY", text: "The core business works. A few important systems need strengthening before aggressive growth." },
    { min: 40, label: "SYSTEMS FRAGILE", text: "The business works today, but higher volume is likely to expose significant gaps." },
    { min: 0, label: "NOT READY TO SCALE", text: "Growing now is likely to multiply existing operational problems. Fix the foundation before adding more complexity." }
  ];

  var RISKS = {
    founder: { title: "Founder Dependency Is Limiting Scale", body: "Too many important activities or decisions still depend on the founder.", fix: "Identify the three recurring activities consuming the most founder time and either delegate, systemise or automate them." },
    people: { title: "Your Ownership Structure Needs Work", body: "Growth becomes fragile when important functions depend on individuals without clear ownership and authority.", fix: "Put a named owner against every critical business function with clear responsibility, targets and decision authority." },
    process: { title: "Your Processes May Break At Higher Volume", body: "Processes that work at today’s scale may fail when volume increases.", fix: "Document the five processes most likely to break at 2X volume and test whether someone other than the founder can execute them." },
    metrics: { title: "You May Be Scaling Without A Scoreboard", body: "Teams cannot improve what they cannot clearly measure.", fix: "Define the 5–10 numbers that actually drive the business. Give every metric a target, frequency and owner." },
    mis: { title: "Management Visibility Is Too Weak", body: "Scaling becomes dangerous when management discovers problems after they have already affected cash, customers or operations.", fix: "Build one management dashboard that gives leadership an accurate weekly/monthly view without manually chasing data." },
    controls: { title: "Growth May Amplify Leakage", body: "Revenue can grow while cash flow, margins and operational discipline deteriorate.", fix: "Define limits for major financial and operating risks. Every breach should create an alert, owner and corrective action." },
    tech: { title: "Too Much Work Is Still Manual", body: "Manual reporting, follow-ups and repetitive workflows increase complexity as the business grows.", fix: "Identify the three repetitive workflows consuming the most manual effort and automate those first." }
  };

  var REVENUE = ["Pre-revenue", "Below ₹1L/month", "₹1–5L/month", "₹5–20L/month", "₹20L–₹1Cr/month", "₹1Cr+/month"];

  var SITE_URL = "https://satyavyas.in/growth-readiness";

  /* ---------- Scoring (deterministic, integer arithmetic until the last step) ---------- */

  function verifyConfig() {
    var i, j, sum = 0, perPillar = {}, p;
    for (i = 0; i < QUESTIONS.length; i++) {
      sum += QUESTIONS[i].weight;
      perPillar[QUESTIONS[i].pillar] = (perPillar[QUESTIONS[i].pillar] || 0) + QUESTIONS[i].weight;
      var seen = {};
      for (j = 0; j < QUESTIONS[i].options.length; j++) { seen[QUESTIONS[i].options[j][1]] = true; }
      if (QUESTIONS[i].options.length !== 5 || !seen[0] || !seen[1] || !seen[2] || !seen[3] || !seen[4]) {
        throw new Error("Question " + (i + 1) + " must have exactly the scores 0-4.");
      }
    }
    if (QUESTIONS.length !== 12) { throw new Error("Expected 12 questions."); }
    if (sum !== 100) { throw new Error("Question weights sum to " + sum + ", expected 100."); }
    var pillarSum = 0;
    for (p = 0; p < PILLARS.length; p++) {
      pillarSum += PILLARS[p].weight;
      if (perPillar[PILLARS[p].key] !== PILLARS[p].weight) {
        throw new Error("Pillar " + PILLARS[p].name + " question weights do not match its pillar weight.");
      }
    }
    if (pillarSum !== 100) { throw new Error("Pillar weights sum to " + pillarSum + ", expected 100."); }
    return true;
  }

  function roundHalfUp(x) { return Math.floor(x + 0.5); }
  function round2(x) { return Math.round(x * 100) / 100; }

  function bandFor(rounded) {
    for (var i = 0; i < BANDS.length; i++) { if (rounded >= BANDS[i].min) { return BANDS[i]; } }
    return BANDS[BANDS.length - 1];
  }

  /* answers: array of 12 raw scores (0-4). Question score = raw / 4 * weight. Max total = 100. */
  function score(answers) {
    if (!answers || answers.length !== QUESTIONS.length) { throw new Error("Need 12 answers."); }
    var num = {}, p, q, total = 0, k;
    for (p = 0; p < PILLARS.length; p++) { num[PILLARS[p].key] = 0; }
    for (q = 0; q < QUESTIONS.length; q++) {
      var raw = answers[q];
      if (raw !== 0 && raw !== 1 && raw !== 2 && raw !== 3 && raw !== 4) { throw new Error("Answer " + (q + 1) + " must be 0-4."); }
      num[QUESTIONS[q].pillar] += raw * QUESTIONS[q].weight; /* in quarter-points */
    }
    var pillars = [];
    for (p = 0; p < PILLARS.length; p++) {
      k = PILLARS[p].key;
      total += num[k];
      pillars.push({
        key: k, name: PILLARS[p].name, weight: PILLARS[p].weight, order: p,
        num: num[k],                                   /* exact: score = num * 25 / weight */
        score: num[k] * 25 / PILLARS[p].weight,
        rounded: roundHalfUp(num[k] * 25 / PILLARS[p].weight)
      });
    }
    var overall = total / 4;                            /* exact, 0..100 in steps of 0.25 */
    var overallRounded = roundHalfUp(overall);
    /* Rank weakest first. Exact comparison by cross-multiplication; ties go to pillar order. */
    var ranked = pillars.slice().sort(function (a, b) {
      var l = a.num * b.weight, r = b.num * a.weight;
      if (l !== r) { return l - r; }
      return a.order - b.order;
    });
    var band = bandFor(overallRounded);
    return { overall: overall, overallRounded: overallRounded, pillars: pillars, ranked: ranked, lowest: ranked[0], second: ranked[1], band: band };
  }

  verifyConfig();

  var api = {
    PILLARS: PILLARS, QUESTIONS: QUESTIONS, BANDS: BANDS, RISKS: RISKS, REVENUE: REVENUE,
    verifyConfig: verifyConfig, score: score, bandFor: bandFor, SITE_URL: SITE_URL
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  root.GrowthReadiness = api;

  if (typeof document === "undefined" || !document.getElementById("gr-app")) { return; }

  /* ---------- UI ---------- */

  var STORE_KEY = "gr_state";
  var UTM_KEY = "gr_utm";
  var appEl = document.getElementById("gr-app");
  var landingEl = document.getElementById("gr-landing");
  var answers = [];
  var revenue = null;
  var done = false;
  var step = "landing";
  var started = false;
  var submitting = false;
  var N = QUESTIONS.length;
  var i;
  for (i = 0; i < N; i++) { answers.push(null); }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function track(name, params) {
    try { if (typeof root.gtag === "function") { root.gtag("event", name, params || {}); } } catch (e) { /* ignore */ }
  }

  function save() {
    try { root.sessionStorage.setItem(STORE_KEY, JSON.stringify({ a: answers, r: revenue, d: done })); } catch (e) { /* storage may be blocked */ }
  }
  function load() {
    try {
      var s = JSON.parse(root.sessionStorage.getItem(STORE_KEY) || "null");
      if (s && s.a && s.a.length === N) {
        for (var j = 0; j < N; j++) { answers[j] = (s.a[j] === 0 || s.a[j] === 1 || s.a[j] === 2 || s.a[j] === 3 || s.a[j] === 4) ? s.a[j] : null; }
        revenue = s.r || null;
        done = !!s.d && allAnswered();
      }
    } catch (e) { /* ignore */ }
  }
  function allAnswered() {
    for (var j = 0; j < N; j++) { if (answers[j] === null) { return false; } }
    return true;
  }
  function firstUnanswered() {
    for (var j = 0; j < N; j++) { if (answers[j] === null) { return j; } }
    return N;
  }

  function utms() {
    var out = {}, keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"], stored = {}, k, m;
    try { stored = JSON.parse(root.sessionStorage.getItem(UTM_KEY) || "{}") || {}; } catch (e) { stored = {}; }
    for (var j = 0; j < keys.length; j++) {
      k = keys[j];
      m = new RegExp("[?&]" + k + "=([^&#]*)").exec(root.location.search);
      var v = m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : (stored[k] || null);
      out[k] = v ? String(v).slice(0, 200) : null;
    }
    return out;
  }

  /* ---------- Screens ---------- */

  function progressHtml(label, pct) {
    return '<div class="gr-progress"><p class="gr-count">' + esc(label) + '</p>' +
      '<div class="gr-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progress"><span style="width:' + pct + '%"></span></div></div>';
  }

  function questionHtml(idx) {
    var q = QUESTIONS[idx], pillar = "", p;
    for (p = 0; p < PILLARS.length; p++) { if (PILLARS[p].key === q.pillar) { pillar = PILLARS[p].name; } }
    var html = progressHtml("Question " + (idx + 1) + " of " + N, Math.round((idx / N) * 100));
    html += '<p class="eyebrow gr-pillar">' + esc(pillar) + '</p>';
    html += '<h2 class="gr-q" id="gr-focus" tabindex="-1">' + esc(q.text) + '</h2>';
    html += '<div class="gr-opts" role="group" aria-label="Answers">';
    for (var o = 0; o < q.options.length; o++) {
      var pressed = answers[idx] === q.options[o][1];
      html += '<button type="button" class="gr-opt" data-q="' + idx + '" data-s="' + q.options[o][1] + '" aria-pressed="' + (pressed ? "true" : "false") + '">' + esc(q.options[o][0]) + '</button>';
    }
    html += '</div>';
    html += '<p class="gr-back"><button type="button" class="gr-link" data-back="1"' + (idx === 0 ? ' hidden' : '') + '>Back</button></p>';
    return html;
  }

  function gateHtml() {
    var html = progressHtml("Almost done", 100);
    html += '<h2 class="gr-q" id="gr-focus" tabindex="-1">Your Growth Readiness Score Is Ready.</h2>';
    html += '<p>Enter your details to see:</p>';
    html += '<ul class="dash"><li>your overall Scale Readiness Score</li><li>your two biggest scaling risks</li><li>what you should fix first</li></ul>';
    html += '<form id="gr-form" novalidate>';
    html += '<p class="hp" hidden><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>';
    html += '<div class="field"><label for="gr-first">First name</label><input type="text" id="gr-first" name="first_name" required autocomplete="given-name" maxlength="100"></div>';
    html += '<div class="field"><label for="gr-email">Work email</label><input type="email" id="gr-email" name="email" required autocomplete="email" maxlength="254"></div>';
    html += '<div class="field"><label for="gr-rev">Monthly business revenue</label><select id="gr-rev" name="monthly_revenue" required><option value="" disabled' + (revenue ? "" : " selected") + '>Select a range</option>';
    for (var r = 0; r < REVENUE.length; r++) { html += '<option' + (revenue === REVENUE[r] ? " selected" : "") + '>' + esc(REVENUE[r]) + '</option>'; }
    html += '</select></div>';
    html += '<div class="field"><label for="gr-biz">Business name (optional)</label><input type="text" id="gr-biz" name="business_name" autocomplete="organization" maxlength="200"></div>';
    html += '<p class="gr-error" id="gr-err" role="alert" hidden></p>';
    html += '<button class="btn" type="submit" id="gr-submit">Show My Results</button>';
    html += '</form>';
    html += '<p class="gr-back"><button type="button" class="gr-link" data-back="1">Back</button></p>';
    return html;
  }

  function ctaFor(rev) {
    var idx = REVENUE.indexOf(rev);
    var guides = { href: "guides.html", ev: "growth_test_guides_clicked" };
    var talk = { href: "work.html#talk", ev: "growth_test_talk_to_me_clicked" };
    if (idx <= 2) {
      return { copy: "Build the fundamentals before adding complexity.", primary: { label: "Explore The Free Business Guides", href: guides.href, ev: guides.ev }, secondary: { label: "Talk To Me", href: talk.href, ev: talk.ev } };
    }
    if (idx === 3) {
      return { copy: "Identify and fix the systems that could break as your business grows.", primary: { label: "Explore Scale Ready", href: "work.html", ev: "" }, secondary: { label: "Explore The Free Guides", href: guides.href, ev: guides.ev } };
    }
    return { copy: "If you are preparing for the next stage of growth, let’s diagnose the constraints before committing more capital.", primary: { label: "Talk To Me", href: talk.href, ev: talk.ev }, secondary: { label: "Explore The Free Guides", href: guides.href, ev: guides.ev } };
  }

  function shareMessage(s) {
    return "I scored " + s.overallRounded + "/100 on this Growth Readiness Test. Try it before you scale your business: " + SITE_URL;
  }

  function resultHtml() {
    var s = score(answers);
    var html = '<div class="gr-result">';
    html += '<p class="gr-score" id="gr-focus" tabindex="-1"><span>' + s.overallRounded + '</span> / 100</p>';
    html += '<p class="gr-band">' + esc(s.band.label) + '</p>';
    html += '<p class="gr-band-text">' + esc(s.band.text) + '</p>';
    html += '<p class="fine">This is a self-reported diagnostic and not a guarantee that a business will successfully scale.</p>';
    html += '<h2 class="gr-h">Your readiness by pillar</h2><ul class="gr-pillars">';
    for (var p = 0; p < s.pillars.length; p++) {
      html += '<li><div class="gr-pillar-row"><span>' + esc(s.pillars[p].name) + '</span><span>' + s.pillars[p].rounded + '</span></div>' +
        '<div class="gr-bar gr-bar-lg" role="img" aria-label="' + esc(s.pillars[p].name) + ' ' + s.pillars[p].rounded + ' out of 100"><span style="width:' + Math.max(0, Math.min(100, s.pillars[p].score)) + '%"></span></div></li>';
    }
    html += '</ul>';
    html += '<h2 class="gr-h">Your Two Biggest Scaling Risks</h2>';
    var two = [s.lowest, s.second];
    for (var t = 0; t < 2; t++) {
      var r = RISKS[two[t].key];
      html += '<div class="gr-risk"><p class="eyebrow">' + esc(two[t].name) + '</p><h3>' + esc(r.title) + '</h3><p>' + esc(r.body) + '</p><p><strong>Fix first:</strong> ' + esc(r.fix) + '</p></div>';
    }
    var cta = ctaFor(revenue);
    html += '<div class="gr-cta"><p class="gr-cta-copy">' + esc(cta.copy) + '</p><div class="buttons">' +
      '<a class="btn" href="' + cta.primary.href + '"' + (cta.primary.ev ? ' data-ev="' + cta.primary.ev + '"' : '') + '>' + esc(cta.primary.label) + '</a>' +
      '<a class="btn btn-outline" href="' + cta.secondary.href + '"' + (cta.secondary.ev ? ' data-ev="' + cta.secondary.ev + '"' : '') + '>' + esc(cta.secondary.label) + '</a></div></div>';
    html += '<p class="gr-share fine">Share your score: <button type="button" class="gr-link" data-share="copy">Copy link</button> &middot; <a href="https://wa.me/?text=' + encodeURIComponent(shareMessage(s)) + '" target="_blank" rel="noopener" data-share="whatsapp">WhatsApp</a></p>';
    html += '<p class="gr-restart fine"><button type="button" class="gr-link" data-restart="1">Start over</button></p>';
    html += '</div>';
    return html;
  }

  /* ---------- Navigation ---------- */

  function render() {
    if (step === "landing") {
      appEl.hidden = true; appEl.innerHTML = "";
      if (landingEl) { landingEl.hidden = false; }
      return;
    }
    if (landingEl) { landingEl.hidden = true; }
    appEl.hidden = false;
    if (typeof step === "number") { appEl.innerHTML = questionHtml(step); }
    else if (step === "gate") { appEl.innerHTML = gateHtml(); }
    else if (step === "result") { appEl.innerHTML = resultHtml(); track("growth_test_result_viewed", { score: score(answers).overallRounded }); }
    var f = document.getElementById("gr-focus");
    if (f && f.focus) { try { f.focus({ preventScroll: false }); } catch (e) { f.focus(); } }
    if (root.scrollTo) { root.scrollTo(0, 0); }
  }

  function go(next, push) {
    step = next;
    if (push) {
      try { root.history.pushState({ gr: 1, step: next }, "", root.location.pathname + root.location.search + "#start"); } catch (e) { /* ignore */ }
    }
    render();
  }

  function begin() {
    if (!started) { started = true; track("growth_test_started"); }
    go(done ? "result" : 0, true);
  }

  function validStep(s) {
    if (s === "landing" || s === "gate" || s === "result") { return true; }
    return typeof s === "number" && s >= 0 && s < N;
  }

  function onAnswer(q, s) {
    answers[q] = s;
    save();
    track("growth_test_question_completed", { question_number: q + 1 });
    if (q < N - 1) { go(q + 1, true); }
    else { track("growth_test_completed"); go("gate", true); }
  }

  function back() {
    if (step === "gate") { go(N - 1, true); }
    else if (typeof step === "number" && step > 0) { go(step - 1, true); }
  }

  /* ---------- Submit ---------- */

  function showError(msg) {
    var el = document.getElementById("gr-err");
    if (el) { el.textContent = msg; el.hidden = false; }
  }

  function insertRow(row, cb) {
    var cfg = root.GR_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) { cb("Results storage is not configured yet (missing Supabase URL or key)."); return; }
    var x = new XMLHttpRequest();
    x.open("POST", String(cfg.SUPABASE_URL).replace(/\/+$/, "") + "/rest/v1/assessment_submissions", true);
    x.setRequestHeader("Content-Type", "application/json");
    x.setRequestHeader("apikey", cfg.SUPABASE_ANON_KEY);
    if (/^eyJ/.test(cfg.SUPABASE_ANON_KEY)) { x.setRequestHeader("Authorization", "Bearer " + cfg.SUPABASE_ANON_KEY); }
    x.setRequestHeader("Prefer", "return=minimal");
    x.timeout = 20000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) { cb(null); return; }
      var msg = "";
      try { var j = JSON.parse(x.responseText); msg = j.message || j.error_description || j.error || ""; } catch (e) { /* not json */ }
      cb("Could not save your results (" + x.status + (msg ? ": " + msg : "") + ").");
    };
    x.onerror = function () { cb("Could not save your results: network error. Check your connection and try again."); };
    x.ontimeout = function () { cb("Could not save your results: the request timed out. Try again."); };
    x.send(JSON.stringify(row));
  }

  function buildRow(first, email, rev, biz) {
    var s = score(answers), ans = {}, raw = {}, pill = {}, q, p;
    for (q = 0; q < N; q++) {
      raw["q" + (q + 1)] = answers[q];
      for (var o = 0; o < QUESTIONS[q].options.length; o++) { if (QUESTIONS[q].options[o][1] === answers[q]) { ans["q" + (q + 1)] = QUESTIONS[q].options[o][0]; } }
    }
    for (p = 0; p < s.pillars.length; p++) { pill[s.pillars[p].name] = round2(s.pillars[p].score); }
    var u = utms();
    return {
      first_name: first, email: email, business_name: biz || null, monthly_revenue: rev,
      answers: ans, raw_scores: raw, overall_score: s.overallRounded, pillar_scores: pill,
      lowest_pillar: s.lowest.name, second_lowest_pillar: s.second.name, result_band: s.band.label,
      utm_source: u.utm_source, utm_medium: u.utm_medium, utm_campaign: u.utm_campaign, utm_content: u.utm_content, utm_term: u.utm_term
    };
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (submitting) { return; }
    var f = ev.target;
    if (f.elements.website && f.elements.website.value) { return; }
    var first = f.elements.first_name.value.replace(/^\s+|\s+$/g, "");
    var email = f.elements.email.value.replace(/^\s+|\s+$/g, "");
    var rev = f.elements.monthly_revenue.value;
    var biz = f.elements.business_name.value.replace(/^\s+|\s+$/g, "");
    if (!first) { showError("Enter your first name."); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showError("Enter a valid work email."); return; }
    if (REVENUE.indexOf(rev) < 0) { showError("Select your monthly business revenue."); return; }
    if (!allAnswered()) { showError("Some answers are missing. Go back and complete all 12 questions."); return; }
    revenue = rev; save();
    var btn = document.getElementById("gr-submit");
    submitting = true; btn.disabled = true; btn.textContent = "Saving…";
    var err = document.getElementById("gr-err"); err.hidden = true;
    insertRow(buildRow(first, email, rev, biz), function (e) {
      submitting = false;
      if (e) { btn.disabled = false; btn.textContent = "Show My Results"; showError(e); return; }
      track("growth_test_email_submitted");
      done = true; save();
      go("result", true);
    });
  }

  /* ---------- Share ---------- */

  function copyText(text, cb) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta); cb(ok);
    }
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(text).then(function () { cb(true); }, fallback);
    } else { fallback(); }
  }

  /* ---------- Events ---------- */

  appEl.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== appEl && !(t.getAttribute && (t.getAttribute("data-s") !== null || t.getAttribute("data-back") || t.getAttribute("data-share") || t.getAttribute("data-restart") || t.getAttribute("data-ev")))) { t = t.parentNode; }
    if (!t || t === appEl) { return; }
    if (t.getAttribute("data-s") !== null) { onAnswer(parseInt(t.getAttribute("data-q"), 10), parseInt(t.getAttribute("data-s"), 10)); return; }
    if (t.getAttribute("data-back")) { back(); return; }
    if (t.getAttribute("data-restart")) {
      for (var j = 0; j < N; j++) { answers[j] = null; }
      revenue = null; done = false; save(); go(0, true); return;
    }
    if (t.getAttribute("data-share") === "copy") {
      copyText(SITE_URL, function () { t.textContent = "Link copied"; });
      track("growth_test_shared", { method: "copy" });
      return;
    }
    if (t.getAttribute("data-share") === "whatsapp") { track("growth_test_shared", { method: "whatsapp", transport_type: "beacon" }); return; }
    var ev = t.getAttribute("data-ev");
    if (ev) { track(ev, { transport_type: "beacon" }); }
  });
  appEl.addEventListener("submit", function (e) { if (e.target && e.target.id === "gr-form") { onSubmit(e); } });

  var startBtn = document.getElementById("gr-start");
  if (startBtn) { startBtn.addEventListener("click", begin); }

  root.addEventListener("popstate", function (e) {
    var st = e.state;
    if (st && st.gr && validStep(st.step)) { step = st.step; if (step === "result" && !done) { step = "gate"; } }
    else { step = "landing"; }
    render();
  });

  root.addEventListener("hashchange", function () {
    if (root.location.hash === "#start" && step === "landing") { begin(); }
  });

  /* ---------- Init ---------- */

  load();
  var st0 = root.history && root.history.state;
  if (st0 && st0.gr && validStep(st0.step)) {
    step = st0.step;
    if (step === "result" && !done) { step = allAnswered() ? "gate" : 0; }
    started = true;
    render();
  } else if (root.location.hash === "#start") {
    started = true; track("growth_test_started");
    step = done ? "result" : 0;
    try { root.history.replaceState({ gr: 1, step: step }, "", root.location.href); } catch (e) { /* ignore */ }
    render();
  } else {
    render();
  }
})(typeof window !== "undefined" ? window : this);
