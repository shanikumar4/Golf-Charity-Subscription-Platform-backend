const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const allowedOrigins = [
    "http://localhost:5000", // local frontend
    "https://golfgives-efvnren6g-shanikumar4s-projects.vercel.app",
    "https://golfgives-olive.vercel.app",
    "https://golfgives-fk9a.vercel.app",
    "https://golfgives-fk9a-7nrtpjvm2-shanikumar4s-projects.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("Blocked Origin:", origin); // 👈 debugging
                callback(new Error("CORS not allowed"));
            }
        },
        credentials: true,
    })
);


// 🔥 Routes
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

const scoreRoutes = require('./routes/scoreRoutes');

app.use('/api/score', scoreRoutes);

const drawRoutes = require("./routes/drawRoutes");

app.use("/api/draw", drawRoutes);

const winnerRoutes = require("./routes/winnerRoutes");

app.use("/api/winner", winnerRoutes);

const subscriptionRoutes = require("./routes/subscriptionRoutes");

app.use("/api/subscription", subscriptionRoutes);

const charityRoutes = require("./routes/charityRoutes");

app.use("/api/charity", charityRoutes);

const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const configRoutes = require("./routes/configRoutes");
app.use("/api/config", configRoutes);

// test route
app.get('/', (req, res) => {
    res.send("API Running 🚀");
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});