const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send("Hellooooo");
});

app.get("/user/:userId/:name/:pwd", (req, res) => {
  console.log(req.params);
  res.send("Test Hello");
});

app.post("/user", (req, res) => {
  res.send("User added");
});

app.listen(3000, () => {
  console.log("Server is listenng on port 3000...");
});
