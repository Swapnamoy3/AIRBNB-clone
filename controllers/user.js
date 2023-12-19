const User = require("../models/user.js")


module.exports.Signup = async (req,res)=>{try{
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
}


module.exports.Login = async (req,res)=>{
    req.flash("success","Welcome back to WanderList");
    console.log("kljsdhlsa  ",res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl || "/listings");
    
}

module.exports.Logout = (req,res)=>{
    req.logOut((error)=>{
        if(error)
            return next(error)
        else{
            req.flash("success","Logged out");
            res.redirect("/listings")
        }
    })
}