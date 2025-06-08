const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(500,errMsg)
    }else{
         next();
    }
}
//Reviews routes
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//Delete Review Route
router.post("/:reviewId",
    isReviewAuthor,
    isLoggedIn,
    wrapAsync(reviewController.deleteReview));
module.exports=router;