const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v -strategies -isAdmin');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }]});
    if (user) return res.status(400).send('User already registered');

    user = new User({ username: req.body.username, email: req.body.email, password: req.body.password, registeredAt: new Date(), lastLogon: new Date() });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ _id: user._id, username: user.username, email: user.email });
});

router.put('/', auth, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = await User.findByIdAndUpdate(req.user._id, { password });

    if (!user) return res.status(400).send('User id is not valid');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ _id: user._id, username: user.username, email: user.email });
})

router.delete('/me', auth, async (req, res) => {
    const user = await User.findByIdAndRemove(req.user._id);
    if (!user) return res.status(404).send('User not found');

    res.send({ _id: user._id, user: user.username, email: user.email });
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('User not found');

    res.send(user);
})

module.exports = router;