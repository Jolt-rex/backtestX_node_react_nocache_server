const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User({ username: req.body.username, email: req.body.email, password: req.body.password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ _id: user._id, username: user.username, email: user.email });
});

module.exports = router;