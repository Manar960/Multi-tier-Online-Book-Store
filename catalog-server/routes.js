const express = require('express');
const router = express.Router();
const implementation = require('./implementation');

router.get('/info/:item_number', implementation.info);
router.get('/search/:topic', implementation.searchBooks);
router.put('/update/:item_number', implementation.searchBooks);

module.exports = router;
