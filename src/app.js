const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); //like a handler, call before all the APIs irrespective of methods

app.post("/signup", async (req, res) => {
  console.log(req.body);

  // const user = new User({
  //   firstName: "Nandy",
  //   lastName: "Rajan",
  //   emailId: "abc@gail.com",
  //   password: "abc@123",
  // });
  const user = new User(req.body);
  // creating a new instance of the User model
  // const user = new User(userObj);
  try {
    await user.save(); // return a promise
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB is connected");
    app.listen(3000, () => {
      console.log("Server is listenng on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Not connected");
  });
