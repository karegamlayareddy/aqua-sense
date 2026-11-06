const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const supabase = require("./config/db");

const waterRoutes = require("./routes/waterRoutes");
const leakageRoutes = require("./routes/leakageRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// FRONTEND

app.use(express.static(
    path.join(__dirname, "../frontend")
));


// API ROUTES

app.use("/api/water", waterRoutes);

app.use("/api/leakage", leakageRoutes);

app.use("/api/issues", issueRoutes);


// SERVER AND DATABASE STATUS

app.get("/api/status", async (req, res) => {

    const { error } = await supabase
        .from("areas")
        .select("id")
        .limit(1);

    if (error) {
        return res.status(500).json({
            success: false,
            database: "Disconnected",
            message: error.message
        });
    }

    res.json({
        success: true,
        server: "Running",
        database: "Connected",
        project: "AquaSense"
    });

});


// HOME PAGE

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );

});


// ERROR HANDLER

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// START SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("==============================");
    console.log("AQUASENSE SERVER STARTED");
    console.log(`http://localhost:${PORT}`);
    console.log("==============================");

});