const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {isLoggedIn} = require("../middleware.js");











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
router.get("/", wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//NEW route

router.get("/new",isLoggedIn,wrapAsync((req,res)=>{
    res.render("./listings/create.ejs");
}))

router.post("/",listingValidator,wrapAsync(async (req,res)=>{
    if(!req.body) throw new ExpressError(400,"enter valid data for listing");
    let listing = req.body;
    console.log(listing)

    let newListing = new Listing(listing);
    await newListing.save();
    req.flash("success","new listing is added");
    res.redirect("/listings");
}))

//SHOW route

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
}))

//Edit Listing
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}))

//UPDATE route
router.put("/:id",isLoggedIn,listingValidator,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing = req.body;
    await Listing.findByIdAndUpdate(id,listing,{runValidators:true});
    req.flash("success","Listing Updated");
    res.redirect("/listings/"+id)
}))

//DELETE route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{

    let {id}=req.params;
    await Listing.findOneAndDelete({_id:id});
    req.flash("success","Listing Deleted");
    res.redirect("/listings");

}))


module.exports= router