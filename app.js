const express = require("express");
const fs = require("fs");
const Busboy = require("busboy");
// var busboy_connect = require('connect-busboy');
const app = express();
const morgan = require("morgan");
const path = require("path");

const cors = require("cors");
var formidable = require("formidable");
const moment = require("moment-timezone");
const { time } = require("console");
const { now } = require("moment-timezone");
const { WSAEINVAL } = require("constants");
const { env } = require("process");

const accessLogStream = require("./utils/logStream");

app.use(morgan("combined", { stream: accessLogStream }));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("static"));
app.use(cors());
// app.use(busboy_connect());
app.use(express.json());

let uploadPath = "";

app.get("/", (req, res) => {
  res.render("upload");
});
app.post("/upload", (req, res) => {
  console.log("js pinged");

  // var form = new formidable.IncomingForm();
  // const baseAddress = __dirname
  // var upload_path = ''
  const busboy = Busboy({ headers: req.headers });

  busboy.on("error", (e) => {
    console.log("error == ", e);
    res.sendStatus(500);
  });

  busboy.on("file", (_, file, filename) => {
    console.log(uploadPath + "\\" + filename);
    file.pipe(fs.createWriteStream(uploadPath + "\\" + filename));
  });

  busboy.on("finish", () => {
    console.log("Completed");
    res.sendStatus(200);
  });

  req.pipe(busboy);
  // var fstream;
  // const baseAddress = __dirname + '\\'
  // var m = meter()
  // req.pipe(req.busboy, m);
  // var progress = 0
  // const total = req.headers['content-length']

  // req.busboy.on('file', function (fieldname, file, filename) {
  //     if (req.body.folder){
  //         console.log('address changes')
  //         baseAddress = baseAddress + '\\' + req.body.folder + "\\"
  //     }
  //     console.log("Uploading: " + filename + ' at ' + baseAddress);
  //     //Path where image will be uploaded
  //     fstream = fs.createWriteStream(baseAddress +  filename);
  //     file.on('data', (data) => {
  //         fstream.write(data, () => {
  //             progress += data.length
  //             console.log(progress, (progress / total) * 100)
  //             // res.emit((progress / total) * 100 + '')
  //         })
  //     });
  //     file.on('end', function () {
  //         console.log("Upload Finished of " + filename);
  //         fstream.end()

  //     });
  // });

  // busboy.on('finish', function () {
  //     console.log('finish')
  //     // res.redirect('/');
  // });
});
app.post("/upload-request", (req, res) => {
  newPath = req.body.uploadpath;
  console.log(req.body);
  console.log("newPAth", newPath);
  uploadPath = __dirname;
  if (newPath) {
    folderStruc = newPath.split("/");
    folderStruc.forEach((value) => {
      uploadPath = path.join(uploadPath, value);
      if (!fs.existsSync(uploadPath)) {
        console.log("creating.................");
        fs.mkdirSync(uploadPath);
      }
    });
  }

  console.log("final PAth", uploadPath);
  res.sendStatus(200);
});
PORT = process.env.PORT || 5000;
IP = process.env.PORT || "0.0.0.0";
var server = app.listen(PORT, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log("\n  listening at http://%s:%s", host, port);
});
console.log("server at 5000");
