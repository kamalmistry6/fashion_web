const productModel = require("./product.model");

exports.fetchProducts = async (queryParams) => {
  const { page, limit, ...filters } = queryParams;
  const currentPage = parseInt(page) || 1;
  const perPage = parseInt(limit) || 10;

  const pagination = {
    offset: (currentPage - 1) * perPage,
    perPage,
  };

  const { products, total } = await productModel.getProducts(filters, pagination);
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;

  return {
    products,
    total,
    totalPages,
    hasNext: currentPage < totalPages,
  };
};

exports.addProduct = async (data) => {
  const { images } = data;

  if (!images || images.length === 0) {
    throw new Error("At least one image is required");
  }

  const primaryCount = images.filter((img) => img.is_primary).length;

  if (primaryCount !== 1) {
    throw new Error("Exactly one primary image is required");
  }

  return await productModel.createProduct(data);
};

exports.updateProduct = async (id, data) => {
  const { images } = data;

  if (!images || images.length === 0) {
    throw new Error("At least one image is required");
  }

  const primaryCount = images.filter((img) => img.is_primary).length;

  if (primaryCount !== 1) {
    throw new Error("Exactly one primary image is required");
  }

  return await productModel.updateProduct(id, data);
};

exports.fetchProductBySlug = async (slug) => {
  const product = await productModel.getProductBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
