const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const accessLogStream = require("./utils/logStream");
var uploadRoutes = require("./routes/upload");

app.use(morgan("combined", { stream: accessLogStream }));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("static"));
app.use(cors());
app.use(express.json());
app.use(uploadRoutes);

app.get("/", (req, res) => {
  res.render("upload");
});

PORT = process.env.PORT || 5000;
IP = process.env.PORT || "0.0.0.0";
var server = app.listen(PORT, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log("\n  listening at http://%s:%s", host, port);
});
