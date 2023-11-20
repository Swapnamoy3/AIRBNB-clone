const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");





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

router.post("/",reviewValidator,wrapAsync( async (req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    let review = req.body;
    console.log(review)
    let newReview = new Review(review)
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","review Added");
    res.redirect(`/listings/${listing._id}`)
}))

//review 
//DELETE route
router.post("/:reviewId",wrapAsync( async (req,res)=>{
    console.log("s")
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    req.flash("success","review Deleted");
    res.redirect(`/listings/`+id);
}))

module.exports= router;