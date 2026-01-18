const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

/* ===== DB UTILS ===== */
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

/* ===== ROOT ===== */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ======================================================
   USERS / AUTH
====================================================== */

/**
 * LOGIN
 * POST /api/login
 * body: { email, password }
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
  }

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }

  res.json(user);
});

/**
 * REGISTER
 * POST /api/register
 * body: { name, email, password }
 */
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  const exists = db.users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role: "customer",
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json(newUser);
});

/* ======================================================
   PRODUCTS
====================================================== */
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

app.get("/api/products/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find((p) => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

/* ======================================================
   PRODUCTS - CREATE
====================================================== */
app.post("/api/products", (req, res) => {
  const db = readDB();

  const newProduct = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  db.products.push(newProduct);
  writeDB(db);

  res.status(201).json(newProduct);
});

/* ======================================================
   PRODUCTS - UPDATE
====================================================== */
app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(
    (p) => String(p.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json(db.products[index]);
});

/* ======================================================
   PRODUCTS - DELETE
====================================================== */
app.delete("/api/products/:id", (req, res) => {
  const db = readDB();

  const before = db.products.length;
  db.products = db.products.filter(
    (p) => String(p.id) !== String(req.params.id)
  );

  if (before === db.products.length) {
    return res.status(404).json({ message: "Product not found" });
  }

  writeDB(db);
  res.json({ success: true });
});


/* ======================================================
   REVIEWS
====================================================== */
app.get("/api/reviews", (req, res) => {
  const db = readDB();
  const { productId } = req.query;

  const reviews = productId
    ? db.reviews.filter((r) => r.productId == productId)
    : db.reviews;

  res.json(reviews || []);
});

app.post("/api/reviews", (req, res) => {
  const db = readDB();

  const newReview = {
    id: Date.now().toString(),
    ...req.body,
  };

  db.reviews.push(newReview);
  writeDB(db);

  res.status(201).json(newReview);
});

/* ======================================================
   ORDERS
====================================================== */
app.get("/api/orders", (req, res) => {
  const db = readDB();
  const { userId } = req.query;

  const orders = userId
    ? db.orders.filter((o) => o.userId == userId)
    : db.orders;

  res.json(orders || []);
});

app.post("/api/orders", (req, res) => {
  const db = readDB();

  const newOrder = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "pending",
    deliveryStatus: "pending",
    ...req.body,
  };

  db.orders.push(newOrder);
  writeDB(db);

  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { status, deliveryStatus } = req.body;

  const orderIndex = db.orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (status) db.orders[orderIndex].status = status;
  if (deliveryStatus) db.orders[orderIndex].deliveryStatus = deliveryStatus;

  writeDB(db);

  res.json(db.orders[orderIndex]);
});
/* ======================================================
   FAVORITES
====================================================== */
app.get("/api/favorites", (req, res) => {
  const db = readDB();
  const { userId } = req.query;

  const favs = userId
    ? db.favorites.filter((f) => f.userId == userId)
    : db.favorites;

  res.json(favs || []);
});

app.post("/api/favorites", (req, res) => {
  const db = readDB();

  const exists = db.favorites.find(
    (f) =>
      f.userId == req.body.userId &&
      f.productId == req.body.productId
  );

  if (exists) return res.json(exists);

  const fav = {
    id: Date.now().toString(),
    ...req.body,
  };

  db.favorites.push(fav);
  writeDB(db);

  res.status(201).json(fav);
});

app.delete("/api/favorites/:id", (req, res) => {
  const db = readDB();
  db.favorites = db.favorites.filter((f) => f.id != req.params.id);
  writeDB(db);
  res.json({ success: true });
});

/* ======================================================
   BLOGS
====================================================== */
app.get("/api/blogs", (req, res) => {
  const db = readDB();
  res.json(db.blogs || []);
});

app.get("/api/blogs/:id", (req, res) => {
  const db = readDB();
  const blog = db.blogs.find((b) => b.id == req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });
  res.json(blog);
});

/* ======================================================
   VOUCHERS
====================================================== */

// GET ALL
app.get("/api/vouchers", (req, res) => {
  const db = readDB();
  res.json(db.vouchers || []);
});

// GET BY ID
app.get("/api/vouchers/:id", (req, res) => {
  const db = readDB();
  const voucher = db.vouchers.find(
    v => String(v.id) === req.params.id
  );

  if (!voucher) {
    return res.status(404).json({ message: "Voucher không tồn tại" });
  }

  res.json(voucher);
});

// ADD
app.post("/api/vouchers", (req, res) => {
  const db = readDB();

  const newVoucher = {
    id: Date.now().toString(),
    code: req.body.code,
    title: req.body.title,
    description: req.body.description,
    discountType: req.body.discountType, // percent | fixed
    discountValue: Number(req.body.discountValue),
    minOrderValue: Number(req.body.minOrderValue),
    expiryDate: req.body.expiryDate,
    image: req.body.image || "",
  };

  db.vouchers.push(newVoucher);
  writeDB(db);

  res.status(201).json(newVoucher);
});

// UPDATE
app.put("/api/vouchers/:id", (req, res) => {
  const db = readDB();
  const index = db.vouchers.findIndex(
    v => String(v.id) === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ message: "Voucher không tồn tại" });
  }

  db.vouchers[index] = {
    ...db.vouchers[index],
    code: req.body.code,
    title: req.body.title,
    description: req.body.description,
    discountType: req.body.discountType,
    discountValue: Number(req.body.discountValue),
    minOrderValue: Number(req.body.minOrderValue),
    expiryDate: req.body.expiryDate,
    image: req.body.image,
  };

  writeDB(db);
  res.json(db.vouchers[index]);
});

// DELETE
app.delete("/api/vouchers/:id", (req, res) => {
  const db = readDB();
  const index = db.vouchers.findIndex(
    v => String(v.id) === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ message: "Voucher không tồn tại" });
  }

  db.vouchers.splice(index, 1);
  writeDB(db);

  res.json({ message: "Xóa voucher thành công" });
});


/* ===== START ===== */
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
