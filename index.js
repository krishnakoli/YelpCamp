if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsmate=require('ejs-mate');
const {transcode}=require('buffer');
const morgan = require('morgan');
const Mo=require('method-override');
const campgroundRoutes=require('./routes/campground')
const reviewRoutes =require('./routes/review')
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport'); 
const localstrategy=require('passport-local');
const user=require('./models/user');
const userRoutes=require('./routes/users');
const mongosanitize=require('express-mongo-sanitize');
// const helmet=require('helmet');
const Mongodbstore=require('connect-mongo');
const dburl='mongodb://127.0.0.1:27017/mycamp';

mongoose.connect(dburl,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true, 
     // useFindAndModify:false
})
.then(()=>
    console.log("Working")
)
.catch((error)=>
    console.error("Not Working"))



const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});



const app=express();

app.use(mongosanitize({
    replaceWith:'_'
}));
app.use(morgan('tiny'));
app.use((req,res,next)=>{
    next();
})
app.engine('ejs',ejsmate);
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.path('views',path.join(__dirname,'views'));
app.use(Mo('_method'));




// const store=new MongoStore({
//     url:process.env.Mongo_url,
//     secret:'thisshouldbebettersecret',  
//     touchAfter:24*60*60
// });

// store.on("error",function(e){
//     console.log("Session Store Error!!",e);
// })

const sessionconfig={
    store:Mongodbstore.create({
        mongoUrl:dburl
    }),
    secret:'thisshouldbebettersecret',  
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }  
}
app.use(session(sessionconfig));

// app.use(helmet({contentSecurityPolic:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{ 
    console.log(req.query);
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error'); 
    next();
})


app.get('/home',(req,res)=>{
    res.render('home');
})
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/review',reviewRoutes);
app.use('/',userRoutes);


app.use((err,req,res,next)=>{
    const {status= 500,message='Something went wrong'}=err;
    res.status(status).render('Error',{err}); 
})

app.listen(3000,()=>{
    console.log("Server is Set!")
})