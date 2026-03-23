const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const reviewController = require("../review/review.controller");
const upload = require("../../middleware/upload.middleware");

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/:slug", productController.getProductBySlug);

router.post(
  "/upload",
  upload.array("images", 5),
  productController.uploadImages,
);

// Public review routes
router.post("/:slug/reviews", reviewController.createReviewBySlug);
router.get("/:slug/reviews", reviewController.getApprovedReviewsBySlug);

module.exports = router;
