const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/Listing.js");
main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}
const initdb= async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
       ...obj,
       owner:"696cb3b0184e77af86f87b71",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
};
initdb();