
const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
require("dotenv").config();

const router = express.Router();

// const serviceAccount = require("../../../team-work-20ec3-firebase-adminsdk-4jk45-09016eba05.json");
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket(); // Firebase Storage bucket


// Multer middleware for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const fileName = file.originalname;
          const storageFile = bucket.file(fileName);
          const fileStream = storageFile.createWriteStream({
            metadata: {
              contentType: file.mimetype, // Use the file's MIME type
            },
          });

          fileStream.on("error", (error) => {
            console.error(`Error uploading file ${fileName}:`, error);
            reject({ error: `Failed to upload file: ${fileName}` });
          });

          fileStream.on("finish", async () => {
            try {
              await storageFile.makePublic();

              const downloadLink = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              resolve({
                url: downloadLink,
                downloadLink,
                previewLink: downloadLink,
                fileType: file.mimetype,
              });
            } catch (error) {
              console.error(`Error making file public: ${fileName}`, error);
              reject({ error: `Failed to make file public: ${fileName}` });
            }
          });

          fileStream.end(file.buffer);
        });
      })
    );

    res.status(200).json(uploadResults);
  } catch (error) {
    console.error("Error during file uploads:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
});

module.exports = router;
