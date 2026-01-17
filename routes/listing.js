const express=require("express");
const router= express.Router();
const wrapasync=require("../utils/wrapasync.js");
const {listingschema,listingreview}=require("../schema.js");
const Listing=require("../models/Listing.js");
const expresserror=require("../utils/expresserror.js");
const {isLoggedIn}=require("../middleware.js");
const validateListing=(req,res,next)=>{
      let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }else{
        next();
    }
}
//index route
router.get("/",wrapasync(async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}));
// new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});
//crate route
router.post("/",isLoggedIn,validateListing, wrapasync(async (req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new expresserror(400,"send valid data for listings");
    //  }
     let newlisting=new Listing(req.body.listing);
     await newlisting.save();
     req.flash("success","new listing created!");
    res.redirect("/listings");
   
}));
//show route
router.get("/:id",isLoggedIn,wrapasync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//edit route
router.get("/:id/edit",wrapasync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
       if(!listing){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id", validateListing,wrapasync(async (req,res)=>{
    // if(!req.body.listing){
    //     throw new expresserror(400,"send valid data for listings");
    //  }
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
       req.flash("success","listing updated!")
     res.redirect(`/listings/${id}`);
}));
router.delete("/:id",wrapasync(async (req,res)=>{
     let {id}=req.params;
     let deletelisting=await Listing.findByIdAndDelete(id);
     console.log(deletelisting);
       req.flash("success","listing deleted!")
     res.redirect("/listings");
}));
module.exports=router;