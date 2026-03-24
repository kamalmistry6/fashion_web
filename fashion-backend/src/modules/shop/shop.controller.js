const shopService = require("./shop.service");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await shopService.fetchActiveProducts(req.query);

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await shopService.fetchFeaturedProducts(req.query);

    res.json({
      success: true,
      message: "Featured products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrendingProducts = async (req, res, next) => {
  try {
    const products = await shopService.fetchTrendingProducts(req.query);

    res.json({
      success: true,
      message: "Trending products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await shopService.fetchActiveProductBySlug(req.params.slug);

    res.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
