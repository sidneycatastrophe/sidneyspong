(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Contact form delivery.
     Paste a free Web3Forms access key here (web3forms.com). The key is tied
     to the inbox you sign up with, so using the personal Gmail delivers
     straight there without relying on Cloudflare's email forwarding.
     While it's empty, "Send message" opens the visitor's email app with
     everything pre-filled, addressed to CONTACT_EMAIL.
     ------------------------------------------------------------------ */
  var WEB3FORMS_ACCESS_KEY = "1c7348c6-087f-4e5a-a7b6-df78a571f704";
  var CONTACT_EMAIL = "info@sidneyspong.uk";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Header: scrolled state + mobile menu ---------- */
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      menu.hidden = false;
      // Wait a frame so the links transition in rather than appearing instantly
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          header.classList.add("is-open");
          var first = menu.querySelector("a");
          if (first) first.focus({ preventScroll: true });
        });
      });
    } else {
      header.classList.remove("is-open");
      menu.hidden = true;
    }
  }

  if (header && toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  var hero = document.querySelector(".hero");
  if (header && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px", threshold: 0.92 }).observe(hero);
  }

  /* ---------- Current section in desktop nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-current"); a.removeAttribute("aria-current"); });
        link.classList.add("is-current");
        link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ---------- Crayon scribbles draw themselves on ---------- */
  function drawScribble(svg) {
    var strokes = svg.querySelectorAll("[pathLength]");
    Array.prototype.forEach.call(strokes, function (path, i) {
      if (reduceMotion.matches || !path.animate) {
        path.style.strokeDashoffset = "0";
        return;
      }
      var anim = path.animate(
        [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
        { duration: 900, delay: 250 + i * 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
      anim.onfinish = function () {
        path.style.strokeDashoffset = "0";
        anim.cancel();
      };
    });
  }

  /* ---------- Reveal on scroll (with a small stagger per group) ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], .scribble"));
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        if (entry.target.classList.contains("scribble")) drawScribble(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    var lastParent = null;
    var step = 0;
    revealables.forEach(function (el) {
      if (el.hasAttribute("data-reveal")) {
        step = el.parentElement === lastParent ? step + 1 : 0;
        lastParent = el.parentElement;
        el.style.setProperty("--d", Math.min(step, 5) * 0.08 + "s");
      }
      revealObserver.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-in");
      if (el.classList.contains("scribble")) drawScribble(el);
    });
  }

  /* ---------- Lessons: crossfade the sticky photo to match the lesson in view ---------- */
  var lessonItems = document.querySelectorAll("[data-lesson]");
  var stageImgs = document.querySelectorAll(".lesson-stage img");
  if (lessonItems.length && "IntersectionObserver" in window) {
    var lessonObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("data-lesson");
        Array.prototype.forEach.call(lessonItems, function (li) { li.classList.toggle("is-active", li === entry.target); });
        Array.prototype.forEach.call(stageImgs, function (img) { img.classList.toggle("is-active", img.getAttribute("data-for") === id); });
      });
    }, { rootMargin: "-22% 0px -66% 0px" });
    Array.prototype.forEach.call(lessonItems, function (li) { lessonObserver.observe(li); });
  }

  /* ---------- Lessons on phones: "01 / 06" counter + progress line while swiping ---------- */
  var lessonRail = document.querySelector(".lesson-list");
  var countEl = document.querySelector("[data-lesson-count]");
  var progressEl = document.querySelector("[data-lesson-progress]");
  if (lessonRail && countEl && progressEl) {
    var total = lessonRail.children.length;
    var ticking = false;
    lessonRail.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = lessonRail.scrollWidth - lessonRail.clientWidth;
        var ratio = max > 0 ? lessonRail.scrollLeft / max : 0;
        var index = Math.min(total, Math.round(ratio * (total - 1)) + 1);
        countEl.textContent = (index < 10 ? "0" : "") + index;
        progressEl.style.transform = "scaleX(" + Math.max(1 / total, ratio) + ")";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Video: load YouTube only when someone presses play ---------- */
  document.querySelectorAll("[data-video]").forEach(function (box) {
    var btn = box.querySelector(".video-play");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + box.getAttribute("data-video") + "?autoplay=1&rel=0&playsinline=1";
      iframe.title = btn.getAttribute("aria-label").replace(/^Play the /, "");
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      box.replaceChild(iframe, btn);
      iframe.focus();
    });
  });

  /* ---------- Copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = "mailto:" + text; });
      } else {
        window.location.href = "mailto:" + text;
      }
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var label = form.querySelector(".btn-label");

    var rules = {
      name: function (v) { return v.trim() ? "" : "Please add your name."; },
      email: function (v) {
        if (!v.trim()) return "Please add your email so I can reply.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "That email doesn't look quite right.";
      },
      message: function (v) { return v.trim().length >= 10 ? "" : "Tell me a little more, even a sentence is fine."; }
    };

    function check(field) {
      var msg = rules[field.name](field.value);
      var err = document.getElementById(field.id + "-error");
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) field.setAttribute("aria-describedby", field.id + "-error");
      else field.removeAttribute("aria-describedby");
      if (err) err.textContent = msg;
      return !msg;
    }

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      field.addEventListener("blur", function () { if (field.value) check(field); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") check(field);
      });
    });

    function setStatus(kind, html) {
      status.className = "form-status" + (kind ? " is-" + kind : "");
      status.innerHTML = html;
    }

    function mailtoFallback(data) {
      var subject = "Singing lessons: " + data.name;
      var body =
        data.message + "\n\n" +
        "Lessons: " + data.format + "\n" +
        "Name: " + data.name + "\n" +
        "Email: " + data.email;
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      setStatus("success",
        "Your email app should now be open with your message ready to send. " +
        "If nothing happened, email <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a> directly.");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = [form.elements.name, form.elements.email, form.elements.message];
      var ok = fields.map(check).every(Boolean);
      if (!ok) {
        var firstBad = fields.filter(function (f) { return f.getAttribute("aria-invalid") === "true"; })[0];
        if (firstBad) firstBad.focus();
        return;
      }
      if (form.elements.botcheck.checked) return;

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        format: (form.querySelector("input[name=format]:checked") || {}).value || "Not sure yet",
        message: form.elements.message.value.trim()
      };

      if (!WEB3FORMS_ACCESS_KEY) {
        mailtoFallback(data);
        return;
      }

      form.classList.add("is-sending");
      label.textContent = "Sending…";
      setStatus("", "");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Singing lessons enquiry from " + data.name,
          from_name: "sidneyspong.uk",
          replyto: data.email,
          name: data.name,
          email: data.email,
          lessons: data.format,
          message: data.message
        })
      })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok && json.success, json: json }; }); })
        .then(function (result) {
          if (!result.ok) throw new Error(result.json && result.json.message);
          form.reset();
          Object.keys(rules).forEach(function (n) { form.elements[n].removeAttribute("aria-invalid"); });
          setStatus("success", "Thanks, " + data.name.split(" ")[0] + ". Your message is on its way. I usually reply within a day.");
        })
        .catch(function () {
          setStatus("error",
            "Your message didn't send. Please try again, or email <a href=\"mailto:" + CONTACT_EMAIL + "\">" +
            CONTACT_EMAIL + "</a> directly.");
        })
        .then(function () {
          form.classList.remove("is-sending");
          label.textContent = "Send message";
        });
    });
  }

  /* ---------- Pause / resume all looping motion ---------- */
  var motionToggle = document.querySelector(".motion-toggle");
  if (motionToggle) {
    var svgs = document.querySelectorAll(".defs, .mic");
    var setPaused = function (paused) {
      root.classList.toggle("motion-paused", paused);
      motionToggle.setAttribute("aria-pressed", String(paused));
      motionToggle.textContent = paused ? "Play animations" : "Pause animations";
      Array.prototype.forEach.call(svgs, function (svg) {
        if (svg.pauseAnimations) paused ? svg.pauseAnimations() : svg.unpauseAnimations();
      });
    };
    if (reduceMotion.matches) setPaused(true);
    motionToggle.addEventListener("click", function () {
      setPaused(!root.classList.contains("motion-paused"));
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
