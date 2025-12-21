const express = require("express");
const Document = require("../models/Document");
const { authenticateToken, authorizeRoles } = require("./auth");

const router = express.Router();

/* ===================== CREATE ===================== */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const { title, fileUrl, description, category } = req.body;

      if (!title || !fileUrl) {
        return res.status(400).json({
          message: "Title and fileUrl are required"
        });
      }

      const document = await Document.create({
        title,
        description,
        fileUrl,
        category,
        uploadedBy: req.user.id
      });

      res.status(201).json({ success: true, data: document });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ===================== READ ===================== */
router.get("/", async (req, res) => {
  res.json({ success: true, message: "Documents route working" });
});

/* ===================== UPDATE ===================== */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ success: true, data: updated });
  }
);

/* ===================== DELETE ===================== */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const deleted = await Document.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ success: true, message: "Document deleted" });
  }
);

/*test*/

router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();
    res.json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
});

module.exports = router;


