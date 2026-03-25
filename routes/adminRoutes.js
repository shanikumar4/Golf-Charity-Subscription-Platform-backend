const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware");

const { addCharity } = require("../controllers/charityController");

// ❤️ Add Charity (Admin only)
router.post("/charity", protect, admin, addCharity);

module.exports = router;