const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getCharities,
  selectCharity,
} = require("../controllers/charityController");

// Get all charities
router.get("/", getCharities);

// Select charity
router.post("/select", protect, selectCharity);

module.exports = router;