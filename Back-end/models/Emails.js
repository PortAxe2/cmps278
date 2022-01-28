const mongoose = require('mongoose');


const EmailsSchema = mongoose.Schema({
    num: {
        type: String,
        required: true
    },
    
    emails: {
        type: Array,
        required: false
    }

});

module.exports = mongoose.model('Emails', EmailsSchema);