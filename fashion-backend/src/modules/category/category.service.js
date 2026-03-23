const categoryModel = require("./category.model");

exports.fetchCategories = async (query, pagination) => {
  return await categoryModel.getAllCategories(query, pagination);
};

exports.getCategory = async (id) => {
  const category = await categoryModel.getCategoryById(id);
  if (!category) throw new Error("Category not found");
  return category;
};

exports.addCategory = async (data) => {
  const slugExists = await categoryModel.slugExists(data.slug);
  if (slugExists) throw new Error("Slug already exists");

  return await categoryModel.createCategory(data);
};

exports.editCategory = async (id, data) => {
  const slugExists = await categoryModel.slugExists(data.slug, id);
  if (slugExists) throw new Error("Slug already exists");

  await categoryModel.updateCategory(id, data);
};

exports.removeCategory = async (id) => {
  await categoryModel.deleteCategory(id);
};
