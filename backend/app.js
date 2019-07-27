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

// get route for specific cycle file
app.get('/api/:fileName', (req, res, next) => {
  const filePath = `files/${req.params.fileName}.csv`;

  // check if file exists in ./files
  if (fs.existsSync(filePath)) {
    csv()
      .fromFile(filePath)
      .then(jsonObj => {
        res.send(jsonObj)
      }).catch(err => {
        res.status(500).send('Error parsing CSV');
        console.log('Error parsing CSV at ' + filePath, err);
      });
  } else {
    res.status(404).send('File does not exist');
  }
});

// get route for all cycle files
app.get('/api', (req, res, next) => {
  const dirPath = path.join(__dirname, '/../files');
  // get all csv files in file dir
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      res.status(500).send('Error getting files');
      console.log('Error getting files from files directory', err);
    } else {
      // parse each file async and return as promises
      const parsedFiles = files.map(async file => {
        const filePath = `${dirPath}/${file}`;
        try {
          return await csv().fromFile(filePath);
        } catch (err) {
          res.status(500).send('Error parsing CSV');
          console.log('Error parsing CSV at ' + filePath, err);
        }
      });
      // resolve promises and send parsed csv data with file names
      Promise.all(parsedFiles).then(data => {
        res.send({ fileNames: files, data });
      }).catch(err => {
        res.status(500).send('Error resolving CSV data');
        console.log('Error resolving CSV data', err);
      });
    }
  });
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