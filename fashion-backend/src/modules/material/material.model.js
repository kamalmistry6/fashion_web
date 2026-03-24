const pool = require("../../config/db");

exports.getAllMaterials = async (filters, pagination) => {
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
    SELECT id, name, slug, status, created_at
    FROM materials
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  values.push(perPage, offset);

  const [rows] = await pool.query(query, values);

  return rows;
};

exports.getMaterialById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM materials WHERE id = ?`, [id]);
  return rows[0];
};

exports.createMaterial = async (data) => {
  const { name, slug, status } = data;

  const [result] = await pool.query(
    `INSERT INTO materials (name, slug, status)
     VALUES (?, ?, ?)`,
    [name, slug, status],
  );

  return result.insertId;
};

exports.updateMaterial = async (id, data) => {
  const { name, slug, status } = data;

  await pool.query(
    `UPDATE materials
     SET name=?, slug=?, status=?
     WHERE id=?`,
    [name, slug, status, id],
  );
};

exports.deleteMaterial = async (id) => {
  await pool.query(`DELETE FROM materials WHERE id=?`, [id]);
};

exports.slugExists = async (slug, excludeId = null) => {
  let query = `SELECT id FROM materials WHERE slug = ?`;
  let values = [slug];

  if (excludeId) {
    query += " AND id != ?";
    values.push(excludeId);
  }

  const [rows] = await pool.query(query, values);
  return rows.length > 0;
};
