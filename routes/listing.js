const express=require("express");
const router= express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing=require("../models/Listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontrollers=require("../controllers/listings.js");
router
.route("/")
.get(wrapasync(listingcontrollers.index))
.post(isLoggedIn,validateListing, wrapasync(listingcontrollers.createlisting));
router.get("/new",isLoggedIn,listingcontrollers.newlisting);
router
.route("/:id")
.get(wrapasync(listingcontrollers.showlisting))
.put(isLoggedIn,isOwner, validateListing,wrapasync(listingcontrollers.updatelisting))
.delete(isLoggedIn,isOwner,wrapasync(listingcontrollers.destroylisting));
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingcontrollers.editlisting));
module.exports=router;
//index route
// router.get("/",wrapasync(listingcontrollers.index));
// new route
//crate route
// router.post("/",isLoggedIn,validateListing, wrapasync(listingcontrollers.createlisting));
//show route
// router.get("/:id",wrapasync(listingcontrollers.showlisting));
//edit route
//update route
// router.put("/:id",isLoggedIn,isOwner, validateListing,wrapasync(listingcontrollers.updatelisting));
//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapasync(listingcontrollers.destroylisting));
