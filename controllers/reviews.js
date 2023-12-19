const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js")

module.exports.NewReview = async (req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    let review = req.body;
    console.log(review)
    let newReview = new Review(review)
    newReview.author = res.locals.user._id
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","review Added");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.DeleteReview =  async (req,res)=>{
    console.log("s")
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    req.flash("success","review Deleted");
    res.redirect(`/listings/`+id);
}