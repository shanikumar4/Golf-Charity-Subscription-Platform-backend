const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    draw: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Draw",
    },

    matchCount: Number,

    prize: {
        type: Number,
        default: 0,
    },

    proofImage: {
        type: String,
        default: null,
    },


    status: {
        type: String,
        enum: ["pending", "verified", "paid"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Winner", winnerSchema);