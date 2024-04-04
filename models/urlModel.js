const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    original_url:{
        type : String,
        required : true
    },
    short_url:{
        type:String,
        required : true
    },
    visitCount:{
        type:Number,
        required:true,
        default:0
    }
});

module.exports = mongoose.model("urls",urlSchema);