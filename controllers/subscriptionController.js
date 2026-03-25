const User = require("../models/User");

// 🟢 Activate Subscription
const activateSubscription = async (req, res) => {
    try {
        const { plan } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let endDate;

        if (plan === "monthly") {
            endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan === "yearly") {
            endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            return res.status(400).json({ message: "Invalid plan" });
        }

        user.subscription = {
            status: "active",
            plan,
            startDate: new Date(),
            endDate,
        };

        await user.save();

        res.json({
            message: "Subscription activated",
            subscription: user.subscription,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔴 Check Subscription Status
const checkSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.subscription || user.subscription.status === "inactive") {
            return res.json({ status: "inactive" });
        }

        // expire check
        if (new Date() > user.subscription.endDate) {
            user.subscription.status = "inactive";
            await user.save();

            return res.json({ status: "expired" });
        }

        res.json({
            status: "active",
            subscription: user.subscription,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    activateSubscription,
    checkSubscription,
};