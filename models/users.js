const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    username: {type: String, unique: true, maxLeght: 255},
    password: {type: String, maxLeght: 255},
    email: {type: String, unique: true},
    name: {type: String},
    avatar: {type: String},
    available: {type: Boolean, default: false},
}, {
    timestamps: true
})

module.exports = mongoose.model('user', Users)