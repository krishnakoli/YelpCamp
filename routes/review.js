const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utility/asyncerror');
const Expresserror=require('../utility/expresserror');
const Campground=require('../models/campground');
const Review=require('../models/review');
const Joi=require('joi');
const {isloggedin,isauthor}=require('../middleware');


const Validatereview=(req,res,next)=>{
    const reviewSchema=Joi.object({
        body:Joi.string().required(),
        Rating:Joi.number().required().min(0),
    }).required()
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new Expresserror(msg,400);
    }else{
        next();
    }
}


router.post('/',isloggedin,wrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review =new Review(req.body);
    campground.reviews.push(review);
    review.User=req.user._id;
    review.authorname=req.user.username;
    await campground.save();
    await review.save();
    req.flash('success','Sucessfully add a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewid',wrapAsync(async(req,res)=>{
    const {id,reviewid}=req.params;
    const review =await Review.findById(reviewid);
    if(review.User.equals(req.user._id)){
        const campgrounds=await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
        console.log(review.User);
        await Review.deleteOne({_id:reviewid});
        req.flash('success','Sucessfully remove a review!');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
    req.flash('error',"Sorry you dont't have permission!!!!!");
    res.redirect(`/campgrounds/${id}`); 
    }
}))

module.exports=router; 