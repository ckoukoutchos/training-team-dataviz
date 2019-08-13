const express = require('express');
const router = express.Router();
const CycleService = require('./cycle-service');
const service = new CycleService();

router.get('/', (req, res) => {
	service.retrieveAllCycleData(req, res);
});

router.get('/:id', (req, res) => {
	service.retrieveCycleData(req, res);
});

module.exports = router;