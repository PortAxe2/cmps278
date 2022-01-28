const mongoose = require('mongoose');


const ItemsReviewSchema = mongoose.Schema({
    itemID: {
        type: String,
        required: true
    },
    
    reviewerUsername: {
        type: String,
        required: true
    },

    reviewerPicture: {
        type: String,
        required: true
    },

    reviewText: {
        type: String,
        required: true
    },

    numberOfLikes: {
        type: Number,
        required: true
    },

    numberOfDisLikes: {
        type: Number,
        required: true
    },

    replies: {
        type: Array,
        required: false
    },

    likedby: {
        type: Array,
        required: false
    },

    dislikedby: {
        type: Array,
        required: false
    },

    reports: {
        type: Array,
        required: false
    }

});

module.exports = mongoose.model('ItemsReview', ItemsReviewSchema);