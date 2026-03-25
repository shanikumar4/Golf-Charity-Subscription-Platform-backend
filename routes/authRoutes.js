const express = require("express");
const router = express.Router();

// ✅ correct import
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/authController");

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Password
router.put("/change-password", protect, changePassword);

module.exports = router;