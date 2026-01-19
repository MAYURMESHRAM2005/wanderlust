const Listing=require("../models/Listing.js");
module.exports.index=async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
};
module.exports.newlisting=(req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.createlisting=async (req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new expresserror(400,"send valid data for listings");
    //  }
     let newlisting=new Listing(req.body.listing);
     console.log(req.user);
     newlisting.owner=req.user._id;
     await newlisting.save();
     req.flash("success","new listing created!");
    res.redirect("/listings");
   
};
module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};
module.exports.editlisting=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
       if(!listing){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};
module.exports.updatelisting=async (req,res)=>{
    // if(!req.body.listing){
    //     throw new expresserror(400,"send valid data for listings");
    //  }
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
       req.flash("success","listing updated!")
     res.redirect(`/listings/${id}`);
};
module.exports.destroylisting=async (req,res)=>{
     let {id}=req.params;
     let deletelisting=await Listing.findByIdAndDelete(id);
     console.log(deletelisting);
       req.flash("success","listing deleted!")
     res.redirect("/listings");
};