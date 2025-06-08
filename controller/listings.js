const Listing=require("../models/listing.js");
// Add this at the top of listings.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports.index=async(req,res)=>{
   const allListings=await Listing.find({});
        res.render("listings/index.ejs",{allListings});
}
module.exports.renderNewForm=async(req,res)=>{
        res.render("listings/new.ejs");
     }
module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).
    populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    res.render("./listings/show.ejs",{listing});
}
module.exports.createListing=async(req,res,next)=>{
    const location = req.body.listing.location;
const geocodingURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

const response = await fetch(geocodingURL, {
    headers: {
      'User-Agent': 'WanderlustApp/1.0 (nj2835385@gmail.com)'
    }
  });

const data = await response.json();

if (!data.length) {
  req.flash("error", "Location not found.");
  return res.redirect("/listings/new");
}

// Extract lat/lon
const lat = parseFloat(data[0].lat);
const lon = parseFloat(data[0].lon);
console.log(`Coordinates for "${location}":`, lat, lon);
    let url=req.file.path;
    let filename=req.file.filename;
    let listing=req.body.listing;
    listing.owner=req.user._id;
    listing.image={url,filename};
    listing.geometry = {
        type: "Point",
        coordinates: [lon, lat] // GeoJSON format: [longitude, latitude]
      };
      
      await Listing.create(listing);
      
    req.flash("success","New Listing Created!..");
    res.redirect("/listings");
}
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested Listing is not available")
        res.redirect("/listings");
    }
    let originalimgurl=listing.image.url;
    originalimgurl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalimgurl});
}
module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    }
    const location = req.body.listing.location;
    console.log(location)
    const geocodingURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    
    const response = await fetch(geocodingURL, {
        headers: {
          'User-Agent': 'WanderlustApp/1.0 (nj2835385@gmail.com)'
        }
      });
    
    const data = await response.json();
    
    if (!data.length) {
      req.flash("error", "Location not found.");
      return res.redirect("/listings/new");
    }
    
    // Extract lat/lon
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    console.log(`Coordinates for "${location}":`, lat, lon);
    listing.geometry = {
        type: "Point",
        coordinates: [lon, lat] // GeoJSON format: [longitude, latitude]
      };
      await listing.save();
      
    req.flash("success","Listing Updated!..");
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!..");
    res.redirect("/listings");
}