const Charity = require("../models/Charity");
const User = require("../models/User");


const addCharity = async (req, res) => {
    try {
        const { name, description } = req.body;

        const charity = await Charity.create({
            name,
            description,
        });

        res.json({
            message: "Charity added",
            charity,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📥 Get all charities
const getCharities = async (req, res) => {
    try {
        const charities = await Charity.find();
        res.json(charities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ❤️ Select charity
const selectCharity = async (req, res) => {
    try {
        const { charityId, percentage } = req.body;

        if (percentage < 10) {
            return res.status(400).json({
                message: "Minimum 10% donation required",
            });
        }

        const charity = await Charity.findById(charityId);
        if (!charity) {
            return res.status(404).json({
                message: "Charity not found",
            });
        }

        const user = await User.findById(req.user._id);

        user.charity = charityId;
        user.charityPercentage = percentage;

        await user.save();

        res.json({
            message: "Charity selected",
            charity,
            percentage,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCharities,
    selectCharity,
    addCharity,
};