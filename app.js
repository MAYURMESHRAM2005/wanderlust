const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/Listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expresserror=require("./utils/expresserror.js");
// const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");
const newlistingrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
  const sessionoptions=({
        secret:"mysupersecretstring",
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httponly:true,
        },
    });
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,("public"))))
app.engine('ejs', ejsMate);
app.get("/",(req,res)=>{
    res.send("root is working")
});
app.use(session(sessionoptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
    next();
});
//demouser
// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"mayur@gmail.com",
//         username:"mayur-meshram",
//     });
//     let registereduser=await User.register(fakeuser,"helloworld");
//     res.send(registereduser);
// });

// // app.get("/demouser", async (req, res) => {
//     console.log("TYPE OF REGISTER:", typeof User.register);
//     console.log("PLUGIN:", typeof passportLocalMongoose);
//     res.send("Check console");
// });

//post validation

app.use("/listings",newlistingrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",userrouter)
app.all(/.*/,(req,res,next)=>{
    next(new expresserror(404,"page not found"));
});
// // 404 Handler
// app.use((req, res, next) => {
//     next(new expresserror(404, "Page not found"));
// });


app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    // res.status(statuscode).send(message);
     res.status(statuscode).render("error.ejs",{message});
     
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
