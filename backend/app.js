const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', express.static(path.join(__dirname, 'frontend')));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
//   });

app.get('/api', (req, res) => {
  res.send({
    data: [
      {
        id: 'Basics',
        ranges: [8, 16],
        measures: [7],
        markers: [5, 10]
      },
      {
        id: 'Databases',
        ranges: [4, 8],
        measures: [3],
        markers: [2, 6]
      },
      {
        id: 'Java',
        ranges: [10, 20],
        measures: [9],
        markers: [6, 13]
      },
      {
        id: 'React',
        ranges: [8, 16],
        measures: [11],
        markers: [6, 13]
      }
    ]
  });
});

module.exports = app;