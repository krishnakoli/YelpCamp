const express=require('express');
const router=express.Router();
const wrapAsync=require('../utility/asyncerror');
const Expresserror=require('../utility/expresserror');
const Campground=require('../models/campground');
const Review=require('../models/review');
const Joi=require('joi');
const {isloggedin,isauthor,Validatecampground}=require('../middleware');
const multer=require('multer');
const {storage, cloudinary}=require('../cloudinary');
const upload=multer({storage});
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const map_token=process.env.map_token;
const geocoder=mbxGeocoding({accessToken:map_token});


router.get('/',wrapAsync(async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('index',{campgrounds});
}))

  
router.get('/new',isloggedin,async(req,res)=>{ 
    res.render('new');
})

router.post('/',upload.array('image'),Validatecampground, wrapAsync(async(req,res,next)=>{
    const geodata=await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send();
    const campgrounds= await new Campground(req.body);
    campgrounds.geometry=geodata.body.features[0].geometry;
    campgrounds.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campgrounds.author=req.user._id;
    await campgrounds.save();
    console.log(campgrounds);
    req.flash('success','Sucessfully made a new campground!');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))

router.get('/:id',wrapAsync(async(req,res)=>{
    const id=req.params.id;
    const campgrounds=await Campground.findById(id).populate('reviews').populate('author');
    if(!campgrounds){
        req.flash('error',"can't find the campground");
        res.redirect('/campgrounds'); 
    }
    res.render('show',{campgrounds});
}))

router.post('/:id',isloggedin,upload.array('image'),Validatecampground, isauthor,wrapAsync(async(req,res)=>{
    const id=req.params.id;
    console.log(req.body);
    const campe=await Campground.findById(id);
    if(req.body.deleteimages){
        for(let filename of req.body.deleteimages){
            await cloudinary.uploader.destroy(filename);
        }
        await campe.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}});
    }
    campe.title=req.body.title;
    campe.location=req.body.location;
    campe.price=req.body.price;
    const img=req.files.map(f=>({url:f.path,filename:f.filename}));
    campe.images.push(...img);
    await campe.save();
    res.redirect(`/campgrounds/${campe._id}`);
}))


router.get('/:id/edit',isloggedin,isauthor,wrapAsync(async (req,res)=>{
    const id=req.params.id;
    const campgrounds=await Campground.findById(id);
    res.render('edit',{campgrounds});
}))


router.delete('/:id',isloggedin,isauthor,wrapAsync(async (req,res)=>{
    const id=req.params.id;
    const campd=await Campground.findOneAndDelete({_id:id});
    req.flash('success','Sucessfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports=router;