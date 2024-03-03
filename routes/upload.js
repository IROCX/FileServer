var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const Busboy = require("busboy");
const { log } = require("console");
let uploadPath = "./../files/";

router.post("/upload", (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  busboy.on("error", (e) => {
    res.sendStatus(500);
  });

  busboy.on("file", (_, file, fileMetaData) => {
    file.pipe(fs.createWriteStream(uploadPath + "\\" + fileMetaData.filename));
  });

  busboy.on("finish", () => {
    res.sendStatus(200);
  });

  req.pipe(busboy);
});

router.post("/upload-request", (req, res) => {
  newPath = req.body.uploadpath;
  uploadPath = __dirname;

  if (newPath) {
    folderStruc = newPath.split("/");
    folderStruc.forEach((value) => {
      uploadPath = path.join(uploadPath, value);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
    });
  }
  res.sendStatus(200);
});

module.exports = router;
