const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getDashboard,
    getWinnings,
} = require("../controllers/dashboardController");

// Dashboard
router.get("/", protect, getDashboard);

// Winnings
router.get("/winnings", protect, getWinnings);

module.exports = router;