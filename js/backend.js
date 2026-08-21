(function () {
  var PRODUCTS_KEY = "bl-admin-products";
  var ORDERS_KEY = "bl-admin-orders";
  var remote = false;
  var app = null;

  function store() {
    return window.STORE || {};
  }

  function hasRemoteConfig() {
    var c = window.FIREBASE_CONFIG || {};
    return !!(c.apiKey && c.projectId && typeof window.firebase !== "undefined");
  }

  function initRemote() {
    if (!hasRemoteConfig() || remote) {
      return remote;
    }
    try {
      app = firebase.initializeApp(window.FIREBASE_CONFIG);
      remote = true;
    } catch (error) {
      remote = false;
    }
    return remote;
  }

  function seedProducts() {
    return Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : [];
  }

  function readLocal(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  window.ShopDB = {
    isRemote: function () {
      return initRemote();
    },

    modeLabel: function () {
      return initRemote()
        ? "Live (Firebase)"
        : "This browser only — connect Firebase to receive orders and photos from customers";
    },

    getProducts: function () {
      if (initRemote()) {
        return firebase
          .firestore()
          .collection("products")
          .get()
          .then(function (snap) {
            var list = [];
            snap.forEach(function (doc) {
              var item = doc.data();
              item.id = doc.id;
              list.push(item);
            });
            return list.length ? list : seedProducts();
          })
          .catch(function () {
            return seedProducts();
          });
      }

      var local = readLocal(PRODUCTS_KEY, []);
      return Promise.resolve(local.length ? local : seedProducts());
    },

    saveProduct: function (product) {
      if (initRemote()) {
        var id = product.id || "p" + Date.now();
        return firebase
          .firestore()
          .collection("products")
          .doc(id)
          .set(product)
          .then(function () {
            return id;
          });
      }

      var list = readLocal(PRODUCTS_KEY, seedProducts());
      var found = false;
      list = list.map(function (item) {
        if (item.id === product.id) {
          found = true;
          return product;
        }
        return item;
      });
      if (!found) {
        list.push(product);
      }
      writeLocal(PRODUCTS_KEY, list);
      window.PRODUCTS = list;
      return Promise.resolve(product.id);
    },

    deleteProduct: function (id) {
      if (initRemote()) {
        return firebase.firestore().collection("products").doc(id).delete();
      }
      var list = readLocal(PRODUCTS_KEY, seedProducts()).filter(function (item) {
        return item.id !== id;
      });
      writeLocal(PRODUCTS_KEY, list);
      window.PRODUCTS = list;
      return Promise.resolve();
    },

    // uploadImage: function (file, id) {
    //   if (!file) {
    //     return Promise.resolve("");
    //   }

    //   if (initRemote()) {
    //     var path = "products/" + (id || Date.now()) + "-" + file.name.replace(/\s+/g, "-");
    //     var ref = firebase.storage().ref().child(path);
    //     return ref.put(file).then(function () {
    //       return ref.getDownloadURL();
    //     });
    //   }

    //   return new Promise(function (resolve, reject) {
    //     if (file.size > 700000) {
    //       reject(new Error("Without Firebase, keep images under 700 KB."));
    //       return;
    //     }
    //     var reader = new FileReader();
    //     reader.onload = function () {
    //       resolve(reader.result);
    //     };
    //     reader.onerror = reject;
    //     reader.readAsDataURL(file);
    //   });
    // },

    uploadImage: function (file, id) {
  if (!file) {
    return Promise.resolve("");
  }

  return new Promise(function (resolve, reject) {
    if (file.size > 700000) {
      reject(new Error("Without Firebase Storage, keep images under 700 KB."));
      return;
    }

    var reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
},

    addOrder: function (order) {
      order.id = order.id || "ord-" + Date.now();
      order.createdAt = order.createdAt || new Date().toISOString();
      order.status = order.status || "new";
      order.payment = "Cash on delivery";

      if (initRemote()) {
        return firebase
          .firestore()
          .collection("orders")
          .doc(order.id)
          .set(order)
          .then(function () {
            return order;
          });
      }

      var orders = readLocal(ORDERS_KEY, []);
      orders.unshift(order);
      writeLocal(ORDERS_KEY, orders);
      return Promise.resolve(order);
    },

    getOrders: function () {
      if (initRemote()) {
        return firebase
          .firestore()
          .collection("orders")
          .orderBy("createdAt", "desc")
          .get()
          .then(function (snap) {
            var list = [];
            snap.forEach(function (doc) {
              var item = doc.data();
              item.id = doc.id;
              list.push(item);
            });
            return list;
          });
      }
      return Promise.resolve(readLocal(ORDERS_KEY, []));
    },

    login: function (email, password, pin) {
      if (initRemote()) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      }
      if (String(pin) === String(store().adminPin || "1234")) {
        sessionStorage.setItem("bl-admin", "1");
        return Promise.resolve({ local: true });
      }
      return Promise.reject(new Error("Wrong PIN"));
    },

    logout: function () {
      sessionStorage.removeItem("bl-admin");
      if (initRemote()) {
        return firebase.auth().signOut();
      }
      return Promise.resolve();
    },

    isLoggedIn: function () {
      if (initRemote()) {
        return !!(firebase.auth().currentUser);
      }
      return sessionStorage.getItem("bl-admin") === "1";
    }
  };
})();
