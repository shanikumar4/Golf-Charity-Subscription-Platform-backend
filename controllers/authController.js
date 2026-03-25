const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};


// ==========================
// 🔵 REGISTER USER
// ==========================
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user (password hashing model me ho raha hai)
        const user = await User.create({
            fullName,
            email,
            password,
        });

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==========================
// 🔵 LOGIN USER
// ==========================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {

            if (user.isBlocked) {
                return res.status(403).json({
                    message: "User is blocked by admin",
                });
            }

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });

        } else {
            res.status(401).json({
                message: "Invalid email or password",
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==========================
// 🔵 GET PROFILE (Protected)
// ==========================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==========================
// 🔵 UPDATE PROFILE
// ==========================
const updateProfile = async (req, res) => {
    try {
        const { fullName, charity, charityPercentage } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (fullName) user.fullName = fullName;
        if (charity) user.charity = charity;
        if (charityPercentage) user.charityPercentage = charityPercentage;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            charity: updatedUser.charity,
            charityPercentage: updatedUser.charityPercentage,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==========================
// 🔵 CHANGE PASSWORD
// ==========================
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect",
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            message: "Password changed successfully",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
};