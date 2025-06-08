if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const ejsMate=require("ejs-mate");
const path=require("path");
const Listing=require("./models/listing.js");
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
app.use(express.json());
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

let dburl=process.env.ATLASDB_URL;
//let mongourl='mongodb://127.0.0.1:27017/wanderlust';
main()
   .then(()=>{
      console.log("connection successfull");
       console.log(dburl);
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect(dburl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use((err,req,res,next)=>{
   let {statusCode=500,message="something went wrong"}=err;
   res.render("error.ejs",{message});
})
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
})
store.on("error",()=>{
    console.log("error in mongodb store");
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // also important for login checks
    next();
});
app.get("/", (req, res) => {
    res.redirect("/listings"); // or res.render("home") if you have a homepage
});
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.listen(port,()=>{
    console.log("server is listening on port 8080");
})



