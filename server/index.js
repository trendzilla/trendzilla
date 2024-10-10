const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Admin = require("./models/Admin");
dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const JWT_SECRET = "A@9dj34FhG2QWxM1N!sd9D$fJQ9xq3T"; //key

// Register API endpoint
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Save the user in MongoDB
    const newUser = new User({ email, password });
    await newUser.save();

    // Dynamically import Firebase Firestore functions
    const { db, collection, addDoc } = await import(
      "../client/src/firebase.js"
    );

    // Save the user in Firebase Firestore
    try {
      const firebaseUserRef = await addDoc(collection(db, "users"), {
        email,
        createdAt: new Date().toISOString(),
      });
      console.log("User added to Firebase with ID:", firebaseUserRef.id);
    } catch (firebaseError) {
      console.error("Error saving user to Firebase:", firebaseError);
      return res.status(500).json({
        message:
          "User registered in MongoDB but failed to register in Firebase",
        error: firebaseError.message,
      });
    }

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login API endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/isAdmin", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const admin = await Admin.findOne({ email: user.email });

    if (!admin) {
      return res.status(403).json({ message: "User is not an admin" });
    }

    res.json({ isAdmin: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
