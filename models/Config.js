const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
    activePrizePool: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
