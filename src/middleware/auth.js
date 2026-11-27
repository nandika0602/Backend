const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req, res, next) => {
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorised request");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  //Read the token from thw req cookies
  //validate the token
  //FInd the USer
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedObj = await jwt.verify(token, "secretkey");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("USer not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
