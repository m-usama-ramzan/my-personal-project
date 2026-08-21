(function () {
  var CART_KEY = "bl-cart";
  var CITIES = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Gujranwala",
    "Sialkot",
    "Hyderabad",
    "Bahawalpur",
    "Sargodha",
    "Abbottabad",
    "Rahim Yar Khan",
    "Other"
  ];

  function store() {
    return window.STORE || {};
  }

  function products() {
    return Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  }

  function findProduct(id) {
    return products().filter(function (item) {
      return item.id === id;
    })[0];
  }

  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
    renderCartDrawer();
  }

  function money(amount) {
    return "Rs " + Number(amount).toLocaleString("en-PK");
  }

  function lineItems() {
    return readCart()
      .map(function (row) {
        var product = findProduct(row.id);
        if (!product) {
          return null;
        }
        return {
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image,
          qty: Number(row.qty) || 1
        };
      })
      .filter(Boolean);
  }

  function totals() {
    var items = lineItems();
    var subtotal = items.reduce(function (sum, item) {
      return sum + item.price * item.qty;
    }, 0);
    var shipping = items.length ? Number(store().shippingFee) || 0 : 0;
    var tax = Math.round(subtotal * (Number(store().taxRate) || 0.04));
    return {
      items: items,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: subtotal + shipping + tax
    };
  }

  function cartCount() {
    return readCart().reduce(function (sum, row) {
      return sum + (Number(row.qty) || 0);
    }, 0);
  }

  function updateCartCount() {
    var count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }

  function addToCart(id) {
    var product = findProduct(id);
    if (!product || product.stockStatus === "sold-out") {
      return;
    }
    var items = readCart();
    var found = false;
    items = items.map(function (row) {
      if (row.id === id) {
        found = true;
        row.qty = (Number(row.qty) || 1) + 1;
      }
      return row;
    });
    if (!found) {
      items.push({ id: id, qty: 1 });
    }
    writeCart(items);
    openCart(true);
  }

  function setQty(id, qty) {
    qty = Number(qty) || 0;
    var items = readCart().filter(function (row) {
      if (row.id !== id) {
        return true;
      }
      return qty > 0;
    }).map(function (row) {
      if (row.id === id) {
        row.qty = qty;
      }
      return row;
    });
    writeCart(items);
    renderCheckoutSummary();
  }

  function openCart(open) {
    var drawer = document.getElementById("cart-drawer");
    var overlay = document.querySelector(".cart-overlay");
    if (!drawer || !overlay) {
      return;
    }
    drawer.classList.toggle("is-open", open);
    overlay.hidden = !open;
    document.body.classList.toggle("cart-open", open);
  }

  function renderCartDrawer() {
    var mount = document.getElementById("cart-drawer-body");
    if (!mount) {
      return;
    }
    var bill = totals();
    if (!bill.items.length) {
      mount.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      return;
    }
    mount.innerHTML =
      bill.items
        .map(function (item) {
          return (
            '<article class="cart-line">' +
            '<img src="' +
            item.image +
            '" alt="">' +
            "<div>" +
            "<h3>" +
            item.name +
            "</h3>" +
            "<p>" +
            money(item.price) +
            "</p>" +
            '<div class="qty">' +
            '<button type="button" data-qty="' +
            item.id +
            '" data-delta="-1">−</button>' +
            "<span>" +
            item.qty +
            "</span>" +
            '<button type="button" data-qty="' +
            item.id +
            '" data-delta="1">+</button>' +
            "</div></div>" +
            "<strong>" +
            money(item.price * item.qty) +
            "</strong></article>"
          );
        })
        .join("") +
      '<div class="cart-sub">' +
      "<p>Subtotal <span>" +
      money(bill.subtotal) +
      "</span></p>" +
      "<p>Shipping and 4% tax are added at checkout.</p>" +
      '<a class="button" href="checkout.html">Check out</a>' +
      "</div>";
  }

  function ensureCartDrawer() {
    if (document.getElementById("cart-drawer")) {
      return;
    }
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="cart-overlay" hidden></div>' +
      '<aside id="cart-drawer" class="cart-drawer" aria-label="Cart">' +
      '<div class="cart-drawer__head"><h2>Cart</h2>' +
      '<button type="button" class="icon-button" data-close-cart aria-label="Close cart">&times;</button></div>' +
      '<div id="cart-drawer-body" class="cart-drawer__body"></div></aside>';
    while (wrap.firstChild) {
      document.body.appendChild(wrap.firstChild);
    }
  }

  function bindCartUi() {
    ensureCartDrawer();
    updateCartCount();
    renderCartDrawer();

    document.addEventListener("click", function (event) {
      var add = event.target.closest("[data-add-cart]");
      if (add) {
        event.preventDefault();
        addToCart(add.getAttribute("data-add-cart"));
        return;
      }
      if (event.target.closest("[data-open-cart]")) {
        event.preventDefault();
        openCart(true);
        return;
      }
      if (event.target.closest("[data-close-cart]") || event.target.classList.contains("cart-overlay")) {
        openCart(false);
        return;
      }
      var qtyBtn = event.target.closest("[data-qty]");
      if (qtyBtn) {
        var id = qtyBtn.getAttribute("data-qty");
        var row = readCart().filter(function (item) {
          return item.id === id;
        })[0];
        var next = (row ? Number(row.qty) : 1) + Number(qtyBtn.getAttribute("data-delta"));
        setQty(id, next);
      }
    });
  }

  function fillCities(select) {
    if (!select) {
      return;
    }
    select.innerHTML =
      '<option value="">Select city</option>' +
      CITIES.map(function (city) {
        return "<option>" + city + "</option>";
      }).join("");
  }

  function summaryHtml(bill) {
    return (
      bill.items
        .map(function (item) {
          return (
            '<div class="summary-line">' +
            '<img src="' +
            item.image +
            '" alt="">' +
            "<div><p>" +
            item.name +
            "</p><span>× " +
            item.qty +
            "</span></div>" +
            "<strong>" +
            money(item.price * item.qty) +
            "</strong></div>"
          );
        })
        .join("") +
      '<dl class="bill">' +
      "<div><dt>Subtotal</dt><dd>" +
      money(bill.subtotal) +
      "</dd></div>" +
      "<div><dt>Shipping</dt><dd>" +
      money(bill.shipping) +
      "</dd></div>" +
      "<div><dt>Tax (4%)</dt><dd>" +
      money(bill.tax) +
      "</dd></div>" +
      '<div class="bill__total"><dt>Total</dt><dd><small>PKR</small> ' +
      money(bill.total) +
      "</dd></div></dl>"
    );
  }

  function renderCheckoutSummary() {
    var mount = document.getElementById("checkout-summary");
    var shippingLabel = document.getElementById("shipping-amount");
    if (!mount) {
      return;
    }
    var bill = totals();
    if (!bill.items.length) {
      mount.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
      return;
    }
    mount.innerHTML = summaryHtml(bill);
    if (shippingLabel) {
      shippingLabel.textContent = money(bill.shipping);
    }
  }

  function initCheckout() {
    var form = document.getElementById("checkout-form");
    if (!form) {
      return;
    }
    fillCities(document.getElementById("city"));
    renderCheckoutSummary();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var bill = totals();
      if (!bill.items.length) {
        return;
      }
      var data = new FormData(form);
      var order = {
        customer: {
          email: String(data.get("email") || "").trim(),
          firstName: String(data.get("firstName") || "").trim(),
          lastName: String(data.get("lastName") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          address: String(data.get("address") || "").trim(),
          apartment: String(data.get("apartment") || "").trim(),
          city: String(data.get("city") || "").trim(),
          locality: String(data.get("cityText") || "").trim(),
          postal: String(data.get("postal") || "").trim(),
          country: "Pakistan"
        },
        items: bill.items,
        subtotal: bill.subtotal,
        shipping: bill.shipping,
        tax: bill.tax,
        total: bill.total,
        payment: "Cash on delivery"
      };

      var button = form.querySelector("[type='submit']");
      button.disabled = true;

      window.ShopDB.addOrder(order)
        .then(function (saved) {
          writeCart([]);
          form.hidden = true;
          var done = document.getElementById("checkout-done");
          done.hidden = false;
          document.getElementById("order-id").textContent = saved.id;
          document.getElementById("order-bill").innerHTML = summaryHtml({
            items: saved.items,
            subtotal: saved.subtotal,
            shipping: saved.shipping,
            tax: saved.tax,
            total: saved.total
          });
        })
        .catch(function (error) {
          button.disabled = false;
          alert(error.message || "Could not place the order.");
        });
    });
  }

  window.Shop = {
    money: money,
    totals: totals,
    addToCart: addToCart,
    bindCartUi: bindCartUi,
    initCheckout: initCheckout,
    refresh: function () {
      updateCartCount();
      renderCartDrawer();
      renderCheckoutSummary();
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    bindCartUi();
    initCheckout();
  });
})();
