const express = require("express");

const router = express.Router();

const cloudinary = require("cloudinary").v2;

const CLOUDINARY_DB_NAME = process.env.CLOUDINARY_DB_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRETE = process.env.CLOUDINARY_API_SECRETE;

cloudinary.config({
  cloud_name: CLOUDINARY_DB_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRETE,
});

router.route("/").post(async (req, res) => {
  console.log("reached", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Failed to upload file" });
        }

        const downloadLink = `https://res.cloudinary.com/${CLOUDINARY_DB_NAME}/image/upload/v${result.version}/${result.public_id}.${result.format}`;

        res.status(200).json({
          url: result.secure_url,
          downloadLink: downloadLink,
        });
      }
    );

    uploadStream.end(req.file.buffer);
    console.log("success");
  } catch (error) {
    console.log("error from file uploader == ", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
