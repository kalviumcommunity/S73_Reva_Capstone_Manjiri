// auth.js - Authentication System with JWT

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authRouter = express.Router();

// ==================== USER SCHEMA ====================

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, { timestamps: true });

// ==================== PASSWORD HASH ====================

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// ==================== JWT ====================

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const User = mongoose.model('User', userSchema);

// ==================== MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // { id, role }
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  };
};

// ==================== ROUTES ====================

// REGISTER
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password, fullName, role });
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Provide username and password' });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ME ✅ FIXED
authRouter.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PROFILE
authRouter.put('/profile', authenticateToken, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({ success: true, data: user });
});

// CHANGE PASSWORD
authRouter.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Wrong current password' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated' });
});

// ==================== EXPORT ====================

module.exports = {
  User,
  authRouter,
  authenticateToken,
  authorizeRoles
};

//help me push the code and create prquest
// To push the code and create a pull request, follow these steps:  
// 1. Initialize a Git repository (if you haven't already):
//    git init  
// 2. Add the files to staging:
//    git add backend/routes/auth.js
// 3. Commit the changes:
//    git commit -m "Add authentication system with JWT"
// 4. Create a new branch for your changes:
//    git checkout -b add-auth-system
// 5. Push the branch to your remote repository:
//    git push origin add-auth-system
// 6. Go to your repository on GitHub (or your Git hosting service) and create a new pull request from the branch you just pushed.
