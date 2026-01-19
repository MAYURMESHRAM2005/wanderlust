
const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const { saveRedirectUrl } = require("../middleware.js");
const usercontrollers = require("../controllers/users.js");

// SIGNUP
router
  .route("/signup")
  .get(usercontrollers.rendersignup)
  .post(wrapAsync(usercontrollers.signup));

// LOGIN
router
  .route("/login")
  .get(usercontrollers.renderlogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontrollers.login
  );

// LOGOUT
router.get("/logout", usercontrollers.logout);

module.exports = router;

// router.get("/signup", usercontrollers.rendersignup);

// router.post("/signup", wrapAsync(usercontrollers.signup));
// router.get("/login",usercontrollers.renderlogin);
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash:true,
//     }),
//     usercontrollers.login);
// router.get("/logout",usercontrollers.logout);

// module.exports = router;
