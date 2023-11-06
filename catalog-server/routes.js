const express = require('express');
const router = express.Router();
const implementation = require('./implementation');

router.get('/query/:method/:param', implementation.info);
router.put('/update/:book_id', implementation.update);

module.exports = router;
