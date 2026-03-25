const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema({
    winningNumbers: {
        type: [Number],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Draw", drawSchema);