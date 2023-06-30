const express=require('express');
const router=express.Router();
const user=require('../models/user');
const passport = require('passport');
const campground = require('../models/campground');

router.get('/register',(req,res)=>{
    res.render('users/register');
});

router.post('/register',async (req,res)=>{
    try{
    const {username,email,password}=req.body;
    const User=new user({email,username});
    const registerusername=await user.register(User,password);
    // console.log(User);
    console.log(registerusername);
    // console.log(user);
    req.login(registerusername,err=>{
        if(err) return next(err);
    req.flash('success','Welcome to yelp camp');
    res.redirect('/campgrounds');
    });
    
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }    
});

router.get('/login',async(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back!')
    const returnurl=req.session.returnTo || '/campgrounds';
    delete req.session.returnto;
    res.redirect(returnurl);

})

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success',"GoodBye!")
      res.redirect('/campgrounds');
    });
  });
module.exports=router;