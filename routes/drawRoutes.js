const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { createDraw, getLatestDraw } = require("../controllers/drawController");

// Create draw (admin later restrict kar sakte hain)
router.post("/", protect, createDraw);

// Get latest draw
router.get("/latest", protect, getLatestDraw);

module.exports = router;