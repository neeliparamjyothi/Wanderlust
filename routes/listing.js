const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const passport=require("passport");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controller/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(500,errMsg)
    }else{
         next();
    }
}

router.route("/")
.get( wrapAsync(listingController.index))
.post(
   isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))

//index route
//New Route
//show route
//edit route
router.get("/:id/edit",isLoggedIn,listingController.editListing)
//update route
//delete route
router.get("/:id/delete",isLoggedIn ,listingController.deleteListing)
module.exports=router;