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
          success: false,
          message: "Title and fileUrl are required",
        });
      }

      // Create document instance
      const document = new Document({
        title,
        description,
        fileUrl,
        category,
        uploadedBy: req.user.id,
      });

      // Save to MongoDB
      const savedDocument = await document.save();

      res.status(201).json({
        success: true,
        data: savedDocument,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* ===================== READ ===================== */
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();

    res.status(200).json({
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

/* ===================== UPDATE ===================== */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const updated = await Document.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* ===================== DELETE ===================== */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const deleted = await Document.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      res.json({
        success: true,
        message: "Document deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;


/* No changes were made to the application code. During this process, database operations were performed to 
read existing data and write updates directly into the database. This allowed us to verify the integrity of the stored data and confirm
 that the system correctly reflects the updated information without modifying the application logic.*/