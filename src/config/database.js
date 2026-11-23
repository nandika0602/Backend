// const URI =
//   "mongodb+srv://uidev2002_db_user:Amma143@nodejs.sal7d8p.mongodb.net/HelloWorld";
// const mongoose = require("mongoose");
// const connectDB = async () => {
//   await mongoose.connect(URI);
// };

// connectDB()
//   .then(() => {
//     console.log("COnnection Done");
//   })
//   .catch((err) => {
//     console.log("Not Connected");
//   });

const mongoose = require("mongoose");

const URI =
  "mongodb+srv://uidev2002_db_user:Amma143@nodejs.sal7d8p.mongodb.net/devTinder";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connected Successfully ✅");
  } catch (err) {
    console.log("MongoDB Connection Failed ❌");
    console.log(err.message);
  }
};

// connectDB();

module.exports = connectDB;
