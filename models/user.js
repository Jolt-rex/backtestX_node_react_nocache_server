const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    registeredAt: {
        type: Date,
        required: true
    },
    lastLogon: {
        type: Date,
        required: true
    },
    strategies: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Strategy'
        },
    ]
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id, username: this.username, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey')
    );
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: 
            Joi.string()
            .required()
            .min(3)
            .max(25),
        email: 
            Joi.string()
            .required()
            .min(5)
            .max(255)
            .email(),
        password: 
            Joi.string()
            .required()
            .min(5)
            .max(255)
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;