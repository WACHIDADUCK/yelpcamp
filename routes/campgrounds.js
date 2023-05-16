const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds")

//para upload archivos
const multer = require('multer');
const { storage } = require("../cloudinary")
const upload = multer({ storage })

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")


//CREA UN CAMPO NUEVO
router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm))


//ENSEÑA UN CAMPO EN PARTICULAR
router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, campgrounds.delete)


//EDITAR
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;