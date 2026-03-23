const pool = require("../../config/db");
const reviewService = require("./review.service");

/**
 * PUBLIC: Create review using product slug
 */
exports.createReviewBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [product] = await pool.query(
      "SELECT id FROM products WHERE slug = ?",
      [slug],
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const productId = product[0].id;

    const id = await reviewService.addReview({
      ...req.body,
      product_id: productId,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted for approval",
      data: { id },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUBLIC: Get approved reviews by slug
 */
exports.getApprovedReviewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [product] = await pool.query(
      "SELECT id FROM products WHERE slug = ?",
      [slug],
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await reviewService.fetchApprovedReviews(product[0].id);

    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Get pending reviews
 */
exports.getPendingReviews = async (req, res, next) => {
  try {
    const data = await reviewService.fetchPendingReviews();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Approve review
 */
exports.approveReview = async (req, res, next) => {
  try {
    await reviewService.approveReview(req.params.id);

    res.json({
      success: true,
      message: "Review approved",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Delete review
 */
exports.deleteReview = async (req, res, next) => {
  try {
    await reviewService.removeReview(req.params.id);

    res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (err) {
    next(err);
  }
};
