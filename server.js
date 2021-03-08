// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const { DateTime, Settings } = require('luxon');
Settings.defaultZoneName = "gmt";

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

const parseStr = [
  (time) => DateTime.fromFormat(time, "MMMM-d-yyyy"),
  (time) => DateTime.fromFormat(time, "MMMM-dd-yyyy"),
  (time) => DateTime.fromFormat(time, "LLLL-dd-yyyy"),
  (time) => DateTime.fromFormat(time, "dd-LLLL-yyyy"),
  (time) => DateTime.fromHTTP(time),
  (time) => DateTime.fromISO(time)
];

const parseNum = [
  (time) => DateTime.fromMillis(time)
]

function tryParseInt(str) {
  if (str.includes("-")) {
    return str;
  } else {
    let res = parseInt(str);
    if (isNaN(res)) return str;
    else if (typeof res === 'number') return res;
  }
}

function tryParse(time) {
  let parsedTimes;
  let formattedTime = tryParseInt(time);

  if (typeof formattedTime === 'number') {
    parsedTimes = parseNum.map((parse) => parse(formattedTime))
  } else {
    parsedTimes = parseStr.map((parse) => parse(formattedTime));
  }
  let result = null;
  
  for (var i = 0; i < parsedTimes.length; i++) {
    if (parsedTimes[i] !== null) result = parsedTimes[i];
  }

  return result;
}

// your first API endpoint... 
app.get('/api/timestamp/:timestamp', (req, res) => {
  const dt = tryParse(req.params.timestamp);
  res.json({ unix: dt.toMillis(), utc: dt.toHTTP() })
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port + ', or possibly http://localhost:' + listener.address().port);
});
