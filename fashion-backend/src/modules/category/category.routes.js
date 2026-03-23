const express = require("express");
const router = express.Router();
const controller = require("./category.controller");

router.get("/", controller.getCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", controller.createCategory);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
