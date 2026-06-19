const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required : true,
        unique:true
    },
    password:{
        type:String,
        required : true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        code: String,
        expiry: Date,
        purpose: {
            type: String,
            enum: ['verification', 'reset']
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("users",userSchema);