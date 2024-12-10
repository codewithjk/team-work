const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");

const router = express.Router();

const serviceAccount = require("../../../team-work-20ec3-firebase-adminsdk-4jk45-09016eba05.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket(); // Firebase Storage bucket

// Multer middleware for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = req.file.originalname;
    const file = bucket.file(fileName);
    const fileStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype, // Use the file's MIME type
      },
    });

    fileStream.on("error", (error) => {
      console.error("File upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    });

    fileStream.on("finish", async () => {
      await file.makePublic();

      const downloadLink = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      const previewLink = downloadLink;

      res.status(200).json({
        url: downloadLink,
        downloadLink,
        previewLink,
        fileType: req.file.mimetype,
      });
    });

    fileStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error from file uploader:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
