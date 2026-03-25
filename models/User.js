const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        // 🔥 Project specific fields
        subscription: {
            status: {
                type: String,
                enum: ["active", "inactive"],
                default: "inactive",
            },
            plan: {
                type: String,
                enum: ["monthly", "yearly"],
                default: null,
            },
            startDate: Date,
            endDate: Date,
        },

        

        charity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Charity",
            default: null,
        },

        charityPercentage: {
            type: Number,
            default: 10, // minimum 10%
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


// 🔐 Password Hash Before Save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// 🔎 Password Compare Method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);

module.exports = User;