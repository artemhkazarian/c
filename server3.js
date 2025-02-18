const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

// Verify Firebase Auth Token (Middleware)
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
};

// Protected route (Only accessible with a valid token)
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({ message: "You have accessed a protected route!", user: req.user });
});

app.get("/api/free", (req, res) => {
    res.json({ message: "You have accessed a free route!", user: req.user });
});
