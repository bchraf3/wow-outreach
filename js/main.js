/* ==========================================================================
   W.O.W Outreach — main.js
   ========================================================================== */

(function () {
  "use strict";

  /* --- Sticky Navigation --- */
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector(".hero");

  if (navbar && hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        navbar.classList.toggle("sticky", !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    heroObserver.observe(hero);
  }

  /* --- Mobile Menu Toggle --- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const mobileOverlay = document.querySelector(".mobile-overlay");

  function closeMenu() {
    navToggle?.classList.remove("open");
    navLinks?.classList.remove("open");
    mobileOverlay?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    navToggle?.classList.add("open");
    navLinks?.classList.add("open");
    mobileOverlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  navToggle?.addEventListener("click", () => {
    if (navLinks?.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileOverlay?.addEventListener("click", closeMenu);

  // Close menu on link click
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* --- Active Section Highlighting --- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  if (sections.length && navItems.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navItems.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* --- Scroll Reveal Animations --- */
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      reveals.forEach((el) => el.classList.add("visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      reveals.forEach((el) => revealObserver.observe(el));
    }
  }

  /* --- Impact Number Counters --- */
  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length) {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      counters.forEach((el) => {
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        el.textContent =
          prefix + parseInt(el.dataset.count, 10).toLocaleString() + suffix;
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* --- Contact Form (Formspree AJAX) --- */
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formMessage.textContent = "Thank you! Your message has been sent.";
        formMessage.className = "form-message success";
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      formMessage.textContent =
        "Oops! Something went wrong. Please try again.";
      formMessage.className = "form-message error";
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    // Auto-hide message after 6 seconds
    setTimeout(() => {
      formMessage.className = "form-message";
    }, 6000);
  });

  /* --- Copy Bank Details to Clipboard --- */
  const copyBtn = document.getElementById("copy-bank-details");

  copyBtn?.addEventListener("click", async () => {
    const details = [
      "Account Name: Walking On Water",
      "Bank: Capitec",
      "Branch Code: 470 010",
      "Account No: 1384644170",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(details);
      copyBtn.classList.add("copied");
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.classList.remove("copied");
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = details;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy Details";
        copyBtn.classList.remove("copied");
      }, 2000);
    }
  });
})();
