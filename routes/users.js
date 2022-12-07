const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', async (req, res) => {
    console.log('user get req')
});

module.exports = router;