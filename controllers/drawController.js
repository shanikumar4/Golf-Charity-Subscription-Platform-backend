const Draw = require("../models/Draw");
const generateDrawNumbers = require("../utils/drawGenerator");

// 🎯 Create Draw
const createDraw = async (req, res) => {
    try {
        // TEMPORARY: Hardcoded numbers for testing winner functionality
        // const numbers = generateDrawNumbers();
        const numbers = [1, 2, 3, 4, 5]; // Replace these with whichever 5 numbers you want to test!

        const draw = await Draw.create({
            winningNumbers: numbers,
        });

        res.json({
            message: "Draw generated",
            draw,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 📥 Get latest draw
const getLatestDraw = async (req, res) => {
    try {
        const draw = await Draw.findOne().sort({ _id: -1 });
        if (!draw) return res.json(null);

        const Winner = require("../models/Winner");
        const allResults = await Winner.find({ draw: draw._id }).populate("user", "fullName email");

        const participants = allResults.length;
        const winners = allResults.filter(w => w.matchCount >= 3).sort((a, b) => b.matchCount - a.matchCount);

        res.json({
            draw,
            participants,
            winners,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDraw,
    getLatestDraw,
};