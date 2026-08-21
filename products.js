const WHATSAPP_NUMBER = "923001234567";

window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;

window.STORE = {
  name: "Brand's Leftover",
  whatsapp: WHATSAPP_NUMBER,
  tiktok: "YOUR_TIKTOK_URL",
  facebook: "YOUR_FACEBOOK_URL",
  shippingFee: 300,
  taxRate: 0.04,
  adminPin: "1234"
};

window.PRODUCTS = [
  {
    id: "p01",
    name: "Printed lawn 2-piece",
    category: "Stitched",
    price: 1850,
    oldPrice: 2490,
    image: "assets/products/p01.svg",
    description: "Light summer lawn set from a leftover dealer lot. Mixed prints.",
    stockStatus: "in-stock",
    isNew: true,
    isSale: true
  },
  {
    id: "p02",
    name: "Men's polo mix",
    category: "Men",
    price: 990,
    oldPrice: 1490,
    image: "assets/products/p02.svg",
    description: "Assorted polo shirts. Sizes mixed. Cotton-feel surplus stock.",
    stockStatus: "in-stock",
    isNew: false,
    isSale: true
  },
  {
    id: "p03",
    name: "Kids fleece hoodie",
    category: "Kids",
    price: 750,
    oldPrice: null,
    image: "assets/products/p03.svg",
    description: "Warm kids hoodie from a winter leftover carton.",
    stockStatus: "low-stock",
    isNew: true,
    isSale: false
  },
  {
    id: "p04",
    name: "Stitched cotton kurti",
    category: "Stitched",
    price: 1290,
    oldPrice: 1790,
    image: "assets/products/p04.svg",
    description: "Ready-to-wear kurti. Dealer leftover, limited colours.",
    stockStatus: "in-stock",
    isNew: false,
    isSale: true
  },
  {
    id: "p05",
    name: "Denim jeans lot",
    category: "Women",
    price: 1590,
    oldPrice: 2200,
    image: "assets/products/p05.svg",
    description: "Straight and slim mixed jeans. Check size when you enquire.",
    stockStatus: "in-stock",
    isNew: false,
    isSale: true
  },
  {
    id: "p06",
    name: "Khaddar unstitched 3-piece",
    category: "Unstitched",
    price: 2100,
    oldPrice: null,
    image: "assets/products/p06.svg",
    description: "Winter khaddar suit length. Surplus mill leftover.",
    stockStatus: "in-stock",
    isNew: true,
    isSale: false
  },
  {
    id: "p07",
    name: "Men's formal shirt",
    category: "Men",
    price: 890,
    oldPrice: 1350,
    image: "assets/products/p07.svg",
    description: "Office shirts from a packed leftover bundle.",
    stockStatus: "low-stock",
    isNew: false,
    isSale: true
  },
  {
    id: "p08",
    name: "Western crop top",
    category: "Women",
    price: 650,
    oldPrice: 990,
    image: "assets/products/p08.svg",
    description: "Casual western top. TikTok-ready surplus piece.",
    stockStatus: "in-stock",
    isNew: true,
    isSale: true
  },
  {
    id: "p09",
    name: "Unisex tracksuit",
    category: "Sportswear",
    price: 1890,
    oldPrice: 2590,
    image: "assets/products/p09.svg",
    description: "Two-piece tracksuit from a sports surplus carton.",
    stockStatus: "in-stock",
    isNew: false,
    isSale: true
  },
  {
    id: "p10",
    name: "Chiffon dupatta pack",
    category: "Accessories",
    price: 450,
    oldPrice: null,
    image: "assets/products/p10.svg",
    description: "Lightweight dupattas sold as leftover pack stock.",
    stockStatus: "in-stock",
    isNew: false,
    isSale: false
  },
  {
    id: "p11",
    name: "Embroidered waistcoat",
    category: "Men",
    price: 1750,
    oldPrice: 2400,
    image: "assets/products/p11.svg",
    description: "Festive waistcoat from a wedding leftover lot.",
    stockStatus: "sold-out",
    isNew: false,
    isSale: true
  },
  {
    id: "p12",
    name: "Linen mix trousers",
    category: "Women",
    price: 1190,
    oldPrice: null,
    image: "assets/products/p12.svg",
    description: "Breathable trousers. Mixed waist sizes in the lot.",
    stockStatus: "in-stock",
    isNew: true,
    isSale: false
  },
  {
    id: "p13",
    name: "Karandi unstitched suit",
    category: "Unstitched",
    price: 2450,
    oldPrice: 3100,
    image: "assets/products/p06.svg",
    description: "Winter karandi length with dupatta. Leftover mill stock.",
    stockStatus: "in-stock",
    isNew: false,
    isSale: true
  },
  {
    id: "p14",
    name: "Pearl hair clip set",
    category: "Accessories",
    price: 350,
    oldPrice: 550,
    image: "assets/products/p10.svg",
    description: "Small leftover accessory pack. Mix of clips and pins.",
    stockStatus: "low-stock",
    isNew: true,
    isSale: true
  }
];
