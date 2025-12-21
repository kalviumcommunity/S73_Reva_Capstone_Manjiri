const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authRouter = express.Router();

/* ===================== USER SCHEMA ===================== */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    }
  },
  { timestamps: true }
);

/* ===================== PASSWORD HASH ===================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);

/* ===================== MIDDLEWARE ===================== */
const authenticateToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

/* ===================== ROUTES ===================== */

// REGISTER
authRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role
    });

    const token = user.generateToken();
    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateToken();
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ME
authRouter.get("/me", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, data: user });
});

/* ===================== EXPORTS ===================== */
module.exports = {
  authRouter,
  authenticateToken,
  authorizeRoles
};
