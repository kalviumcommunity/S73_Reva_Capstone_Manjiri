const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "headmistress", "principal"],
      default: "student"
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = 10;
    const hashed = await bcryptjs.hash(this.password, saltRounds);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcryptjs.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
