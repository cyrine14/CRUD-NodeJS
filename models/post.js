const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 15
    },
    date: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('Post',postSchema)