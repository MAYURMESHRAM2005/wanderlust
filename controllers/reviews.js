const Listing=require("../models/Listing.js");
const Review=require("../models/review.js");
module.exports.createreview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review)
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log(newreview);
      req.flash("success","new review created!")
    // res.send("new review id is updated");
    res.redirect(`/listings/${listing._id}`)

};
module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted!")
    res.redirect(`/listings/${id}`);

};