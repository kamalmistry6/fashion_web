const pool = require("../../config/db");

exports.getProducts = async (filters, pagination) => {
  const { offset, perPage } = pagination;

  let conditions = [];
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

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

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
      p.status,
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

  return {
    products: rows,
    total,
  };
};

exports.createProduct = async (productData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      category_id,
      material_id,
      name,
      slug,
      description,
      price,
      discount_price,
      is_featured,
      is_trending,
      status,
      images,
      variants,
    } = productData;

    // 1️⃣ Insert product
    const [result] = await connection.query(
      `INSERT INTO products 
      (category_id, material_id, name, slug, description, price, discount_price, is_featured, is_trending, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        material_id,
        name,
        slug,
        description,
        price,
        discount_price,
        is_featured,
        is_trending,
        status,
      ],
    );

    const productId = result.insertId;

    // 2️⃣ Insert images
    if (images && images.length > 0) {
      for (const img of images) {
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES (?, ?, ?)`,
          [productId, img.image_url, img.is_primary || false],
        );
      }
    }

    // 3️⃣ Insert variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await connection.query(
          `INSERT INTO product_variants (product_id, size, color, stock)
           VALUES (?, ?, ?, ?)`,
          [productId, variant.size, variant.color, variant.stock || 0],
        );
      }
    }

    await connection.commit();
    return { id: productId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateProduct = async (id, data) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      category_id,
      material_id,
      name,
      slug,
      description,
      price,
      discount_price,
      is_featured,
      is_trending,
      status,
      images,
      variants,
    } = data;

    await connection.query(
      `UPDATE products SET
        category_id=?,
        material_id=?,
        name=?,
        slug=?,
        description=?,
        price=?,
        discount_price=?,
        is_featured=?,
        is_trending=?,
        status=?
      WHERE id=?`,
      [
        category_id,
        material_id,
        name,
        slug,
        description,
        price,
        discount_price,
        is_featured,
        is_trending,
        status,
        id,
      ],
    );

    // Delete old images & variants
    await connection.query(`DELETE FROM product_images WHERE product_id=?`, [
      id,
    ]);
    await connection.query(`DELETE FROM product_variants WHERE product_id=?`, [
      id,
    ]);

    // Reinsert new
    if (images) {
      for (const img of images) {
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES (?, ?, ?)`,
          [id, img.image_url, img.is_primary || false],
        );
      }
    }

    if (variants) {
      for (const variant of variants) {
        await connection.query(
          `INSERT INTO product_variants (product_id, size, color, stock)
           VALUES (?, ?, ?, ?)`,
          [id, variant.size, variant.color, variant.stock || 0],
        );
      }
    }

    await connection.commit();
    return { id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.deleteProduct = async (id) => {
  const [result] = await pool.query(`DELETE FROM products WHERE id=?`, [id]);

  return result;
};

exports.getProductBySlug = async (slug) => {
  // 1️⃣ Get main product
  const [productRows] = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.discount_price,
      p.avg_rating,
      p.total_reviews,
      p.status,
      p.is_featured,
      p.is_trending,
      p.category_id,
      p.material_id,
      c.name AS category,
      m.name AS material
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN materials m ON p.material_id = m.id
    WHERE p.slug = ?
    `,
    [slug],
  );

  if (productRows.length === 0) {
    return null;
  }

  const product = productRows[0];

  // 2️⃣ Get all images
  const [images] = await pool.query(
    `SELECT id, image_url, is_primary
     FROM product_images
     WHERE product_id = ?
     ORDER BY is_primary DESC`,
    [product.id],
  );

  // 3️⃣ Get variants
  const [variants] = await pool.query(
    `SELECT id, size, color, stock
     FROM product_variants
     WHERE product_id = ?`,
    [product.id],
  );

  // 4️⃣ Get approved reviews
  const [reviews] = await pool.query(
    `SELECT id, name, rating, title, comment, created_at
     FROM product_reviews
     WHERE product_id = ? AND is_approved = 1
     ORDER BY created_at DESC`,
    [product.id],
  );

  return {
    ...product,
    images,
    variants,
    reviews,
  };
};
