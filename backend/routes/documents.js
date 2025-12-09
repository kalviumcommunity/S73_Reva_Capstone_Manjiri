const express = require("express");
const Document = require("../models/Document");
const router = express.Router();

// Create document
router.post("/", async (req, res) => {
  try {
    const { title, description, fileUrl, uploadedBy, category } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ message: "Title and fileUrl are required" });
    }

    const document = new Document({
      title,
      description,
      fileUrl,
      uploadedBy,
      category
    });

    await document.save();
    res.status(201).json(document);
  } catch (err) {
    console.error("Create document error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all documents
router.get("/", async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error("Get documents error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single document
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error("Get document error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update document
router.put("/:id", async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Document not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update document error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete document
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Document deleted" });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
