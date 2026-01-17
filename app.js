const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const newlistingrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");
const expresserror = require("./utils/expresserror.js");

// DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

// EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH MIDDLEWARE
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ROUTES
app.use("/", userrouter);
app.use("/listings", newlistingrouter);
app.use("/listings/:id/reviews", reviewsrouter);

// 404 handler
app.all("*", (req, res, next) => {
    next(new expresserror(404, "Page not found"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    const { statuscode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statuscode).render("error.ejs", { message: err.message });
});

app.listen(8080, () => console.log("Server running at 8080"));
