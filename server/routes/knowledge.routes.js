import express from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import auth from "../middleware/auth.js";
import Knowledge from "../models/Knowledge.js";
import { processDocumentText } from "../services/embedding.service.js";

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/upload", auth, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // 1. Extract text from PDF buffer
    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    const rawText = pdfData.text;
    await parser.destroy();

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract any text from the PDF" });
    }

    // 2. Process text: chunk and generate embeddings
    const processedChunks = await processDocumentText(rawText);

    // 3. Save to database
    const knowledgeDocs = processedChunks.map(chunk => ({
      userId: req.user.id,
      fileName: req.file.originalname,
      text: chunk.text,
      embedding: chunk.embedding
    }));

    await Knowledge.insertMany(knowledgeDocs);

    res.status(200).json({ 
      message: "Document successfully processed and added to your knowledge base.",
      chunksAdded: knowledgeDocs.length
    });

  } catch (error) {
    console.error("Knowledge upload error:", error);
    res.status(500).json({ message: "An error occurred while processing the document." });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    // Get unique file names the user has uploaded
    const files = await Knowledge.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: "$fileName", count: { $sum: 1 } } },
      { $project: { _id: 0, fileName: "$_id", chunks: "$count" } }
    ]);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching knowledge documents." });
  }
});

router.delete("/:fileName", auth, async (req, res) => {
  try {
    await Knowledge.deleteMany({ userId: req.user.id, fileName: req.params.fileName });
    res.json({ message: "Document removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting document." });
  }
});

export default router;
