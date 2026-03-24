const shopModel = require("./shop.model");

exports.fetchActiveProducts = async (queryParams) => {
  const { page, limit, ...filters } = queryParams;
  const currentPage = parseInt(page) || 1;
  const perPage = parseInt(limit) || 10;

  const pagination = {
    offset: (currentPage - 1) * perPage,
    perPage,
  };

  const { products, total } = await shopModel.getActiveProducts(filters, pagination);
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;

  return { products, total, totalPages, hasNext: currentPage < totalPages };
};

exports.fetchFeaturedProducts = async (queryParams) => {
  const currentPage = parseInt(queryParams.page) || 1;
  const perPage = parseInt(queryParams.limit) || 10;

  const pagination = {
    offset: (currentPage - 1) * perPage,
    perPage,
  };

  const { products, total } = await shopModel.getFeaturedProducts(pagination);
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;

  return { products, total, totalPages, hasNext: currentPage < totalPages };
};

exports.fetchTrendingProducts = async (queryParams) => {
  const currentPage = parseInt(queryParams.page) || 1;
  const perPage = parseInt(queryParams.limit) || 10;

  const pagination = {
    offset: (currentPage - 1) * perPage,
    perPage,
  };

  const { products, total } = await shopModel.getTrendingProducts(pagination);
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;

  return { products, total, totalPages, hasNext: currentPage < totalPages };
};

exports.fetchActiveProductBySlug = async (slug) => {
  const product = await shopModel.getActiveProductBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
