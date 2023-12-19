const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {isLoggedIn} = require("../middleware.js");
const {is_owner} = require("../middleware.js");
const ListingsController = require("../controllers/listings.js")









//listing validator
function listingValidator(req,res,next){
    
    let listing = req.body;
    let error = listingSchema.validate(listing)
    console.log(error);
    if(error.error){
        throw new ExpressError(400,error.error)
    }
    else next();
}


// INDEX and CREATE LISTING route
router.route("/")
    .get( wrapAsync(ListingsController.index))
    .post(listingValidator,wrapAsync(ListingsController.CreateNewListing));


router.get("/new",isLoggedIn,wrapAsync(ListingsController.RenderNewListingForm))



//SHOW , UPDATE , DESTROY
router.route("/:id")
    .get(wrapAsync(ListingsController.showListing))
    .put(isLoggedIn,is_owner,listingValidator,wrapAsync(ListingsController.UpdateListing))
    .delete(isLoggedIn,is_owner,wrapAsync(ListingsController.DeleteListing));


//Edit Listing
router.get("/:id/edit",isLoggedIn,is_owner,wrapAsync(ListingsController.EditListing));



module.exports= router