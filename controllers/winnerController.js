const Score = require("../models/Score");
const Draw = require("../models/Draw");
const Winner = require("../models/Winner");
const calculateMatches = require("../utils/matchCalculator");

// 🎯 Calculate Winners
const calculateWinners = async (req, res) => {
    try {
        const latestDraw = await Draw.findOne().sort({ createdAt: -1 });

        if (!latestDraw) {
            return res.status(404).json({ message: "No draw found" });
        }

        const allScores = await Score.find();

        let winners = [];

        for (let userScore of allScores) {
            const matches = calculateMatches(
                userScore.scores,
                latestDraw.winningNumbers
            );

            if (matches >= 3) {
                const winner = await Winner.create({
                    user: userScore.user,
                    draw: latestDraw._id,
                    matchCount: matches,
                });

                winners.push(winner);
            }
        }

        res.json({
            message: "Winners calculated",
            totalWinners: winners.length,
            winners,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const calculatePrizes = async (req, res) => {
    try {
        const totalPool = req.body.totalPool; // manual for now

        const winners = await Winner.find();

        let match5 = winners.filter(w => w.matchCount === 5);
        let match4 = winners.filter(w => w.matchCount === 4);
        let match3 = winners.filter(w => w.matchCount === 3);

        const pool5 = totalPool * 0.40;
        const pool4 = totalPool * 0.35;
        const pool3 = totalPool * 0.25;

        // distribute
        for (let w of match5) {
            w.prize = pool5 / match5.length || 0;
            await w.save();
        }

        for (let w of match4) {
            w.prize = pool4 / match4.length || 0;
            await w.save();
        }

        for (let w of match3) {
            w.prize = pool3 / match3.length || 0;
            await w.save();
        }

        res.json({
            message: "Prizes distributed successfully",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const uploadProof = async (req, res) => {
    try {
        const { winnerId } = req.body;

        const winner = await Winner.findById(winnerId);

        if (!winner) {
            return res.status(404).json({ message: "Winner not found" });
        }

        // owner check
        if (winner.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        // 🔥 Cloudinary image URL
        winner.proofImage = req.file.path;

        winner.status = "pending";

        await winner.save();

        res.json({
            message: "Proof uploaded",
            image: req.file.path,
            winner,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    calculateWinners,
    calculatePrizes,
    uploadProof,
};