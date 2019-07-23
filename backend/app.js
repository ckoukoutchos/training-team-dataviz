const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use react build file 
app.use(express.static(path.join(__dirname, 'build')));

// serve react bundle for base url
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// get route for parsed csv data
app.get('/api/:fileName', (req, res, next) => {
  const filePath = `files/${req.params.fileName}.csv`;

  // check if file exists in ./files
  // if (fs.existsSync(filePath)) {
  //   csv()
  //     .fromFile(filePath)
  //     .then(jsonObj => {
  //       res.send(jsonObj)
  //     }).catch(err => {
  //       res.status(500).send('Error parsing CSV');
  //     });
  // } else {
  //   res.status(404).send('File does not exist');
  // }
  res.status(404).send('File does not exist');
});

// multer storage config
const storage = multer.diskStorage({
  // location to store csv files
  destination: (req, file, cb) => {
    cb(null, 'files/');
  },
  // uses original file name for storage file name
  filename: (req, file, cb) => {
    cb(null, req.params.cycleName + '.csv')
  }
})

// pass config to multer
const upload = multer({ storage });

// post route for csv file
app.post('/api/:cycleName', upload.single('file'), (req, res, next) => {
  // parse csv file to json object
  csv()
    .fromFile(req.file.path)
    .then(jsonObj => {
      res.send(jsonObj)
    }).catch(err => {
      res.status(500).send('Error parsing CSV');
    });
})

module.exports = app;