// 1. Models import karein (Sabse upar)
const User = require('../models/User');
const Charity = require('../models/Charity');
const Draw = require('../models/Draw');

// 2. Dashboard Stats ka function
const getAdminDashboardStats = async (req, res) => {
    try {
        // Total Users
        const totalUsers = await User.countDocuments();

        // Active Subscriptions (Aapke database me field ka naam 'subscriptionStatus' hai)
        const activeSubscriptions = await User.countDocuments({ subscriptionStatus: 'active' });

        // Total Charities
        const totalCharities = await Charity.countDocuments();

        // Total Draws
        const totalDraws = await Draw.countDocuments();

        // Frontend ko response bhej dein
        res.status(200).json({
            dashboard: {
                totalUsers,
                activeSubscriptions,
                totalCharities,
                totalDraws
            }
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
};

// 3. Module exports me is function ko zaroor add karein, jaise:
module.exports = {
    // ... aapke purane functions (addCharity wagera),
    getAdminDashboardStats
};