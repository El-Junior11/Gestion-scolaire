const express = require("express");
const router = express.Router();
const { login, me, updateProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", protect, me);
router.put("/me", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
