
//GENERADOR DE CONTENIDO ARBITRARIO PARA LA BASE DE DATOS

const mongoose = require("mongoose");
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground")

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    /*
    useNewUrelParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    */
});

const db = mongoose.connection; //es una abreviatura
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: "644128f35262962be1b1ec48",
            location: `${cities[random1000].city}, ${cities[random1000].state}`
            , title: `${sample(descriptors)} ${sample(places)}`
            , description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error accusamus libero quidem natus voluptates facilis, consequuntur, similique eius repellendus quam distinctio nostrum rem excepturi! Libero ab quia quidem minima error."
            , price
            , images: [
                {
                    url: 'https://res.cloudinary.com/dklaysawc/image/upload/v1682412272/YelpCamp/xzgg3xnwracgxfk4qit1.jpg',
                    filename: 'YelpCamp/xzgg3xnwracgxfk4qit1',
                },
                {
                    url: 'https://res.cloudinary.com/dklaysawc/image/upload/v1682412272/YelpCamp/az47kid255mtds6rvke1.jpg',
                    filename: 'YelpCamp/az47kid255mtds6rvke1',
                }
            ]

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})