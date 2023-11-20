const mongoose = require("mongoose")
const data= require("./data.js")
const Listing = require("../models/listing.js")

//connsection
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");//connection to wanderLust dataase
    console.log("Connected to mongodb");
}

main().catch((err)=>{
    console.log(err);
});

//

const cleanDB=async ()=>{
    await Listing.deleteMany({});
}

const addData=async ()=>{
    await Listing.insertMany(data.data);
}

async function initDB(){
    await cleanDB()
    await addData();
    console.log("DB initialized");
}


//main()

initDB();