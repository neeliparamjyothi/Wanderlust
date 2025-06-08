const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("/home/rgukt/MAJORPROJECT/models/listing.js");
main()
   .then(()=>{
      console.log("connection successfull");
})
.catch(err => console.log("hi"));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }
const initDB=async()=>{
   await Listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({...obj,owner:"6829b314be135a4e7ca393f3"}));
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");
}
initDB();

