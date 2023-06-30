const review=require('./models/review.js');
const campground=require('./models/campground.js');
const Joi=require('joi');
module.exports=Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().required(),
        location:Joi.string().required(),
        description:Joi.string().required()
    }).required()

module.exports=Joi.object({
            body:Joi.string().required(),
            Rating:Joi.number().required().min(0),
        }).required()