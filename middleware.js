const ExpressError=require("./utils/ExpressError.js");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("success","you must be logged in to create listing");
         return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let review=await Review.findById(req.params.reviewId);
    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this review..");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
}
