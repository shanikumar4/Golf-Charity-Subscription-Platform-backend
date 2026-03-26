const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware");
const { getConfig, setPrizePool } = require("../controllers/configController");

router.get("/", protect, getConfig);
router.post("/pool", protect, admin, setPrizePool);

module.exports = router;
