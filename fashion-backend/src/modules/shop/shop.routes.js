const express = require("express");
const router = express.Router();
const shopController = require("./shop.controller");

router.get("/products", shopController.getProducts);
router.get("/featured", shopController.getFeaturedProducts);
router.get("/trending", shopController.getTrendingProducts);
router.get("/products/:slug", shopController.getProductBySlug);

module.exports = router;
