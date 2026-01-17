
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport=require("passport");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try{
         const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));
router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});
router.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true}),
        async(req,res)=>{
     res.send("welcome to wanderlust! you are loged in!");
});

module.exports = router;
