const express=require("express")
const app=express();
const path = require("path")
const mongoose = require("mongoose");
const port=8080;
const method_override = require("method-override");
const ejsMate = require("ejs-mate")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const { connect } = require("http2");
const session = require("express-session")
const flash = require("connect-flash")
const ExpressError=require("./utils/ExpressError.js")
const passport = require("passport")
const LocalStatergy = require("passport-local")
const User = require("./models/user.js")
const sessionOptions = {
    secret: "mySecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly:true
    }
}



app.listen(port);
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))


//req.body parser
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//templating methods
app.use(method_override("_method"))
app.engine("ejs",ejsMate);


//session accross pages of sane wesite
app.use(session(sessionOptions));
app.use(flash());


//user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//connection to mongoose
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");//connection to wanderLust dataase
    console.log("Connected to mongodb");
}

main().catch((err)=>{
    console.log(err);
});



app.use((req,res,next)=>{
    
    console.log(req.path);
    next();
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;//onlu present if loggeg in
    res.locals.redirectURL = req.session.redirectUrl;
    
    next();
})

//routes





app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)



///middleware




//error handelling

app.all("*",(req,res,next)=>{
    console.dir(req.path)
    next(new ExpressError(404,"this page do not exist"))
})


app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    console.log(err)
    res.status(status).render("error.ejs",{status,message})
})