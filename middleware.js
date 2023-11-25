const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","you must e logged in");
        res.redirect("/login");
    }
    else
        next();
}


module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
       res.locals.redirectUrl =req.session.redirectUrl
    }
    next()
}


module.exports.is_owner = async (req,res,next)=>{
    let id = req.params.id;
    let oldListing = await  Listing.findById(id);
    if(oldListing.owner._id!=res.locals.user._id){
       req.flash("error","you dont have access to this listing")
       return res.redirect("/listings")
    }
    next(); 
}

module.exports.is_author = async (req,res,next)=>{
    let id = req.params.reviewId;
    let review = await  Review.findById(id);
    console.log(review.author._id)
    console.log(res.locals.user._id)
    console.log((review.author._id).equals(res.locals.user._id))
    if(review.author._id!=res.locals.user._id){
       req.flash("error","you are not the author of this review")
       return res.redirect("/listings")
    }
    next(); 
}