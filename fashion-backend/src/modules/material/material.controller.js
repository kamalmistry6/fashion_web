const materialService = require("./material.service");
const { getPagination } = require("../../utils/pagination");

exports.getMaterials = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = getPagination(page, limit);

    const data = await materialService.fetchMaterials(req.query, pagination);

    res.json({
      success: true,
      message: "Materials fetched",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMaterialById = async (req, res, next) => {
  try {
    const data = await materialService.getMaterial(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.createMaterial = async (req, res, next) => {
  try {
    const id = await materialService.addMaterial(req.body);

    res.status(201).json({
      success: true,
      message: "Material created",
      data: { id },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMaterial = async (req, res, next) => {
  try {
    await materialService.editMaterial(req.params.id, req.body);

    res.json({
      success: true,
      message: "Material updated",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMaterial = async (req, res, next) => {
  try {
    await materialService.removeMaterial(req.params.id);

    res.json({
      success: true,
      message: "Material deleted",
    });
  } catch (err) {
    next(err);
  }
};
