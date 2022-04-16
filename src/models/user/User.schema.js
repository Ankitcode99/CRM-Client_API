const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        maxlength: 50,
        required: true
    },
    company:{
        type: String,
        maxlength: 50,
        required:true
    },
    address:{
        type: String,
        maxlength: 100,
    },
    phone:{
        type: Number,
        maxlength: 11
    },
    email:{
        type: String,
        maxlength: 50,
        required: true,
        unique:true
    },
    password:{
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true
    }  
})

module.exports = {
    // model('db table name', Schema)
    UserSchema : mongoose.model('User', UserSchema)
};