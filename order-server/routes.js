const express = require('express');
const router = express.Router();
const implementation = require('./implementation');

router.put('/buy/:book_id', implementation.purchase);

module.exports = router;
