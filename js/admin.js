(function () {
  var loginView = document.getElementById("admin-login");
  var appView = document.getElementById("admin-app");
  var notice = document.getElementById("admin-notice");
  var orderList = document.getElementById("order-list");
  var productList = document.getElementById("admin-products");

  function money(amount) {
    return "Rs " + Number(amount).toLocaleString("en-PK");
  }

  function showApp(open) {
    loginView.hidden = open;
    appView.hidden = !open;
  }

  function renderOrders(orders) {
    if (!orders.length) {
      orderList.innerHTML = "<p>No orders yet.</p>";
      return;
    }
    orderList.innerHTML = orders
      .map(function (order) {
        var c = order.customer || {};
        var items = (order.items || [])
          .map(function (item) {
            return item.name + " × " + item.qty;
          })
          .join(", ");
        return (
          '<article class="order-card">' +
          "<p><strong>" +
          (order.id || "") +
          "</strong> · " +
          (order.createdAt || "") +
          "</p>" +
          "<p>" +
          [c.firstName, c.lastName].join(" ") +
          " · " +
          (c.phone || "") +
          " · " +
          (c.email || "") +
          "</p>" +
          "<p>" +
          [c.address, c.apartment, c.city, c.country].filter(Boolean).join(", ") +
          "</p>" +
          "<p>" +
          items +
          "</p>" +
          "<p>Subtotal " +
          money(order.subtotal) +
          " · Shipping " +
          money(order.shipping) +
          " · Tax " +
          money(order.tax) +
          " · <strong>Total " +
          money(order.total) +
          "</strong></p>" +
          "<p>" +
          (order.payment || "Cash on delivery") +
          "</p></article>"
        );
      })
      .join("");
  }

  function renderProducts(list) {
    productList.innerHTML = list
      .map(function (item) {
        return (
          '<article class="product-admin"><img src="' +
          item.image +
          '" alt="" style="width:4rem;height:5rem;object-fit:cover">' +
          "<p>" +
          item.name +
          " · " +
          money(item.price) +
          "</p>" +
          '<button type="button" data-del="' +
          item.id +
          '">Remove</button></article>'
        );
      })
      .join("");
  }

  function refresh() {
    notice.textContent = ShopDB.modeLabel();
    ShopDB.getOrders().then(renderOrders);
    ShopDB.getProducts().then(renderProducts);
  }

  document.getElementById("mode-label").textContent = ShopDB.modeLabel();

  document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(event.target);
    ShopDB.login(data.get("email"), data.get("password"), data.get("pin"))
      .then(function () {
        showApp(true);
        refresh();
      })
      .catch(function (error) {
        alert(error.message || "Login failed");
      });
  });

  document.getElementById("logout").addEventListener("click", function () {
    ShopDB.logout().then(function () {
      showApp(false);
    });
  });

  document.getElementById("product-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(event.target);
    var id = "p" + Date.now();
    var file = data.get("image");
    var old = data.get("oldPrice");
    ShopDB.uploadImage(file && file.size ? file : null, id)
      .then(function (url) {
        return ShopDB.saveProduct({
          id: id,
          name: String(data.get("name") || "").trim(),
          category: String(data.get("category") || "Women"),
          price: Number(data.get("price")) || 0,
          oldPrice: old ? Number(old) : null,
          image: url || "assets/products/p01.svg",
          description: String(data.get("description") || "").trim(),
          stockStatus: String(data.get("stockStatus") || "in-stock"),
          isNew: data.get("isNew") === "on",
          isSale: data.get("isSale") === "on"
        });
      })
      .then(function () {
        event.target.reset();
        refresh();
      })
      .catch(function (error) {
        alert(error.message || "Could not save product");
      });
  });

  productList.addEventListener("click", function (event) {
    var id = event.target.getAttribute("data-del");
    if (!id) {
      return;
    }
    ShopDB.deleteProduct(id).then(refresh);
  });

  if (ShopDB.isLoggedIn()) {
    showApp(true);
    refresh();
  }
})();
