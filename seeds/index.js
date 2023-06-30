const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const {transcode}=require('buffer');

mongoose.connect('mongodb://127.0.0.1:27017/mycamp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const prandom = Math.floor(Math.random() * 100+100);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,cities[random1000].latitude
                ]
            } ,
            images: [
                {
                  url: 'https://res.cloudinary.com/dkzw6jqtw/image/upload/v1687589140/Yelpcamp/nd2mm1wfrlabcpvk0r9o.jpg',
                  filename: 'Yelpcamp/enybunnzlxvfvbsab7ov',
                }
              ],
              author:"649532e3820a355ac77a0f19",
            price:prandom,
            description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat saepe sunt animi ex provident culpa aliquam omnis ipsa amet laboriosam, suscipit quo ab quae non odit porro, rem, nostrum ut?"
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})