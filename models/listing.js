const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
       {
          type:Schema.Types.ObjectId,
          ref:"Review"
       } 
    ],
    owner:{
         type:Schema.Types.ObjectId,
         ref:"User"
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        }
      },
})
listingSchema.index({ geometry: '2dsphere' });
listingSchema.post("findOneAndDelete",async(listing)=>{
      if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
      }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;