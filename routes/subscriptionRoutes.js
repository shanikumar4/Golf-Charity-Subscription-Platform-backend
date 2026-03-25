const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    activateSubscription,
    checkSubscription,
} = require("../controllers/subscriptionController");

// Activate
router.post("/activate", protect, activateSubscription);

// Check
router.get("/status", protect, checkSubscription);

module.exports = router;