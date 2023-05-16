
const express = require ("express");
const router = express.Router({mergeParams: true});
             // mergeParams: hace que los parametros esten unidos
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews")
const{validateReview, isLoggedIn, isReviewAuthor} = require ("../middleware")



//REVIEWS
router.post("/",isLoggedIn, validateReview, catchAsync(reviews.creatReview))

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;