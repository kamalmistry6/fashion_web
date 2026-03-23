const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const productRoutes = require("./modules/product/product.routes");
const categoryRoutes = require("./modules/category/category.routes");
const reviewRoutes = require("./modules/review/review.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
