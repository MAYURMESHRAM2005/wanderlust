const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/Listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapasync=require("./utils/wrapasync.js")
const expresserror=require("./utils/expresserror.js");
const {listingschema}=require("./schema.js");
main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,("public"))))
app.engine('ejs', ejsMate);
app.get("/",(req,res)=>{
    res.send("root is working")
});
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
app.get("/listings",wrapasync(async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}));
// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//crate route
app.post("/listings",validateListing, wrapasync(async (req,res,next)=>{
    //  if(!req.body.listing){
    //     throw new expresserror(400,"send valid data for listings");
    //  }
     let newlisting=new Listing(req.body.listing);
     await newlisting.save();
    res.redirect("/listings");
   
}));
//show route
app.get("/listings/:id",wrapasync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));
//edit route
app.get("/listings/:id/edit",wrapasync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
app.put("/listings/:id", validateListing,wrapasync(async (req,res)=>{
    // if(!req.body.listing){
    //     throw new expresserror(400,"send valid data for listings");
    //  }
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings/${id}`);
}));
app.delete("/listings/:id",wrapasync(async (req,res)=>{
     let {id}=req.params;
     let deletelisting=await Listing.findByIdAndDelete(id);
     console.log(deletelisting);
     res.redirect("/listings");
}));
app.all(/.*/,(req,res,next)=>{
    next(new expresserror(404,"page not found"));
})
app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    // res.status(statuscode).send(message);
     res.render("listings/error.ejs",{message});
     
});
// app.get("/testlistings",async (req,res)=>{
//     let newlisting=new Listing({
//         title:"my new villa",
//         description:"by the river",
//         price:1300,
//         location:"thane,mumbai",
//         country:"india",
//     });
//    await newlisting.save();
//    console.log("sample was saved");
//    res.send("sucessful listing");
// })
app.listen(8080,()=>{
    console.log("listening on port 8080");
})
