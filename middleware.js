const session=require('express-session');
const wrapAsync=require('./utility/asyncerror');
const Expresserror=require('./utility/expresserror');
const Campground=require('./models/campground');
const baseJoi=require('joi');
const sanitizeHtml=require('sanitize-html')


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.sess=req.originalUrl;
        req.flash('error','Please Signed in!!');
        return res.redirect('/login');
    }
    next();
}

const extension=(joi)=>({
    type:'string',
    base:joi.string(),
    messages:{
        'string.escapeHTML':'{{#label}} must not include HTML'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean=sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean !== value)return helpers.error('string.escapeHTML',{value})
                return clean;
        }
    }
    }
});

const Joi=baseJoi.extend(extension);
module.exports.Validatecampground=(req,res,next)=>{
    const Campground=Joi.object({
        title:Joi.string().required().escapeHTML(),
        price:Joi.number().required().min(0),
        location:Joi.string().required().escapeHTML(),
        description:Joi.string().required().escapeHTML(),
        deleteimages:Joi.array
    }).required()
    const {error}=Campground.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new Expresserror(msg,400);
    }else{
        next(); 
    }
}

module.exports.isauthor=async(req,res,next)=>{
    const id=req.params.id;
    const campgrounds=await Campground.findById(id);
    if(!campgrounds.author[0].equals(req.user._id)){
        req.flash('error',"Sorry you dont't have permission!!!!!");
        res.redirect(`/campgrounds/${id}`); 
    }
    next();
}