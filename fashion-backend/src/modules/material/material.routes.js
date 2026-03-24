const express = require("express");
const router = express.Router();
const controller = require("./material.controller");

router.get("/", controller.getMaterials);
router.get("/:id", controller.getMaterialById);
router.post("/", controller.createMaterial);
router.put("/:id", controller.updateMaterial);
router.delete("/:id", controller.deleteMaterial);

module.exports = router;
