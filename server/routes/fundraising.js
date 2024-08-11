const express = require('express');
const router = express.Router();
const fundraisingController = require('../controllers/fundraisingController');

// Route to create a new fundraising page
router.post('/create', fundraisingController.createFundraising);
router.get('/fundraising/:id',fundraisingController.getFundraising);
router.get('/fundraising', fundraisingController.getAllFundraising);

module.exports = router;