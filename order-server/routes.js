const express = require('express');
const router = express.Router();
const implementation = require('./implementation');

router.post('/buy/:book_id', implementation.purchase);
 
module.exports = router;
