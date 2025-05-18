const express = require('express');
const router = express.Router();
const { createPoll } = require('../controllers/pollController');

router.post('/', createPoll);

module.exports = router;