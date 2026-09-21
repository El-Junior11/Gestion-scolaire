const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/etudiantController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.get("/:id/mensualites", ctrl.getMensualites);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.put("/:id/promouvoir", ctrl.promouvoir);
router.delete("/:id", ctrl.remove);

module.exports = router;
