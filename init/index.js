const mongoose = require("mongoose")
const data = require("./data.js")
const Listing = require("../models/listing.js")

//connsection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");//connection to wanderLust dataase
    console.log("Connected to mongodb");
}

main().catch((err) => {
    console.log(err);
});

//

const cleanDB = async () => {
    await Listing.deleteMany({});
    console.log("data cleaned")
}

const addData = async () => {
    data.data = data.data.map((oj) => ({ ...oj, owner: "6555790b9d7a06875aeb43b4" }))
    await Listing.insertMany(data.data);
}

async function initDB() {
    await cleanDB()
    await addData();
    console.log("DB initialized");
}


//main()
// cleanDB().then(()=>{
// initDB();

// })