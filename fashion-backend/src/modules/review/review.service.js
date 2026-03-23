const reviewModel = require("./review.model");

exports.addReview = async (data) => {
  if (!data.name || !data.comment || !data.rating) {
    throw new Error("Name, rating and comment are required");
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return await reviewModel.createReview(data);
};

exports.fetchApprovedReviews = async (productId) => {
  return await reviewModel.getApprovedReviewsByProduct(productId);
};

exports.fetchPendingReviews = async () => {
  return await reviewModel.getPendingReviews();
};

exports.approveReview = async (reviewId) => {
  const productId = await reviewModel.approveReview(reviewId);
  await reviewModel.updateProductRating(productId);
};

exports.removeReview = async (id) => {
  await reviewModel.deleteReview(id);
};
