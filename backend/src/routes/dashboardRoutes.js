const express = require("express");
const router = express.Router();
const { getStats, getRetards } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

router.get("/stats", protect, getStats);
router.get("/retards", protect, getRetards);

module.exports = router;
