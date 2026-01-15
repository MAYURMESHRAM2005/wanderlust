const express=require("express");
const app=express();
const users=require("./router/user.js");
const posts=require("./router/post.js");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

    const sessionoptions=({
        secret:"mysupersecretstring",
        resave:false,
        saveUninitialized:true,
    });
    app.use(session(sessionoptions));
    app.use(flash());
    app.use((req,res,next)=>{
         res.locals.sucessmsg=req.flash("sucess");
         res.locals.errormsg=req.flash("error");
         next();
    })
    app.get("/register",(req,res)=>{
        let {name="anonymous"}=req.query;
       req.session.name=name;
       if(name==="anonymous"){
        req.flash("error","users not registered!")
       }else{
          req.flash("sucess","users registered successfully1");
       }
      
    //    res.send(name);
       res.redirect("/hello");
    });
    app.get("/hello",(req,res)=>{
        // res.send(`hello, ${req.session.name}`);
        res.render("page.ejs",{ name :req.session.name});
        
    });
// app.get("/test",(req,res)=>{
//   res.send("test successful");
// });
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you sent req ${req.session.count} times`);
// })

// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcode"));
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","india",{signed:true});
//     res.send("signed cookie sent");
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIN","india");
//     res.send("sent you some cookies!");
// });
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`hi ${name}`);
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("hi i am root");
// });
// app.use("/users",users);
// app.use("/posts",posts);
app.listen(3000,()=>{
    console.log("app is listening on port 3000")
});