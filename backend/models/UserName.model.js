const mongoose = require('mongoose');
const userSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
},{timestamps:true});
const UserModel = mongoose.model('UserModel',userSchema);
module.exports = UserModel;