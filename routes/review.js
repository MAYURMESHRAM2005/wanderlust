const express=require("express");
const router= express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const {listingschema,listingreview}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/Listing.js");

//post
const validatereview=(req,res,next)=>{
      let {error}=listingreview.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }else{
        next();
    }
};
router.post("/",validatereview, wrapasync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review)
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log(newreview);
      req.flash("success","new review created!")
    // res.send("new review id is updated");
    res.redirect(`/listings/${listing._id}`)

}));
router.delete("/:reviewid",wrapasync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted!")
    res.redirect(`/listings/${id}`);

}));
module.exports=router;