const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,is_author} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js")




//review validator
function reviewValidator(req,res,next){
    let review = req.body;
    let error = reviewSchema.validate(review);

    if(error.error){
        throw new ExpressError(400,error.error);
    }else{
        next();
    }
}




//REVIEW 
// POST route

router.post("/",isLoggedIn,reviewValidator,wrapAsync( ReviewController.NewReview ))

//review 
//DELETE route
router.post("/:reviewId",isLoggedIn,is_author,wrapAsync(ReviewController.DeleteReview))

module.exports= router;