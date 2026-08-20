(function () {
  var drawer = document.getElementById("site-drawer");
  var overlay = document.querySelector(".drawer-overlay");
  var openButton = document.querySelector("[data-open-drawer]");
  var closeButtons = document.querySelectorAll("[data-close-drawer]");
  var grid = document.getElementById("product-grid");
  var hero = document.getElementById("home-hero");
  var titleEl = document.getElementById("catalogue-title");
  var noteEl = document.getElementById("catalogue-note");
  var searchForm = document.getElementById("search-form");
  var searchInput = document.getElementById("search-input");
  var viewHome = document.getElementById("view-home");
  var viewDetail = document.getElementById("view-detail");
  var viewAbout = document.getElementById("view-about");
  var viewContact = document.getElementById("view-contact");
  var products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  var whatsapp = (window.STORE && window.STORE.whatsapp) || "923001234567";
  var whatsappUrl = "https://wa.me/" + whatsapp;

  var FILTERS = {
    new: { title: "New Collection", note: "Items marked as new." },
    sale: { title: "Sale", note: "Items marked on sale." },
    women: { title: "Women", note: "Category: Women." },
    unstitched: { title: "Unstitched", note: "Category: Unstitched." },
    stitched: { title: "Stitched", note: "Category: Stitched." },
    accessories: { title: "Accessories", note: "Category: Accessories." }
  };

  function setDrawer(open) {
    if (!drawer || !overlay || !openButton) {
      return;
    }

    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    overlay.hidden = !open;
    openButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("drawer-open", open);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatPrice(amount) {
    if (amount === null || amount === undefined) {
      return "";
    }
    return "Rs " + Number(amount).toLocaleString("en-PK");
  }

  function stockLabel(status) {
    if (status === "low-stock") {
      return "Low stock";
    }
    if (status === "sold-out") {
      return "Sold out";
    }
    return "In stock";
  }

  function parseRoute() {
    var raw = (window.location.hash || "#home").replace(/^#/, "");
    if (!raw || raw === "products") {
      raw = "home";
    }

    if (raw.indexOf("product/") === 0) {
      return { type: "product", id: decodeURIComponent(raw.slice("product/".length)) };
    }

    if (raw.indexOf("q/") === 0) {
      return { type: "search", query: decodeURIComponent(raw.slice(2)) };
    }

    if (FILTERS[raw]) {
      return { type: "filter", key: raw };
    }

    if (raw === "about") {
      return { type: "about" };
    }

    if (raw === "contact") {
      return { type: "contact" };
    }

    return { type: "home" };
  }

  function filterProducts(route) {
    if (route.type === "filter") {
      if (route.key === "new") {
        return products.filter(function (item) {
          return item.isNew === true;
        });
      }
      if (route.key === "sale") {
        return products.filter(function (item) {
          return item.isSale === true;
        });
      }
      var categoryMap = {
        women: "Women",
        unstitched: "Unstitched",
        stitched: "Stitched",
        accessories: "Accessories"
      };
      var category = categoryMap[route.key];
      return products.filter(function (item) {
        return item.category === category;
      });
    }

    if (route.type === "search") {
      var query = route.query.trim().toLowerCase();
      if (!query) {
        return products.slice();
      }
      return products.filter(function (item) {
        return (
          String(item.id).toLowerCase().indexOf(query) !== -1 ||
          String(item.name).toLowerCase().indexOf(query) !== -1 ||
          String(item.category).toLowerCase().indexOf(query) !== -1 ||
          String(item.description).toLowerCase().indexOf(query) !== -1
        );
      });
    }

    return products.slice();
  }

  function productCardHtml(product) {
    var badges = "";
    if (product.isNew) {
      badges += '<span class="badge badge--new">New</span>';
    }
    if (product.isSale) {
      badges += '<span class="badge badge--sale">Sale</span>';
    }

    var oldPrice = product.oldPrice
      ? '<span class="price__old">' + formatPrice(product.oldPrice) + "</span>"
      : "";

    return (
      '<a class="product-card" href="#product/' +
      encodeURIComponent(product.id) +
      '">' +
      '<div class="product-card__media">' +
      '<img src="' +
      escapeHtml(product.image) +
      '" alt="' +
      escapeHtml(product.name) +
      '">' +
      (badges ? '<div class="product-card__badges">' + badges + "</div>" : "") +
      "</div>" +
      '<div class="product-card__body">' +
      '<p class="product-card__category">' +
      escapeHtml(product.category) +
      "</p>" +
      "<h3>" +
      escapeHtml(product.name) +
      "</h3>" +
      '<p class="product-card__desc">' +
      escapeHtml(product.description) +
      "</p>" +
      '<div class="product-card__meta">' +
      '<p class="price">' +
      '<span class="price__now">' +
      formatPrice(product.price) +
      "</span>" +
      oldPrice +
      "</p>" +
      '<p class="stock stock--' +
      escapeHtml(product.stockStatus) +
      '">' +
      stockLabel(product.stockStatus) +
      "</p>" +
      "</div>" +
      "</div>" +
      "</a>"
    );
  }

  function renderGrid(list) {
    if (!grid) {
      return;
    }

    if (!list.length) {
      grid.innerHTML = '<p class="empty">No products match this view.</p>';
      return;
    }

    grid.innerHTML = list.map(productCardHtml).join("");
  }

  function renderDetail(id) {
    var product = products.filter(function (item) {
      return item.id === id;
    })[0];

    if (!viewDetail) {
      return;
    }

    if (!product) {
      viewDetail.innerHTML =
        '<p class="empty">This product was not found.</p><p><a class="button" href="#home">Back to catalogue</a></p>';
      return;
    }

    var oldPrice = product.oldPrice
      ? '<span class="price__old">' + formatPrice(product.oldPrice) + "</span>"
      : "";
    var saleMark = product.isSale ? '<span class="badge badge--sale">Sale</span>' : "";
    var newMark = product.isNew ? '<span class="badge badge--new">New</span>' : "";

    viewDetail.innerHTML =
      '<a class="back-link" href="#home">Back to catalogue</a>' +
      '<article class="detail">' +
      '<div class="detail__media"><img src="' +
      escapeHtml(product.image) +
      '" alt="' +
      escapeHtml(product.name) +
      '"></div>' +
      '<div class="detail__body">' +
      '<p class="product-card__category">' +
      escapeHtml(product.category) +
      "</p>" +
      "<h1>" +
      escapeHtml(product.name) +
      "</h1>" +
      '<div class="product-card__badges detail__badges">' +
      newMark +
      saleMark +
      "</div>" +
      '<p class="price">' +
      '<span class="price__now">' +
      formatPrice(product.price) +
      "</span>" +
      oldPrice +
      "</p>" +
      '<p class="stock stock--' +
      escapeHtml(product.stockStatus) +
      '">' +
      stockLabel(product.stockStatus) +
      "</p>" +
      '<p class="detail__id">Product ID: ' +
      escapeHtml(product.id) +
      "</p>" +
      "<p>" +
      escapeHtml(product.description) +
      "</p>" +
      "</div></article>";
  }

  function showView(name) {
    if (viewHome) {
      viewHome.hidden = name !== "home";
    }
    if (viewDetail) {
      viewDetail.hidden = name !== "detail";
    }
    if (viewAbout) {
      viewAbout.hidden = name !== "about";
    }
    if (viewContact) {
      viewContact.hidden = name !== "contact";
    }
  }

  function setActiveNav(route) {
    if (!drawer) {
      return;
    }

    var activeHref = "#home";
    if (route.type === "filter") {
      activeHref = "#" + route.key;
    } else if (route.type === "about") {
      activeHref = "#about";
    } else if (route.type === "contact") {
      activeHref = "#contact";
    }

    drawer.querySelectorAll(".drawer__nav a").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === activeHref);
    });
  }

  function applyRoute() {
    var route = parseRoute();
    setActiveNav(route);

    if (route.type === "product") {
      showView("detail");
      renderDetail(route.id);
      window.scrollTo(0, 0);
      return;
    }

    if (route.type === "about") {
      showView("about");
      window.scrollTo(0, 0);
      return;
    }

    if (route.type === "contact") {
      showView("contact");
      window.scrollTo(0, 0);
      return;
    }

    showView("home");

    if (hero) {
      hero.hidden = route.type !== "home";
    }

    if (titleEl && noteEl) {
      if (route.type === "filter") {
        titleEl.textContent = FILTERS[route.key].title;
        noteEl.textContent = FILTERS[route.key].note;
      } else if (route.type === "search") {
        titleEl.textContent = "Search";
        noteEl.textContent = route.query
          ? 'Results for "' + route.query + '".'
          : "Type a name, category, or product ID.";
      } else {
        titleEl.textContent = "Catalogue";
        noteEl.textContent = "Sample stock for layout. Replace these items with your real lots.";
      }
    }

    if (searchInput) {
      searchInput.value = route.type === "search" ? route.query : "";
    }

    renderGrid(filterProducts(route));

    if (route.type === "home" && (window.location.hash || "") === "#products") {
      var productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView();
      }
    }
  }

  function setWhatsAppLinks() {
    var links = document.querySelectorAll("#whatsapp-link, #contact-whatsapp");
    links.forEach(function (link) {
      link.setAttribute("href", whatsappUrl);
    });
  }

  if (openButton) {
    openButton.addEventListener("click", function () {
      setDrawer(true);
    });
  }

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setDrawer(false);
    });
  });

  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawer(false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setDrawer(false);
    }
  });

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = searchInput ? searchInput.value.trim() : "";
      window.location.hash = query ? "q/" + encodeURIComponent(query) : "home";
    });
  }

  window.addEventListener("hashchange", applyRoute);

  setWhatsAppLinks();
  applyRoute();
})();
