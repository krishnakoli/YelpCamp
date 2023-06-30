const mongoose=require('mongoose');
const Review=require('./review');
const user=require('./user')
const Schema=mongoose.Schema;


const opts={toJSON:{virtuals:true}};
const CampgroundSchema=new Schema({
    title:String,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            // required:true
        },
        coordinates:[{
            type:Number,
            // required:true
        }]
    },
    price:Number,
    description:String,
    location:String,
    author:[
        {
        type:Schema.Types.ObjectId,
        ref:'user'
}],
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts)

CampgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
    
})

CampgroundSchema.virtual('properties.PopUpMarkup').get(function(){
    return ` <a href="/campgrounds/${this._id}">${this.title}</a>
            <p>${this.location}</p>`
})

module.exports=mongoose.model('Campground',CampgroundSchema); 