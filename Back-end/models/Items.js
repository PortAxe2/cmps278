const mongoose = require('mongoose');

const ItemsSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },

    itemDesc: {
        type: String,
        requried: true
    },

    itemType: {
        type: String,
        required: true
    },

    itemImageURL: {
        type: String,
        required: true
    },

    averageRating: {
        type: Number,
        required: true
    },

    totalNumReviews: {
        type: Number,
        required: true
    },

    itemGenre: {
        type: Array,
        required: true
    },

    itemPrice: {
        type: Number,
        required: true
    },

    movieTrailerURL: {
        type: String,
        required: false
    },

    movieCast: {
        type: Array,
        required: false
    },

    movieCredit: {
        type: String,
        required: false
    },

    extraImages: {
        type: Array,
        required: false
    },

    releaseDate: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model('Items', ItemsSchema);