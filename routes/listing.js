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


// INDEX route
router.get("/", wrapAsync(ListingsController.index))

//NEW route

router.get("/new",isLoggedIn,wrapAsync(ListingsController.RenderNewListingForm))

router.post("/",listingValidator,wrapAsync(ListingsController.CreateNewListing))

//SHOW route

router.get("/:id",wrapAsync(ListingsController.showListing))

//Edit Listing
router.get("/:id/edit",isLoggedIn,is_owner,wrapAsync(ListingsController.EditListing));

//UPDATE route
router.put("/:id",isLoggedIn,is_owner,listingValidator,wrapAsync(ListingsController.UpdateListing))

//DELETE route
router.delete("/:id",isLoggedIn,is_owner,wrapAsync(ListingsController.DeleteListing));


module.exports= router