const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        scores: [
            {
                value: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 45,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);