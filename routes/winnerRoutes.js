const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    calculateWinners,
    calculatePrizes,
    uploadProof,
} = require("../controllers/winnerController");

// Calculate winners
router.post("/calculate", protect, calculateWinners);

// Distribute prize
router.post("/prize", protect, calculatePrizes);

// Upload proof
router.post(
    "/upload-proof",
    protect,
    upload.single("image"),
    uploadProof
);

module.exports = router;