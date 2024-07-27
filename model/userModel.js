const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    userImage: {
        type: String,
        default: null,
    },
    passwordHistory: [
        {
            password: { type: String, required: true },
            changedAt: { type: Date, required: true }
        }
    ],
    passwordChangedAt: {
        type: Date,
        default: Date.now,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
    }
});

const Users = mongoose.model('users', userSchema);
module.exports = Users;