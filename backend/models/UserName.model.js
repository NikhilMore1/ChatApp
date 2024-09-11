const mongoose = require('mongoose');
const userSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false 
    }
},{timestamps:true});
const UserModel = mongoose.model('UserModel',userSchema);
module.exports = UserModel;