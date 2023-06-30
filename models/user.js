const { string } = require('joi');
const mongoose=require('mongoose');
const passportlocalmongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    }
});
userSchema.plugin(passportlocalmongoose);

module.exports=mongoose.model('user',userSchema); 