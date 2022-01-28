const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    userImageURL: {
        type: String,
        required: true
    },

    wishlistIDs: {
        type: Array,
        required: true
    },

    lastVisited: {
        type: Array,
        required: true
    }

});

module.exports = mongoose.model('Users', UserSchema);