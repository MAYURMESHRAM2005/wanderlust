// const express=require("express");
// const router= express.Router();
// const User=require("../models/user.js");
// router.get("/signup",(req,res)=>{
//    res.render("user/signup.ejs");
// });
// router.post("/signup",async(req,res)=>{
//     let {username,email,password}=req.body;
//     const newuser=new User({email,username});
//     const registereduser=await User.register(newuser,password);
//     console.log(registereduser);
//     req.flash("success","Welcome to wanderlust!");
//     res.redirect("/listings");
// });
// module.exports=router;
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);

    req.flash("success", "Welcome to Wanderlust!");

    res.redirect("/listings");
}));

module.exports = router;
