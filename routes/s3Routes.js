const multer = require("multer");
const express = require("express");
const router = express.Router();
const { s3UploadV2, s3UploadV3 } = require("../aws/s3Service");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10000000000 },
});

router.post("/Upload", upload.single("File"), async (req, res) => {
  try {
    const results = await s3UploadV2(req.file, req.file.mimetype);
    if (results && results.Location) {
      const response = {
        message: "Upload Successfully",
        isSuccess: true,
        data: results.Location,
      };

      return res.status(200).send(response);
    } else {
      const response = {
        message: "Upload Failed",
        isSuccess: false,
        data: null,
      };

      return res.status(404).send(response);
    }
  } catch (err) {
    const response = {
      message: err.message,
      isSuccess: false,
      data: null,
    };

    return res.status(404).send(response);
  }
});

module.exports = router;
