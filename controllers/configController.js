const Config = require("../models/Config");

const getActiveConfig = async () => {
    let config = await Config.findOne();
    if (!config) {
        config = await Config.create({ activePrizePool: 0 });
    }
    return config;
};

const getConfig = async (req, res) => {
    try {
        const config = await getActiveConfig();
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const setPrizePool = async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Only Admins should logically trigger this route, secured by middleware in routes
        let config = await getActiveConfig();
        config.activePrizePool = Number(amount) || 0;
        await config.save();
        
        res.json({
            message: "Prize pool updated successfully",
            config
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getConfig,
    setPrizePool
};
