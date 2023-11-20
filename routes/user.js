const express=require("express")
const app=express();
const User = require("../models/user.js")
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");

// sign up route

router.get("/signUp",(req,res)=>{
    res.render("users/signUp");
})

router.post("/signUp",wrapAsync(async (req,res)=>{try{
    let {username,email,password} = req.body;
    let newUser = new User({username,email});
    let regUser = await User.register(newUser,password)
    
    req.logIn(regUser,(error)=>{
        if(error) return next(error);
        console.log(regUser);
        req.flash("success","Welcome to WanderLust")
        res.redirect("/listings")
    })
} catch(err){
    req.flash("error",err.message);
    res.redirect("/signUp");
}
}))


//login route
router.get("/login",(req,res)=>{
    res.render("users/login");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync( async (req,res)=>{
    req.flash("success","Welcome back to WanderList");
    console.log("kljsdhlsa  ",res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl || "/listings");
    
}))


///logout

router.get("/logout",(req,res)=>{
    req.logOut((error)=>{
        if(error)
            return next(error)
        else{
            req.flash("success","Logged out");
            res.redirect("/listings")
        }
    })
})

module.exports = router;