const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
const multer = require('multer');

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
app.get('/api', (req, res) => {
  res.send({
    data: [
      {
        id: 'Basics',
        ranges: [6, 10],
        measures: [7],
        markers: [5, 9]
      },
      {
        id: 'Databases',
        ranges: [4, 6],
        measures: [3],
        markers: [2, 5]
      },
      {
        id: 'Java',
        ranges: [10, 16],
        measures: [9.7],
        markers: [6.7, 13.7]
      },
      {
        id: 'React',
        ranges: [8, 14],
        measures: [11],
        markers: [6, 13]
      }
    ]
  });
});

const upload = multer({ dest: 'files/' });

// post route for csv file
app.post('/api', upload.single('file'), (req, res, next) => {
  const file = req.file;

  csv()
    .fromFile(file.path)
    .then(jsonObj => {
      res.send(jsonObj)
    });
})

module.exports = app;