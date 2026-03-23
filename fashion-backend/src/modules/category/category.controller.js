const categoryService = require("./category.service");
const { getPagination } = require("../../utils/pagination");

exports.getCategories = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = getPagination(page, limit);

    const data = await categoryService.fetchCategories(req.query, pagination);

    res.json({
      success: true,
      message: "Categories fetched",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const data = await categoryService.getCategory(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const id = await categoryService.addCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created",
      data: { id },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    await categoryService.editCategory(req.params.id, req.body);

    res.json({
      success: true,
      message: "Category updated",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.removeCategory(req.params.id);

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (err) {
    next(err);
  }
};
