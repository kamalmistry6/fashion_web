const productService = require("./product.service");
const { getPagination } = require("../../utils/pagination");

exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = getPagination(page, limit);

    const products = await productService.fetchProducts({
      ...req.query,
      page: pagination.currentPage,
      limit: pagination.perPage,
    });

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const result = await productService.addProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.fetchProductBySlug(req.params.slug);

    res.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const files = req.files.map((file) => ({
      image_url: `/uploads/products/${file.filename}`,
      is_primary: false,
    }));

    res.json({
      success: true,
      message: "Images uploaded successfully",
      data: files,
    });
  } catch (err) {
    next(err);
  }
};
