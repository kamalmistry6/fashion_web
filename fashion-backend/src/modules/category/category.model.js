const pool = require("../../config/db");

exports.getAllCategories = async (filters, pagination) => {
  const { offset, perPage } = pagination;

  let conditions = [];
  let values = [];

  if (filters.status !== undefined) {
    conditions.push("status = ?");
    values.push(filters.status);
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const query = `
    SELECT id, name, slug, description, status, created_at
    FROM categories
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  values.push(perPage, offset);

  const [rows] = await pool.query(query, values);

  return rows;
};

exports.getCategoryById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM categories WHERE id = ?`, [
    id,
  ]);
  return rows[0];
};

exports.createCategory = async (data) => {
  const { name, slug, description, status } = data;

  const [result] = await pool.query(
    `INSERT INTO categories (name, slug, description, status)
     VALUES (?, ?, ?, ?)`,
    [name, slug, description, status],
  );

  return result.insertId;
};

exports.updateCategory = async (id, data) => {
  const { name, slug, description, status } = data;

  await pool.query(
    `UPDATE categories
     SET name=?, slug=?, description=?, status=?
     WHERE id=?`,
    [name, slug, description, status, id],
  );
};

exports.deleteCategory = async (id) => {
  await pool.query(`DELETE FROM categories WHERE id=?`, [id]);
};

exports.slugExists = async (slug, excludeId = null) => {
  let query = `SELECT id FROM categories WHERE slug = ?`;
  let values = [slug];

  if (excludeId) {
    query += " AND id != ?";
    values.push(excludeId);
  }

  const [rows] = await pool.query(query, values);
  return rows.length > 0;
};
