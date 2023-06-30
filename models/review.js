const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const user=require('./user')

const ReviewSchema=Schema({
    body:String,
    Rating:Number,
    authorname:String,
    User:
        {
        type:Schema.Types.ObjectId,
        ref:'user'
}})
module.exports=mongoose.model('Review',ReviewSchema);