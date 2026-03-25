const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { addScore, getScores } = require("../controllers/scoreController");

// ➕ Add score
router.post("/", protect, addScore);

// 📥 Get scores
router.get("/", protect, getScores);

module.exports = router;