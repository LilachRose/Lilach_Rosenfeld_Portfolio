(function () {
  const data = window.portfolioData;
  const root = document.documentElement;

  Object.entries(data.settings.colors).forEach(([name, value]) => {
    root.style.setProperty(`--${name}`, value);
  });

  document.title = data.settings.siteTitle;

  const nav = document.getElementById("site-nav");
  nav.innerHTML = data.settings.nav
    .map((label) => {
      const section = data.sections.find((item) => item.label === label);
      if (!section) return "";
      if (section.type === "contentHub") {
        const sublinks = section.blocks
          .map((block) => `<a href="#${block.id}">${block.title}</a>`)
          .join("");
        return `
          <div class="nav-group">
            <a href="#${section.id}">${label}</a>
            <div class="nav-submenu">
              ${sublinks}
              <a href="#social-media">Social Media</a>
            </div>
          </div>
        `;
      }
      return `<a href="#${section.id}">${label}</a>`;
    })
    .join("");

  const menuToggle = document.querySelector(".menu-toggle");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });

  document.querySelector(".hero").innerHTML = `
    <div class="hero-copy">
      <p class="section-label">${data.hero.subtitle}</p>
      <h1>${lineBreakTitle(data.hero.title)}</h1>
      ${data.hero.tagline ? `<p class="hero-tagline">${data.hero.tagline}</p>` : ""}
    </div>
    <figure class="hero-media">
      <img src="${data.hero.image}" alt="${data.hero.imageAlt}">
    </figure>
  `;

  const sectionRoot = document.getElementById("sections");
  const galleryItems = [];
  const orderedSections = data.settings.nav
    .map((label) => data.sections.find((section) => section.label === label))
    .filter(Boolean);
  sectionRoot.innerHTML = orderedSections.map(renderSection).join("");

  function renderSection(section) {
    const header = `
      <div class="section-heading">
        <p class="section-label">${section.label}</p>
        ${section.intro ? `<p class="intro">${section.intro}</p>` : ""}
      </div>
    `;

    const body = {
      skills: renderSkills,
      logos: renderLogos,
      cards: renderCards,
      brandBlocks: renderBrandBlocks,
      feature: renderFeature,
      gallery: renderGallery,
      showcase: renderShowcase,
      integrated: renderIntegrated,
      contentHub: renderContentHub,
      events: renderEvents,
      contact: renderContact
    }[section.type](section);

    return `<section id="${section.id}" class="section-page section-${section.type}">${header}${body}</section>`;
  }

  function renderSkills(section) {
    return `
      <div class="skills-layout">
        <div class="skill-list">
          ${section.skills
            .map(
              (skill) => `
                <article class="skill-row">
                  <h3>${skill.title}</h3>
                  <div class="skill-tags">
                    ${skill.items.map((item) => `<span>${item}</span>`).join("")}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderLogos(section) {
    return `
      <div class="project-logo-grid" aria-label="Selected project logos">
        ${section.logos
          .map(
            (logo) => logo.videoEmbed
              ? `
              <div class="link-card">
              <button class="project-logo video-trigger" type="button" data-video="${attr(logo.videoEmbed)}" data-link="${attr(logo.link)}" data-title="${attr(logo.alt)}" aria-label="Watch ${attr(logo.alt)}">
                <img src="${logo.image}" alt="${logo.alt}" loading="lazy">
              </button>
              ${printLink(logo.link, logo.alt)}
              </div>
            `
              : `
              <div class="link-card">
              <button class="project-logo page-trigger" type="button" data-url="${attr(logo.link)}" data-embed-url="${attr(logo.openAsPage ? logo.link : logo.embedUrl || logo.link)}" data-title="${attr(logo.alt)}" aria-label="Open ${attr(logo.alt)}">
                <img src="${logo.image}" alt="${logo.alt}" loading="lazy">
              </button>
              ${printLink(logo.link, logo.alt)}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderCards(section) {
    return `
      <div class="article-grid">
        ${section.items
          .map(
            (item) => `
              <div class="link-card">
              <button class="article-card page-trigger" type="button" data-url="${attr(item.link)}" data-embed-url="${attr(item.embedUrl || item.link)}" data-title="${attr(item.title)}" aria-label="Open ${attr(item.title)}">
                <img src="${item.image}" alt="${item.brand}" loading="lazy">
                <h3 ${item.title.match(/[\u0590-\u05ff]/) ? 'dir="rtl"' : ""}>${textWithBreaks(item.title)}</h3>
              </button>
              ${printLink(item.link, item.title)}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderBrandBlocks(section) {
    return `
      <div class="brand-blocks">
        ${section.items
          .map(
            (item, index) => `
              <div class="link-card">
              <button class="brand-block block-${index + 1} page-trigger" type="button" data-url="${attr(item.link)}" data-embed-url="${attr(item.embedUrl || item.link)}" data-title="${attr(item.title)}" aria-label="Open ${attr(item.title)}">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
              </button>
              ${printLink(item.link, item.title)}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderFeature(section) {
    const media = `
      <img src="${section.image}" alt="${section.imageAlt}" loading="lazy">
      <span class="play-button" aria-hidden="true"></span>
    `;

    if (section.videoEmbed) {
      return `
        <div class="feature-layout">
          <button class="feature-media video-trigger" type="button" data-video="${attr(section.videoEmbed)}" data-link="${attr(section.link)}" data-title="${attr(section.cta)}" aria-label="${attr(section.cta)}">
            ${media}
          </button>
          ${printLink(section.link, section.cta)}
        </div>
      `;
    }

    return `
      <div class="feature-layout">
        <button class="feature-media page-trigger" type="button" data-url="${attr(section.link)}" data-embed-url="${attr(section.embedUrl || section.link)}" data-title="${attr(section.cta)}" aria-label="${attr(section.cta)}">
          ${media}
        </button>
        ${printLink(section.link, section.cta)}
      </div>
    `;
  }

  function renderGallery(section) {
    return `
      <div class="gallery-grid">
        ${section.items
          .map(
            (item) => `
              <article class="gallery-item">
                <div class="item-title">
                  ${item.number ? `<span>${item.number}</span>` : ""}
                  <h3>${textWithBreaks(item.title)}</h3>
                </div>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderShowcase(section) {
    return `
      <div class="showcase-grid">
        ${section.items
          .map(
            (item, index) => `
              <article class="showcase-item showcase-${index + 1}">
                <div class="item-title">
                  ${item.number ? `<span>${item.number}</span>` : ""}
                  <h3>${textWithBreaks(item.title)}</h3>
                </div>
                ${item.link ? linkedSample(item) : focusableImage(item, section.label)}
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderContentHub(section) {
    return `
      <div class="content-hub">
        ${section.blocks.map((block) => renderContentBlock(block)).join("")}
      </div>
    `;
  }

  function renderContentBlock(block) {
    return `
      <article id="${block.id}" class="content-block content-block-${block.type}">
        <div class="content-block-heading">
          <h2>${block.title}</h2>
          ${block.intro ? `<p class="intro">${block.intro}</p>` : ""}
        </div>
        ${
          {
            cards: renderCards,
            showcase: renderShowcase,
            integrated: renderIntegrated,
            feature: renderFeature
          }[block.type](block)
        }
      </article>
    `;
  }

  function renderIntegrated(section) {
    return `
      <div class="integrated-stack copywriting-stack">
        ${section.groups
          .map(
            (group) => `
              <article ${group.id ? `id="${group.id}"` : ""} class="integrated-group copy-section" aria-label="${group.title}">
                <div class="copy-title">
                  ${group.title ? `<h3>${group.title}</h3>` : ""}
                </div>
                <div class="gallery-grid compact-gallery copy-grid three">
                  ${group.items
                    .map(
                      (item) => `
                        ${item.storyTitle ? `<div class="item-title story-break"><h4>${textWithBreaks(item.storyTitle)}</h4></div>` : ""}
                        <article class="gallery-item">
                          ${item.title ? `<div class="item-title">${item.number ? `<span>${item.number}</span>` : ""}<h4>${textWithBreaks(item.title)}</h4></div>` : ""}
                          ${item.link ? linkedSample(item) : focusableImage(item, group.category || group.title || section.label)}
                          ${item.link ? printLink(item.link, item.title || "Open link") : ""}
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderEvents(section) {
    return `
      <div class="event-grid">
        ${section.items
          .map(
            (item) => renderEventItem(item)
          )
          .join("")}
      </div>
    `;
  }

  function renderEventItem(item) {
    const content = `
      ${renderEventImages(item)}
      <h3>${textWithBreaks(item.title)}</h3>
    `;

    if (item.videoEmbed) {
      return `
        <div class="link-card">
        <button class="event-item video-trigger" type="button" data-video="${attr(item.videoEmbed)}" data-link="${attr(item.link)}" data-title="${attr(item.title)}" aria-label="Watch ${attr(item.title)}">
          ${content}
        </button>
        ${printLink(item.link, item.title)}
        </div>
      `;
    }

    return `
      <div class="link-card">
      <button class="event-item page-trigger" type="button" data-url="${attr(item.link || "#events")}" data-embed-url="${attr(item.embedUrl || item.link || "#events")}" data-title="${attr(item.title)}" aria-label="Open ${attr(item.title)}">
        ${content}
      </button>
      ${item.link ? printLink(item.link, item.title) : ""}
      </div>
    `;
  }

  function renderEventImages(item) {
    if (item.images) {
      return `
        <div class="event-collage">
          ${item.images.map((image) => `<img src="${image}" alt="${item.title}" loading="lazy">`).join("")}
        </div>
      `;
    }
    return `<img src="${item.image}" alt="${item.title}" loading="lazy">`;
  }

  function clickableImage(item) {
    const image = `<img src="${item.image}" alt="${item.title}" loading="lazy">`;
    return item.link ? `<a href="${item.link}" target="_blank" rel="noopener">${image}</a>` : image;
  }

  function focusableImage(item) {
    const index = galleryItems.length;
    galleryItems.push({
      image: item.image,
      title: item.title || "Portfolio sample",
      category: arguments[1] || "Portfolio sample",
      size: item.size || ""
    });
    const classes = ["focus-image"];
    if (item.fit === "coverTop") classes.push("fit-cover-top");
    if (item.fit === "contain") classes.push("fit-contain");
    if (item.fit === "natural") classes.push("fit-natural");
    if (item.fit === "fill") classes.push("fit-fill");
    if (item.fit === "backdrop") classes.push("fit-backdrop");
    if (item.fit === "pdfBackdrop") classes.push("fit-pdf-backdrop");
    if (item.fit === "siteBackdropContain") classes.push("fit-site-backdrop-contain");
    if (item.fit === "maternityCover") classes.push("fit-maternity-cover");
    if (item.size === "large") classes.push("needs-large-view");

    return `
      <button class="${classes.join(" ")}" type="button" data-index="${index}" data-full="${attr(item.image)}" data-title="${attr(item.title || "Portfolio sample")}" aria-label="Enlarge ${attr(item.title || "portfolio sample")}">
        <span class="sample-backdrop" style="background-image: url('${attr(item.image)}');" aria-hidden="true"></span>
        <img src="${item.image}" alt="${attr(item.title || "Portfolio sample")}" loading="lazy">
      </button>
    `;
  }

  function linkedSample(item) {
    const classes = ["linked-sample", "page-trigger"];
    if (item.fit === "coverTop") classes.push("fit-cover-top");
    if (item.fit === "coverCenter") classes.push("fit-cover-center");
    if (item.fit === "socialLinkCover") classes.push("fit-social-link-cover");
    return `
      <button class="${classes.join(" ")}" type="button" data-url="${attr(item.link)}" data-embed-url="${attr(item.embedUrl || item.link)}" data-title="${attr(item.title)}" aria-label="Open ${attr(item.title)}">
        <img src="${item.image}" alt="${attr(item.title || "Portfolio sample")}" loading="lazy">
      </button>
    `;
  }

  function renderContact(section) {
    const emailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(section.email)}`;
    const phoneHref = `tel:${section.phone.replace(/[^\d+]/g, "")}`;
    return `
      <div class="contact-layout">
        <div class="contact-card">
          <div class="contact-links">
            <a class="contact-link contact-email" href="${emailHref}" aria-label="Email Lilach at ${section.email}">
              <span class="contact-label">E-mail</span>
              <span class="contact-value">${section.email}</span>
            </a>
            <a class="contact-link contact-phone" href="${phoneHref}" aria-label="Call Lilach at ${section.phone}">
              <span class="contact-label">Phone</span>
              <span class="contact-value">${section.phone}</span>
            </a>
          </div>
        </div>
        <img src="${section.image}" alt="${section.imageAlt}" loading="lazy">
      </div>
    `;
  }

  function lineBreakTitle(title) {
    return title
      .split(" ")
      .map((word) => `<span>${word}</span>`)
      .join("");
  }

  function attr(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function textWithBreaks(value) {
    return attr(value).replaceAll("\n", "<br>");
  }

  function printLink(url, label = "Open link") {
    if (!url) return "";
    return `<a class="print-link" href="${attr(url)}" aria-label="${attr(label)}"></a>`;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close enlarged image">Close</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <figure>
      <aside class="lightbox-meta">
        <p class="lightbox-category"></p>
        <figcaption></figcaption>
      </aside>
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">
    </figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">›</button>
  `;
  document.body.appendChild(lightbox);
  let activeGalleryIndex = 0;
  let mobileOverlayStateActive = false;
  let closingOverlayFromUi = false;

  document.addEventListener("click", (event) => {
    const contactTrigger = event.target.closest(".contact-link");
    if (contactTrigger) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openInNewTab(contactTrigger.href);
      return;
    }

    const trigger = event.target.closest(".focus-image");
    if (!trigger) return;
    activeGalleryIndex = Number(trigger.dataset.index || 0);
    updateLightbox();
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    pushMobileOverlayState();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.closest(".lightbox-close")) {
      closeOverlayFromUi(closeImageLightbox);
      return;
    }

    if (event.target.closest(".lightbox-prev")) {
      moveGallery(-1);
    }

    if (event.target.closest(".lightbox-next")) {
      moveGallery(1);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOverlayFromUi(closeAnyOverlay);
    }

    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "ArrowLeft") moveGallery(-1);
    if (event.key === "ArrowRight") moveGallery(1);
  });

  function moveGallery(direction) {
    activeGalleryIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  function updateLightbox() {
    const item = galleryItems[activeGalleryIndex];
    if (!item) return;
    const image = lightbox.querySelector("img");
    const caption = lightbox.querySelector("figcaption");
    const category = lightbox.querySelector(".lightbox-category");
    image.src = item.image;
    image.alt = item.title;
    image.classList.toggle("is-large-sample", item.size === "large");
    category.textContent = item.category;
    caption.textContent = "";
  }

  function closeImageLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
  }

  const videoLightbox = document.createElement("div");
  videoLightbox.className = "video-lightbox";
  videoLightbox.innerHTML = `
    <div class="video-frame" role="dialog" aria-modal="true" aria-label="Portfolio video">
      <button class="video-close" type="button" aria-label="Close video">Close</button>
      <iframe title="Portfolio video" src="" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      <a class="video-fallback" href="#" target="_blank" rel="noopener">Open on YouTube</a>
    </div>
  `;
  document.body.appendChild(videoLightbox);

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".video-trigger");
    if (!trigger) return;
    const iframe = videoLightbox.querySelector("iframe");
    const fallback = videoLightbox.querySelector(".video-fallback");
    const source = trigger.dataset.video;
    const separator = source.includes("?") ? "&" : "?";
    iframe.src = `${source}${separator}autoplay=1&rel=0`;
    iframe.title = trigger.dataset.title || "Portfolio video";
    fallback.href = trigger.dataset.link || source;
    videoLightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    pushMobileOverlayState();
  });

  videoLightbox.addEventListener("click", (event) => {
    if (event.target === videoLightbox || event.target.closest(".video-close")) {
      closeOverlayFromUi(closeVideo);
    }
  });

  function closeVideo() {
    if (!videoLightbox) return;
    videoLightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    const iframe = videoLightbox.querySelector("iframe");
    if (iframe) iframe.src = "";
  }

  const pageLightbox = document.createElement("div");
  pageLightbox.className = "page-lightbox";
  pageLightbox.innerHTML = `
    <div class="page-frame" role="dialog" aria-modal="true" aria-label="Portfolio link preview">
      <div class="page-bar">
        <strong></strong>
        <div>
          <a class="page-fallback" href="#" target="_blank" rel="noopener">Open in new tab</a>
          <button class="page-close" type="button" aria-label="Close preview">Close</button>
        </div>
      </div>
      <iframe title="Portfolio link preview" src="" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
  `;
  document.body.appendChild(pageLightbox);

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".page-trigger");
    if (!trigger) return;
    const url = trigger.dataset.url;
    const embedUrl = trigger.dataset.embedUrl || url;
    if (!url || url.startsWith("#")) return;
    const iframe = pageLightbox.querySelector("iframe");
    const title = pageLightbox.querySelector("strong");
    const fallback = pageLightbox.querySelector(".page-fallback");
    iframe.onerror = () => fallbackToExternal(closePagePreview, url);
    title.textContent = trigger.dataset.title || "Portfolio link";
    iframe.src = embedUrl;
    fallback.href = url;
    pageLightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    pushMobileOverlayState();
    window.setTimeout(() => {
      if (!pageLightbox.classList.contains("is-open")) return;
      if (!shouldExternalFallbackAfterAttempt(url)) return;
      fallbackToExternal(closePagePreview, url);
    }, 900);
  });

  pageLightbox.addEventListener("click", (event) => {
    if (event.target === pageLightbox || event.target.closest(".page-close")) {
      closeOverlayFromUi(closePagePreview);
    }
  });

  function closePagePreview() {
    if (!pageLightbox) return;
    pageLightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    const iframe = pageLightbox.querySelector("iframe");
    if (iframe) iframe.src = "";
  }

  function openInNewTab(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener");
  }

  function fallbackToExternal(closeFn, url) {
    if (!url) return;
    if (isMobileViewport() && mobileOverlayStateActive) {
      closingOverlayFromUi = true;
      closeFn();
      mobileOverlayStateActive = false;
      history.back();
      window.setTimeout(() => openInNewTab(url), 80);
      return;
    }
    closeFn();
    openInNewTab(url);
  }

  function shouldExternalFallbackAfterAttempt(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");
      return (
        host === "provacan.co.uk" && parsed.pathname.includes("/blogs/cbd-academy/cbd-for-sleep")
      ) || (
        host === "ynet.co.il" && parsed.pathname.includes("/articles/")
      ) || (
        host === "magazine.shufersal.co.il"
      );
    } catch {
      return false;
    }
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function isAnyOverlayOpen() {
    return (
      lightbox.classList.contains("is-open") ||
      videoLightbox.classList.contains("is-open") ||
      pageLightbox.classList.contains("is-open")
    );
  }

  function pushMobileOverlayState() {
    if (!isMobileViewport() || mobileOverlayStateActive) return;
    history.pushState({ portfolioOverlay: true }, "");
    mobileOverlayStateActive = true;
  }

  function closeOverlayFromUi(closeFn) {
    if (isMobileViewport() && mobileOverlayStateActive) {
      closingOverlayFromUi = true;
      closeFn();
      mobileOverlayStateActive = false;
      history.back();
      return;
    }
    closeFn();
  }

  function closeAnyOverlay() {
    closeImageLightbox();
    closeVideo();
    closePagePreview();
  }

  window.addEventListener("popstate", () => {
    if (closingOverlayFromUi) {
      closingOverlayFromUi = false;
      return;
    }
    if (!isMobileViewport() || !isAnyOverlayOpen()) return;
    closeAnyOverlay();
    mobileOverlayStateActive = false;
  });

})();
