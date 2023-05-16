if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}


const express = require("express");
const path = require("path"); //requiere para luego app.set("views", path.join(__dirname, "views"))
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //hace los layouts, para reducir los heads y los foots
//npm i express-session
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
//npm i connect-flash
const flash = require("connect-flash");

var axios = require('axios');

const User = require("./models/user");

//npm i passport passport-local passport-local-mongoose
const passport = require("passport");
const LocalStrategy = require("passport-local");


//ROUTES
const userRoutes = require("./routes/users")
const campgroundsRoutes = require ("./routes/campgrounds");
const reviewsRoutes = require ("./routes/reviews");
const mapsRoutes = require ("./routes/maps");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    /*
    useNewUrelParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,

    useFindAndModify: false
    */
});

const db = mongoose.connection; //es una abreviatura
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")) //hace que no tome como referencia el archivo views

app.use(express.urlencoded({extended: true})) // IT PARSE THE BODY
app.use(methodOverride("_method"))//Se usa en la parte de Editar
app.use(express.static(path.join(__dirname, "public")))


const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialize: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }

}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

//functions from passport-local-mongoose
//get store in sesion
passport.serializeUser(User.serializeUser());
// get unstore user from session
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

/*
app.get("/fakeUser", async (req,res)=>{
    const user = new User ({email: "1gmail.com", username: "1"})
    const newUser = await User.register(user,"1")
    res.send(newUser)
})
*/
/*register an user
app.get("/fakeUser", async (req,res)=>{
    const user = new User ({email: "colt@gmail.com", username: "colt"})
    const newUser = await User.register(user, "chicken");
    //Convenience method to register a new user instance 
    //with a given password. Checks if username is unique.
    res.send(newUser);
})
*/

//USAR LOS ROUTES
app.use("/", userRoutes)
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)
app.use("/maps", mapsRoutes)


const validateCampground = (req,res, next)=>{
  
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=> el.message).join(",")
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(",")
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}



//PAGINA INICIAL
app.get("/", (req,res)=>{


    // var config = {
    //     method: 'get',
    //     url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Lagotiticaca&inputtype=textquery&locationbias=circle%3A2000%4047.6918452%2C-122.2226413&fields=geometry&key=${process.env.GOOGLE_KEY}`,
    //     headers: { }
    //   };
    //   axios(config)
      
    //   .then(function (response) {
      
    //   console.log(response.data.candidates[0].geometry.location)
    //   const latLng = response.data.candidates[0].geometry.location
    //   console.log("Geodata = " + latLng)
    //   })
      
    //   .catch(function (error) {
    //     console.log(error);
    //   });

// var config = {
//   method: 'get',
//   url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Granada&inputtype=textquery&locationbias=circle%3A2000%4047.6918452%2C-122.2226413&fields=geometry&key=${process.env.GOOGLE_KEY}`,
//   headers: { }
// };
// axios(config)

// .then(function (response) {

// console.log(JSON.stringify(response.data));
// console.log("");
// console.log(response.data.candidates[0].geometry.location)
// console.log(response.data.candidates[0].geometry.location.lat)
// console.log(response.data.candidates[0].geometry.location.lng)
// const latLng = [response.data.candidates[0].geometry.location.lat, response.data.candidates[0].geometry.location.lng]
// console.log("Geodata = " + latLng)
// })

// .catch(function (error) {
//   console.log(error);
// });
    res.render("home")
})



//Error Handeling
app.all("*", (req,res,next) =>{
    next(new ExpressError("Page Not Found", 404))
    res.send("404!")
})

//ERROR HANDELING
app.use((err, req, res, next)=>{
    const {statusCode =500, message="Something went wrong"} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render("error", {err})
})

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})

