
const express = require('express');
const router = express.Router();
const { Strategy, validateStrategy } = require('../models/strategy');
const { User } = require('../models/user');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const query = req.user.isAdmin ? {} : { isPublic: true };
  const strategies = await Strategy.find(query).limit(500);

  res.send(strategies);
});

router.get('/myStrategies', auth, async (req, res) => {

});

router.post('/', auth, async (req, res) => {
  const { error } = validateStrategy(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // TODO check if user has hit limit of strategies they can have
  let { name, description, triggers, isPublic } = req.body;
  console.log(req.user);
  let strategy = new Strategy({ name, description, triggers, isPublic, createdBy: req.user.username });

  await strategy.save();

  await User.findByIdAndUpdate(req.user._id, { $push: { strategies: strategy._id } });

  res.send(strategy);
});

module.exports = router;