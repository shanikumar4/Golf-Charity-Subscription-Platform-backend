const User = require("../models/User");
const Score = require("../models/Score");
const Winner = require("../models/Winner");
const Draw = require("../models/Draw");
const Config = require("../models/Config");

// 📊 User Dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 FIX: add .lean()
    const user = await User.findById(userId)
      .populate("charity")
      .lean();

    const scoreData = await Score.findOne({ user: userId });
    const winnings = await Winner.find({ user: userId, status: "approved" });

    const totalWinnings = winnings.reduce((acc, w) => acc + w.prize, 0);

    const latestDraw = await Draw.findOne().sort({ _id: -1 });
    const latestResult = latestDraw ? await Winner.findOne({ user: userId, draw: latestDraw._id }).populate("draw") : null;
    const participationHistory = await Winner.find({ user: userId }).populate("draw").sort({ createdAt: -1 });

    const config = await Config.findOne();
    const activePrizePool = config ? config.activePrizePool : 0;

    res.json({
      subscription: user.subscription,

      charity: user.charity
        ? {
            _id: user.charity._id,
            name: user.charity.name,
            description: user.charity.description,
            percentage: user.charityPercentage ?? 0, 
          }
        : null,

      scores: scoreData ? scoreData.scores : [],
      totalWinnings,
      latestDraw,
      latestResult,
      participationHistory,
      activePrizePool,
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