# Brand's Leftover

Clothing catalogue with cart, cash-on-delivery checkout, WhatsApp, and an admin page.

## How to run

Open `index.html` in a browser. Keep these files in the **repo root**, not in a `MyProject` folder.

## Shop settings

In `products.js`:

- `WHATSAPP_NUMBER` — digits with country code
- `STORE.shippingFee` — shipping in rupees (not free)
- `STORE.taxRate` — `0.04` means 4% of product value
- `STORE.tiktok` / `STORE.facebook` — full `https://` URLs
- `STORE.adminPin` — PIN for the admin page when Firebase is not connected

Bill = product subtotal + shipping + 4% tax on the product subtotal.

## Add / remove a product

**From the website (recommended):** open `admin.html`, log in, upload a photo, save.

**From code:** edit the `window.PRODUCTS` list in `products.js`.

## Cart and checkout

Customers add items with **Add to cart**, then check out on `checkout.html`. Payment is **cash on delivery only**. There is no card payment.

## Admin panel

Open `admin.html`.

- Without Firebase: log in with the PIN (`1234` until you change it). Orders and uploaded photos stay **in that browser only**.
- With Firebase: log in with the Firebase email/password. Then orders and photos work for real customers.

## Connect Firebase (needed for live orders and photo uploads)

GitHub Pages cannot store orders or customer-facing photos by itself. Use Firebase’s free plan:

1. Create a project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password) and create your admin user
3. Enable **Firestore** and **Storage**
4. Paste the web app keys into `js/firebase-config.js`
5. Use these rules:

Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Deploy for free (GitHub Pages)

1. Put the site in the **root** of the GitHub repo.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Open `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
