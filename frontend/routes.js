const express = require('express');
const router = express.Router();
const implementation = require('./implementation');

router.get('/info/:item_number', implementation.info);
router.get('/search/:topic', implementation.searchBooks);
router.post('/buy/:item_number', implementation.purchase);

module.exports = router;
