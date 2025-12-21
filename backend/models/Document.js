const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      default: "general",
      trim: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true 
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Document", documentSchema);
