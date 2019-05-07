const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/socialnetwork', {useNewUrlParser: true});

module.exports = mongoose
