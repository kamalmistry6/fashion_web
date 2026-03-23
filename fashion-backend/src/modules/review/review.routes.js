const express = require("express");
const router = express.Router();
const controller = require("./review.controller");

// Admin
router.get("/pending", controller.getPendingReviews);
router.put("/approve/:id", controller.approveReview);
router.delete("/:id", controller.deleteReview);

module.exports = router;
