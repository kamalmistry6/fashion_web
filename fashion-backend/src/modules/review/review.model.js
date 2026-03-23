const pool = require("../../config/db");

exports.createReview = async (data) => {
  const { product_id, name, email, rating, title, comment } = data;

  const [result] = await pool.query(
    `INSERT INTO product_reviews 
     (product_id, name, email, rating, title, comment)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [product_id, name, email, rating, title, comment],
  );

  return result.insertId;
};

exports.getApprovedReviewsByProduct = async (productId) => {
  const [rows] = await pool.query(
    `SELECT id, name, rating, title, comment, created_at
     FROM product_reviews
     WHERE product_id = ? AND is_approved = 1
     ORDER BY created_at DESC`,
    [productId],
  );

  return rows;
};

exports.getPendingReviews = async () => {
  const [rows] = await pool.query(
    `SELECT r.id, r.name, r.rating, r.title, r.comment, r.created_at,
            r.product_id, p.name AS product_name
     FROM product_reviews r
     JOIN products p ON r.product_id = p.id
     WHERE r.is_approved = 0
     ORDER BY r.created_at DESC`,
  );

  return rows;
};

exports.approveReview = async (reviewId) => {
  // Get product_id first
  const [rows] = await pool.query(
    `SELECT product_id FROM product_reviews WHERE id = ?`,
    [reviewId],
  );

  if (rows.length === 0) {
    throw new Error("Review not found");
  }

  const productId = rows[0].product_id;

  // Approve review
  await pool.query(`UPDATE product_reviews SET is_approved = 1 WHERE id = ?`, [
    reviewId,
  ]);

  return productId;
};

exports.deleteReview = async (id) => {
  await pool.query(`DELETE FROM product_reviews WHERE id = ?`, [id]);
};

exports.updateProductRating = async (productId) => {
  await pool.query(
    `UPDATE products p
     SET 
       avg_rating = (
         SELECT IFNULL(AVG(rating),0)
         FROM product_reviews
         WHERE product_id = p.id AND is_approved = 1
       ),
       total_reviews = (
         SELECT COUNT(*)
         FROM product_reviews
         WHERE product_id = p.id AND is_approved = 1
       )
     WHERE p.id = ?`,
    [productId],
  );
};
