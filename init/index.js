// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

// main().then( () => {
//     console.log("Connected to DB");
// }).catch( err => { console.log(err)});

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("data was initialised");
// };

// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB ✅");

        await initDB();   // 🔥 run AFTER connection

        mongoose.connection.close(); // optional (clean exit)
    } catch (err) {
        console.log(err);
    }
}

const initDB = async () => {
    await Listing.deleteMany({});
    // let updatedData = initData.data.map((obj) => ({
    //     ...obj,
    //     image: obj.image.url   // 🔥 conversion fix
    // }));
    //await Listing.insertMany(initData.data);
    initData.data = initData.data.map((obj) => ({...obj, owner: "6a19589dc173d63b60c15560"})); // 🔥 debug log
    await Listing.insertMany(initData.data);

    console.log("Data was initialized ✅");
};

main();