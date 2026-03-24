const materialModel = require("./material.model");

exports.fetchMaterials = async (query, pagination) => {
  return await materialModel.getAllMaterials(query, pagination);
};

exports.getMaterial = async (id) => {
  const material = await materialModel.getMaterialById(id);
  if (!material) throw new Error("Material not found");
  return material;
};

exports.addMaterial = async (data) => {
  const slugExists = await materialModel.slugExists(data.slug);
  if (slugExists) throw new Error("Slug already exists");

  return await materialModel.createMaterial(data);
};

exports.editMaterial = async (id, data) => {
  const slugExists = await materialModel.slugExists(data.slug, id);
  if (slugExists) throw new Error("Slug already exists");

  await materialModel.updateMaterial(id, data);
};

exports.removeMaterial = async (id) => {
  await materialModel.deleteMaterial(id);
};
