const express=require("express")
const app=express();
const User = require("../models/user.js")
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/user.js");

// sign up route
router.route("/signUp")
.get((req,res)=>{ res.render("users/signUp");})
.post(wrapAsync( UserController.Signup ));




//login route
router.route("/login")
    .get((req,res)=>{ res.render("users/login"); })
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync( UserController.Login ));



///logout

router.get("/logout",UserController.Logout);

module.exports = router;