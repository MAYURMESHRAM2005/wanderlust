const Listing=require("./models/Listing.js");
const Review=require("./models/review.js");
const {listingschema,listingreview}=require("./schema.js");
const expresserror=require("./utils/expresserror.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing=(req,res,next)=>{
      let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }else{
        next();
    }
};
module.exports.validatereview=(req,res,next)=>{
      let {error}=listingreview.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }else{
        next();
    }
};
module.exports.isreviewauthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
};