/* Raitha Mitra — Pure JS interactions (no APIs, no backend) */

(() => {
  const LANG = window.RM_LANG;
  const DEFAULT_LANG = "en";

  const state = {
    lang: DEFAULT_LANG,
    category: "all",
    slideIndex: 0,
    slideTimer: null,
  };

  // ---------- Data (static / indicative only) ----------
  // Prices are sample "reference prices" in ₹ / Quintal (not live).
  const CATEGORIES = [
    { id: "all" },
    { id: "cereals", color: "#4af2a1" },
    { id: "oilseeds", color: "#ffc857" },
    { id: "cash", color: "#5ab3ff" },
    { id: "vegetables", color: "#ff7ad9" },
    { id: "pulses", color: "#ff5b7b" },
  ];

  const CROPS = [
    // Cereals (5)
    {
      id: "paddy",
      category: "cereals",
      name: { en: "Paddy", kn: "ಭತ್ತ" },
      price: { min: 2100, max: 2650 },
      hue: 140,
    },
    { id: "wheat", category: "cereals", name: { en: "Wheat", kn: "ಗೋಧಿ" }, price: { min: 2200, max: 2900 }, hue: 55 },
    { id: "maize", category: "cereals", name: { en: "Maize", kn: "ಮೆಕ್ಕೆಜೋಳ" }, price: { min: 1800, max: 2400 }, hue: 35 },
    { id: "ragi", category: "cereals", name: { en: "Ragi", kn: "ರಾಗಿ" }, price: { min: 2800, max: 3600 }, hue: 300 },
    { id: "jowar", category: "cereals", name: { en: "Jowar", kn: "ಜೋಳ" }, price: { min: 2400, max: 3100 }, hue: 25 },

    // Oilseeds (3)
    { id: "groundnut", category: "oilseeds", name: { en: "Groundnut", kn: "ಕಡಲೆಕಾಯಿ" }, price: { min: 5200, max: 6900 }, hue: 30 },
    { id: "soybean", category: "oilseeds", name: { en: "Soybean", kn: "ಸೋಯಾಬೀನ್" }, price: { min: 3800, max: 4800 }, hue: 85 },
    { id: "mustard", category: "oilseeds", name: { en: "Mustard", kn: "ಸಾಸಿವೆ" }, price: { min: 4200, max: 5600 }, hue: 45 },

    // Cash crops (2)
    { id: "cotton", category: "cash", name: { en: "Cotton", kn: "ಹತ್ತಿ" }, price: { min: 6200, max: 7600 }, hue: 200 },
    { id: "sugarcane", category: "cash", name: { en: "Sugarcane", kn: "ಕಬ್ಬು" }, price: { min: 280, max: 360 }, hue: 120 },

    // Vegetables (5)
    { id: "tomato", category: "vegetables", name: { en: "Tomato", kn: "ಟೊಮ್ಯಾಟೊ" }, price: { min: 1200, max: 2600 }, hue: 8 },
    { id: "onion", category: "vegetables", name: { en: "Onion", kn: "ಈರುಳ್ಳಿ" }, price: { min: 1600, max: 2800 }, hue: 28 },
    { id: "potato", category: "vegetables", name: { en: "Potato", kn: "ಆಲೂಗಡ್ಡೆ" }, price: { min: 1400, max: 2400 }, hue: 35 },
    { id: "green_chilli", category: "vegetables", name: { en: "Green Chilli", kn: "ಹಸಿಮೆಣಸು" }, price: { min: 4500, max: 9000 }, hue: 110 },
    { id: "brinjal", category: "vegetables", name: { en: "Brinjal", kn: "ಬದನೆಕಾಯಿ" }, price: { min: 1800, max: 3200 }, hue: 285 },

    // Pulses (3)
    { id: "tur", category: "pulses", name: { en: "Tur (Arhar)", kn: "ತೊಗರಿ" }, price: { min: 6200, max: 7800 }, hue: 12 },
    { id: "moong", category: "pulses", name: { en: "Moong", kn: "ಹೆಸರುಕಾಳು" }, price: { min: 6800, max: 8600 }, hue: 95 },
    { id: "chana", category: "pulses", name: { en: "Chana", kn: "ಕಡಲೆ" }, price: { min: 5200, max: 6600 }, hue: 55 },
  ];

  // Fertilizer MRP values are sample/indicative (not live).
  const FERTILIZERS = [
    {
      id: "urea",
      name: { en: "Urea", kn: "ಯೂರಿಯಾ" },
      mrp: "₹ 266.50",
      bag: "45 kg",
      usage: {
        en: "Nitrogen source. Apply as per soil test and crop stage.",
        kn: "ನೈಟ್ರೋಜನ್ ಮೂಲ. ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ/ಹಂತದಂತೆ ಬಳಸಿ.",
      },
      hue: 140,
    },
    {
      id: "dap",
      name: { en: "DAP", kn: "ಡಿಎಪಿ" },
      mrp: "₹ 1,350",
      bag: "50 kg",
      usage: {
        en: "Good for early root growth. Use during sowing/basal dose.",
        kn: "ಬೇರು ಬೆಳವಣಿಗೆಗೆ ಉತ್ತಮ. ಬಿತ್ತನೆ ವೇಳೆ/ಬೇಸಲ್ ಡೋಸ್‌ನಲ್ಲಿ ಬಳಸಿ.",
      },
      hue: 45,
    },
    {
      id: "mop",
      name: { en: "MOP (Potash)", kn: "ಎಮ್‌ಒಪಿ (ಪೊಟಾಶ್)" },
      mrp: "₹ 1,700",
      bag: "50 kg",
      usage: {
        en: "Improves fruit quality and disease resistance. Use as recommended.",
        kn: "ಹಣ್ಣು ಗುಣಮಟ್ಟ/ರೋಗ ನಿರೋಧ ಹೆಚ್ಚಿಸುತ್ತದೆ. ಸಲಹೆಯಂತೆ ಬಳಸಿ.",
      },
      hue: 210,
    },
    {
      id: "npk",
      name: { en: "NPK (Complex)", kn: "ಎನ್‌ಪಿಕೆ (ಕಾಂಪ್ಲೆಕ್ಸ್)" },
      mrp: "₹ 1,480",
      bag: "50 kg",
      usage: {
        en: "Balanced nutrients. Choose grade (e.g., 10-26-26) as per crop.",
        kn: "ಸಮತೋಲನ ಪೋಷಕಾಂಶ. ಬೆಳೆ/ಗ್ರೇಡ್ (ಉದಾ: 10-26-26) ಅನುಗುಣವಾಗಿ ಆಯ್ಕೆ ಮಾಡಿ.",
      },
      hue: 300,
    },
  ];

  const CATEGORY_LABELS = {
    cereals: { en: "Cereals", kn: "ಧಾನ್ಯಗಳು" },
    oilseeds: { en: "Oilseeds", kn: "ಎಣ್ಣೆಬೀಜಗಳು" },
    cash: { en: "Cash Crops", kn: "ವಾಣಿಜ್ಯ ಬೆಳೆಗಳು" },
    vegetables: { en: "Vegetables", kn: "ತರಕಾರಿಗಳು" },
    pulses: { en: "Pulses", kn: "ಬೇಳೆಕಾಳು" },
  };

  // ---------- Helpers ----------
  function $(sel) {
    return document.querySelector(sel);
  }
  function $all(sel) {
    return Array.from(document.querySelectorAll(sel));
  }

  function formatRange(min, max) {
    const inr = (n) => n.toLocaleString("en-IN");
    return `₹ ${inr(min)} – ${inr(max)}`;
  }

  function svgDataUrl({ title, hue = 140, subtitle = "" }) {
    const bg1 = `hsl(${hue} 80% 45%)`;
    const bg2 = `hsl(${(hue + 50) % 360} 85% 50%)`;
    const fg = "rgba(255,255,255,0.92)";
    const sub = "rgba(255,255,255,0.75)";
    const safeTitle = escapeXml(title);
    const safeSub = escapeXml(subtitle);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${bg1}"/>
            <stop offset="1" stop-color="${bg2}"/>
          </linearGradient>
          <radialGradient id="glow" cx="35%" cy="30%" r="70%">
            <stop offset="0" stop-color="rgba(255,255,255,0.35)"/>
            <stop offset="1" stop-color="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="180" height="180" rx="32" fill="url(#g)"/>
        <circle cx="60" cy="56" r="80" fill="url(#glow)"/>
        <path d="M28 128 C52 108, 78 150, 104 124 C126 103, 148 132, 164 116 L164 180 L28 180 Z" fill="rgba(0,0,0,0.15)"/>
        <text x="18" y="78" font-family="system-ui,Segoe UI,Arial" font-size="18" font-weight="900" fill="${fg}">${safeTitle}</text>
        <text x="18" y="102" font-family="system-ui,Segoe UI,Arial" font-size="12" font-weight="800" fill="${sub}">${safeSub}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function escapeXml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }

  function t(key) {
    return (LANG[state.lang] && LANG[state.lang][key]) || (LANG.en && LANG.en[key]) || key;
  }

  // ---------- Language system ----------
  function applyLanguage() {
    document.documentElement.lang = state.lang === "kn" ? "kn" : "en";

    $all("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    // update active button style
    $all(".lang-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === state.lang));

    // re-render dynamic content to reflect language
    renderCategoryFilters();
    renderCrops();
    renderFertilizers();
  }

  function bindLanguageToggle() {
    $all(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.lang = btn.dataset.lang === "kn" ? "kn" : "en";
        applyLanguage();
      });
    });
  }

  // ---------- Category filters ----------
  function renderCategoryFilters() {
    const wrap = $("#categoryFilters");
    if (!wrap) return;

    wrap.innerHTML = "";

    // Build chips
    const chips = [];

    chips.push({
      id: "all",
      label: t("filterAll"),
    });

    for (const c of CATEGORIES.filter((x) => x.id !== "all")) {
      chips.push({
        id: c.id,
        label: CATEGORY_LABELS[c.id][state.lang],
      });
    }

    for (const chip of chips) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `chip ${state.category === chip.id ? "is-active" : ""}`;
      btn.textContent = chip.label;
      btn.dataset.category = chip.id;
      btn.addEventListener("click", () => {
        state.category = chip.id;
        renderCategoryFilters();
        renderCrops();
      });
      wrap.appendChild(btn);
    }
  }

  // ---------- Crops ----------
  function renderCrops() {
    const grid = $("#cropGrid");
    if (!grid) return;

    const list = state.category === "all" ? CROPS : CROPS.filter((c) => c.category === state.category);
    grid.innerHTML = "";

    for (const crop of list) {
      const card = document.createElement("article");
      card.className = "card crop";

      const name = crop.name[state.lang];
      const otherName = crop.name[state.lang === "kn" ? "en" : "kn"];
      const categoryLabel = CATEGORY_LABELS[crop.category][state.lang];

      const imgUrl = svgDataUrl({
        title: name,
        subtitle: crop.name.kn, // show Kannada on the image for quick recognition
        hue: crop.hue,
      });

      card.innerHTML = `
        <div class="card-top">
          <div class="thumb" aria-hidden="true">
            <img src="${imgUrl}" alt="" />
          </div>
          <div>
            <h3 class="card-title">${escapeHtml(name)} <span style="opacity:.75;font-weight:850;">(${escapeHtml(otherName)})</span></h3>
            <p class="card-subtitle">${t("labelCategory")}: ${escapeHtml(categoryLabel)}</p>
          </div>
        </div>
        <div class="meta">
          <span class="pill accent">${t("labelRefPrice")}</span>
          <span class="pill warn">${formatRange(crop.price.min, crop.price.max)} ${t("labelPerQuintal")}</span>
        </div>
      `;

      grid.appendChild(card);
    }
  }

  // ---------- Fertilizers ----------
  function renderFertilizers() {
    const grid = $("#fertilizerGrid");
    if (!grid) return;

    grid.innerHTML = "";

    for (const fert of FERTILIZERS) {
      const card = document.createElement("article");
      card.className = "card fertilizer";

      const name = fert.name[state.lang];
      const otherName = fert.name[state.lang === "kn" ? "en" : "kn"];
      const usage = fert.usage[state.lang];
      const imgUrl = svgDataUrl({
        title: name,
        subtitle: fert.name.kn,
        hue: fert.hue,
      });

      card.innerHTML = `
        <div class="card-top">
          <div class="thumb" aria-hidden="true">
            <img src="${imgUrl}" alt="" />
          </div>
          <div>
            <h3 class="card-title">${escapeHtml(name)} <span style="opacity:.75;font-weight:850;">(${escapeHtml(otherName)})</span></h3>
            <p class="card-subtitle">${t("labelMrp")}: <strong>${escapeHtml(fert.mrp)}</strong></p>
          </div>
        </div>
        <div class="meta">
          <span class="pill accent">${t("labelBagSize")}: ${escapeHtml(fert.bag)}</span>
        </div>
        <p class="card-desc"><strong>${t("labelUsage")}:</strong> ${escapeHtml(usage)}</p>
      `;

      grid.appendChild(card);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // ---------- Slider ----------
  function setSlide(index) {
    const slides = $all(".slide");
    const dots = $all(".dot");
    if (!slides.length) return;

    state.slideIndex = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach((s, i) => s.classList.toggle("is-active", i === state.slideIndex));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === state.slideIndex));
  }

  function nextSlide() {
    setSlide(state.slideIndex + 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    state.slideTimer = window.setInterval(nextSlide, 4500);
  }

  function stopAutoSlide() {
    if (state.slideTimer) window.clearInterval(state.slideTimer);
    state.slideTimer = null;
  }

  function bindSliderDots() {
    $all(".dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.dot || "0");
        setSlide(idx);
        startAutoSlide();
      });
    });

    // pause on hover for better readability
    const hero = $(".hero-slider");
    if (hero) {
      hero.addEventListener("mouseenter", stopAutoSlide);
      hero.addEventListener("mouseleave", startAutoSlide);
      hero.addEventListener("focusin", stopAutoSlide);
      hero.addEventListener("focusout", startAutoSlide);
    }
  }

  // ---------- Reveal on scroll ----------
  function setupReveal() {
    const els = $all(".reveal");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
  }

  // ---------- Init ----------
  function init() {
    bindLanguageToggle();
    renderCategoryFilters();
    renderCrops();
    renderFertilizers();
    applyLanguage();

    setupReveal();
    bindSliderDots();
    setSlide(0);
    startAutoSlide();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

