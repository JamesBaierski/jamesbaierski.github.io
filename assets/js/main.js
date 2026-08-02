/* =========================================================================
   James Baierski — portfolio behaviour
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- EDIT ME ---------------------------------------------------------
     Set your Formspree (or Getform) endpoint below to switch the contact
     form on. While this is empty the form stays disabled and points people
     at LinkedIn instead — it deliberately does NOT fall back to a mailto:
     link, so no email address is exposed anywhere on the site.
     1. Sign up free at https://formspree.io
     2. Create a form, copy the endpoint (looks like https://formspree.io/f/xabcdefg)
     3. Paste it between the quotes below. Nothing else needs changing.
  ---------------------------------------------------------------------- */
  var FORM_ENDPOINT = "";
  var LINKEDIN = "https://www.linkedin.com/in/jbaierski/";

  /* ---------------------------------------------------------- nav state -- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------- active section link -- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------- reveal on scroll -- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- contact form -- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = form.querySelector(".form__status");

    var say = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form__status " + (ok ? "is-ok" : "is-err");
    };

    // No endpoint configured yet: disable the form outright rather than
    // falling back to a mailto: link, and send people to LinkedIn instead.
    if (!FORM_ENDPOINT) {
      form.setAttribute("data-inactive", "true");
      Array.prototype.forEach.call(form.querySelectorAll("input, textarea, button"), function (el) {
        el.disabled = true;
      });
      var note = form.querySelector(".form__note");
      if (note) {
        note.innerHTML = 'The contact form isn\'t live yet — reach me on ' +
          '<a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a> in the meantime.';
      }
      return;
    }

    form.setAttribute("action", FORM_ENDPOINT);

    form.addEventListener("submit", function (e) {
      // Honeypot — silently drop bot submissions.
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) { e.preventDefault(); return; }

      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      say("", true);
      if (status) status.className = "form__status";

      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          say("Thanks — your message is on its way. I'll reply within a day or two.", true);
        } else {
          say("Something went wrong. Please reach me on LinkedIn instead.", false);
        }
      }).catch(function () {
        say("Network error. Please reach me on LinkedIn instead.", false);
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send message"; }
      });
    });
  }

  /* ---------------------------------------------------------- year stamp -- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
