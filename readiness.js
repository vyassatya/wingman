/* Business Readiness Test.
   Scoring is deterministic integer arithmetic and has no DOM dependency (first half).
   The second half is the UI. Plain ES5 so it runs in in-app browsers. */
(function (root) {
  "use strict";

  var AP = "’"; /* typographic apostrophe, as in the supplied copy */

  /* ---------- Content ---------- */

  var FLOWS = {
    running: {
      key: "running",
      label: "I" + AP + "m already running a business",
      moneyField: "monthly_revenue",
      moneyTitle: "Current monthly revenue",
      moneyOptions: ["Below ₹1L", "₹1–5L", "₹5–20L", "₹20L–₹1Cr", "₹1Cr+"],
      infoBiz: { title: "Business name and industry", f1: "Business name", f2: "Industry" },
      areas: [
        { name: "Founder Capacity", q: [0, 1] },
        { name: "People", q: [2] },
        { name: "Processes", q: [3] },
        { name: "Visibility", q: [4] },
        { name: "Controls", q: [5] },
        { name: "Automation", q: [6] }
      ],
      bands: [
        { min: 90, label: "Strong Scale Foundation" },
        { min: 75, label: "Scale Ready — With Gaps" },
        { min: 60, label: "Almost Scale Ready" },
        { min: 40, label: "Systems Fragile" },
        { min: 0, label: "Not Ready to Scale" }
      ],
      fixes: {
        "Founder Capacity": "Name the three recurring tasks that only you can do. Delegate or drop the rest this week.",
        "People": "Put a named owner, a target, and decision rights on every critical function.",
        "Processes": "Write the five steps that would break at 2× volume. Have someone other than you run one.",
        "Visibility": "Pick five numbers. Give each a target, a frequency, and an owner. Review them weekly.",
        "Controls": "Set a limit for cash, margin, and delivery. A breach needs an owner and an action, not a conversation.",
        "Automation": "Pick the three follow-ups or reports you do by hand every week. Automate those first."
      },
      questions: [
        { area: "Founder Capacity", text: "If you disappeared from the business for 7 days, what would happen?",
          options: [["Business would run almost normally", 4], ["A few decisions would wait for me", 3], ["Important things would slow down", 2], ["Operations would start breaking", 1], ["Most things depend on me", 0]] },
        { area: "Founder Capacity", text: "How much of your week goes into growth, strategy and important decisions vs daily execution and firefighting?",
          options: [["Mostly growth and strategic work", 4], ["More growth than operations", 3], ["Roughly equal", 2], ["Mostly operations and firefighting", 1], ["Almost entirely day-to-day execution", 0]] },
        { area: "People", text: "Do your critical functions have clear owners who can make decisions without you?",
          options: [["Yes, across the business", 4], ["Across most functions", 3], ["Across some functions", 2], ["Very few functions", 1], ["Most important decisions still come to me", 0]] },
        { area: "Processes", text: "If your orders, customers or revenue doubled next month, what would happen?",
          options: [["We could handle it with minor strain", 4], ["We would need some additional capacity", 3], ["Several processes would need fixing", 2], ["Quality or service would probably suffer", 1], ["Things would start breaking", 0]] },
        { area: "Visibility", text: "How clearly can you see how the business is performing every week?",
          options: [["Clear dashboard, targets and regular review", 4], ["Good visibility, but some reporting is manual", 3], ["We track several numbers but not consistently", 2], ["We mostly look at sales and basic financial numbers", 1], ["We don" + AP + "t have a structured view", 0]] },
        { area: "Controls", text: "When something important goes off target — margins, cash, inventory, delivery, quality — what usually happens?",
          options: [["A threshold triggers an alert, owner and action", 4], ["We usually catch and address it quickly", 3], ["It gets discussed when someone notices it", 2], ["I usually discover and fix it myself", 1], ["We don" + AP + "t have defined controls", 0]] },
        { area: "Automation", text: "How much repetitive work, reporting and follow-up is automated today?",
          options: [["Most recurring workflows are automated", 4], ["Several important workflows are automated", 3], ["We have some basic automation", 2], ["Very little is automated", 1], ["Almost everything is manual", 0]] },
        { area: "Not scored", text: "What do YOU think is stopping the business from growing faster right now?",
          options: [["Founder bandwidth"], ["Team / people"], ["Operations / processes"], ["Sales / demand"], ["Cash / capital"], ["Technology / automation"], ["Not sure"]] }
      ]
    },
    setup: {
      key: "setup",
      label: "I" + AP + "m actively setting one up",
      sub: "Seriously planning to launch soon, not just exploring.",
      moneyField: "investment_budget",
      moneyTitle: "Approximate investment budget",
      moneyOptions: ["Below ₹5L", "₹5–10L", "₹10–25L", "₹25–50L", "₹50L–₹1Cr", "₹1Cr+"],
      infoBiz: { title: "What business are you setting up?", f1: "Business", f2: "Industry" },
      areas: [
        { name: "Customer", q: [0] },
        { name: "Validation", q: [1] },
        { name: "Business Model", q: [2] },
        { name: "Setup", q: [3] },
        { name: "Ownership", q: [4] },
        { name: "Founder Time", q: [5] },
        { name: "Execution", q: [6] }
      ],
      bands: [
        { min: 90, label: "Strong Launch Foundation" },
        { min: 75, label: "Launch Ready — With Gaps" },
        { min: 60, label: "Almost Launch Ready" },
        { min: 40, label: "Foundation Incomplete" },
        { min: 0, label: "Not Ready to Launch" }
      ],
      fixes: {
        "Customer": "Write one sentence: who pays, for what, and why now.",
        "Validation": "Get one paid order, pre-order, or paid pilot before you spend on setup.",
        "Business Model": "Write price, direct cost, and contribution on one page.",
        "Setup": "List the five things that must exist on launch day. Finish the one that blocks the others.",
        "Ownership": "Name who runs the floor on day one. If it is you, block the hours.",
        "Founder Time": "Put the weekly hours on a calendar before you sign anything.",
        "Execution": "Turn the list into dates and owners. A list is not a plan."
      },
      questions: [
        { area: "Customer", text: "How clear are you on exactly who this business is for?",
          options: [["Very specific customer and use case", 4], ["Fairly clear customer segment", 3], ["Broad idea of the customer", 2], ["Still exploring different customers", 1], ["Not clear yet", 0]] },
        { area: "Validation", text: "How much have you tested whether customers actually want this?",
          options: [["Customers have already paid, pre-ordered, or bought a pilot", 4], ["Strong validation through real customer tests", 3], ["Spoken to several potential customers", 2], ["Mostly research and assumptions", 1], ["Haven" + AP + "t tested it yet", 0]] },
        { area: "Business Model", text: "How clear are you on how this business will make money?",
          options: [["Pricing, costs and unit economics are worked out", 4], ["Revenue model and pricing are clear", 3], ["Broad business model is clear", 2], ["Still comparing different models", 1], ["Not worked out yet", 0]] },
        { area: "Setup", text: "How far have you progressed on the things required to actually launch? Location, suppliers, product, technology, licences, vendors.",
          options: [["Most critical pieces are already finalised", 4], ["Shortlists, quotes and plans are ready", 3], ["Research is underway", 2], ["Only initial research has started", 1], ["Haven" + AP + "t started execution yet", 0]] },
        { area: "Ownership", text: "Who will run the business day-to-day once it launches?",
          options: [["Clear operator or team with defined responsibilities", 4], ["I will operate it full-time", 3], ["I have someone in mind but roles aren" + AP + "t final", 2], ["I plan to manage it alongside another full-time commitment", 1], ["Not figured out yet", 0]] },
        { area: "Founder Time", text: "How much time can you realistically give this business every week until launch?",
          options: [["30+ hours", 4], ["20–30 hours", 3], ["10–20 hours", 2], ["5–10 hours", 1], ["Less than 5 hours, or inconsistent", 0]] },
        { area: "Execution", text: "Do you have a launch plan with clear actions, dates and owners?",
          options: [["Yes, detailed plan already being executed", 4], ["Plan exists with dates and milestones", 3], ["Rough plan exists", 2], ["Mostly a list of things to do", 1], ["No structured launch plan yet", 0]] },
        { area: "Not scored", text: "What is stopping you from moving faster right now?",
          options: [["Choosing the right business or model"], ["Customer validation"], ["Money / funding"], ["Location / vendors / setup"], ["Finding the right people"], ["Time"], ["Execution, don" + AP + "t know what to do next"], ["Something else"]] }
      ]
    }
  };

  var OFFERS = {
    launch: { name: "Wingman Launch", button: "See Wingman Launch", href: "work.html#launch", line: "₹1,50,000 for 60 days" },
    cofounder: { name: "Wingman Cofounder", button: "See Wingman Cofounder", href: "work.html#cofounder", line: "₹50,000 for 30 days" },
    scale: { name: "Wingman Scale", button: "See Wingman Scale", href: "work.html#scale", line: "₹6,00,000 for 90 days" }
  };

  var TOTAL_POINTS = 28;

  /* ---------- Scoring ---------- */

  function verifyConfig() {
    var f, i, j, k;
    for (f in FLOWS) {
      if (!FLOWS.hasOwnProperty(f)) { continue; }
      var flow = FLOWS[f];
      if (flow.questions.length !== 8) { throw new Error(f + ": expected 8 questions."); }
      var covered = {};
      for (i = 0; i < 7; i++) {
        var seen = {};
        for (j = 0; j < flow.questions[i].options.length; j++) { seen[flow.questions[i].options[j][1]] = true; }
        if (flow.questions[i].options.length !== 5 || !seen[0] || !seen[1] || !seen[2] || !seen[3] || !seen[4]) { throw new Error(f + " Q" + (i + 1) + ": scores must be exactly 0-4."); }
      }
      if (flow.questions[7].options[0].length !== 1) { throw new Error(f + " Q8 must be unscored."); }
      for (i = 0; i < flow.areas.length; i++) {
        for (k = 0; k < flow.areas[i].q.length; k++) {
          if (covered[flow.areas[i].q[k]]) { throw new Error(f + ": question in two areas."); }
          covered[flow.areas[i].q[k]] = true;
        }
      }
      for (i = 0; i < 7; i++) { if (!covered[i]) { throw new Error(f + ": Q" + (i + 1) + " is in no area."); } }
      for (i = 0; i < flow.areas.length; i++) { if (!flow.fixes[flow.areas[i].name]) { throw new Error(f + ": missing fix line for " + flow.areas[i].name); } }
    }
    return true;
  }

  function bandFor(flow, rounded) {
    for (var i = 0; i < flow.bands.length; i++) { if (rounded >= flow.bands[i].min) { return flow.bands[i]; } }
    return flow.bands[flow.bands.length - 1];
  }

  /* raw: array of 7 scores (0-4). Final = points / 28 x 100. Area = its answers / (4 x its questions) x 100. */
  function score(pathKey, raw) {
    var flow = FLOWS[pathKey];
    if (!flow) { throw new Error("Unknown path."); }
    if (!raw || raw.length !== 7) { throw new Error("Need 7 scores."); }
    var points = 0, i, k;
    for (i = 0; i < 7; i++) {
      if (raw[i] !== 0 && raw[i] !== 1 && raw[i] !== 2 && raw[i] !== 3 && raw[i] !== 4) { throw new Error("Score " + (i + 1) + " must be 0-4."); }
      points += raw[i];
    }
    var overall = points * 100 / TOTAL_POINTS;
    var rounded = Math.floor((points * 200 + TOTAL_POINTS) / (TOTAL_POINTS * 2)); /* round half up, integer arithmetic */
    var areas = [];
    for (i = 0; i < flow.areas.length; i++) {
      var sum = 0;
      for (k = 0; k < flow.areas[i].q.length; k++) { sum += raw[flow.areas[i].q[k]]; }
      var n = flow.areas[i].q.length;
      areas.push({ name: flow.areas[i].name, order: i, sum: sum, n: n, score: sum * 100 / (4 * n) });
    }
    var ranked = areas.slice().sort(function (a, b) {
      var l = a.sum * b.n, r = b.sum * a.n; /* compare a.sum/a.n with b.sum/b.n exactly */
      if (l !== r) { return l - r; }
      return a.order - b.order;
    });
    return { points: points, overall: overall, rounded: rounded, areas: areas, ranked: ranked, lowest: ranked[0], second: ranked[1], band: bandFor(flow, rounded) };
  }

  function offerFor(pathKey, money) {
    if (pathKey === "setup") { return "launch"; }
    var idx = FLOWS.running.moneyOptions.indexOf(money);
    if (idx < 0) { return null; }
    return idx <= 2 ? "cofounder" : "scale";
  }

  verifyConfig();

  var api = { FLOWS: FLOWS, OFFERS: OFFERS, score: score, offerFor: offerFor, verifyConfig: verifyConfig };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  root.Readiness = api;

  if (typeof document === "undefined" || !document.getElementById("rd-app")) { return; }

  /* ---------- UI ---------- */

  var STORE_KEY = "rd_state";
  var UTM_KEY = "gr_utm";
  var appEl = document.getElementById("rd-app");
  var state = { path: null, info: { first: "", email: "", phone: "", business: "", industry: "", money: "" }, ans: [null, null, null, null, null, null, null, null], done: false };
  var step = "path";
  var submitting = false;
  var lastError = "";

  function stepsFor() {
    return ["path", "first", "contact", "biz", "money", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "result"];
  }
  var TOTAL_SCREENS = 13;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function track(name, params) { try { if (typeof root.gtag === "function") { root.gtag("event", name, params || {}); } } catch (e) { /* ignore */ } }
  function save() { try { root.sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage may be blocked */ } }
  function load() {
    try {
      var s = JSON.parse(root.sessionStorage.getItem(STORE_KEY) || "null");
      if (s && s.ans && s.ans.length === 8 && s.info) {
        state.path = (s.path === "running" || s.path === "setup") ? s.path : null;
        for (var k in state.info) { if (state.info.hasOwnProperty(k) && typeof s.info[k] === "string") { state.info[k] = s.info[k]; } }
        for (var i = 0; i < 8; i++) { state.ans[i] = (typeof s.ans[i] === "number" && s.ans[i] >= 0) ? s.ans[i] : null; }
        state.done = !!s.done;
      }
    } catch (e) { /* ignore */ }
  }
  function flow() { return state.path ? FLOWS[state.path] : null; }
  function allScored() { for (var i = 0; i < 7; i++) { if (state.ans[i] === null) { return false; } } return true; }
  function rawScores() {
    var f = flow(), raw = [];
    for (var i = 0; i < 7; i++) { raw.push(f.questions[i].options[state.ans[i]][1]); }
    return raw;
  }

  function utms() {
    var out = {}, keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"], stored = {}, m, k, v;
    try { stored = JSON.parse(root.sessionStorage.getItem(UTM_KEY) || "{}") || {}; } catch (e) { stored = {}; }
    for (var j = 0; j < keys.length; j++) {
      k = keys[j];
      m = new RegExp("[?&]" + k + "=([^&#]*)").exec(root.location.search);
      v = m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : (stored[k] || null);
      out[k] = v ? String(v).slice(0, 200) : null;
    }
    return out;
  }

  /* ---------- Screens ---------- */

  function bar(pct) {
    return '<div class="gr-progress"><div class="gr-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progress"><span style="width:' + pct + '%"></span></div></div>';
  }
  function backBtn(show) { return '<p class="gr-back"><button type="button" class="gr-link" data-back="1"' + (show ? "" : " hidden") + '>Back</button></p>'; }
  function errHtml() { return '<p class="gr-error" id="rd-err" role="alert"' + (lastError ? "" : " hidden") + '>' + esc(lastError) + '</p>'; }
  function idx(id) { return stepsFor().indexOf(id); }

  function pathHtml() {
    var html = bar(0) + '<h2 class="gr-q" id="rd-focus" tabindex="-1">Where are you today?</h2><div class="gr-opts" role="group" aria-label="Answers">';
    var keys = ["running", "setup"];
    for (var i = 0; i < 2; i++) {
      var f = FLOWS[keys[i]];
      html += '<button type="button" class="gr-opt" data-path="' + f.key + '" aria-pressed="' + (state.path === f.key ? "true" : "false") + '">' + esc(f.label) + (f.sub ? '<span class="gr-opt-sub">' + esc(f.sub) + '</span>' : "") + '</button>';
    }
    return html + '</div>' + backBtn(false);
  }

  function formHtml(title, fields, btn) {
    var html = bar(Math.round((idx(step) / TOTAL_SCREENS) * 100)) + '<h2 class="gr-q" id="rd-focus" tabindex="-1">' + esc(title) + '</h2><form id="rd-form" novalidate>';
    html += '<p class="hp" hidden><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>';
    for (var i = 0; i < fields.length; i++) {
      var fl = fields[i];
      html += '<div class="field"><label for="rd-' + fl.name + '"' + (fl.hideLabel ? ' class="gr-sr"' : "") + '>' + esc(fl.label) + '</label><input type="' + fl.type + '" id="rd-' + fl.name + '" name="' + fl.name + '" value="' + esc(fl.value) + '" required' + (fl.auto ? ' autocomplete="' + fl.auto + '"' : "") + (fl.mode ? ' inputmode="' + fl.mode + '"' : "") + ' maxlength="' + (fl.max || 200) + '"></div>';
    }
    html += errHtml() + '<button class="btn" type="submit">' + esc(btn) + '</button></form>' + backBtn(true);
    return html;
  }

  function moneyHtml() {
    var f = flow();
    var html = bar(Math.round((idx("money") / TOTAL_SCREENS) * 100)) + '<h2 class="gr-q" id="rd-focus" tabindex="-1">' + esc(f.moneyTitle) + '</h2><div class="gr-opts" role="group" aria-label="Answers">';
    for (var i = 0; i < f.moneyOptions.length; i++) {
      html += '<button type="button" class="gr-opt" data-money="' + i + '" aria-pressed="' + (state.info.money === f.moneyOptions[i] ? "true" : "false") + '">' + esc(f.moneyOptions[i]) + '</button>';
    }
    return html + '</div>' + backBtn(true);
  }

  function questionHtml(qi) {
    var f = flow(), q = f.questions[qi];
    var html = bar(Math.round((idx(step) / TOTAL_SCREENS) * 100)) + '<p class="eyebrow gr-pillar">' + esc(q.area) + '</p>';
    html += '<h2 class="gr-q" id="rd-focus" tabindex="-1">' + esc(q.text) + '</h2><div class="gr-opts" role="group" aria-label="Answers">';
    for (var o = 0; o < q.options.length; o++) {
      html += '<button type="button" class="gr-opt" data-q="' + qi + '" data-o="' + o + '"' + (submitting ? " disabled" : "") + ' aria-pressed="' + (state.ans[qi] === o ? "true" : "false") + '">' + esc(q.options[o][0]) + '</button>';
    }
    html += '</div>';
    if (qi === 7) {
      html += '<p class="gr-saving" id="rd-saving"' + (submitting ? "" : " hidden") + '>Saving your results…</p>' + errHtml();
      html += '<p class="gr-retry"' + (lastError && !submitting ? "" : " hidden") + '><button type="button" class="btn" data-retry="1">Try again</button></p>';
    }
    return html + backBtn(true);
  }

  function resultHtml() {
    var f = flow(), s = score(state.path, rawScores());
    var offer = OFFERS[offerFor(state.path, state.info.money)];
    var blocker = f.questions[7].options[state.ans[7]][0];
    var html = '<div class="gr-result"><p class="gr-score" id="rd-focus" tabindex="-1"><span>' + s.rounded + '</span> / 100</p>';
    html += '<p class="gr-band">' + esc(s.band.label) + '</p>';
    html += '<h2 class="gr-h">The two areas I would fix first.</h2>';
    var two = [s.lowest, s.second];
    for (var t = 0; t < 2; t++) {
      html += '<div class="gr-risk"><p class="eyebrow">' + esc(two[t].name) + '</p><p>' + esc(f.fixes[two[t].name]) + '</p></div>';
    }
    html += '<p class="fine">You said the blocker is ' + esc(blocker) + '. The diagnostic points at ' + esc(s.lowest.name) + '.</p>';
    html += '<p class="fine">This is a self-reported diagnostic, not a guarantee.</p>';
    html += '<div class="gr-cta"><p><a class="btn" href="' + offer.href + '" data-offer="' + esc(offer.name) + '">' + esc(offer.button) + '</a></p><p class="fine">' + esc(offer.line) + '</p></div></div>';
    return html;
  }

  /* ---------- Navigation ---------- */

  function render() {
    var html = "";
    if (step === "path") { html = pathHtml(); }
    else if (step === "first") {
      html = formHtml("First name", [{ name: "first", label: "First name", hideLabel: true, type: "text", value: state.info.first, auto: "given-name", max: 100 }], "Continue");
    } else if (step === "contact") {
      html = formHtml("Email and WhatsApp number", [
        { name: "email", label: "Email", type: "email", value: state.info.email, auto: "email", max: 254 },
        { name: "phone", label: "WhatsApp number", type: "tel", value: state.info.phone, auto: "tel", max: 30, mode: "tel" }
      ], "Continue");
    } else if (step === "biz") {
      var b = flow().infoBiz;
      html = formHtml(b.title, [
        { name: "business", label: b.f1, type: "text", value: state.info.business, auto: "organization", max: 200 },
        { name: "industry", label: b.f2, type: "text", value: state.info.industry, max: 200 }
      ], "Continue");
    } else if (step === "money") { html = moneyHtml(); }
    else if (step.charAt(0) === "q") { html = questionHtml(parseInt(step.slice(1), 10) - 1); }
    else if (step === "result") { html = resultHtml(); }
    appEl.innerHTML = html;
    if (step === "result") { track("readiness_result_viewed", { path: state.path, score: score(state.path, rawScores()).rounded }); }
    var fo = document.getElementById("rd-focus");
    if (fo && fo.focus) { try { fo.focus(); } catch (e) { /* ignore */ } }
    if (root.scrollTo) { root.scrollTo(0, 0); }
  }

  function go(next, push) {
    step = next; lastError = "";
    if (push) { try { root.history.pushState({ rd: 1, step: next }, "", root.location.href); } catch (e) { /* ignore */ } }
    render();
  }

  function prevStep() {
    var order = stepsFor(), i = order.indexOf(step);
    return i > 0 ? order[i - 1] : null;
  }

  function validStep(s) { return stepsFor().indexOf(s) >= 0; }
  function canShow(s) {
    if (s === "path") { return true; }
    if (!state.path) { return false; }
    if (s === "result") { return state.done && allScored() && state.ans[7] !== null && !!state.info.money; }
    return true;
  }

  /* ---------- Submit ---------- */

  function insertRow(row, cb) {
    var cfg = root.GR_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) { cb("Results storage is not configured yet (missing Supabase URL or key)."); return; }
    var x = new XMLHttpRequest();
    x.open("POST", String(cfg.SUPABASE_URL).replace(/\/+$/, "") + "/rest/v1/assessments", true);
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

  function round2(x) { return Math.round(x * 100) / 100; }

  /* Row for public.assessments (email, score, verdict, weakest, answers; created_at is set by the database).
     Everything else collected (contact, business, money, per-question scores, area scores, UTMs) rides in the answers JSON. */
  function buildRow() {
    var f = flow(), s = score(state.path, rawScores()), ans = {}, raw = {}, areas = {}, i, a;
    for (i = 0; i < 8; i++) { ans["q" + (i + 1)] = f.questions[i].options[state.ans[i]][0]; }
    for (i = 0; i < 7; i++) { raw["q" + (i + 1)] = f.questions[i].options[state.ans[i]][1]; }
    for (a = 0; a < s.areas.length; a++) { areas[s.areas[a].name] = round2(s.areas[a].score); }
    var u = utms(), isRun = state.path === "running", k, utm = {}, hasUtm = false;
    for (k in u) { if (u.hasOwnProperty(k) && u[k]) { utm[k] = u[k]; hasUtm = true; } }
    var answers = {
      path: state.path,
      profile: {
        first_name: state.info.first, phone: state.info.phone,
        business_name: state.info.business || null, industry: state.info.industry || null
      },
      monthly_revenue: isRun ? state.info.money : null,
      investment_budget: isRun ? null : state.info.money,
      responses: ans, raw_scores: raw, area_scores: areas,
      second_weakest: s.second.name, recommended_offer: OFFERS[offerFor(state.path, state.info.money)].name
    };
    if (hasUtm) { answers.utm = utm; }
    return { email: state.info.email.toLowerCase(), score: s.rounded, verdict: s.band.label, weakest: s.lowest.name, answers: answers };
  }

  function submit() {
    if (submitting) { return; }
    if (!allScored() || state.ans[7] === null || !state.info.money) { lastError = "Some answers are missing. Go back and complete every step."; render(); return; }
    submitting = true; lastError = ""; render();
    insertRow(buildRow(), function (e) {
      submitting = false;
      if (e) { lastError = e; render(); return; }
      track("readiness_submitted", { path: state.path });
      state.done = true; save();
      go("result", true);
    });
  }

  /* ---------- Events ---------- */

  function showErr(msg) { var el = document.getElementById("rd-err"); if (el) { el.textContent = msg; el.hidden = false; } }

  function onFormSubmit(ev) {
    ev.preventDefault();
    var f = ev.target;
    if (f.elements.website && f.elements.website.value) { return; }
    function val(n) { return f.elements[n] ? f.elements[n].value.replace(/^\s+|\s+$/g, "") : ""; }
    if (step === "first") {
      if (!val("first")) { showErr("Enter your first name."); return; }
      state.info.first = val("first"); save(); go("contact", true);
    } else if (step === "contact") {
      var email = val("email"), phone = val("phone"), digits = phone.replace(/\D/g, "");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showErr("Enter a valid email."); return; }
      if (!/^[+\d][\d\s().-]*$/.test(phone) || digits.length < 8 || digits.length > 15) { showErr("Enter a valid WhatsApp number, with country code if outside India."); return; }
      state.info.email = email; state.info.phone = phone; save(); go("biz", true);
    } else if (step === "biz") {
      if (!val("business") || !val("industry")) { showErr(step === "biz" && state.path === "setup" ? "Enter the business and the industry." : "Enter your business name and industry."); return; }
      state.info.business = val("business"); state.info.industry = val("industry"); save(); go("money", true);
    }
  }

  appEl.addEventListener("click", function (e) {
    var t = e.target, el = null;
    while (t && t !== appEl) {
      if (t.getAttribute && (t.getAttribute("data-path") || t.getAttribute("data-money") !== null || t.getAttribute("data-q") !== null || t.getAttribute("data-back") || t.getAttribute("data-retry") || t.getAttribute("data-offer"))) { el = t; break; }
      t = t.parentNode;
    }
    if (!el || el.disabled) { return; }
    var p = el.getAttribute("data-path");
    if (p) {
      if (state.path !== p) { state.path = p; state.info.money = ""; for (var i = 0; i < 8; i++) { state.ans[i] = null; } state.done = false; }
      save(); track("readiness_path_selected", { path: p }); go("first", true); return;
    }
    if (el.getAttribute("data-money") !== null) {
      state.info.money = flow().moneyOptions[parseInt(el.getAttribute("data-money"), 10)]; save();
      track("readiness_info_completed", { path: state.path }); go("q1", true); return;
    }
    if (el.getAttribute("data-q") !== null) {
      var qi = parseInt(el.getAttribute("data-q"), 10);
      state.ans[qi] = parseInt(el.getAttribute("data-o"), 10); save();
      track("readiness_question_completed", { question_number: qi + 1, path: state.path });
      if (qi < 7) { go("q" + (qi + 2), true); } else { submit(); }
      return;
    }
    if (el.getAttribute("data-back")) { var pv = prevStep(); if (pv) { go(pv, true); } return; }
    if (el.getAttribute("data-retry")) { submit(); return; }
    if (el.getAttribute("data-offer")) { track("readiness_offer_clicked", { offer: el.getAttribute("data-offer"), transport_type: "beacon" }); }
  });
  appEl.addEventListener("submit", function (e) { if (e.target && e.target.id === "rd-form") { onFormSubmit(e); } });

  root.addEventListener("popstate", function (e) {
    var st = e.state;
    var next = (st && st.rd && validStep(st.step)) ? st.step : "path";
    if (!canShow(next)) { next = "path"; }
    step = next; lastError = ""; render();
  });

  /* ---------- Init ---------- */

  load();
  var st0 = root.history && root.history.state;
  if (st0 && st0.rd && validStep(st0.step) && canShow(st0.step)) {
    step = st0.step;
  } else {
    step = "path";
    try { root.history.replaceState({ rd: 1, step: "path" }, "", root.location.href); } catch (e) { /* ignore */ }
    track("readiness_started");
  }
  render();
})(typeof window !== "undefined" ? window : this);
