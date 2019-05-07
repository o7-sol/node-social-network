const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 5,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
        required: true
    },
    created_at: {
        type: String
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User