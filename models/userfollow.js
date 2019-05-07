const mongoose = require('mongoose')
const Schema = mongoose.Schema

const followSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    following: {
        type: String,
        required: true
    },
    created_at: {
        type: String
    }
})

const FollowUser = mongoose.model('FollowUser', followSchema)

module.exports = FollowUser