const Score = require("../models/Score");

// ➕ Add Score
const addScore = async (req, res) => {
    try {
        const { value } = req.body;
        const User = require("../models/User");
        const user = await User.findById(req.user._id);

        if (!user.subscription || user.subscription.status !== "active") {
            return res.status(403).json({
                message: "Active subscription required",
            });
        }

        if (!value || value < 1 || value > 45) {
            return res.status(400).json({
                message: "Score must be between 1 and 45",
            });
        }

        let userScore = await Score.findOne({ user: req.user._id });

        // Agar user ka record nahi hai → create karo
        if (!userScore) {
            userScore = await Score.create({
                user: req.user._id,
                scores: [{ value }],
            });
        } else {
            // Max 5 scores logic 🔥
            if (userScore.scores.length >= 5) {
                userScore.scores.shift(); // oldest remove
            }

            userScore.scores.push({ value });

            await userScore.save();
        }

        res.status(200).json({
            message: "Score added successfully",
            scores: userScore.scores,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 📥 Get Scores
const getScores = async (req, res) => {
    try {
        const userScore = await Score.findOne({ user: req.user._id }).lean();

        if (!userScore) {
            return res.json({ scores: [] });
        }

        // Return scores in reversed order (newest first)
        const sortedScores = userScore.scores ? userScore.scores.slice().reverse() : [];
        userScore.scores = sortedScores;

        res.json(userScore);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addScore,
    getScores,
};