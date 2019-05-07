const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true,
        minlength: 2
    },
    created_at: {
        type: String
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post