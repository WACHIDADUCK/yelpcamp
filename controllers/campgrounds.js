const Campground = require("../models/campground");
const cloudinary = require('cloudinary').v2;
var axios = require('axios');


const mapBoxToken = process.env.MAPBOX_TOKEN



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
    //if(!req.body.campground)throw new ExpressError("Invalid Campground Data", 400);
    //https://joi.dev/api/?v=17.7.0


// console.log(campground.location)

//     var config = {
//         method: 'get',
//         url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${campground.location}&inputtype=textquery&locationbias=circle%3A2000%4047.6918452%2C-122.2226413&fields=geometry&key=${process.env.GOOGLE_KEY}`,
//         headers: { }
//       };
//       axios(config)
      
//       .then(function (response) {
      
//       const geoData = response.data.candidates[0].geometry.location
//       console.log(`Geodata ${campground.location} = ` + geoData.lat + geoData.lng)
//       })

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()

    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull :{images: {filename: {$in: req.body.deleteImages}}}})
        console.log(req.body)
    }
    // res.send(campground);
    // res.send(campground._id);
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id)


    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds");
}