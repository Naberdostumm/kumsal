// Kumsal'ın web sitesi - ana script
(function () {
  // fotograflar/liste.js dosyasında tanımlanan liste (yoksa boş dizi)
  const fotolar = (window.KUMSAL_FOTOLAR || []).map(function (f) {
    return "fotograflar/" + f;
  });

  const grid = document.getElementById("galleryGrid");
  const empty = document.getElementById("galleryEmpty");
  const heroImg = document.getElementById("heroPhoto");

  // --- Hero fotoğrafı (ilk fotoğraf) ---
  if (fotolar.length > 0 && heroImg) {
    heroImg.src = fotolar[0];
    heroImg.onload = function () { heroImg.classList.add("loaded"); };
  }

  // --- Galeriyi doldur ---
  if (fotolar.length === 0) {
    if (empty) empty.style.display = "block";
    if (grid) grid.style.display = "none";
  } else {
    if (empty) empty.style.display = "none";
    fotolar.forEach(function (src, i) {
      const item = document.createElement("div");
      item.className = "gallery__item reveal";
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Kumsal fotoğraf " + (i + 1);
      img.loading = "lazy";
      item.appendChild(img);
      item.addEventListener("click", function () { openLightbox(i); });
      grid.appendChild(item);
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  let current = 0;

  function openLightbox(i) {
    current = i;
    lightboxImg.src = fotolar[current];
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function show(delta) {
    current = (current + delta + fotolar.length) % fotolar.length;
    lightboxImg.src = fotolar[current];
  }

  if (lightbox) {
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox__prev").addEventListener("click", function () { show(-1); });
    lightbox.querySelector(".lightbox__next").addEventListener("click", function () { show(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") show(-1);
      if (e.key === "ArrowRight") show(1);
    });
  }

  // --- Kaydırınca beliren animasyon ---
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal, .card, .timeline__item").forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });
})();
