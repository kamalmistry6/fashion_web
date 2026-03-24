const pool = require("../../config/db");

exports.getActiveProducts = async (filters, pagination) => {
  const { offset, perPage } = pagination;

  let conditions = ["p.status = 1"];
  let values = [];

  if (filters.category) {
    conditions.push("c.slug = ?");
    values.push(filters.category);
  }

  if (filters.material) {
    conditions.push("m.slug = ?");
    values.push(filters.material);
  }

  if (filters.minPrice) {
    conditions.push("p.price >= ?");
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    conditions.push("p.price <= ?");
    values.push(filters.maxPrice);
  }

  if (filters.search) {
    conditions.push("p.name LIKE ?");
    values.push(`%${filters.search}%`);
  }

  const whereClause = "WHERE " + conditions.join(" AND ");

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN materials m ON p.material_id = m.id
    ${whereClause}
  `;

  const query = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.price,
      p.discount_price,
      p.avg_rating,
      p.total_reviews,
      p.is_featured,
      p.is_trending,
      c.name AS category,
      m.name AS material,
      pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN materials m ON p.material_id = m.id
    LEFT JOIN product_images pi
      ON pi.product_id = p.id AND pi.is_primary = 1
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countValues = [...values];
  const queryValues = [...values, perPage, offset];

  const [[{ total }]] = await pool.query(countQuery, countValues);
  const [rows] = await pool.query(query, queryValues);

  return { products: rows, total };
};

exports.getFeaturedProducts = async (pagination) => {
  const { offset, perPage } = pagination;

  const whereClause = "WHERE p.status = 1 AND p.is_featured = 1";

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p ${whereClause}`,
  );

  const [rows] = await pool.query(
    `SELECT
      p.id, p.name, p.slug, p.price, p.discount_price,
      p.avg_rating, p.total_reviews,
      c.name AS category, m.name AS material,
      pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN materials m ON p.material_id = m.id
    LEFT JOIN product_images pi
      ON pi.product_id = p.id AND pi.is_primary = 1
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?`,
    [perPage, offset],
  );

  return { products: rows, total };
};

exports.getTrendingProducts = async (pagination) => {
  const { offset, perPage } = pagination;

  const whereClause = "WHERE p.status = 1 AND p.is_trending = 1";

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p ${whereClause}`,
  );

  const [rows] = await pool.query(
    `SELECT
      p.id, p.name, p.slug, p.price, p.discount_price,
      p.avg_rating, p.total_reviews,
      c.name AS category, m.name AS material,
      pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN materials m ON p.material_id = m.id
    LEFT JOIN product_images pi
      ON pi.product_id = p.id AND pi.is_primary = 1
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?`,
    [perPage, offset],
  );

  return { products: rows, total };
};

exports.getActiveProductBySlug = async (slug) => {
  const [productRows] = await pool.query(
    `SELECT
      p.id, p.name, p.slug, p.description, p.price, p.discount_price,
      p.avg_rating, p.total_reviews, p.is_featured, p.is_trending,
      p.category_id, p.material_id,
      c.name AS category, m.name AS material
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN materials m ON p.material_id = m.id
    WHERE p.slug = ? AND p.status = 1`,
    [slug],
  );

  if (productRows.length === 0) return null;

  const product = productRows[0];

  const [images] = await pool.query(
    `SELECT id, image_url, is_primary
     FROM product_images WHERE product_id = ?
     ORDER BY is_primary DESC`,
    [product.id],
  );

  const [variants] = await pool.query(
    `SELECT id, size, color, stock
     FROM product_variants WHERE product_id = ?`,
    [product.id],
  );

  const [reviews] = await pool.query(
    `SELECT id, name, rating, title, comment, created_at
     FROM product_reviews
     WHERE product_id = ? AND is_approved = 1
     ORDER BY created_at DESC`,
    [product.id],
  );

  return { ...product, images, variants, reviews };
};
