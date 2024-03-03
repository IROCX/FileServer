
// create a rotating write stream
const path = require("path");
const rfs = require("rotating-file-stream");
const morgan = require("morgan");
const moment = require("moment-timezone");

let date = new Date();
var logfile = `log-${date.toISOString().split("T")[0]}.log`;

var accessLogStream = rfs.createStream(logfile, {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
morgan.token("date", (req, res) => {
  return moment().tz("Asia/Kolkata").format();
});

module.exports = accessLogStream;
