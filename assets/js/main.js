/* MADS Lab: small progressive enhancements. The site works without JS. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme toggle ---- */
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  });

  /* ---- Mobile navigation ---- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  if (navToggle) {
    var setNav = function (open) {
      root.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    navToggle.addEventListener("click", function () { setNav(!root.classList.contains("nav-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
    document.querySelectorAll(".site-nav a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }

  /* ---- Header state on scroll ---- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".group-card, .news-card, .person-card, .project-card, .wg-row, .join-banner, .feature")
      .forEach(function (el) {
        if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("reveal"); io.observe(el); }
      });
  }

  /* ---- Copy BibTeX ---- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var code = btn.parentElement.querySelector("code");
    if (!code || !navigator.clipboard) return;
    navigator.clipboard.writeText(code.textContent).then(function () {
      btn.textContent = "Copied!";
      setTimeout(function () { btn.textContent = "Copy"; }, 1500);
    });
  });

  /* ---- Publication filters ---- */
  var toolbar = document.querySelector("[data-pub-filter]");
  if (toolbar) {
    var search = toolbar.querySelector("[data-pub-search]");
    var typeSel = toolbar.querySelector("[data-pub-type]");
    var groupBtns = toolbar.querySelectorAll("[data-pub-group]");
    var counter = toolbar.querySelector("[data-pub-count]");
    var empty = document.querySelector("[data-pub-empty]");
    var years = document.querySelectorAll("[data-pub-year]");
    var pubs = Array.prototype.map.call(document.querySelectorAll(".pub-years .pub"), function (li) {
      var text = li.querySelector(".pub-main").cloneNode(true);
      var bib = text.querySelector(".pub-bib"); if (bib) bib.remove();
      return { el: li, text: norm(text.textContent), type: li.dataset.type, groups: li.dataset.groups.split(" ") };
    });
    var group = new URLSearchParams(location.search).get("group") || "";

    function norm(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " "); }

    function apply() {
      var q = norm(search.value.trim()).split(" ").filter(Boolean);
      var types = typeSel.value ? typeSel.value.split(" ") : null;
      var n = 0;
      pubs.forEach(function (p) {
        var ok = (!group || p.groups.indexOf(group) >= 0) &&
                 (!types || types.indexOf(p.type) >= 0) &&
                 q.every(function (w) { return p.text.indexOf(w) >= 0; });
        p.el.hidden = !ok;
        if (ok) n++;
      });
      years.forEach(function (y) { y.hidden = !y.querySelector(".pub:not([hidden])"); });
      counter.textContent = n + (n === 1 ? " publication" : " publications");
      empty.hidden = n > 0;
      groupBtns.forEach(function (b) { b.classList.toggle("is-active", b.dataset.pubGroup === group); });
    }
    search.addEventListener("input", apply);
    typeSel.addEventListener("change", apply);
    groupBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        group = b.dataset.pubGroup;
        var url = new URL(location.href);
        if (group) url.searchParams.set("group", group); else url.searchParams.delete("group");
        history.replaceState(null, "", url);
        apply();
      });
    });
    apply();
  }

  /* ---- Hero: autonomous agents exchanging messages ---- */
  var canvas = document.querySelector("[data-hero-canvas]");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var colors = ["#8b8cff", "#22d3ee", "#fbbf24", "#fb7192", "#b39dff"];
    var nodes = [], msgs = [], W = 0, H = 0, dpr = 1, running = false, raf = 0;
    var mouse = { x: -1e4, y: -1e4 };
    var LINK = 150;

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(90, Math.max(28, W * H / 16000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
          r: Math.random() * 1.6 + 1.2,
          c: Math.random() < .22 ? colors[2 + (i % 3)] : colors[i % 2]
        });
      }
      msgs = [];
      if (!running) draw();
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var dx = n.x - mouse.x, dy = n.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140 && d2 > 1) { var f = .6 / Math.sqrt(d2); n.vx += dx * f * .02; n.vy += dy * f * .02; }
        n.vx *= .995; n.vy *= .995;
        var sp = Math.hypot(n.vx, n.vy);
        if (sp < .08) { n.vx += (Math.random() - .5) * .05; n.vy += (Math.random() - .5) * .05; }
        if (sp > .9) { n.vx *= .9; n.vy *= .9; }
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      }
      // spawn messages along existing links
      if (msgs.length < 14 && Math.random() < .08) {
        var a = nodes[(Math.random() * nodes.length) | 0], best = null, bd = LINK;
        for (var j = 0; j < nodes.length; j++) {
          var b = nodes[j]; if (b === a) continue;
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < bd && Math.random() < .5) { bd = d; best = b; }
        }
        if (best) msgs.push({ a: a, b: best, t: 0, c: a.c });
      }
      msgs = msgs.filter(function (m) { m.t += .018; return m.t < 1 && Math.hypot(m.a.x - m.b.x, m.a.y - m.b.y) < LINK * 1.2; });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = "rgba(160,170,255," + (1 - d / LINK) * .22 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < msgs.length; k++) {
        var m = msgs[k], x = m.a.x + (m.b.x - m.a.x) * m.t, y = m.a.y + (m.b.y - m.a.y) * m.t;
        ctx.fillStyle = m.c; ctx.shadowColor = m.c; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.283); ctx.fill();
      }
      ctx.shadowBlur = 0;
      for (var n = 0; n < nodes.length; n++) {
        var p = nodes[n];
        ctx.fillStyle = p.c; ctx.globalAlpha = .9;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop() { step(); draw(); raf = requestAnimationFrame(loop); }
    function start() { if (!running && !reduceMotion) { running = true; loop(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    canvas.parentElement.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", function () { mouse.x = mouse.y = -1e4; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(canvas);
    } else start();
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }
})();
