const mongoose = require('mongoose');
const Joi = require('joi');

const strategySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 255
  },
  triggers: {
    type: Array,
    required: true,
    maxlength: 50
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  createdBy: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Date,
    required: true,
    default: new Date()
  },
  isPublic: {
    type: Boolean,
    required: true
  }
});

function validateStrategy(strategy) {
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(20),
    description: Joi.string().min(3).max(255),
    triggers: Joi.array().required().max(50),
    isPublic: Joi.boolean().required(),
  });

  return schema.validate(strategy);
}

const Strategy = mongoose.model('Strategy', strategySchema);

exports.Strategy = Strategy;
exports.validateStrategy = validateStrategy;