const express=require("express");
const router= express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const Review=require("../models/review.js");
const Listing=require("../models/Listing.js");
const {validatereview,isLoggedIn,isreviewauthor}=require("../middleware.js")
const reviewcontrollers=require("../controllers/reviews.js");

//post
router.post("/",isLoggedIn,validatereview, wrapasync(reviewcontrollers.createreview));
//delete
router.delete("/:reviewid",isLoggedIn,isreviewauthor,wrapasync(reviewcontrollers.deletereview));
module.exports=router;