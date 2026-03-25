const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware");

const { addCharity } = require("../controllers/charityController");
const {
    getAllUsers
} = require("../controllers/authController");

//  Add Charity (Admin only)
router.post("/charity", protect, admin, addCharity);
router.get("/users", protect, admin, getAllUsers);

module.exports = router;