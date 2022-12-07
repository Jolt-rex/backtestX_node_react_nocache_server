const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', async (req, res) => {
    return res.send('User request').status(200);
});

module.exports = router;