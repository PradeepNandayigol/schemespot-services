// Schemespot Services — shared behaviour
document.addEventListener("DOMContentLoaded", () => {

  /* Mobile nav toggle */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.classList.toggle("active");
    });
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* Highlight active nav link */
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* Sticky header shadow on scroll */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 8 ? "0 6px 20px -12px rgba(20,43,79,.35)" : "none";
    });
  }

  /* Gallery filter */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = cat === "all" || item.dataset.category === cat;
        item.classList.toggle("hidden", !match);
      });
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.querySelector(".lightbox-close");

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      const src = item.dataset.src;
      const caption = item.dataset.caption || "";
      lightboxContent.innerHTML = "";
      if (type === "video") {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        lightboxContent.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = caption;
        lightboxContent.appendChild(img);
      }
      lightboxCaption.textContent = caption;
      lightbox.classList.add("open");
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightboxContent.innerHTML = "";
  }
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* Contact form (static demo — no backend) */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = document.getElementById("formSuccess");
      success.classList.add("show");
      form.reset();
      setTimeout(() => success.classList.remove("show"), 6000);
    });
  }

  /* Counter animation for stats */
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          let cur = 0;
          const step = Math.max(1, Math.round(target / 40));
          const t = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            el.textContent = cur.toLocaleString("en-IN");
          }, 30);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

});
