Listing = require("../models/listing.js")

module.exports.index= async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing["reviews"],"hello");
    res.render("./listings/show.ejs",{listing});
}

module.exports.EditListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}

module.exports.UpdateListing = async (req,res)=>{
    let {id}=req.params;
    let listing = req.body;
    await Listing.findByIdAndUpdate(id,listing,{runValidators:true});
    req.flash("success","Listing Updated");
    res.redirect("/listings/"+id)
};


module.exports.DeleteListing = async (req,res)=>{

    let {id}=req.params;

    await Listing.findOneAndDelete({_id:id});
    req.flash("success","Listing Deleted");
    res.redirect("/listings");

}

module.exports.CreateNewListing = async (req,res)=>{
    if(!req.body) throw new ExpressError(400,"enter valid data for listing");
    let listing = req.body;
    console.log(listing)

    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing is added");
    res.redirect("/listings");
}

module.exports.RenderNewListingForm = (req,res)=>{
    res.render("./listings/create.ejs");
}