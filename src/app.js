const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json()); //like a handler, call before all the APIs irrespective of methods
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    //Validation of Data
    validateSignUpData(req);
    // Encrypt the Password
    const { firstName, lastName, emailId, password } = req.password;
    const passwordHash = bcrypt.hash(password, 10);
    console.log(passwordHash);
    // const user = new User({
    //   firstName: "Nandy",
    //   lastName: "Rajan",
    //   emailId: "abc@gail.com",
    //   password: "abc@123",
    // });
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    // creating a new instance of the User model
    // const user = new User(userObj);

    await user.save(); // return a promise
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.find({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Creds");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "secretkey");
      console.log(token);

      //Add the token to cookie and send the response back to the user
      res.cookie("toeken", token); //can see it in postman once we login
      res.send("Login Successfully");
    } else {
      throw new Error("Invalid Creds");
    }
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.post("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    //Validate my token

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "secretkey");
    console.log(decodedMessage);

    const { _id } = decodedMessage;
    console.log("Logged in User is", _id);

    console.log(cookies); // undefined - to read it we need middleware/npm library

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.send("Reading", user);
  } catch (err) {
    console.log(err);
  }
});

app.get("/user", async (req, res) => {
  console.log(req.body);

  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User Not Found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong.." + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong.." + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong.." + err.message);
  }
});

app.patch("/user:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    if (data?.skills?.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
    const users = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User Updated Successfully", users);
  } catch (err) {
    res.status(400).send("Something went wrong.." + err.message);
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
