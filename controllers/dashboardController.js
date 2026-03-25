const User = require("../models/User");
const Score = require("../models/Score");
const Winner = require("../models/Winner");

// 📊 User Dashboard
const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        // user
        const user = await User.findById(userId).populate("charity");

        // scores
        const scoreData = await Score.findOne({ user: userId });

        // winnings
        const winnings = await Winner.find({ user: userId, status: "approved" });

        const totalWinnings = winnings.reduce((acc, w) => acc + w.prize, 0);

        res.json({
            subscription: user.subscription,
            // Humne yahan 'percentage' ko user model se uthakar charity details ke saath bhej diya 🔥
            charity: user.charity ? {
                ...user.charity.toObject(), // Charity model ka saara data (name, desc etc.)
                percentage: user.charityPercentage || 0 // User model se percentage
            } : null,
            scores: scoreData ? scoreData.scores : [],
            totalWinnings,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWinnings = async (req, res) => {
  try {
    const winnings = await Winner.find({
      user: req.user._id,
      status: "approved",
    });

    res.json(winnings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getWinnings,
};