const Draw = require("../models/Draw");
const generateDrawNumbers = require("../utils/drawGenerator");

// 🎯 Create Draw
const createDraw = async (req, res) => {
    try {
        const numbers = generateDrawNumbers();

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
        const draw = await Draw.findOne().sort({ createdAt: -1 });

        res.json(draw);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDraw,
    getLatestDraw,
};