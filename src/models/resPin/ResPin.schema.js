const mongoose = require('mongoose');

const ResetPinSchema = new mongoose.Schema({
    pin:{
        type: Number,
        maxlength: 6,
        minlength: 6
    },
    email:{
        type: String,
        maxlength: 50,
        required: true,
    }
})

module.exports = mongoose.model('ResetPinData', ResetPinSchema)
    // model('db table name', Schema)